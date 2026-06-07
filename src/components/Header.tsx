/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, X, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COMPLEMENTARY_COLORS } from '../data';

interface HeaderProps {
  onBookClick: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onOpenPortal?: () => void;
}

export default function Header({ onBookClick, activeSection, setActiveSection, onOpenPortal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'hero', name: 'Home' },
    { id: 'services', name: 'Services' },
    { id: 'projects', name: 'Portfolio' },
    { id: 'inspiration', name: 'Mood Space' },
    { id: 'quiz', name: 'Style Match' },
    { id: 'journal', name: 'Design Journal' },
    { id: 'testimonials', name: 'Testimonials' }
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    
    // Smooth scroll on next tick when DOM sections render
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else if (id === 'hero') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 80);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#3C2A21]/10">
      <div className="max-w-none px-4 sm:px-10 h-22 flex items-center justify-between">
        
        {/* Vector Monogram + Brand Titles */}
        <div 
          onClick={() => scrollTo('hero')} 
          className="flex items-center gap-2 sm:gap-4 cursor-pointer group"
          id="brand-logo"
        >
          {/* Exact Brand Monogram */}
          <div className="relative w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Connecting Top Bar */}
              <rect x="24" y="34" width="46" height="10" rx="1.5" fill="#3C2A21" />
              {/* Pillar 1 */}
              <rect x="24" y="34" width="10" height="42" rx="1.5" fill="#3C2A21" />
              {/* Pillar 2 */}
              <rect x="42" y="34" width="10" height="42" rx="1.5" fill="#3C2A21" />
              {/* Pillar 3 */}
              <rect x="60" y="34" width="10" height="42" rx="1.5" fill="#3C2A21" />
              {/* Logo Navy Blue Dot above Pillar 3 */}
              <circle cx="65" cy="20" r="5.5" fill="#1E2941" />
            </svg>
          </div>

          <div className="flex flex-col select-none">
            <span className="font-sans text-[15px] sm:text-xl font-semibold tracking-[0.05em] sm:tracking-[0.1em] text-[#3C2A21] uppercase leading-none mb-0.5">
              Monica Interiors
            </span>
            <span className="text-[8px] sm:text-[10px] font-sans text-[#7F675B] uppercase tracking-[0.15em] sm:tracking-[0.25em] leading-none">
              Interior Design Studio
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`font-sans text-[13px] uppercase tracking-[0.2em] transition-all relative py-2 ${
                activeSection === item.id 
                  ? 'text-[#3C2A21] font-medium' 
                  : 'text-[#6B625E] hover:text-[#3C2A21]'
              }`}
              id={`nav-${item.id}`}
            >
              {item.name}
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#BFA15F]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Action Button - Secure Gateway Booking */}
        <div className="hidden lg:flex items-center gap-3">
          {onOpenPortal && (
            <button
              onClick={onOpenPortal}
              className="text-[#BFA15F] hover:text-[#3C2A21] transition-all cursor-pointer uppercase tracking-[0.12em] text-[10px] font-bold border border-[#BFA15F]/40 hover:border-[#3C2A21]/30 px-3 py-2.5 rounded bg-white font-sans"
              id="header-portal-btn"
            >
              🔑 Track Bookings
            </button>
          )}
          <button
            onClick={onBookClick}
            className="flex items-center gap-2.5 bg-[#3C2A21] text-[#FAF8F5] px-5 py-3 hover:bg-[#1E2941] active:scale-98 transition-all font-sans text-xs uppercase tracking-[0.15em] font-medium shadow-md shadow-[#3C2A21]/15"
            id="header-book-btn"
          >
            <Calendar className="w-4 h-4 text-[#BFA15F]" />
            Book Consult
          </button>
        </div>

        {/* Hamburger Mobile Triggger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#3C2A21] hover:text-[#BFA15F] transition-colors"
          id="mobile-menu-toggle"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-[#3C2A21]/10 bg-[#FAF8F5] overflow-hidden"
            id="mobile-drawer"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left font-sans text-[13px] uppercase tracking-[0.2em] py-1 ${
                    activeSection === item.id ? 'text-[#BFA15F] font-semibold' : 'text-[#6B625E]'
                  }`}
                  id={`mob-nav-${item.id}`}
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-[#3C2A21]/10 pt-4 mt-2 flex flex-col gap-3">
                {onOpenPortal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenPortal();
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-[#BFA15F] text-[#BFA15F] hover:bg-[#BFA15F]/5 py-3 text-xs uppercase tracking-[0.15em] font-bold rounded bg-white text-center"
                    id="mobile-drawer-portal-btn"
                  >
                    🔑 Track Bookings
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onBookClick();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#3C2A21] text-[#FAF8F5] py-3.5 text-xs uppercase tracking-[0.15em] font-medium shadow-md"
                  id="mobile-drawer-book-btn"
                >
                  <Calendar className="w-4 h-4 text-[#BFA15F]" />
                  Book Consult
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
