/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Instagram, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onBookClick: () => void;
  onOpenPolicy?: (tab: 'contact' | 'terms' | 'privacy' | 'refund') => void;
  onOpenPortal?: () => void;
}

export default function Footer({ onBookClick, onOpenPolicy, onOpenPortal }: FooterProps) {
  return (
    <footer className="bg-[#1E1714] text-[#FAF8F5]/90 border-t border-[#3C2A21]/20">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Main Logo Column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 flex-shrink-0 bg-[#FAF8F5]/5 p-0.5 rounded">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <rect x="24" y="34" width="46" height="10" rx="1.5" fill="#FAF8F5" />
                  <rect x="24" y="34" width="10" height="42" rx="1.5" fill="#FAF8F5" />
                  <rect x="42" y="34" width="10" height="42" rx="1.5" fill="#FAF8F5" />
                  <rect x="60" y="34" width="10" height="42" rx="1.5" fill="#FAF8F5" />
                  <circle cx="65" cy="20" r="5.5" fill="#BFA15F" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-lg font-semibold tracking-[0.12em] uppercase text-[#FAF8F5]">
                  Monica Interiors
                </span>
                <span className="text-[10px] font-sans text-[#BFA15F] uppercase tracking-[0.25em]">
                  Interior Design Studio
                </span>
              </div>
            </div>
            
            <p className="font-sans text-sm text-[#FAF8F5]/60 max-w-sm leading-relaxed font-light">
              Transforming homes into timeless spaces. Monica Interiors is a premium luxury interior design studio with 6+ years of experience, creating elegant sanctuaries for 2BHK, 3BHK, and Villas across Mumbai, Navi Mumbai, Delhi, &amp; Rajasthan.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://www.instagram.com/m.o.n.i.c.a.interiors/" 
                target="_blank" 
                rel="noopener"
                className="w-10 h-10 rounded-full border border-[#FAF8F5]/10 flex items-center justify-center hover:bg-[#BFA15F] hover:border-transparent hover:text-[#1E1714] transition-all text-[#FAF8F5]/80"
                aria-label="Instagram Portfolio Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="mailto:monicainteriors23@gmail.com"
                className="w-10 h-10 rounded-full border border-[#FAF8F5]/10 flex items-center justify-center hover:bg-[#BFA15F] hover:border-transparent hover:text-[#1E1714] transition-all text-[#FAF8F5]/80"
                aria-label="Email Studio Contact"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-5">
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold">
              The Services
            </span>
            <ul className="flex flex-col gap-3 font-sans text-xs uppercase tracking-widest text-[#FAF8F5]/60 font-light">
              <li className="hover:text-[#BFA15F] transition-colors cursor-pointer" onClick={onBookClick}>Space Planning & Layouts</li>
              <li className="hover:text-[#BFA15F] transition-colors cursor-pointer" onClick={onBookClick}>Custom Quality Woodwork</li>
              <li className="hover:text-[#BFA15F] transition-colors cursor-pointer" onClick={onBookClick}>Home Interior Renovations</li>
              <li className="hover:text-[#BFA15F] transition-colors cursor-pointer" onClick={onBookClick}>Commercial & Cafe Design</li>
              <li className="hover:text-[#BFA15F] transition-colors cursor-pointer" onClick={onBookClick}>Custom Furniture Selection</li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="flex flex-col gap-5">
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold">
              The Studio
            </span>
            <div className="flex flex-col gap-4 font-sans text-sm text-[#FAF8F5]/60 font-light">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-[#BFA15F] mt-0.5 flex-shrink-0" />
                <span>
                  Monica Interiors Studio<br />
                  Mumbai • Navi Mumbai • Delhi • Rajasthan<br />
                  India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#BFA15F] flex-shrink-0" />
                <a href="tel:+919137062574" className="hover:text-white transition-colors">+91 9137062574</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#BFA15F] flex-shrink-0" />
                <a href="mailto:monicainteriors23@gmail.com" className="hover:text-white transition-colors">monicainteriors23@gmail.com</a>
              </div>
              <div className="pt-2">
                <a 
                  href="https://maps.app.goo.gl/De1WH2acvmSum1HVA" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 hover:bg-[#BFA15F] hover:text-[#1E1714] hover:border-transparent text-xs text-[#FAF8F5] uppercase tracking-wider py-2 px-4 rounded transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#BFA15F] group-hover:text-inherit" />
                  GMB Location Map
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Studio Sub-bar */}
        <div className="border-t border-[#FAF8F5]/15 mt-16 pt-8 flex flex-col xl:flex-row items-center justify-between gap-6 font-sans text-xs text-[#FAF8F5]/40 font-light text-center xl:text-left">
          <div className="flex flex-col gap-1.5">
            <span>&copy; {new Date().getFullYear()} Monica Interiors. All rights reserved.</span>
            <span className="text-[#FAF8F5]/50 select-text">
              Website developed by{' '}
              <a 
                href="https://deepakkumaragency.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#BFA15F] hover:text-white underline transition-all font-medium"
                id="developer-agency-link"
              >
                Deepak Kumar Agency
              </a>
            </span>
            <span>END-TO-END INTERIOR SERVICES &bull; Premium Residential & Commercial.</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a 
              href="#contact"
              onClick={(e) => { e.preventDefault(); onOpenPolicy?.('contact'); }} 
              className="hover:text-[#BFA15F] transition-all cursor-pointer uppercase tracking-wider text-[10px] font-semibold text-[#FAF8F5]/60 hover:underline"
              id="footer-link-contact"
            >
              Contact Us
            </a>
            <a 
              href="#terms"
              onClick={(e) => { e.preventDefault(); onOpenPolicy?.('terms'); }} 
              className="hover:text-[#BFA15F] transition-all cursor-pointer uppercase tracking-wider text-[10px] font-semibold text-[#FAF8F5]/60 hover:underline"
              id="footer-link-terms"
            >
              Terms &amp; Conditions
            </a>
            <a 
              href="#privacy"
              onClick={(e) => { e.preventDefault(); onOpenPolicy?.('privacy'); }} 
              className="hover:text-[#BFA15F] transition-all cursor-pointer uppercase tracking-wider text-[10px] font-semibold text-[#FAF8F5]/60 hover:underline"
              id="footer-link-privacy"
            >
              Privacy Policy
            </a>
            <a 
              href="#refund"
              onClick={(e) => { e.preventDefault(); onOpenPolicy?.('refund'); }} 
              className="hover:text-[#BFA15F] transition-all cursor-pointer uppercase tracking-wider text-[10px] font-semibold text-[#FAF8F5]/60 hover:underline"
              id="footer-link-refund"
            >
              Refund Policy
            </a>
            <button 
              onClick={onOpenPortal} 
              className="text-[#BFA15F] hover:text-white transition-all cursor-pointer uppercase tracking-wider text-[10px] font-bold border border-[#BFA15F]/30 hover:border-white px-2.5 py-0.5 rounded bg-[#FAF8F5]/5 hover:bg-[#BFA15F]/10"
              id="footer-link-portal"
            >
              🔑 Track Bookings
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-[#FAF8F5]/50">
              <ShieldCheck className="w-4 h-4 text-[#BFA15F]" />
              <span>TLS Secured Direct Booking Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
