/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Shield, User, Search, Calendar, Mail, Phone, Clock, CreditCard, 
  Check, CheckCircle2, AlertCircle, RefreshCw, BarChart3, Users, DollarSign, ExternalLink,
  Edit, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudioPortalProps {
  onClose: () => void;
  onOpenBooking: () => void;
}

export default function StudioPortal({ onClose, onOpenBooking }: StudioPortalProps) {
  const [activeTab, setActiveTab] = useState<'client' | 'admin'>('client');
  
  // Client lookup state
  const [lookupValue, setLookupValue] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [clientBookings, setClientBookings] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Admin access state
  const [adminPin, setAdminPin] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminBookings, setAdminBookings] = useState<any[]>([]);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Status updates
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingMeetId, setEditingMeetId] = useState<string | null>(null);
  const [editingMeetValue, setEditingMeetValue] = useState<string>("");

  // Stats computation for Admin
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    uniqueClients: 0,
    activeBookings: 0
  });

  // Save PIN in sessionStorage during session for convenience
  useEffect(() => {
    const savedPin = sessionStorage.getItem('studio_admin_pin');
    if (savedPin) {
      setAdminPin(savedPin);
      verifyAdminPin(savedPin);
    }
  }, []);

  // Format date helper
  const formatDateString = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  // Perform client booking search lookup
  const handleClientLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupValue.trim()) return;

    setLookupLoading(true);
    setLookupError(null);
    setSearched(true);

    try {
      const response = await fetch(`/api/bookings/query?value=${encodeURIComponent(lookupValue.trim())}`);
      const data = await response.json();
      
      if (response.ok) {
        setClientBookings(data.bookings || []);
      } else {
        throw new Error(data.error || 'Server responded with inquiry query rejection.');
      }
    } catch (err: any) {
      setLookupError(err.message || 'Network connection failed. Please retry.');
    } finally {
      setLookupLoading(false);
    }
  };

  // Verify and fetch Admin bookings
  const verifyAdminPin = async (pinToVerify: string) => {
    setAdminLoading(true);
    setAdminError(null);

    try {
      const response = await fetch(`/api/bookings/all?pin=${encodeURIComponent(pinToVerify)}`);
      const data = await response.json();

      if (response.ok) {
        setAdminBookings(data.bookings || []);
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('studio_admin_pin', pinToVerify);
        computeStats(data.bookings || []);
      } else {
        throw new Error(data.error || 'Invalid administrator credentials pin.');
      }
    } catch (err: any) {
      setAdminError(err.message || 'Failure validating authorization pin code.');
      setIsAdminAuthenticated(false);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPin.trim()) return;
    verifyAdminPin(adminPin.trim());
  };

  // Compute stat metrics for the dashboard
  const computeStats = (bookingsList: any[]) => {
    let rev = 0;
    const clientSet = new Set<string>();
    let active = 0;

    bookingsList.forEach(b => {
      // Add revenue if confirmed/completed
      if (b.status !== 'Cancelled') {
        rev += Number(b.amountPaid) || 0;
      }
      if (b.clientEmail) {
        clientSet.add(b.clientEmail.toLowerCase().trim());
      }
      if (b.status === 'Confirmed' || b.status === 'Rescheduled') {
        active++;
      }
    });

    setStats({
      totalRevenue: rev,
      totalBookings: bookingsList.length,
      uniqueClients: clientSet.size,
      activeBookings: active
    });
  };

  // Update a booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const response = await fetch('/api/bookings/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: adminPin, bookingId, status: newStatus })
      });
      const data = await response.json();

      if (response.ok) {
        // Refresh local bookings state
        const updatedList = adminBookings.map(b => {
          if (b.bookingId === bookingId) {
            return { ...b, status: newStatus };
          }
          return b;
        });
        setAdminBookings(updatedList);
        computeStats(updatedList);
      } else {
        alert(data.error || 'Failed to update transaction status.');
      }
    } catch (err) {
      console.error('Status update crash:', err);
      alert('Network exception updating transaction status values.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Update a booking's Google Meet link (Admin custom entry)
  const updateBookingMeetLink = async (bookingId: string, meetLink: string) => {
    setUpdatingId(bookingId);
    try {
      const response = await fetch('/api/bookings/update-meet-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, meetLink })
      });
      const data = await response.json();

      if (response.ok) {
        // Refresh local bookings state
        const updatedList = adminBookings.map(b => {
          if (b.bookingId === bookingId) {
            return { ...b, meetLink: data.booking?.meetLink || meetLink };
          }
          return b;
        });
        setAdminBookings(updatedList);
        setEditingMeetId(null);
      } else {
        alert(data.error || 'Failed to update Google Meet link.');
      }
    } catch (err) {
      console.error('Meet link update crash:', err);
      alert('Network exception updating Google Meet link.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('studio_admin_pin');
    setIsAdminAuthenticated(false);
    setAdminPin('');
    setAdminBookings([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 py-8 md:py-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#FAF8F5] text-[#3C2A21] w-full max-w-5xl min-h-[550px] border border-[#3C2A21]/15 shadow-2xl flex flex-col relative rounded-lg overflow-hidden"
        id="studio-portal-modal"
      >
        {/* Header Ribbon */}
        <div className="bg-[#1E1714] text-[#FAF8F5] p-6 border-b border-[#3C2A21]/20 flex justify-between items-center">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#BFA15F]">
              Direct Database Access
            </span>
            <h3 className="font-serif text-2xl tracking-tight mt-1 text-white">
              Studio Portal &amp; Ledger
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-3 text-xs uppercase tracking-wider font-mono border border-white/10 hover:border-[#BFA15F] hover:text-[#BFA15F] bg-white/5 rounded transition-all cursor-pointer"
            id="close-portal-button"
          >
            Exit Portal ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#3C2A21]/10 bg-white">
          <button
            onClick={() => setActiveTab('client')}
            className={`flex-1 py-4 text-center font-sans text-xs uppercase tracking-[0.15em] font-medium transition-all border-b-2 ${
              activeTab === 'client' 
                ? 'border-[#3C2A21] text-[#3C2A21] bg-stone-50/50' 
                : 'border-transparent text-[#6B625E] hover:text-[#3C2A21] hover:bg-stone-50/20'
            }`}
            id="tab-client-ledger"
          >
            Client Booking Tracker
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-4 text-center font-sans text-xs uppercase tracking-[0.15em] font-medium transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'admin' 
                ? 'border-[#3C2A21] text-[#3C2A21] bg-stone-50/50' 
                : 'border-transparent text-[#6B625E] hover:text-[#3C2A21] hover:bg-stone-50/20'
            }`}
            id="tab-admin-ledger"
          >
            <Lock className="w-3.5 h-3.5 text-[#BFA15F]" />
            Studio Owner Dashboard
          </button>
        </div>

        {/* CONTENT ENVELOPE */}
        <div className="flex-grow p-6 md:p-8 flex flex-col bg-[#FAF8F5]">
          
          {/* CLIENT TRACKING TAB */}
          {activeTab === 'client' && (
            <div className="flex flex-col gap-6 md:max-w-3xl mx-auto w-full py-2">
              <div className="text-center">
                <h4 className="font-serif text-xl text-[#3C2A21] mb-2">Track Your Design Consultation</h4>
                <p className="font-sans text-xs text-[#6B625E] font-light max-w-md mx-auto leading-relaxed">
                  Enter your registered client email address, phone number, or bespoke Reservation ID below to track your transaction details, check verified Razorpay payouts, or fetch virtual Google Meet room credentials.
                </p>
              </div>

              {/* SEARCH COMPASS */}
              <form onSubmit={handleClientLookup} className="flex gap-2 max-w-lg mx-auto w-full mt-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. your_email@domain.com, phone number, or booking reference"
                  value={lookupValue}
                  onChange={(e) => setLookupValue(e.target.value)}
                  className="flex-grow bg-white border border-[#3C2A21]/15 px-4 py-3 text-xs md:text-sm rounded outline-none focus:border-[#BFA15F] font-sans"
                  id="client-search-field"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="bg-[#3C2A21] text-[#FAF8F5] hover:bg-[#1E1714] px-5 py-3 text-xs uppercase tracking-widest font-mono font-bold font-medium rounded transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  id="client-search-submit"
                >
                  {lookupLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  Locate
                </button>
              </form>

              {/* ERROR BLOCK */}
              {lookupError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded text-xs text-red-700 font-sans font-medium max-w-lg mx-auto w-full flex gap-2 items-center">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{lookupError}</span>
                </div>
              )}

              {/* RESULTS GRID */}
              <AnimatePresence mode="wait">
                {searched && !lookupLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 mt-2"
                  >
                    {clientBookings.length === 0 ? (
                      <div className="text-center py-8 bg-white border border-dashed border-[#3C2A21]/10 rounded-lg max-w-lg mx-auto w-full">
                        <AlertCircle className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                        <span className="font-serif text-base block text-[#3C2A21]">No transactions matched your search criteria</span>
                        <p className="font-sans text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                          Check for spelling errors, verify country codes, or submit a new design consultation request!
                        </p>
                        <button
                          onClick={onOpenBooking}
                          className="mt-4 inline-flex items-center gap-1 bg-[#3C2A21] text-white text-[10px] uppercase tracking-widest font-mono px-3 py-2 rounded hover:bg-[#BFA15F] hover:text-[#1E1714] transition-all"
                        >
                          Book consultation
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <span className="font-mono text-[10px] text-[#BFA15F] uppercase tracking-widest font-bold">
                          Matched reservations on server ({clientBookings.length})
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {clientBookings.map((b) => (
                            <div 
                              key={b.bookingId}
                              className="bg-white border border-[#3C2A21]/10 rounded-lg p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-start border-b border-stone-100 pb-2 mb-3">
                                  <div>
                                    <span className="font-mono text-[9px] text-[#BFA15F] uppercase tracking-wider block">Reservation Ref</span>
                                    <span className="font-mono text-xs font-bold text-[#3C2A21]">{b.bookingId}</span>
                                  </div>
                                  <div className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono font-medium ${
                                    b.status === 'Completed' 
                                      ? 'bg-emerald-100 text-emerald-800' 
                                      : b.status === "Cancelled" 
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {b.status}
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 text-xs">
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="w-3.5 h-3.5 text-[#BFA15F]" />
                                    <span className="font-medium text-[#3C2A21]">{b.packageName}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2 mt-1 border-t border-dashed border-stone-100 pt-2 text-[11px] text-[#6B625E]">
                                    <div className="flex items-center gap-1.5">
                                      <Calendar className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">{b.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-3 h-3 flex-shrink-0" />
                                      <span>{b.time}</span>
                                    </div>
                                  </div>

                                  <div className="mt-1 flex justify-between items-center bg-stone-50 p-2 rounded text-[11px]">
                                    <span className="text-stone-400 font-mono text-[9px] uppercase">Design Retainer</span>
                                    <span className="font-semibold text-[#3C2A21]">₹{b.amountPaid ? b.amountPaid.toLocaleString('en-IN') : 'N/A'} (Verified)</span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Panel for Google Meet */}
                              {b.status !== 'Cancelled' && b.meetLink && (
                                <div className="mt-4 border-t border-stone-100 pt-3 flex flex-col gap-2">
                                  <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest block">Virtual Consultation Room</span>
                                  <a
                                    href={b.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#3C2A21]/5 hover:bg-[#3C2A21] hover:text-white text-[#3C2A21] font-mono text-[10px] font-bold uppercase tracking-widest text-center py-2.5 rounded transition-all flex items-center justify-center gap-1.5 border border-[#3C2A21]/10"
                                  >
                                    Join Google Meet Studio
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Close Button to exit the Tracker portal */}
              <div className="flex justify-center mt-8 pt-6 border-t border-[#3C2A21]/10">
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest font-mono bg-[#3C2A21] hover:bg-[#BFA15F] text-[#FAF8F5] hover:text-[#3C2A21] border border-[#3C2A21] rounded transition-all cursor-pointer shadow-md duration-200"
                  id="client-tracker-bottom-close-btn"
                >
                  Exit Portal ✕
                </button>
              </div>
            </div>
          )}

          {/* ADMIN MANAGEMENT TAB */}
          {activeTab === 'admin' && (
            <div className="flex flex-col h-full flex-grow">
              
              {/* ADMIN LOCK SCREEN */}
              {!isAdminAuthenticated ? (
                <div className="flex flex-col items-center justify-center py-12 max-w-sm mx-auto w-full text-center">
                  <div className="w-12 h-12 rounded-full bg-[#BFA15F]/10 flex items-center justify-center text-[#BFA15F] mb-4 border border-[#BFA15F]/20">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl text-[#3C2A21] mb-2">Studio Authentication PIN</h4>
                  <p className="font-sans text-xs text-[#6B625E] font-light mb-6 leading-relaxed">
                    Access is restricted to authorized studio design desk managers. Please authenticate using your custom Studio Ledger Key.
                  </p>

                  <form onSubmit={handleAdminAuth} className="w-full flex flex-col gap-3">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B625E]/40" />
                      <input
                        type="password"
                        required
                        placeholder="PIN Code (Default: 2306)"
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        className="w-full bg-white border border-[#3C2A21]/15 pl-9 pr-3 py-3 text-center text-sm rounded outline-none focus:border-[#BFA15F] font-mono tracking-widest"
                        id="admin-pin-field"
                      />
                    </div>
                    
                    {adminError && (
                      <span className="text-[10px] text-red-600 block text-center font-sans font-medium mt-1">
                        ⚠️ Code invalid: {adminError}
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={adminLoading}
                      className="w-full bg-[#3C2A21] text-white py-3 px-4 rounded text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#1E1714] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      id="admin-auth-submit"
                    >
                      {adminLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      Access Studio Ledger
                    </button>
                  </form>
                </div>
              ) : (
                /* OWNER DASHBOARD PANEL CONTENT */
                <div className="flex flex-col gap-6 flex-grow">
                  
                  {/* METRIC BOXES SUMMARY */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-ribbon">
                    
                    {/* STAT 1: SECURED SALES REVENUE */}
                    <div className="bg-white border border-[#3C2A21]/10 p-4 rounded-lg flex items-center gap-3 shadow-xs">
                      <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-stone-400 block tracking-wider">Secured Revenue</span>
                        <span className="font-serif text-base sm:text-lg font-bold text-stone-800">
                          ₹{stats.totalRevenue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* STAT 2: TOTAL SESSIONS */}
                    <div className="bg-white border border-[#3C2A21]/10 p-4 rounded-lg flex items-center gap-3 shadow-xs">
                      <div className="w-9 h-9 rounded bg-[#BFA15F]/10 text-[#BFA15F] flex items-center justify-center">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-stone-400 block tracking-wider">Consultations</span>
                        <span className="font-serif text-base sm:text-lg font-bold text-stone-800">
                          {stats.totalBookings} Registered
                        </span>
                      </div>
                    </div>

                    {/* STAT 3: UNIQUE CLIENTS */}
                    <div className="bg-white border border-[#3C2A21]/10 p-4 rounded-lg flex items-center gap-3 shadow-xs">
                      <div className="w-9 h-9 rounded bg-[#1E1714]/5 text-[#3C2A21] flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-stone-400 block tracking-wider">Active Clienteles</span>
                        <span className="font-serif text-base sm:text-lg font-bold text-stone-800">
                          {stats.uniqueClients} Clients
                        </span>
                      </div>
                    </div>

                    {/* STAT 4: ACTIVE BOOKINGS */}
                    <div className="bg-white border border-[#3C2A21]/10 p-4 rounded-lg flex items-center gap-3 shadow-xs">
                      <div className="w-9 h-9 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-stone-400 block tracking-wider">Pending Slates</span>
                        <span className="font-serif text-base sm:text-lg font-bold text-stone-800">
                          {stats.activeBookings} Upcoming
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* MASTER CLIENT LEDGER TABLE */}
                  <div className="flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-[10px] text-[#BFA15F] uppercase tracking-widest font-bold">
                        Bespoke Consultation Records ({adminBookings.length})
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => verifyAdminPin(adminPin)}
                          className="p-1.5 px-3 text-[10px] font-mono uppercase tracking-wider bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 rounded flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Refresh List
                        </button>
                        <button
                          onClick={handleLogout}
                          className="p-1.5 px-3 text-[10px] font-mono uppercase tracking-wider bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>

                    {/* Ledger Scroll Wrapper */}
                    <div className="bg-white border border-[#3C2A21]/10 rounded-lg overflow-hidden flex-grow shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-sans text-xs">
                          <thead>
                            <tr className="bg-stone-50 border-b border-[#3C2A21]/10 text-[#7F675B] text-[10px] font-mono uppercase tracking-wider">
                              <th className="p-4 py-3 font-semibold">Booking ID</th>
                              <th className="p-4 py-3 font-semibold">Client Specifics</th>
                              <th className="p-4 py-3 font-semibold">Program</th>
                              <th className="p-4 py-3 font-semibold">Reserved Slot</th>
                              <th className="p-4 py-3 font-semibold text-right">Retainer Fee</th>
                              <th className="p-4 py-3 font-semibold text-center">Status</th>
                              <th className="p-4 py-3 font-semibold text-center">Desk Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {adminBookings.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="p-12 text-center text-stone-400 font-light">
                                  No client transactions are currently logged on the server. Make a sandbox booking to log records!
                                </td>
                              </tr>
                            ) : (
                              adminBookings.map((b) => (
                                <tr key={b.bookingId} className="hover:bg-stone-50/50">
                                  {/* Ref code */}
                                  <td className="p-4 font-mono font-bold text-stone-700 truncate max-w-[120px]">
                                    {b.bookingId}
                                    <span className="block text-[8px] text-stone-400 font-light mt-0.5">
                                      {formatDateString(b.createdAt)}
                                    </span>
                                  </td>

                                  {/* Client */}
                                  <td className="p-4">
                                    <div className="font-semibold text-stone-800">{b.clientName || 'Anonymous'}</div>
                                    <div className="text-[11px] text-stone-500 font-mono lower-case truncate max-w-[180px]">
                                      {b.clientEmail}
                                    </div>
                                    {b.clientPhone && (
                                      <a 
                                        href={`https://wa.me/${b.clientPhone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-[#BFA15F] font-mono block hover:underline mt-0.5"
                                      >
                                        📞 {b.clientPhone} (WhatsApp)
                                      </a>
                                    )}
                                  </td>

                                  {/* Package */}
                                  <td className="p-4">
                                    <span className="font-medium text-stone-700 block">{b.packageName}</span>
                                    {editingMeetId === b.bookingId ? (
                                      <div className="mt-1.5 flex items-center gap-1">
                                        <input
                                          type="text"
                                          value={editingMeetValue}
                                          onChange={(e) => setEditingMeetValue(e.target.value)}
                                          className="bg-white border border-stone-300 text-[10px] font-mono rounded px-1.5 py-0.5 w-36 outline-none focus:border-[#BFA15F] text-stone-800"
                                          placeholder="https://meet.google.com/..."
                                          autoFocus
                                        />
                                        <button
                                          onClick={() => updateBookingMeetLink(b.bookingId, editingMeetValue)}
                                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                                          title="Save Link"
                                        >
                                          <Save className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => setEditingMeetId(null)}
                                          className="p-1 text-stone-400 hover:bg-stone-50 rounded cursor-pointer"
                                          title="Cancel"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 mt-1">
                                        {b.meetLink ? (
                                          <a 
                                            href={b.meetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 font-mono"
                                          >
                                            Meet Space
                                            <ExternalLink className="w-2.5 h-2.5" />
                                          </a>
                                        ) : (
                                          <span className="text-[10px] text-stone-400 font-mono italic">No Link</span>
                                        )}
                                        <button
                                          onClick={() => {
                                            setEditingMeetId(b.bookingId);
                                            setEditingMeetValue(b.meetLink || "");
                                          }}
                                          className="p-0.5 text-stone-400 hover:text-[#BFA15F] hover:bg-stone-100 rounded transition cursor-pointer"
                                          title="Edit Google Meet Link"
                                        >
                                          <Edit className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    )}
                                  </td>

                                  {/* Timing slot */}
                                  <td className="p-4 text-stone-600">
                                    <div className="font-medium">{b.date}</div>
                                    <div className="text-[11px] font-mono text-stone-400 mt-0.5">⏱️ {b.time} (IST)</div>
                                  </td>

                                  {/* Amount */}
                                  <td className="p-4 text-right font-serif font-bold text-stone-800">
                                    ₹{b.amountPaid ? b.amountPaid.toLocaleString('en-IN') : '0'}
                                    <span className="font-mono text-[8px] text-emerald-600 block uppercase font-light mt-0.5">CAPTURED</span>
                                  </td>

                                  {/* Status indicators */}
                                  <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono font-medium ${
                                      b.status === 'Completed' 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : b.status === "Cancelled" 
                                        ? 'bg-red-100 text-red-800'
                                        : b.status === "Rescheduled"
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {b.status}
                                    </span>
                                  </td>

                                  {/* Status update actions dropdown */}
                                  <td className="p-4 text-center">
                                    {updatingId === b.bookingId ? (
                                      <RefreshCw className="w-4 h-4 animate-spin text-[#BFA15F] mx-auto" />
                                    ) : (
                                      <select
                                        value={b.status || 'Confirmed'}
                                        onChange={(e) => updateBookingStatus(b.bookingId, e.target.value)}
                                        className="bg-stone-50 border border-stone-200 text-[10px] font-mono font-semibold rounded p-1 outline-none text-[#3C2A21] focus:border-[#BFA15F] cursor-pointer"
                                      >
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Rescheduled">Rescheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                      </select>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Bottom Close Button to exit the Admin desk portal */}
              <div className="flex justify-center mt-8 pt-6 border-t border-[#3C2A21]/10 w-full">
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest font-mono bg-[#3C2A21] hover:bg-[#BFA15F] text-[#FAF8F5] hover:text-[#3C2A21] border border-[#3C2A21] rounded transition-all cursor-pointer shadow-md duration-200"
                  id="admin-dashboard-bottom-close-btn"
                >
                  Exit Portal ✕
                </button>
              </div>

            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
