import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';

// Read configuration dynamically
import firebaseConfig from '../firebase-applet-config.json';

// Ensure Firebase is initialized exactly once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Calendar scopes (allows ConferenceData Meet spaces)
provider.addScope('https://www.googleapis.com/auth/calendar');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Handle caching of Google tokens in memory securely
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google connection did not return a valid credentials access token.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google credentials lookup failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Formatting helpers for IST slot
export function parseDateTimeSlot(dateStr: string, slotStr: string) {
  // dateStr format is expected to be: YYYY-MM-DD or readable. 
  // Let's standardise the date format:
  // If dateStr contains words (e.g. Wednesday, June 10, 2026), let's parse or fall back
  let cleanDate = dateStr;
  
  // Detect human formatted date (e.g., "Monday, June 15, 2026")
  if (dateStr.includes(',')) {
    try {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        const y = parsedDate.getFullYear();
        const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const d = String(parsedDate.getDate()).padStart(2, '0');
        cleanDate = `${y}-${m}-${d}`;
      }
    } catch (_) {}
  }

  const timeStr = slotStr.trim().toUpperCase();
  let hours = 10;
  let minutes = 0;
  
  const timeMatch = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/);
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3];
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
  } else {
    if (timeStr.includes('10:00')) { hours = 10; minutes = 0; }
    else if (timeStr.includes('1:00') || timeStr.includes('01:00')) { hours = 13; minutes = 0; }
    else if (timeStr.includes('3:30')) { hours = 15; minutes = 30; }
    else if (timeStr.includes('6:00') || timeStr.includes('06:00')) { hours = 18; minutes = 0; }
  }
  
  const pad = (n: number) => String(n).padStart(2, '0');
  const startIso = `${cleanDate}T${pad(hours)}:${pad(minutes)}:00+05:30`;
  
  let endHours = hours + 1;
  let endMinutes = minutes;
  if (endHours >= 24) endHours = 23;
  const endIso = `${cleanDate}T${pad(endHours)}:${pad(endMinutes)}:00+05:30`;
  
  return { startIso, endIso };
}

export interface GoogleCalendarEventOptions {
  packageName: string;
  dateStr: string;
  timeSlot: string;
  clientEmail: string;
  clientName: string;
  bookingId: string;
}

// REST call to create event on primary calendar with space creation enabled
export const createCalendarEventWithMeet = async (
  token: string, 
  options: GoogleCalendarEventOptions
): Promise<{ eventId: string; htmLink: string; meetUrl: string }> => {
  const { startIso, endIso } = parseDateTimeSlot(options.dateStr, options.timeSlot);
  
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `Design Session: ${options.clientName || 'Client'} (${options.packageName || 'Consultation'})`,
        description: `Bespoke interior design consultation session for ${options.clientName || 'our client'}.\nReservation ID: ${options.bookingId}\nJoin our design studio and craft your space!`,
        start: {
          dateTime: startIso,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: endIso,
          timeZone: 'Asia/Kolkata',
        },
        attendees: [
          { email: options.clientEmail, displayName: options.clientName }
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet_${options.bookingId}_${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || `Google Calendar API error: ${response.statusText}`);
  }

  const rawData = await response.json();
  console.log("Google Calendar API raw event payload:", rawData);
  
  // Extract conference Google Meet link
  let meetUrl = '';
  
  // Priority 1: Top-level standard hangoutLink is the absolute Google Meet url
  if (rawData.hangoutLink) {
    meetUrl = rawData.hangoutLink;
  }
  
  // Priority 2: conferenceData entryPoints
  if (!meetUrl && rawData.conferenceData?.entryPoints) {
    const videoEntryPoint = rawData.conferenceData.entryPoints.find(
      (ep: any) => ep.entryPointType === 'video'
    );
    if (videoEntryPoint?.uri) {
      meetUrl = videoEntryPoint.uri;
    }
  }

  // Priority 3: fallback location match
  if (!meetUrl && rawData.location && rawData.location.includes('meet.google.com')) {
    meetUrl = rawData.location;
  }
  
  return {
    eventId: rawData.id || '',
    htmLink: rawData.htmlLink || '',
    meetUrl: meetUrl || rawData.meetLink || `https://meet.google.com/abc-defg-hij`
  };
};
