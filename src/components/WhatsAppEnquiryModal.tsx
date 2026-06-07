/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Send, CheckCircle, HelpCircle, MapPin, Sparkles } from 'lucide-react';

interface WhatsAppEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export default function WhatsAppEnquiryModal({ isOpen, onClose, initialService = '' }: WhatsAppEnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: 'Mumbai',
    customLocation: '',
    spaceType: 'Residential' as 'Residential' | 'Commercial',
    residentialService: initialService || 'Modular Kitchen',
    commercialService: 'Offices',
    propertySize: '2BHK',
    customNotes: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const locations = ['Mumbai', 'Thane', 'Navi Mumbai', 'Other'];
  
  const residentialServices = [
    'Bedroom',
    'Living Room',
    'Dining Room',
    'Modular Kitchen',
    'Full Home Turnkey Interior'
  ];

  const commercialServices = [
    'Offices',
    'Boutiques',
    'Cafes',
    'Restaurants / Retail',
    'Other Workspace'
  ];

  const propertySizes = ['1BHK Flat', '2BHK Apartment', '3BHK Residence', '4BHK / Penthouse', 'Commercial Space'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpaceTypeChange = (type: 'Residential' | 'Commercial') => {
    setFormData(prev => {
      // Pick sensible defaults when switching space types
      if (type === 'Residential') {
        return { ...prev, spaceType: type, propertySize: '2BHK Apartment' };
      } else {
        return { ...prev, spaceType: type, propertySize: 'Commercial Space' };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine final location
    const finalLocation = formData.location === 'Other' ? formData.customLocation : formData.location;
    // Determine selected sub-service
    const finalService = formData.spaceType === 'Residential' ? formData.residentialService : formData.commercialService;

    // Build absolute high-contrast structured text message with numbered list for cross-device compatibility
    const messageLines = [
      `*NEW DESIGN ENQUIRY — MONICA INTERIORS*`,
      `------------------------------------------`,
      `1. *Name:* ${formData.name}`,
      `2. *Contact:* ${formData.phone}`,
      `3. *Location:* ${finalLocation || 'Mumbai Area'}`,
      `4. *Category:* ${formData.spaceType} Services`,
      `5. *Primary Interest:* ${finalService}`,
      `6. *Property Layout:* ${formData.propertySize}`,
      formData.customNotes ? `7. *Brief / Notes:* ${formData.customNotes}` : '',
      `------------------------------------------`
    ].filter(Boolean);

    const fullMessage = messageLines.join('\n');
    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/919137062574?text=${encodedMessage}`;

    // Open WhatsApp in new secure screen
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop blurring layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1E1714]/80 backdrop-blur-sm"
            id="whatsapp-modal-backdrop"
          />

          {/* Form Modal Body container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#3C2A21]/15 rounded-lg shadow-2xl overflow-hidden flex flex-col z-10"
            id="whatsapp-enquiry-modal-body"
          >
            {/* Elegant Header with dark sand accent */}
            <div className="bg-[#1E1714] text-white px-6 py-5 flex items-center justify-between border-b border-[#FAF8F5]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-inner">
                  <MessageSquare className="w-4 h-4 text-white fill-current" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg tracking-tight text-white font-medium">WhatsApp Interior Enquiry</h3>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#BFA15F] font-semibold">Instant auto-formatting brief</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                aria-label="Close modal dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Content Scroller */}
            <div className="p-6 overflow-y-auto max-h-[80vh] sm:max-h-[75vh]">
              <AnimatePresence mode="wait">
                {formSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10 text-center gap-4"
                    id="whatsapp-enquiry-success"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/35 text-[#25D366]">
                      <svg
                        className="w-8 h-8 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-bold text-[#3C2A21]">Opening WhatsApp...</h4>
                      <p className="font-sans text-sm text-[#6B625E] font-light mt-1.5 max-w-xs leading-relaxed">
                        We have automatically compiled your structural layout specifications. Please click "send" in your WhatsApp chat window to lock your design quote slot!
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    id="whatsapp-enquiry-form-element"
                  >
                    {/* Intro Prompt */}
                    <div className="bg-[#BFA15F]/10 border border-[#BFA15F]/20 p-3.5 rounded text-xs leading-relaxed text-[#3C2A21] flex gap-2">
                      <Sparkles className="w-4 h-4 text-[#BFA15F] flex-shrink-0 mt-0.5" />
                      <span>
                        Fill out your basic criteria below, and we will package this details bundle into a beautiful message ready to push directly to our interior design queue.
                      </span>
                    </div>

                    {/* NAME INPUT */}
                    <div>
                      <label htmlFor="wa-name" className="block text-xs uppercase tracking-wider font-mono text-[#3C2A21] font-semibold mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="wa-name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#3C2A21]/15 px-3 py-2 text-sm text-[#3C2A21] rounded placeholder-stone-400 focus:outline-none focus:border-[#BFA15F]"
                        placeholder="e.g. Priyesh Sharma"
                      />
                    </div>

                    {/* PHONE INPUT */}
                    <div>
                      <label htmlFor="wa-phone" className="block text-xs uppercase tracking-wider font-mono text-[#3C2A21] font-semibold mb-1">
                        WhatsApp Contact Number *
                      </label>
                      <input
                        type="tel"
                        id="wa-phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#3C2A21]/15 px-3 py-2 text-sm text-[#3C2A21] rounded placeholder-stone-400 focus:outline-none focus:border-[#BFA15F]"
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>

                    {/* LOCAL GEOGRAPHY LOCATION PICKER */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-mono text-[#3C2A21] font-semibold mb-1">
                        Location / Site Area *
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {locations.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, location: loc }))}
                            className={`px-2 py-1.5 text-xs rounded border text-center font-sans tracking-wide transition-all cursor-pointer ${
                              formData.location === loc
                                ? 'bg-[#3C2A21] text-white border-transparent font-medium shadow-sm'
                                : 'bg-white hover:bg-[#FAF8F5] border-[#3C2A21]/15 text-[#6B625E]'
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>

                      {/* Explicit custom location prompt to handle GEO/mumbai queries */}
                      {formData.location === 'Other' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2"
                        >
                          <input
                            type="text"
                            name="customLocation"
                            required
                            value={formData.customLocation}
                            onChange={handleChange}
                            className="w-full bg-white border border-[#3C2A21]/15 px-3 py-2 text-sm text-[#3C2A21] rounded focus:outline-none focus:border-[#BFA15F]"
                            placeholder="Enter specific city/suburb, e.g. Bandra West, Delhi"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* SPACE TYPE SELECTOR */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-mono text-[#3C2A21] font-semibold mb-1.5">
                        Project Scope *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleSpaceTypeChange('Residential')}
                          className={`flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-widest rounded border transition-all cursor-pointer ${
                            formData.spaceType === 'Residential'
                              ? 'bg-[#1E1714] text-[#BFA15F] border-transparent font-bold'
                              : 'bg-white border-[#3C2A21]/15 text-[#6B625E] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          🏡 Residential
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSpaceTypeChange('Commercial')}
                          className={`flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-widest rounded border transition-all cursor-pointer ${
                            formData.spaceType === 'Commercial'
                              ? 'bg-[#1E1714] text-[#BFA15F] border-transparent font-bold'
                              : 'bg-white border-[#3C2A21]/15 text-[#6B625E] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          🏢 Commercial
                        </button>
                      </div>
                    </div>

                    {/* CATEGORY & SUB-SERVICES INTERIOR REQUIREMENTS (DENSE BUT CLEAR) */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-mono text-[#3C2A21] font-semibold mb-1">
                        Specific Turnkey Service Required *
                      </label>
                      {formData.spaceType === 'Residential' ? (
                        <select
                          name="residentialService"
                          value={formData.residentialService}
                          onChange={handleChange}
                          className="w-full bg-white border border-[#3C2A21]/15 px-3 py-2 text-sm text-[#3C2A21] rounded focus:outline-none focus:border-[#BFA15F]"
                        >
                          {residentialServices.map(service => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      ) : (
                        <select
                          name="commercialService"
                          value={formData.commercialService}
                          onChange={handleChange}
                          className="w-full bg-white border border-[#3C2A21]/15 px-3 py-2 text-sm text-[#3C2A21] rounded focus:outline-none focus:border-[#BFA15F]"
                        >
                          {commercialServices.map(service => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* PROPERTY SIZES */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-mono text-[#3C2A21] font-semibold mb-1">
                        Flat / Site Dimensions Layout Type *
                      </label>
                      <select
                        name="propertySize"
                        value={formData.propertySize}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#3C2A21]/15 px-3 py-2 text-sm text-[#3C2A21] rounded focus:outline-none focus:border-[#BFA15F]"
                      >
                        {propertySizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    {/* BRIEF SPECIFICATION NOTES (MUTABLE DESCRIPTOR) */}
                    <div>
                      <label htmlFor="wa-customNotes" className="block text-xs uppercase tracking-wider font-mono text-[#3C2A21] font-semibold mb-1">
                        Space Notes / Custom Requirements
                      </label>
                      <textarea
                        id="wa-customNotes"
                        name="customNotes"
                        rows={3}
                        value={formData.customNotes}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#3C2A21]/15 px-3 py-2 text-sm text-[#3C2A21] rounded placeholder-stone-400 focus:outline-none focus:border-[#BFA15F]"
                        placeholder="Tell us about special color grids, Vastu wishes or custom ceilings..."
                      />
                    </div>

                    {/* SUBMIT BUTTON WITH INTEGRATED WHATSAPP EMBLEM */}
                    <button
                      type="submit"
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] active:scale-98 transition-all hover:scale-101 text-white py-3 px-5 rounded font-mono uppercase text-xs tracking-widest font-bold flex items-center justify-center gap-2.5 shadow-md mt-4 cursor-pointer"
                    >
                      <span>Submit &amp; Open WhatsApp</span>
                      <Send className="w-4 h-4 ml-1" />
                    </button>
                    
                    <p className="font-sans text-[10px] text-center text-stone-400 font-light max-w-xs mx-auto">
                      All details are parsed client-side and dynamically formatted. Safe, secure connection to Monica Interiors.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
