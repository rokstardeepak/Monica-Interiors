/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, MapPin, Eye, Compass, Award, PenTool, 
  Home, Briefcase, ShieldCheck, Scale, FileText, CheckCircle, ChevronLeft, ChevronRight, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data & Components
import { PROJECTS_DATA, TESTIMONIALS, COMPLEMENTARY_COLORS } from './data';
import { Project } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import StyleQuiz from './components/StyleQuiz';
import MoodBoardSimulator from './components/MoodBoardSimulator';
import AppointmentBooking from './components/AppointmentBooking';
import PolicyModal, { PolicyTab } from './components/PolicyModal';
import StudioPortal from './components/StudioPortal';
import ServiceDetails from './components/ServiceDetails';
import WorkCarousel from './components/WorkCarousel';
import BlogSection from './components/BlogSection';
import WhatsAppEnquiryModal from './components/WhatsAppEnquiryModal';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedPkg, setPreselectedPkg] = useState<string | undefined>(undefined);
  const [galleryFilter, setGalleryFilter] = useState<'All' | 'Residential' | 'Commercial'>('All');
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  
  // Immersive Lightbox State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Policy Modal States
  const [policyOpen, setPolicyOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<PolicyTab>('contact');

  // Studio Portal State
  const [portalOpen, setPortalOpen] = useState(false);

  // Selected Service Detail Page State
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // WhatsApp Enquiry State
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [whatsAppInitialService, setWhatsAppInitialService] = useState('');

  // Auto-rotating Hero slides list
  const heroSlides = [
    {
      title: 'Beautiful Modern Homes',
      subtitle: 'Designing Cozy and Highly Efficient Spaces',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600',
      tagline: 'Modern Living Room Designs'
    },
    {
      title: 'Elegant Wood & Stone',
      subtitle: 'Custom Cabinetry and Premium Polished Marbles',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
      tagline: 'Quality Modular Kitchen Solutions'
    },
    {
      title: 'Peaceful Bedrooms',
      subtitle: 'Soft Cozy Curtains and Warm Textured Walls',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1600',
      tagline: 'Luxury Bedroom Designs'
    }
  ];

  // Auto-advance hero slides & testimonials
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    const testimonialTimer = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8500);

    return () => {
      clearInterval(heroTimer);
      clearInterval(testimonialTimer);
    };
  }, []);

  // Filtered projects
  const filteredProjects = PROJECTS_DATA.filter((proj) => {
    if (galleryFilter === 'All') return true;
    return proj.category === galleryFilter;
  });

  // Open booking flow helper
  const triggerBookingWithPack = (packageId?: string) => {
    setPreselectedPkg(packageId);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#3C2A21] font-sans antialiased overflow-x-hidden">
      
      {/* 1. ELEVATED HEADER */}
      <Header 
        onBookClick={() => triggerBookingWithPack()} 
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setSelectedService(null);
          setActiveSection(sec);
        }}
        onOpenPortal={() => setPortalOpen(true)}
      />

      {selectedService ? (
        <motion.div
          key="service-details-page"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <ServiceDetails
            serviceId={selectedService}
            onClose={() => {
              setSelectedService(null);
              // Smoothly scroll back to the 'services' section on the main overview
              setTimeout(() => {
                const element = document.getElementById('services');
                if (element) {
                  const headerOffset = 100;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }, 80);
            }}
            onBookService={(pkgId) => {
              setSelectedService(null);
              triggerBookingWithPack(pkgId);
            }}
          />
        </motion.div>
      ) : (
        <>
          {/* 2. HERO / IMMERSIVE BRAND INTRO */}
          <section id="hero" className="relative h-[90vh] min-h-[500px] flex items-center bg-[#1E1714]">
        
        {/* Animated Slide Backings */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              activeHeroSlide === idx ? 'opacity-55' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            {/* dark radial vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1714] via-transparent to-[#1E1714]/60" />
          </div>
        ))}

        {/* Content Sheet */}
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 text-white flex flex-col items-start gap-8">
          
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#BFA15F] bg-[#BFA15F]/15 px-3.5 py-1.5 rounded-full inline-block self-start border border-[#BFA15F]/20 backdrop-blur-md">
              {heroSlides[activeHeroSlide].tagline}
            </span>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHeroSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
              >
                <span className="font-sans text-[11px] uppercase tracking-[0.4em] text-[#FAF8F5]/60 block mb-2">
                  Project Gallery &bull; Monica Interiors
                </span>
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#FAF8F5] leading-none">
                  {heroSlides[activeHeroSlide].title}
                </h1>
                <p className="font-serif italic text-lg sm:text-2xl md:text-3xl text-stone-200 mt-4 leading-normal font-light">
                  {heroSlides[activeHeroSlide].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="font-sans text-sm md:text-base text-stone-200 max-w-2xl leading-relaxed font-light">
            <strong className="text-white block font-serif text-lg sm:text-xl md:text-2xl font-normal mb-2 leading-snug">
              Transforming homes into timeless spaces
            </strong>
            Monica Interiors | Luxury Interior Design specializing in high-end, hand-crafted architectural sanctuaries.
          </p>

          {/* Luxury Studio Badging */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 border-y border-white/10 py-5 w-full max-w-3xl font-sans mt-2">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-[#BFA15F] tracking-widest font-mono">Experience</span>
              <span className="text-xs sm:text-sm font-serif font-light text-[#FAF8F5] mt-1">6+ Years Excellence</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-4 sm:pl-8">
              <span className="text-[10px] uppercase text-[#BFA15F] tracking-widest font-mono">Expertise</span>
              <span className="text-xs sm:text-sm font-serif font-light text-[#FAF8F5] mt-1">2BHK • 3BHK • Villas</span>
            </div>
            <div className="flex flex-col border-l border-white/10 col-span-2 pl-4 sm:pl-8">
              <span className="text-[10px] uppercase text-[#BFA15F] tracking-widest font-mono">Service Regions</span>
              <span className="text-xs sm:text-sm font-serif font-light text-[#FAF8F5] mt-1 leading-normal">
                Mumbai • Navi Mumbai • Delhi • Rajasthan
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => triggerBookingWithPack('c2')}
              className="flex items-center justify-center gap-2.5 bg-[#FAF8F5] text-[#1E1714] hover:bg-[#BFA15F] hover:text-[#1E1714] py-4 px-8 text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-xl shadow-black/15"
              id="hero-book-btn"
            >
              <Calendar className="w-4 h-4" />
              Book Consult
            </button>
            <button
              onClick={() => {
                const galleryY = document.getElementById('projects')?.getBoundingClientRect().top || 0;
                window.scrollTo({ top: galleryY + window.pageYOffset - 100, behavior: 'smooth' });
                setActiveSection('projects');
              }}
              className="flex items-center justify-center gap-2.5 border border-white/20 hover:border-white text-white py-4 px-8 text-xs uppercase tracking-[0.2em] font-medium transition-all backdrop-blur-md"
              id="hero-explore-btn"
            >
              View Portfolio
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-8 right-6 z-10 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveHeroSlide(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                activeHeroSlide === i ? 'w-10 bg-[#BFA15F]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              id={`hero-slide-indicator-${i}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </section>

      {/* 3. STUDIO CREDO / FLYER CORE SERVICES */}
      <section id="services" className="bg-white py-16 md:py-24 border-b border-[#3C2A21]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-12">
            
            {/* Descriptive Left Area */}
            <div className="max-w-3xl flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold">
                Our Services & Scope
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#3C2A21] tracking-tight leading-tight">
                Monica Interiors &bull; Studio Services
              </h2>
              <p className="font-sans text-sm md:text-base text-[#6B625E] font-light leading-relaxed">
                Transforming homes into timeless spaces. With over 6+ years of specialized luxury expertise, we design and build bespoke 2BHK, 3BHK, and Villas, operating across Mumbai, Navi Mumbai, Delhi, and Rajasthan. From layout clearance audits to end-to-end turnkey handovers, we deliver uncompromising premium quality.
              </p>
              <div className="flex gap-6 border-t border-[#3C2A21]/10 pt-6 mt-2">
                <div className="flex flex-col">
                  <span className="font-serif text-3xl font-semibold text-[#3C2A21]">100%</span>
                  <span className="font-sans text-[10px] uppercase text-[#6B625E] tracking-wider mt-1">Turnkey Delivery</span>
                </div>
                <div className="flex flex-col border-l border-[#3C2A21]/10 pl-6">
                  <span className="font-serif text-3xl font-semibold text-[#3C2A21]">Premium</span>
                  <span className="font-sans text-[10px] uppercase text-[#6B625E] tracking-wider mt-1">Sourced Materials</span>
                </div>
                <div className="flex flex-col border-l border-[#3C2A21]/10 pl-6">
                  <span className="font-serif text-3xl font-semibold text-[#3C2A21]">6+ Yrs</span>
                  <span className="font-sans text-[10px] uppercase text-[#6B625E] tracking-wider mt-1">Design Trust</span>
                </div>
              </div>
            </div>

            {/* End-to-End Service Coverage Board */}
            <div className="bg-gradient-to-br from-[#1E1714] to-[#2B201C] p-6 md:p-8 rounded-lg shadow-md border border-[#BFA15F]/20 text-[#FAF8F5] relative overflow-hidden" id="end-to-end-services-panel">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#BFA15F]/5 rounded-bl-full pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8 lg:items-center">
                <div className="flex flex-col gap-2.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F]" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#BFA15F] font-bold">End-to-End Service Portfolio Range</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-light tracking-tight text-white leading-tight">We offer end-to-end interior services</h3>
                  <p className="font-sans text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                    At Monica Interiors, we take absolute care of conceptual designs, planning, premium material sourcing, Vastu-alignment, and complete master turnkey execution for both residential and commercial projects.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:min-w-[500px]">
                  {/* Residential Card */}
                  <div className="bg-white/5 border border-white/10 rounded p-4 flex flex-col gap-2 hover:border-[#BFA15F]/40 transition-all duration-300">
                    <div className="flex items-center gap-2 text-[#BFA15F] font-semibold text-xs uppercase tracking-wider font-sans">
                      <span>🏡 Residential Interior Services</span>
                    </div>
                    <p className="font-sans text-xs text-stone-300 font-light leading-relaxed">
                      Custom, high-contrast atmospheric sanctuaries tailored to make your home spaces feel elegant, functional, and spacious:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {['Bedroom', 'Living Room', 'Dining Room', 'Modular Kitchen'].map((tag) => (
                        <span key={tag} className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded font-sans hover:bg-[#BFA15F]/20 hover:text-white transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Commercial Card */}
                  <div className="bg-white/5 border border-white/10 rounded p-4 flex flex-col gap-2 hover:border-[#BFA15F]/40 transition-all duration-300">
                    <div className="flex items-center gap-2 text-[#BFA15F] font-semibold text-xs uppercase tracking-wider font-sans">
                      <span>🏢 Commercial Interior Services</span>
                    </div>
                    <p className="font-sans text-xs text-stone-300 font-light leading-relaxed">
                      Strategic workspace layouts designed to align with branding layout standards, optimize customer flow, and boost output:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {['Offices', 'Boutiques', 'Cafes', 'Plus More'].map((tag) => (
                        <span key={tag} className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded font-sans hover:bg-[#BFA15F]/20 hover:text-white transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flyer Services Grid - 5 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-4">
              
              {/* Complete Home Interior */}
              <button
                onClick={() => setSelectedService('complete-home')}
                className="group text-left bg-[#FAF8F5] hover:bg-white border border-[#3C2A21]/10 hover:border-[#BFA15F] p-6 rounded shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-6 cursor-pointer active:scale-98 w-full"
                id="service-card-complete-home"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded bg-[#3C2A21]/5 group-hover:bg-[#BFA15F]/10 flex items-center justify-center text-[#BFA15F] mb-4 transition-all duration-300">
                      <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-[#3C2A21] leading-snug group-hover:text-[#BFA15F] transition-colors font-sans uppercase tracking-wider text-[13px]">Complete Home Interior</h3>
                    <p className="font-sans text-xs text-[#6B625E] font-light leading-relaxed mt-2 pb-3 border-b border-[#3C2A21]/5">
                      Comprehensive residential mapping, custom furnishing, and spatial transitions designed for 1BHK apartments up to sprawling luxury Villas.
                    </p>
                    <ul className="mt-4 flex flex-col gap-1.5 font-sans text-[11px] text-[#6B625E]/90">
                      <li className="flex items-center gap-1.5 font-medium text-stone-700">
                        <span className="text-[#BFA15F]">&bull;</span> Full 1BHK to Villa layouts
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Bespoke ceiling blueprints
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Material &amp; styling palettes
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Photorealistic 3D concepts
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#3C2A21]/5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#BFA15F] font-semibold mt-2">&bull; 1BHK to Villas</span>
                    <span className="text-[#BFA15F] text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-300">
                      Learn More &rarr;
                    </span>
                  </div>
                </div>
              </button>

              {/* Space Planning & Layout */}
              <button
                onClick={() => setSelectedService('space-planning')}
                className="group text-left bg-[#FAF8F5] hover:bg-white border border-[#3C2A21]/10 hover:border-[#BFA15F] p-6 rounded shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-6 cursor-pointer active:scale-98 w-full"
                id="service-card-space-planning"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded bg-[#3C2A21]/5 group-hover:bg-[#BFA15F]/10 flex items-center justify-center text-[#BFA15F] mb-4 transition-all duration-300">
                      <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-[#3C2A21] leading-snug group-hover:text-[#BFA15F] transition-colors font-sans uppercase tracking-wider text-[13px]">Space Planning &amp; Layout</h3>
                    <p className="font-sans text-xs text-[#6B625E] font-light leading-relaxed mt-2 pb-3 border-b border-[#3C2A21]/5">
                      Clearance auditing, Vastu structural adjustments, and complete AutoCAD layout optimization to ensure intuitive, smooth circulation.
                    </p>
                    <ul className="mt-4 flex flex-col gap-1.5 font-sans text-[11px] text-[#6B625E]/90">
                      <li className="flex items-center gap-1.5 font-medium text-stone-700">
                        <span className="text-[#BFA15F]">&bull;</span> AutoCAD flow optimization
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Vastu direction &amp; orientation
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Path &amp; circulation tuning
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Room proportion auditing
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#3C2A21]/5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#BFA15F] font-semibold mt-2">&bull; Optimization</span>
                    <span className="text-[#BFA15F] text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-300">
                      Learn More &rarr;
                    </span>
                  </div>
                </div>
              </button>

              {/* Modular Kitchen & Wardrobe */}
              <button
                onClick={() => setSelectedService('modular-kitchen')}
                className="group text-left bg-[#FAF8F5] hover:bg-white border border-[#3C2A21]/10 hover:border-[#BFA15F] p-6 rounded shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-6 cursor-pointer active:scale-98 w-full"
                id="service-card-modular-kitchen"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded bg-[#3C2A21]/5 group-hover:bg-[#BFA15F]/10 flex items-center justify-center text-[#BFA15F] mb-4 transition-all duration-300">
                      <PenTool className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-[#3C2A21] leading-snug group-hover:text-[#BFA15F] transition-colors font-sans uppercase tracking-wider text-[13px]">Modular Kitchen &amp; Wardrobe</h3>
                    <p className="font-sans text-xs text-[#6B625E] font-light leading-relaxed mt-2 pb-3 border-b border-[#3C2A21]/5">
                      Custom modular cabinets, soft-close heavy-duty drawers, premium veneer finishes, and highly optimized kitchen layouts.
                    </p>
                    <ul className="mt-4 flex flex-col gap-1.5 font-sans text-[11px] text-[#6B625E]/90">
                      <li className="flex items-center gap-1.5 font-medium text-stone-700">
                        <span className="text-[#BFA15F]">&bull;</span> Work triangle layout mapping
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Soft-close hardware fixtures
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Premium veneer coating
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Heavy-duty storage systems
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#3C2A21]/5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#BFA15F] font-semibold mt-2">&bull; Custom Storage</span>
                    <span className="text-[#BFA15F] text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-300">
                      Learn More &rarr;
                    </span>
                  </div>
                </div>
              </button>

              {/* Room Concepts */}
              <button
                onClick={() => setSelectedService('room-concepts')}
                className="group text-left bg-[#FAF8F5] hover:bg-white border border-[#3C2A21]/10 hover:border-[#BFA15F] p-6 rounded shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-6 cursor-pointer active:scale-98 w-full"
                id="service-card-room-concepts"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded bg-[#3C2A21]/5 group-hover:bg-[#BFA15F]/10 flex items-center justify-center text-[#BFA15F] mb-4 transition-all duration-300">
                      <Sparkles className="w-4.5 h-4.5 group-hover:animate-pulse" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-[#3C2A21] leading-snug group-hover:text-[#BFA15F] transition-colors font-sans uppercase tracking-wider text-[13px]">Room Concepts</h3>
                    <p className="font-sans text-xs text-[#6B625E] font-light leading-relaxed mt-2 pb-3 border-b border-[#3C2A21]/5">
                      Atmospheric color stories, lighting placement, and texture layering for luxurious Living Rooms, tranquil Bedrooms, and interactive Kids Rooms.
                    </p>
                    <ul className="mt-4 flex flex-col gap-1.5 font-sans text-[11px] text-[#6B625E]/90">
                      <li className="flex items-center gap-1.5 font-medium text-stone-700">
                        <span className="text-[#BFA15F]">&bull;</span> Custom bedroom warm suites
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Playful creative kids rooms
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Dynamic accent textures
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Multi-tiered lighting plans
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#3C2A21]/5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#BFA15F] font-semibold mt-2">&bull; Customized Rooms</span>
                    <span className="text-[#BFA15F] text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-300">
                      Learn More &rarr;
                    </span>
                  </div>
                </div>
              </button>

              {/* Turnkey Interior Execution */}
              <button
                onClick={() => setSelectedService('turnkey-execution')}
                className="group text-left bg-[#FAF8F5] hover:bg-white border border-[#3C2A21]/10 hover:border-[#BFA15F] p-6 rounded shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-6 cursor-pointer active:scale-98 w-full"
                id="service-card-turnkey"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded bg-[#3C2A21]/5 group-hover:bg-[#BFA15F]/10 flex items-center justify-center text-[#BFA15F] mb-4 transition-all duration-300">
                      <CheckCircle className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-[#3C2A21] leading-snug group-hover:text-[#BFA15F] transition-colors font-sans uppercase tracking-wider text-[13px]">Turnkey Interior Execution</h3>
                    <p className="font-sans text-xs text-[#6B625E] font-light leading-relaxed mt-2 pb-3 border-b border-[#3C2A21]/5">
                      Complete end-to-end site management—civil execution, painting, MEP coordination, furniture installation, and deep cleaning.
                    </p>
                    <ul className="mt-4 flex flex-col gap-1.5 font-sans text-[11px] text-[#6B625E]/90">
                      <li className="flex items-center gap-1.5 font-medium text-stone-700">
                        <span className="text-[#BFA15F]">&bull;</span> Dynamic project timelines
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Supervised plumbing &amp; MEP
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Expert on-site handholding
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-[#BFA15F]">&bull;</span> Standard deep-cleaning prep
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#3C2A21]/5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#BFA15F] font-semibold mt-2">&bull; Absolute Peace of Mind</span>
                    <span className="text-[#BFA15F] text-xs font-semibold group-hover:translate-x-1.5 transition-transform duration-300">
                      Learn More &rarr;
                    </span>
                  </div>
                </div>
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* 4. COMPARATIVE RENOVATOR COMPARISON (BEFORE AFTER SLIDER) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold dark:border-[#3C2A21]/15">
            The Transformation
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#3C2A21] tracking-tight mt-3">
            Renovation Case Study
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#6B625E] font-light mt-2">
            Witness the structural narrative from blank plaster layouts to complete luxurious sanctuaries. Use the slider handle below to swipe back and forth.
          </p>
        </div>

        <BeforeAfterSlider
          beforeImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
          afterImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
          title="Aetherial Living Sanctuary"
          description="A barren 400sqf living room transformed into a light-filled monolithic gallery. By shaving geometric columns, building curves, and using textured lime-wash plaster, we unlocked warm modernism."
          location="Upper West Side Penthouse"
        />
      </section>

      {/* 5. PORTFOLIO HIGH-RESOLUTION GALLERY */}
      <section id="projects" className="bg-[#FAF8F5] py-16 md:py-24 border-t border-[#3C2A21]/10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold block mb-1">
                Completed Works
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#3C2A21] tracking-tight text-left">
                The Curated Portfolio
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B625E] font-light mt-1 max-w-lg">
                High-resolution layout capture representing Monica Interiors' bespoke residential properties and luxury commercial upgrades.
              </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex border border-[#3C2A21]/15 rounded overflow-hidden bg-white select-none self-start md:self-auto">
              {['All', 'Residential', 'Commercial'].map((category) => (
                <button
                  key={category}
                  onClick={() => setGalleryFilter(category as any)}
                  className={`px-4 sm:px-5 py-2.5 text-xs font-sans uppercase font-medium tracking-wider transition-all h-10 ${
                    galleryFilter === category 
                      ? 'bg-[#3C2A21] text-[#FAF8F5]' 
                      : 'text-[#6B625E] hover:bg-[#3C2A21]/5 h-full'
                  }`}
                  id={`gallery-filter-${category}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Grids */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            id="portfolio-projects-grid"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="flex flex-col group cursor-zoom-in overflow-hidden border border-[#3C2A21]/10 bg-white shadow-sm hover:shadow-lg rounded transition-all"
                  id={`project-card-${project.id}`}
                >
                  <div className="relative w-full h-[240px] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-[#3C2A21]/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/95 px-4 py-2.5 rounded shadow-lg text-xs uppercase tracking-widest font-mono text-[#3C2A21] flex items-center gap-1.5 font-semibold">
                        <Eye className="w-4 h-4 text-[#BFA15F]" />
                        Inspect Details
                      </div>
                    </div>
                    
                    <span className="absolute top-4 left-4 font-mono text-[9px] font-semibold text-white uppercase tracking-[0.2em] bg-[#1E1714]/85 px-2.5 py-1 rounded">
                      {project.category}
                    </span>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-[#BFA15F] tracking-widest uppercase block mb-1">
                        {project.location}
                      </span>
                      <h3 className="font-serif text-lg font-semibold text-[#3C2A21] group-hover:text-[#BFA15F] transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="font-sans text-xs text-[#6B625E] font-light leading-relaxed mt-2 line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-4 mt-auto">
                      {project.materials.slice(0, 3).map((mat, mId) => (
                        <span 
                          key={mId}
                          className="bg-[#FAF8F5] text-[10px] text-[#3C2A21] border border-[#3C2A21]/8 px-2 py-0.5 rounded"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* DYNAMIC AUTO-SLIDING REAL COMPLETED RENOVATIONS PORTFOLIO CAROUSEL */}
      <WorkCarousel />

      {/* 6. IMMERSIVE TACTILE MOOD SPACE PLAYGROUND */}
      <section id="inspiration" className="py-16 md:py-24 max-w-7xl mx-auto px-6 bg-[#FAF8F5]">
        <MoodBoardSimulator />
      </section>

      {/* 7. VISUAL STYLE MATCHING QUIZ */}
      <section id="quiz" className="bg-[#FAF8F5] py-16 md:py-24 border-t border-[#3C2A21]/15">
        <div className="max-w-7xl mx-auto px-6">
          <StyleQuiz onBookSelectedType={(pId) => triggerBookingWithPack(pId)} />
        </div>
      </section>

      {/* 7.5 DESIGN JOURNAL BLOG SECTION (SEO/AEO/GEO EXCELLENCE) */}
      <section id="journal" className="border-t border-[#3C2A21]/10 bg-[#FAF8F5]">
        <BlogSection />
      </section>

      {/* 8. TESTIMONIAL CAROUSEL */}
      <section id="testimonials" className="bg-[#1E1714] text-[#FAF8F5] py-16 md:py-24 border-b border-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold block mb-2">
            Client Reviews
          </span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-white mb-10">
            Praise for Monica Interiors
          </h2>

          {/* Testimonial Active Slider Board */}
          <div className="relative min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonialIdx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center max-w-3xl"
              >
                {/* 5-star rating */}
                <div className="flex gap-1 mb-6 text-[#BFA15F]">
                  {[...Array(TESTIMONIALS[activeTestimonialIdx].rating)].map((_, i) => (
                    <Sparkles key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                <p className="font-serif italic text-lg md:text-2xl font-light text-stone-200 leading-relaxed tracking-wide">
                  "{TESTIMONIALS[activeTestimonialIdx].quote}"
                </p>

                <div className="mt-8 flex flex-col items-center gap-1">
                  <span className="font-sans text-sm font-semibold tracking-wider text-white">
                    {TESTIMONIALS[activeTestimonialIdx].author}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-[#BFA15F] tracking-widest mt-0.5">
                    {TESTIMONIALS[activeTestimonialIdx].role} &bull; {TESTIMONIALS[activeTestimonialIdx].project}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators Toggles */}
          <div className="flex justify-center gap-2 mt-12">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonialIdx(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonialIdx === index ? 'bg-[#BFA15F] scale-125' : 'bg-white/20 hover:bg-white/40'
                }`}
                id={`testimonial-switch-${index}`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 9. THE CONCIERGE SCHEDULER BOARD */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-center">
        <div className="bg-white border border-[#3C2A21]/10 rounded-xl p-8 md:p-14 shadow-lg max-w-4xl mx-auto flex flex-col items-center gap-6 relative overflow-hidden">
          
          {/* subtle decorative background vector layout */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#FAF8F5] rounded-bl-full z-0 pointer-events-none" />

          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-semibold relative z-10 leading-none">
            Direct Concierge Scheduling
          </span>

          <h2 className="font-serif text-3xl md:text-5xl text-[#3C2A21] tracking-tight relative z-10 leading-none max-w-2xl mt-1">
            Let's Design Your Dream Space
          </h2>

          <p className="font-sans text-sm md:text-base text-[#6B625E] font-light leading-relaxed max-w-xl relative z-10">
            Reservations provide full direct material layering review, AutoCAD space clearance assessments, and secure transaction receipts. Reach out to Monica directly at <strong className="text-[#3C2A21]">+91 9137062574</strong> or book below.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-2 relative z-10">
            <button
              onClick={() => triggerBookingWithPack('c2')}
              className="flex items-center justify-center gap-2.5 bg-[#3C2A21] text-[#FAF8F5] hover:bg-[#1E2941] active:scale-98 text-xs uppercase tracking-[0.2em] font-medium transition-all py-4 px-10 shadow-lg shadow-[#3C2A21]/15"
              id="cta-scheduler-book-btn"
            >
              <Calendar className="w-4.5 h-4.5 text-[#BFA15F]" />
              Secure Consultation Space
            </button>
            <a
              href="mailto:monicainteriors23@gmail.com"
              className="flex items-center justify-center gap-2 border border-[#3C2A21]/20 hover:border-[#3C2A21] text-[#3C2A21] text-xs uppercase tracking-[0.2em] font-medium transition-all py-4 px-10 bg-white"
              id="cta-scheduler-email-btn"
            >
              Email Flyer Inquiry
            </a>
            <a
              href="https://maps.app.goo.gl/De1WH2acvmSum1HVA"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 border border-[#BFA15F] hover:bg-[#BFA15F] hover:text-white text-[#3C2A21] text-xs uppercase tracking-[0.2em] font-medium transition-all py-4 px-10 bg-white"
              id="cta-scheduler-gmb-btn"
            >
              <MapPin className="w-4 h-4 text-[#BFA15F]" />
              GMB Location
            </a>
          </div>

          <div className="border-t border-[#3C2A21]/10 w-full pt-6 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-sans text-xs text-[#6B625E]/90">
            <div className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-[#BFA15F] flex-shrink-0" />
              <span>Full licensing insurance</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-[#BFA15F] flex-shrink-0" />
              <span>Escrow security gateway</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-[#BFA15F] flex-shrink-0" />
              <span>Dedicated Zoom connection</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-[#BFA15F] flex-shrink-0" />
              <span>Physical material cards dispatched</span>
            </div>
          </div>

        </div>
      </section>
        </>
      )}

      {/* 10. STUDIO ATELIER DIGITAL FOOTER */}
      <Footer 
        onBookClick={() => triggerBookingWithPack()} 
        onOpenPolicy={(tab) => {
          setPolicyTab(tab);
          setPolicyOpen(true);
        }}
        onOpenPortal={() => setPortalOpen(true)}
      />

      {/* SECURE STUDIO PORTAL OVERLAY */}
      <AnimatePresence>
        {portalOpen && (
          <StudioPortal
            onClose={() => setPortalOpen(false)}
            onOpenBooking={() => {
              setPortalOpen(false);
              triggerBookingWithPack();
            }}
          />
        )}
      </AnimatePresence>

      {/* LEGAL & CONTACT POLICY MODAL OVERLAY */}
      <AnimatePresence>
        {policyOpen && (
          <PolicyModal
            isOpen={policyOpen}
            initialTab={policyTab}
            onClose={() => setPolicyOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* WIDGET POPUP OVERLAY: Appointment checkout wizard */}
      <AnimatePresence>
        {bookingOpen && (
          <AppointmentBooking
            preSelectedPackageId={preselectedPkg}
            onClose={() => {
              setBookingOpen(false);
              setPreselectedPkg(undefined);
            }}
          />
        )}
      </AnimatePresence>

      {/* PORTFOLIO LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div 
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedProject(null)}
            id="lightbox-scaffold"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF8F5] text-[#3C2A21] w-full max-w-4xl border border-[#3C2A21]/15 shadow-2xl relative overflow-hidden rounded-lg flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()} // halt bubbling
              id="lightbox-card"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-[#FAF8F5] text-[#3C2A21] border border-[#3C2A21]/10 rounded shadow-sm font-sans text-xs uppercase tracking-widest font-semibold hover:text-[#BFA15F] transition-colors"
                id="lightbox-close-btn"
              >
                Close ✕
              </button>

              {/* Large Project Image */}
              <div className="w-full md:w-[55%] h-[320px] md:h-auto min-h-[300px] relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#1E1714] text-white font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded">
                  {selectedProject.category} Project
                </div>
              </div>

              {/* Scope details */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between gap-6">
                <div>
                  <span className="font-mono text-[10px] text-[#BFA15F] tracking-widest uppercase block mb-1">
                    {selectedProject.location}
                  </span>
                  <h4 className="font-serif text-2xl md:text-3xl text-[#3C2A21] leading-tight">
                    {selectedProject.title}
                  </h4>
                  
                  <div className="border-t border-[#3C2A21]/10 pt-4 mt-4 flex flex-col gap-3">
                    <div>
                      <span className="font-sans text-[11px] uppercase text-[#6B625E] font-semibold block">Designer Scope:</span>
                      <p className="font-sans text-xs text-[#3C2A21] font-light leading-relaxed mt-0.5">{selectedProject.scope}</p>
                    </div>

                    <div>
                      <span className="font-sans text-[11px] uppercase text-[#6B625E] font-semibold block">Design narrative:</span>
                      <p className="font-sans text-xs text-[#6B625E] font-light leading-relaxed mt-0.5">{selectedProject.description}</p>
                    </div>

                    <div>
                      <span className="font-sans text-[11px] uppercase text-[#6B625E] font-semibold block">Prescribed materials & textures:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedProject.materials.map((mat, idx) => (
                          <span 
                            key={idx}
                            className="bg-white text-[10px] text-[#3C2A21] border border-[#3C2A21]/10 px-2.5 py-1 rounded"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lightbox booking promo CTA */}
                <div className="border-t border-[#3C2A21]/10 pt-4 flex flex-col gap-3">
                  <p className="text-[10px] font-sans text-[#7F675B] italic leading-tight">
                    * Booking a consultation provides complete schematic mapping regarding similar architectural configurations.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      // preselect relevant package based on project category
                      triggerBookingWithPack(selectedProject.category === 'Commercial' ? 'c3' : 'c2');
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#3C2A21] text-[#FAF8F5] hover:bg-[#1E2941] py-3 text-xs uppercase tracking-[0.15em] font-medium transition-colors"
                    id="lightbox-book-pack-btn"
                  >
                    <Calendar className="w-4 h-4 text-[#BFA15F]" />
                    Book Material Consultation
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WHATSAPP INTERIOR ENQUIRY MODAL */}
      <WhatsAppEnquiryModal
        isOpen={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
        initialService={whatsAppInitialService}
      />

      {/* FLOATING WHATSAPP CTA BADGE */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          onClick={() => {
            setWhatsAppInitialService('');
            setWhatsAppOpen(true);
          }}
          className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-none outline-none"
          aria-label="Open WhatsApp Enquiry Form"
          id="floating-whatsapp-cta"
        >
          {/* Subtle Outer Pulsing Wave */}
          <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none group-hover:hidden"></span>
          
          {/* WhatsApp Custom SVG Path (Crisp and precise vectors) */}
          <svg 
            className="w-7 h-7 fill-current" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.843.002-2.63-1.023-5.101-2.886-6.968C16.58 1.93 14.113.905 11.492.905 6.056.905 1.632 5.318 1.63 10.749c0 1.673.443 3.307 1.284 4.747l-.299.854-1.02 3.73 3.818-1.001.644-.37zM17.65 15c-.272-.136-1.614-.797-1.864-.888-.25-.09-.432-.136-.613.136-.182.273-.704.888-.863 1.07-.159.182-.318.205-.59.069-.272-.136-1.15-.424-2.19-1.353-.809-.721-1.355-1.613-1.514-1.886-.159-.273-.017-.42.119-.556.123-.122.272-.318.409-.477.136-.159.182-.273.272-.455.09-.182.046-.341-.023-.477-.069-.136-.613-1.477-.84-2.024-.221-.531-.444-.459-.613-.468-.159-.009-.34-.009-.522-.009s-.477.068-.727.341c-.25.273-.954.932-.954 2.273s.977 2.636 1.114 2.818c.137.182 1.92 2.924 4.654 4.103.65.28 1.157.447 1.554.574.654.207 1.25.178 1.721.108.524-.078 1.614-.659 1.841-1.295.227-.636.227-1.182.159-1.295-.069-.114-.25-.182-.523-.318z"/>
          </svg>

          {/* Hover Tooltip Menu */}
          <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-300 origin-right bg-[#3C2A21] border border-[#BFA15F]/20 text-white text-[11px] font-sans font-medium uppercase tracking-wider py-1.5 px-3 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
            Get Instant Quote on WhatsApp • Active
          </span>
        </button>
      </div>


    </div>
  );
}
