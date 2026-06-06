import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Instagram, Plus, Trash2, HelpCircle, Loader2, RefreshCw, KeyRound, ExternalLink } from 'lucide-react';

interface InstagramReel {
  id: string;
  url: string;
  title: string;
  thumbnail?: string;
}

// 5 Initial high-quality interior design and modular styling Reels/Posts as starting fallbacks
const DEFAULT_REELS: InstagramReel[] = [
  {
    id: 'DPWPWRQk63k',
    url: 'https://www.instagram.com/p/DPWPWRQk63k/',
    title: 'Monica Interiors Legacy Master Bathroom Showcase'
  },
  {
    id: 'C7-K_C4ST3c',
    url: 'https://www.instagram.com/reel/C7-K_C4ST3c/',
    title: 'Aethel Living Room Reveal & Premium Curations'
  },
  {
    id: 'C-U897XvLox',
    url: 'https://www.instagram.com/reel/C-U897XvLox/',
    title: 'Minimalist Modular Kitchen Walkthrough & Storage Layouts'
  },
  {
    id: 'C8_XlS3xpG_',
    url: 'https://www.instagram.com/reel/C8_XlS3xpG_/',
    title: 'Master Bedroom Cozy Textures & Warm Accent Walls'
  },
  {
    id: 'C9N_h9kS4h9',
    url: 'https://www.instagram.com/reel/C9N_h9kS4h9/',
    title: 'Bespoke Studio Behind the Scenes & Custom Sourcing'
  }
];

export default function InstagramReels() {
  const [reels, setReels] = useState<InstagramReel[]>([]);
  const [newReelUrl, setNewReelUrl] = useState('');
  const [newReelTitle, setNewReelTitle] = useState('');
  const [activeReel, setActiveReel] = useState<string | null>('DPWPWRQk63k');
  const [playerMode, setPlayerMode] = useState<'theater' | 'embed'>('theater');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenFound, setTokenFound] = useState(false);

  // Load from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem('monica_instagram_reels');
    let loadedReels = DEFAULT_REELS;
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep saved, but ensure the target showcase items are present at the top
          // Filter out the old unwanted post if it was cached
          const filtered = parsed.filter(item => item.id !== 'DCEV_ZoyjE4');
          const containsDPWP = filtered.some(item => item.id === 'DPWPWRQk63k');
          
          let temp = [...filtered];
          if (!containsDPWP) {
            temp = [DEFAULT_REELS[0], ...temp];
          }
          loadedReels = temp;
        }
      } catch (e) {
        loadedReels = DEFAULT_REELS;
      }
    }
    
    setReels(loadedReels);
    // Set DPWPWRQk63k as active by default so it immediately loads
    if (loadedReels.some(r => r.id === 'DPWPWRQk63k')) {
      setActiveReel('DPWPWRQk63k');
    } else if (loadedReels.length > 0) {
      setActiveReel(loadedReels[0].id);
    }

    // Check if client-side VITE_INSTAGRAM_ACCESS_TOKEN is present
    const isTokenAvailable = !!(import.meta as any).env.VITE_INSTAGRAM_ACCESS_TOKEN;
    setTokenFound(isTokenAvailable);
    
    if (isTokenAvailable) {
      fetchLiveInstagramFeed();
    }
  }, []);

  // Sync to localStorage
  const saveReels = (updated: InstagramReel[]) => {
    setReels(updated);
    localStorage.setItem('monica_instagram_reels', JSON.stringify(updated));
  };

  // Extract Instagram Reel/Post ID from standard URL formats
  const extractIdFromUrl = (url: string): string | null => {
    try {
      const cleanUrl = url.trim();
      // Match pattern like /reel/ID/ or /p/ID/ or /posts/ID/
      const match = cleanUrl.match(/\/(?:reel|p|posts)\/([A-Za-z0-9_-]+)/);
      if (match && match[1]) {
        return match[1];
      }
      
      // Fallback: If they provided just the ID itself
      if (cleanUrl && !cleanUrl.includes('/') && cleanUrl.length > 5) {
        return cleanUrl;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Live Instagram API call (if user configures VITE_INSTAGRAM_ACCESS_TOKEN)
  const fetchLiveInstagramFeed = async () => {
    const token = (import.meta as any).env.VITE_INSTAGRAM_ACCESS_TOKEN;
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      // Fetch media list from the graph explorer
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`
      );
      
      if (!response.ok) {
        throw new Error('Could not synchronize live feed. Please verify validity of the Instagram Access Token.');
      }

      const data = await response.json();
      if (data && data.data) {
        // Filter for video posts/Reels or items that look like Reels
        const liveReels: InstagramReel[] = data.data
          .filter((item: any) => item.media_type === 'VIDEO')
          .slice(0, 6) // Max 6 reels to avoid performance clutter
          .map((item: any) => {
            const shortcode = extractIdFromUrl(item.permalink) || item.id;
            return {
              id: shortcode,
              url: item.permalink,
              title: item.caption ? item.caption.substring(0, 80) : 'Live Instagram Studio Showcase',
              thumbnail: item.thumbnail_url || item.media_url
            };
          });

        if (liveReels.length > 0) {
          saveReels(liveReels);
        } else {
          // If no video reels were returned, let them know in console but keep fallbacks
          console.log('No video media found on Instagram account. Displaying beautifully curated showcase.');
        }
      }
    } catch (err: any) {
      console.warn('Instagram API Error:', err.message);
      setError(err.message || 'Error occurred while syncing feed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReel = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const reelId = extractIdFromUrl(newReelUrl);
    if (!reelId) {
      setError('Invalid Instagram Link. Please paste a standard URL, e.g. https://www.instagram.com/reel/C7-K_C4ST3c/');
      return;
    }

    // Prevent duplicates
    if (reels.some(item => item.id === reelId)) {
      setError('This Instagram Reel is already in your gallery list.');
      return;
    }

    const newReelItem: InstagramReel = {
      id: reelId,
      url: newReelUrl.trim(),
      title: newReelTitle.trim() || 'Monica Interiors Custom Design Concept'
    };

    const updated = [newReelItem, ...reels];
    saveReels(updated);
    setNewReelUrl('');
    setNewReelTitle('');
    setIsAdding(false);
  };

  const handleDeleteReel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering full-screen preview when clicking delete
    const updated = reels.filter(item => item.id !== id);
    saveReels(updated);
    if (activeReel === id) {
      setActiveReel(null);
    }
  };

  const resetToDefault = () => {
    saveReels(DEFAULT_REELS);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* SECTION TOP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12" id="reels-header">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#BFA15F] font-semibold block mb-1">
            Studio Buzz &bull; Instagram Feed
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#3C2A21] tracking-tight leading-tight">
            Visual Walkthroughs & Design Reels
          </h2>
          <p className="font-sans text-[#6B625E] font-light text-sm mt-3 leading-relaxed">
            Follow Monica Interiors on Instagram to experience live walkthroughs, modular layout explanations, and exquisite material curations. Below is our dynamic feed—select any Reel card to watch the video player in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 border border-[#BFA15F]/30 hover:border-[#BFA15F] bg-white text-[#3C2A21] px-4 py-2.5 rounded text-xs uppercase tracking-wider font-sans transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#BFA15F]" />
            {isAdding ? 'Close Manager' : 'Add Custom Reel'}
          </button>
          
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 text-stone-500 hover:text-[#3C2A21] text-xs font-mono font-medium border border-stone-200/60 px-3 py-2.5 rounded bg-stone-100/50 transition-colors"
            title="Reset gallery to default beautiful showcase video reels"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE CARD */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-4 bg-[#1E2941]/5 border border-[#1E2941]/10 rounded text-xs font-sans text-[#1E2941] flex gap-2 items-center"
          >
            <span className="text-[#BFA15F] font-bold">Note: </span>
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MANAGING ADD NEW REEL FORM */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#3C2A21]/5 border border-[#3C2A21]/10 rounded-lg p-6 mb-10 text-[#3C2A21]"
          >
            <h4 className="font-serif text-lg font-semibold mb-4 text-[#3C2A21] flex items-center gap-2">
              <Instagram className="w-5 h-5 text-[#BFA15F]" />
              Manage Studio Instagram Reels
            </h4>

            <form onSubmit={handleAddReel} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#6B625E] font-bold">
                    Instagram Reel URL
                  </label>
                  <input
                    type="url"
                    value={newReelUrl}
                    onChange={(e) => setNewReelUrl(e.target.value)}
                    placeholder="https://www.instagram.com/reel/C7-K_C4ST3c/"
                    required
                    className="bg-white border border-[#3C2A21]/20 focus:border-[#BFA15F] focus:ring-1 focus:ring-[#BFA15F] rounded p-3 text-xs w-full outline-none font-sans text-[#3C2A21]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#6B625E] font-bold">
                    Custom Description Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={newReelTitle}
                    onChange={(e) => setNewReelTitle(e.target.value)}
                    placeholder="Living Room layout reveal in Bandra West Mumbai"
                    className="bg-white border border-[#3C2A21]/20 focus:border-[#BFA15F] focus:ring-1 focus:ring-[#BFA15F] rounded p-3 text-xs w-full outline-none font-sans text-[#3C2A21]"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#3C2A21]/10">
                <p className="text-[10px] text-[#6B625E] font-sans">
                  Any public Reel ID is accepted. It links securely with Instagram's server directly.
                </p>
                <button
                  type="submit"
                  className="bg-[#3C2A21] text-white px-5 py-2 rounded text-xs font-sans hover:bg-[#BFA15F] transition-colors uppercase tracking-wider font-semibold"
                >
                  Publish to Gallery
                </button>
              </div>
            </form>

            {/* Developer Alert Token Guideline */}
            <div className="bg-[#1E2941]/5 border border-[#1E2941]/10 p-4 rounded mt-4 text-[11px] leading-relaxed text-[#1E2941] flex gap-3 items-start font-sans">
              <KeyRound className="w-5 h-5 flex-shrink-0 text-[#BFA15F] mt-0.5" />
              <div>
                <span className="font-bold block mb-1 uppercase tracking-widest font-mono text-[9px] text-[#BFA15F]">
                  OAuth Developer Integration Setup
                </span>
                For fully dynamic automatic account syndication, configure the secure <code className="bg-[#1E2941]/10 px-1 py-0.5 rounded">VITE_INSTAGRAM_ACCESS_TOKEN</code> in your environment variables. If present, Monica Interiors launches active live synchronization from your Instagram Business media catalog automatically.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DYNAMIC METADATA GRID OF SHOWCASE REELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        
        {/* LEFTSIDE REELS LIST GRID - 7 Columns */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="text-xs font-mono uppercase text-[#7F675B] tracking-widest font-semibold flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F] animate-pulse" />
              Studio Feed Catalog ({reels.length} Items)
            </span>
            {tokenFound && (
              <span className="bg-[#FAF8F5] text-[#BFA15F] px-2 py-0.5 rounded border border-[#BFA15F]/20 text-[9px] font-sans flex items-center gap-1">
                <RefreshCw className="w-2.5 h-2.5 animate-spin text-[#BFA15F]" /> Live Sync Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reels.map((reel) => {
              const isActive = activeReel === reel.id;
              // Extract a beautiful high-res interior design backup frame from Unsplash depending on title keywords
              let fallbackBanner = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400';
              if (reel.title.toLowerCase().includes('kitchen')) {
                fallbackBanner = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400';
              } else if (reel.title.toLowerCase().includes('bedroom')) {
                fallbackBanner = 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=400';
              } else if (reel.title.toLowerCase().includes('custom') || reel.title.toLowerCase().includes('behind')) {
                fallbackBanner = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400';
              }

              return (
                <div
                  key={reel.id}
                  onClick={() => setActiveReel(reel.id)}
                  className={`group relative cursor-pointer overflow-hidden border transition-all duration-300 rounded p-3 ${
                    isActive
                      ? 'border-[#BFA15F] bg-[#3C2A21]/5 shadow-md scale-[1.01]'
                      : 'border-stone-200 bg-white hover:border-[#3C2A21]/30 hover:shadow-sm'
                  }`}
                >
                  <div className="relative aspect-[9/16] w-full rounded overflow-hidden bg-stone-900 mb-3">
                    {/* Cover Photo / Thumbnail */}
                    <img 
                      src={reel.thumbnail || fallbackBanner}
                      alt={reel.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-70" />

                    {/* Play/View Trigger indicators overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-[#BFA15F] text-[#FAF8F5] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Top Instagram Logo Tag */}
                    <div className="absolute top-2.5 left-2.5 bg-white/10 backdrop-blur-md text-white text-[9px] font-mono tracking-widest uppercase px-2 py-1 rounded flex items-center gap-1 border border-white/20">
                      <Instagram className="w-3.5 h-3.5 text-[#BFA15F]" />
                      Reel
                    </div>

                    {/* Delete Custom button (shows up if you can delete) */}
                    <button
                      onClick={(e) => handleDeleteReel(reel.id, e)}
                      className="absolute top-2.5 right-2.5 bg-black/40 hover:bg-red-600 font-sans p-1.5 rounded transition-colors text-white border border-white/10 opacity-0 group-hover:opacity-100"
                      title="Remove this reel from list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    {/* Direct external Link */}
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-2.5 left-2.5 bg-black/60 text-white hover:text-[#BFA15F] transition-colors p-1.5 rounded flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest border border-white/10"
                    >
                      <span>ig link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] text-[#BFA15F] uppercase tracking-widest">
                      ID: {reel.id}
                    </span>
                    <h5 className="font-serif text-sm text-[#3C2A21] font-semibold tracking-tight line-clamp-2 h-10 leading-snug group-hover:text-[#BFA15F] transition-colors">
                      {reel.title}
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* RIGHTSIDE HIGH-FIDELITY ACTIVE REEL PLAYER - 5 Columns */}
        <div className="lg:col-span-5 sticky top-28 flex flex-col bg-white border border-[#3C2A21]/15 rounded-lg p-5 shadow-lg">
          <div className="text-xs font-mono uppercase text-[#7F675B] tracking-widest font-semibold flex items-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F] animate-pulse" />
            Live Instagram Player
          </div>

          {activeReel ? (
            (() => {
              const activeItem = reels.find(r => r.id === activeReel);
              const isReel = activeItem ? activeItem.url.includes('/reel/') : false;

              return (
                <div className="flex-1 flex flex-col justify-between h-full">
                  {/* Action Bar Toggle */}
                  <div className="flex gap-2 p-1 bg-stone-100 rounded-md mb-3 text-xs font-mono" id="player-tabs">
                    <span className="flex-1 text-center py-1.5 font-medium rounded bg-white text-[#3C2A21] shadow-xs uppercase tracking-wider text-[10px] flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live In-Website Player
                    </span>
                    <a
                      href={activeItem?.url || `https://www.instagram.com/p/${activeReel}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-1.5 font-medium rounded text-stone-500 hover:text-[#BFA15F] transition-all hover:bg-stone-50 uppercase tracking-wider text-[10px] flex items-center justify-center gap-1 border border-transparent hover:border-stone-200"
                    >
                      Open Live App <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Standardized, Sandbox-Free, Highly-Compatible Embed Container */}
                  <div className="relative w-full rounded-md overflow-hidden bg-white border border-stone-200/80 shadow-md mb-4 flex items-center justify-center h-[520px]">
                    <iframe
                      key={activeReel}
                      src={`https://www.instagram.com/p/${activeReel}/embed/`}
                      className="w-full h-full border-0"
                      scrolling="no"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      title="Monica Interiors Live Instagram Feed"
                    />
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#BFA15F] uppercase tracking-widest font-semibold flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5" />
                        {isReel ? 'ACTIVE INSTAGRAM REEL' : 'ACTIVE INSTAGRAM POST'}
                      </span>
                      <a
                        href={activeItem?.url || `https://www.instagram.com/p/${activeReel}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-500 hover:text-[#BFA15F] flex items-center gap-1 text-xs font-mono font-medium hover:underline"
                      >
                        Source Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    
                    <h4 className="font-serif text-sm font-semibold text-[#3C2A21] leading-relaxed">
                      {activeItem?.title || 'Monica Interiors Design Studio Project Walkthrough'}
                    </h4>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-stone-300 rounded bg-[#FAF8F5]/50">
              <div className="w-14 h-14 rounded-full bg-[#3C2A21]/5 text-[#BFA15F] flex items-center justify-center mb-4">
                <Instagram className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-base font-semibold text-[#3C2A21] mb-1">
                No Video Playing
              </h4>
              <p className="font-sans text-xs text-[#6B625E] font-light max-w-sm leading-relaxed mb-6">
                Click any Reel card on the left side to load its interactive native Instagram player here. You'll be able to watch, mute/unmute, view comments, and click like directly!
              </p>
              
              {reels.length > 0 && (
                <button
                  onClick={() => setActiveReel(reels[0].id)}
                  className="bg-[#3C2A21] hover:bg-[#BFA15F] text-white px-5 py-2.5 rounded text-xs uppercase tracking-widest font-sans transition-all shadow-sm font-medium"
                >
                  Load Highlight Reel
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
