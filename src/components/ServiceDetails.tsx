import React, { useState } from 'react';
import { 
  X, CheckCircle, ArrowRight, Home, Compass, PenTool, Sparkles, 
  Layers, Hammer, ChevronRight, Calculator, Check, ExternalLink, Sliders
} from 'lucide-react';
import { motion } from 'motion/react';
import { COMPLEMENTARY_COLORS } from '../data';

interface ServiceDetailsProps {
  serviceId: string;
  onClose: () => void;
  onBookService: (packageId: string) => void;
}

interface ServiceData {
  id: string;
  title: string;
  tagline: string;
  subheader: string;
  packageId: string;
  mainImage: string;
  thumbImage1: string;
  thumbImage2: string;
  longDescription: string;
  deliverables: string[];
  specs: { label: string; value: string }[];
  icon: React.ReactNode;
}

export default function ServiceDetails({ serviceId, onClose, onBookService }: ServiceDetailsProps) {
  // 1. SERVICES METADATA
  const services: Record<string, ServiceData> = {
    'complete-home': {
      id: 'complete-home',
      title: 'Complete Home Interior',
      tagline: 'End-to-End Residential Architecture & Spatial Mastery',
      subheader: 'From 1BHK Apartments to Sprawling Luxury Villas',
      packageId: 'c3',
      mainImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
      thumbImage1: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=650',
      thumbImage2: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=650',
      longDescription: 'This is our signature comprehensive residential design service. Tailored explicitly for homeowners seeking masterfully coordinated aesthetic transitions, complete drop-ceiling structures, customized modular carpentry, and curated premium materials. We coordinate every square inch, ensuring structural logic runs in complete harmony with visual serenity.',
      specs: [
        { label: 'Timeline', value: '4 - 8 Weeks Design Curation' },
        { label: 'Asset Output', value: '6 - 18 Ultra-HD photorealistic renders' },
        { label: 'Ideal For', value: 'Full refurbishments, pre-construction customization' },
        { label: 'Coverage', value: 'Worldwide design books, PAN India turnkeys' }
      ],
      deliverables: [
        'Complete 2D AutoCAD space allocation & furniture clearance blueprints',
        'High-definition photorealistic 3D rendering profiles for all key living nodes',
        'Physical material swatch catalogs tailored to your moodboard choice',
        'False ceiling lighting schemas, layout drawings, and core MEP blueprints',
        'Curated shopping catalogs containing direct factory furniture suppliers'
      ],
      icon: <Home className="w-5 h-5" />
    },
    'space-planning': {
      id: 'space-planning',
      title: 'Space Planning & Layout',
      tagline: 'Micro-Clearance Audits & Spatial Flow Engineering',
      subheader: 'AutoCAD Drafting & Scientific Spatial Layout Alignments',
      packageId: 'c1',
      mainImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200',
      thumbImage1: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=650',
      thumbImage2: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=650',
      longDescription: 'Poor layout flow destroys beautiful rooms before they are even built. Our space planning service investigates exact active clearances, door opening envelope boundaries, entry vista framing, and physical ergonomics. In addition, we apply modern spatial layouts seamlessly without introducing visual compromises, ensuring your home feels natural, open, and logically aligned.',
      specs: [
        { label: 'Timeline', value: '1 - 2 Weeks Turnaround' },
        { label: 'Key Tool', value: 'AutoCAD Layout Profiler' },
        { label: 'Ideal For', value: 'Before taking possession, purchasing modular systems' },
        { label: 'Focus Area', value: 'Ergonomic circulation & bottleneck troubleshooting' }
      ],
      deliverables: [
        'Interactive 2D multi-option AutoCAD furniture and spatial arrangements',
        'Active egress and clearance envelope stress test diagram overlays',
        'Comprehensive circulation-focused orientation and doorway adjustments map',
        'Detailed structural dimension recommendations to give your contractor',
        'Door transition & wall opening partition recommendation checklist'
      ],
      icon: <Compass className="w-5 h-5" />
    },
    'modular-kitchen': {
      id: 'modular-kitchen',
      title: 'Modular Kitchen & Wardrobe',
      tagline: 'Precision Dynamic Cabinets & European Hardware Engineering',
      subheader: 'Custom Work Triangle Optimization & Premium Veneer Coating',
      packageId: 'c2',
      mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=0.8&w=1200',
      thumbImage1: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=650',
      thumbImage2: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=650',
      longDescription: 'Bespoke cabinet engineering is where functional mechanics meet luxury textures. We calculate kitchen layouts using the Golden Work Triangle to optimize your daily cooking routine perfectly. Our modular wardrobe profiles include soft-closing slide-outs, walk-in vanity cabinets, and internal warm LED light arrays matching actual Italian styles.',
      specs: [
        { label: 'Timeline', value: '2 - 3 Weeks Custom Mapping' },
        { label: 'Materials', value: 'Marine Ply, HDMR, PU Coatings, Imported Veneer' },
        { label: 'Hardware', value: 'Hafele, Blum, or Hettich specifications' },
        { label: 'Best Feature', value: 'Friction-less self-closing soft runners' }
      ],
      deliverables: [
        'Dedicated kitchen work triangle layout (Parallel, Straight, L-shape, Island)',
        'Detailed modular hardware callout maps showing all accessory trays',
        'Wardrobe breakdown layouts: custom shelving, drawers, and tie hangers',
        'Full factory-production ready elevation drafting files (.dwg format)',
        'Ventilation, chimney, gas plumbing, and water purifier point map'
      ],
      icon: <PenTool className="w-5 h-5" />
    },
    'room-concepts': {
      id: 'room-concepts',
      title: 'Room Concepts',
      tagline: 'Atmospheric Color Formulation & Multi-Layered Textures',
      subheader: 'Sanctuary Design for Majestic Living Rooms & Tranquil Bedrooms',
      packageId: 'c2',
      mainImage: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=1200',
      thumbImage1: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=650',
      thumbImage2: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=650',
      longDescription: 'We craft high-contrast, atmospheric rooms designed to embrace you. By mixing custom hand-textured wall plaster, heavy boucle weaving, bespoke architectural LED layouts, and subtle unlacquered metal details, we give rooms exquisite depth. Each concept is balanced to foster peace, inspiration, and pride.',
      specs: [
        { label: 'Timeline', value: '2 Weeks Focus Cycle' },
        { label: 'Output', value: 'Signature Room Styling Portfolio' },
        { label: 'Design Style', value: 'Tailored Minimalist, Warm Contemporary, or Japandi Lux' },
        { label: 'Detail Focus', value: 'Fabrics swatches, ambient dimming, paint formulations' }
      ],
      deliverables: [
        'Aesthetic room styling board mapping colors, timber, and marble swatches',
        'Paint manufacturer shade names & mixing percentages (Jotun, Asian Paints)',
        'Ambient lighting grid design showing precise hidden LED ceiling profiles',
        'Textured wallpaper & luxury upholstery recommendations coordinate book',
        'Accent decor items and art selection guide containing physical sizes'
      ],
      icon: <Sparkles className="w-5 h-5" />
    },
    'turnkey-execution': {
      id: 'turnkey-execution',
      title: 'Turnkey Interior Execution',
      tagline: 'Stress-Free Construction Implementation & Multi-Trades Control',
      subheader: 'On-Site Engineering Oversight & Absolute Peace of Mind',
      packageId: 'c3',
      mainImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200',
      thumbImage1: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=650',
      thumbImage2: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=650',
      longDescription: 'Skip the standard construction stress completely. Under our signature turnkey execution management, we direct highly professional on-site engineers, expert plumbers, licensed electricians, and master modular carpenters. We inspect material arrivals, enforce strict quality standards, and coordinate deep cleaning—taking you safely from blueprints to finished keys.',
      specs: [
        { label: 'Timeline', value: '8 - 14 Weeks Onsite Orchestration' },
        { label: 'Management', value: 'Dedicated single point of contact supervisor' },
        { label: 'Trades Covered', value: 'Demolition, civil, paint, carpentry, MEP, cleaning' },
        { label: 'Quality Audit', value: '4 stage milestone verification system' }
      ],
      deliverables: [
        'Interactive project execution timeline schedules & milestones tracking',
        'Dedicated vendor pricing checks and procurement audit files',
        'Weekly video progress diaries and structural checking logs',
        'Site inspection certification logs ensuring paint layers & joinery aligns',
        'Meticulous home move-in prep checklist & post-completion support'
      ],
      icon: <Hammer className="w-5 h-5" />
    }
  };

  const current = services[serviceId] || services['complete-home'];

  // 2. INTERACTIVE COMPONENT STATES BASED ON ACTIVE SERVICE
  // A. For 'complete-home': Area scale estimation
  const [apartmentSize, setApartmentSize] = useState<number>(1200);
  const [apartmentType, setApartmentType] = useState<string>('2BHK');

  // B. For 'space-planning': bottleneck test
  const [planningShape, setPlanningShape] = useState<string>('L-Shape');
  const [planningResidents, setPlanningResidents] = useState<number>(3);
  const getFlowRating = () => {
    if (planningShape === 'L-Shape' && planningResidents > 3) return { label: 'Moderate Bottleneck Danger', desc: 'Circulation pathways intersect at corners. Space planning layout recommended to prevent narrow walkway blocks.', color: 'text-amber-600 bg-amber-50 border-amber-100' };
    if (planningShape === 'Square' && planningResidents > 4) return { label: 'High Center Clutter Risk', desc: 'Square spaces lead to pushing all furniture to the walls, creating an audit violation. Smart center-zoning suggested.', color: 'text-red-700 bg-red-50 border-red-100' };
    return { label: 'High Potential Serenity', desc: 'Excellent basic proportion. Optimal CAD drafting will achieve comfortable, seamless circulation pathways.', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
  };

  // C. For 'modular-kitchen': work triangle toggler
  const [kitchenShape, setKitchenShape] = useState<string>('L-Shape');

  // D. For 'room-concepts': tone combinations
  const [selectedTimber, setSelectedTimber] = useState<string>('Oak');
  const [selectedMarble, setSelectedMarble] = useState<string>('Travertine');
  const [selectedFabric, setSelectedFabric] = useState<string>('Boucle');
  const getToneMatchOutput = () => {
    if (selectedTimber === 'Espresso' && selectedMarble === 'Travertine') {
      return { title: 'High-Contrast Quiet Luxury', desc: 'The rich deep grains of dark Charcoal Oak stand in outstanding sculptural relief against the porous warm beige Travertine stone. Paired with soft Boucle, it evokes a lavish Milan residential vibe.' };
    }
    if (selectedTimber === 'Walnut' && selectedMarble === 'Nero') {
      return { title: 'Sophisticated Dramatic Club', desc: 'Warm Swirly Walnut meets the striking jagged lightning veins of Nero Marquina marble. This creates a moody, exclusive lounge sanctuary environment.' };
    }
    return { title: 'Contemporary Organic Sanctuaty', desc: 'A soft, airy atmosphere. Natural pale oak and sand travertine combined with textured linen reflect heavy Japanese-Minimalist or Scandinavian design logic.' };
  };

  // E. For 'turnkey-execution': phase tracker
  const [activePhaseTab, setActivePhaseTab] = useState<number>(0);
  const phases = [
    { title: 'Phase 1: Civil Preparation', details: 'Demolition of unneeded partitions, electrical rerouting, concealed conduit placements, physical line setting.' },
    { title: 'Phase 2: Premium Plastering', details: 'Sanding, wall finishing and primer laying. Level verification using specialized onsite laser alignment tools.' },
    { title: 'Phase 3: Timber & Modular Carpentry', details: 'Precision structural framing of custom TV units, wardrobes, and modular hardware mounting (soft sliders).' },
    { title: 'Phase 4: Swatch Detailing', details: 'Aesthetic veneers polishing, premium fabric padding, light placement tuning, deep cleaning, and client handholding.' }
  ];

  return (
    <div 
      className="w-full bg-[#FAF8F5] min-h-screen"
      id="service-details-root"
    >
      {/* 3. HERO CONTAINER HEADER */}
      <div className="relative min-h-[460px] md:min-h-[520px] bg-[#1E1714] text-white flex flex-col justify-between">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={current.mainImage} 
            alt={current.title} 
            className="w-full h-full object-cover opacity-35 filter grayscale-[25%]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1714] via-[#1E1714]/80 to-transparent"></div>
        </div>

        {/* Floating Top Bar (Return & Header Context) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/10">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-[#FAF8F5]/85 hover:text-white bg-white/5 border border-white/15 px-4 py-2 rounded text-xs uppercase tracking-wider transition-all hover:bg-white/10 cursor-pointer text-[10px]"
            id="service-details-back-btn"
          >
            &larr; Return to Studio Overview
          </button>
          
          <div className="flex items-center gap-2.5 bg-[#BFA15F]/20 text-[#BFA15F] font-mono text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded border border-[#BFA15F]/35">
            {current.icon}
            Studio Services
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#3C2A21] flex items-center justify-center text-white/80 hover:text-white hover:bg-[#BFA15F] transition-all cursor-pointer border border-white/10"
            id="service-details-close-icon"
            aria-label="Close detail panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Title / Meta Block */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12 pt-24 md:pt-40 flex flex-col gap-4">
          <span className="font-mono text-xs text-[#BFA15F] tracking-[0.25em] uppercase font-bold">
            {current.tagline}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#FAF8F5] leading-tight tracking-tight">
            {current.title}
          </h1>
          <p className="font-sans text-sm md:text-lg text-white/80 font-light max-w-3xl leading-relaxed">
            {current.subheader}
          </p>
        </div>
      </div>

      {/* 4. MAIN THREE-COLUMN/GRID WORK ENVIRONMENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: OVERVIEW SECTION & METRIC BLOCKS (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* A. Core Introduction */}
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-2xl md:text-3xl text-[#3C2A21] tracking-tight">
              Design Philosophy &amp; Vision
            </h2>
            <p className="font-sans text-sm md:text-base text-[#6B625E] font-light leading-relaxed">
              {current.longDescription}
            </p>
          </div>

          {/* B. Grid of Deliverables */}
          <div className="bg-white border border-[#3C2A21]/15 p-6 md:p-8 rounded shadow-sm">
            <h3 className="font-serif text-lg text-[#3C2A21] mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#BFA15F]" />
              Physical &amp; Digital Project Deliverables:
            </h3>
            <ul className="flex flex-col gap-4">
              {current.deliverables.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-[#BFA15F]/15 flex items-center justify-center text-[#BFA15F] shrink-0 mt-0.5 text-xs font-serif font-bold">
                    {idx + 1}
                  </div>
                  <span className="font-sans text-xs md:text-sm text-[#3C2A21]/90 font-light leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* C. GORGEOUS CUSTOM IMAGES MOCK BENTO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
            <div className="h-[240px] md:h-[280px] rounded overflow-hidden border border-[#3C2A21]/10 relative group">
              <img 
                src={current.thumbImage1} 
                alt="Detail representation 1" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors"></div>
              <div className="absolute bottom-3 left-3 bg-[#1E1714]/85 text-white/90 text-[9.5px] font-mono uppercase tracking-wider px-2 py-1 rounded">
                Bespoke Curation
              </div>
            </div>
            <div className="h-[240px] md:h-[280px] rounded overflow-hidden border border-[#3C2A21]/10 relative group">
              <img 
                src={current.thumbImage2} 
                alt="Detail representation 2" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors"></div>
              <div className="absolute bottom-3 left-3 bg-[#1E1714]/85 text-white/90 text-[9.5px] font-mono uppercase tracking-wider px-2 py-1 rounded">
                Precision Geometry
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE UTILITIES & CALL-TO-ACTION PANEL (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* A. CORE SPECS BOX */}
          <div className="bg-[#FAF8F5] border border-[#3C2A21]/15 rounded p-6">
            <h4 className="font-mono text-[10px] text-[#BFA15F] uppercase tracking-[0.2em] font-semibold mb-4">
              Service Specs &amp; Delivery Parameters
            </h4>
            <div className="flex flex-col gap-3.5">
              {current.specs.map((spec, idx) => (
                <div key={idx} className="flex justify-between items-start border-b border-[#3C2A21]/5 pb-3 last:border-b-0 last:pb-0">
                  <span className="font-sans text-xs text-[#6B625E] font-medium">{spec.label}</span>
                  <span className="font-sans text-xs text-[#3C2A21] text-right font-light max-w-[200px]">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* B. HIGHLY INTERACTIVE TOOL (Varies based on serviceId) */}
          <div className="bg-white border border-[#3C2A21]/15 rounded-lg p-6 shadow-sm">
            
            {/* 1. Complete Home Concept Calculator */}
            {serviceId === 'complete-home' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1.5 text-[#BFA15F] font-mono text-[10px] uppercase font-bold">
                  <Calculator className="w-3.5 h-3.5" />
                  Dynamic Budget Blueprint Calculator
                </div>
                <h4 className="font-serif text-base text-[#3C2A21]">Pre-calculate scale and outputs</h4>
                
                <div className="flex flex-col gap-3 mt-1">
                  <div>
                    <label className="font-sans text-[10.5px] uppercase text-[#6B625E] flex justify-between">
                      <span>Area scale (Square Feet):</span>
                      <span className="font-bold text-[#3C2A21] font-mono">{apartmentSize} sqft</span>
                    </label>
                    <input 
                      type="range" 
                      min="500" 
                      max="5000" 
                      step="100" 
                      value={apartmentSize} 
                      onChange={(e) => setApartmentSize(Number(e.target.value))}
                      className="w-full accent-[#BFA15F] mt-1.5 cursor-pointer h-1.5 bg-stone-100 rounded"
                    />
                  </div>

                  <div>
                    <span className="font-sans text-[10.5px] uppercase text-[#6B625E] block mb-1.5">Apartment Setup:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['1BHK', '2BHK', '3BHK', 'Villa'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setApartmentType(type)}
                          className={`font-mono text-[10px] py-1.5 border rounded cursor-pointer transition-colors ${
                            apartmentType === type 
                              ? 'bg-[#3C2A21] text-[#FAF8F5] border-[#3C2A21]' 
                              : 'bg-[#FAF8F5] text-[#3C2A21]/80 hover:bg-[#3C2A21]/5 border-[#3C2A21]/10'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] border border-stone-150 rounded p-4 flex flex-col gap-2 mt-2">
                  <div className="flex justify-between text-xs border-b border-[#3C2A21]/5 pb-1.5">
                    <span className="text-[#6B625E]">Prescribed duration:</span>
                    <span className="font-medium text-[#3C2A21]">{apartmentType === 'Villa' ? '7-12 weeks' : '4-6 weeks'}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-[#3C2A21]/5 pb-1.5">
                    <span className="text-[#6B625E]">AutoCAD Detail Sheets:</span>
                    <span className="font-medium text-[#3C2A21]">{apartmentSize > 2500 ? '24 detailed layers' : '12 detailed layers'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B625E]">Milestone reviews:</span>
                    <span className="font-medium text-[#3C2A21]">{apartmentType === 'Villa' ? '6 Stage audits' : '3 Stage audits'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Space Planning Circulation Bottleneck Auditor */}
            {serviceId === 'space-planning' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1.5 text-[#BFA15F] font-mono text-[10px] uppercase font-bold">
                  <Sliders className="w-3.5 h-3.5" />
                  Egress Circulation Auditor
                </div>
                <h4 className="font-serif text-base text-[#3C2A21]">Pre-audit spatial clearance bottleneck risks</h4>

                <div className="flex flex-col gap-3 mt-1">
                  <div>
                    <span className="font-sans text-[10.5px] uppercase text-[#6B625E] block mb-1">Architectural Room shape:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['L-Shape', 'Square', 'Rectangular'].map((shape) => (
                        <button
                          key={shape}
                          onClick={() => setPlanningShape(shape)}
                          className={`font-sans text-[10px] py-1.5 border rounded cursor-pointer transition-colors ${
                            planningShape === shape 
                              ? 'bg-[#3C2A21] text-[#FAF8F5] border-[#3C2A21]' 
                              : 'bg-[#FAF8F5] text-[#3C2A21]/80 hover:bg-[#3C2A21]/5 border-[#3C2A21]/10'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-[10.5px] uppercase text-[#6B625E] flex justify-between">
                      <span>Expected Residents/Users:</span>
                      <span className="font-bold text-[#3C2A21] font-mono">{planningResidents} persons</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="8" 
                      step="1" 
                      value={planningResidents} 
                      onChange={(e) => setPlanningResidents(Number(e.target.value))}
                      className="w-full accent-[#BFA15F] mt-1.5 cursor-pointer h-1.5 bg-stone-100 rounded"
                    />
                  </div>
                </div>

                <div className={`p-4 border rounded text-xs leading-relaxed flex flex-col gap-1 mt-2 transition-all duration-300 ${getFlowRating().color}`}>
                  <strong className="font-semibold block uppercase tracking-wider text-[9.5px]">
                    Analysis: {getFlowRating().label}
                  </strong>
                  <p className="font-light opacity-90">{getFlowRating().desc}</p>
                </div>
              </div>
            )}

            {/* 3. Modular Kitchen work triangle toggler */}
            {serviceId === 'modular-kitchen' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1.5 text-[#BFA15F] font-mono text-[10px] uppercase font-bold">
                  <Sliders className="w-3.5 h-3.5" />
                  Work Triangle Simulator
                </div>
                <h4 className="font-serif text-base text-[#3C2A21]">Choose Kitchen Configuration</h4>

                <div className="grid grid-cols-4 gap-1 mt-1">
                  {['L-Shape', 'Parallel', 'Island', 'Straight'].map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setKitchenShape(shape)}
                      className={`font-sans text-[9px] py-2 border rounded cursor-pointer transition-colors font-medium ${
                        kitchenShape === shape 
                          ? 'bg-[#3C2A21] text-[#FAF8F5] border-[#3C2A21]' 
                          : 'bg-[#FAF8F5] text-[#3C2A21]/80 hover:bg-[#3C2A21]/5 border-[#3C2A21]/10'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>

                {/* Draw Simulated Triangle Layout */}
                <div className="border border-[#3C2A21]/10 rounded bg-[#FAF8F5] p-5 h-44 flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="absolute top-2.5 right-2.5 font-mono text-[8px] uppercase text-[#6B625E]">Interactive Layout Model</span>
                  
                  {kitchenShape === 'L-Shape' && (
                    <div className="flex flex-col items-center transition-all duration-500">
                      {/* L shape drawing with dotted line triangle */}
                      <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-95 text-[#BFA15F]">
                        <path d="M10,10 L10,90 L90,90" fill="none" stroke="#3C2A21" strokeWidth="8" strokeOpacity="0.25"/>
                        <polygon points="10,25 10,75 75,90" fill="none" stroke="#BFA15F" strokeWidth="1.5" strokeDasharray="3 3"/>
                        <circle cx="10" cy="25" r="4.5" fill="#3C2A21"/>
                        <text x="20" y="27" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Sink</text>
                        <circle cx="10" cy="75" r="4.5" fill="#3C2A21"/>
                        <text x="20" y="77" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Prep</text>
                        <circle cx="75" cy="90" r="4.5" fill="#3C2A21"/>
                        <text x="65" y="82" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Cook</text>
                      </svg>
                      <span className="font-sans text-[10px] text-[#6B625E]/95 mt-2 font-medium">L-Shape: Compact, zero cross-traffic intersections</span>
                    </div>
                  )}

                  {kitchenShape === 'Parallel' && (
                    <div className="flex flex-col items-center transition-all duration-500">
                      <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-95 text-[#BFA15F]">
                        <rect x="10" y="10" width="8" height="80" rx="2" fill="#3C2A21" fillOpacity="0.2"/>
                        <rect x="80" y="10" width="8" height="80" rx="2" fill="#3C2A21" fillOpacity="0.2"/>
                        <polygon points="14,25 14,75 84,50" fill="none" stroke="#BFA15F" strokeWidth="1.5" strokeDasharray="3 3"/>
                        <circle cx="14" cy="25" r="4.5" fill="#3C2A21"/>
                        <text x="25" y="28" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Sink</text>
                        <circle cx="14" cy="75" r="4.5" fill="#3C2A21"/>
                        <text x="25" y="78" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Prep</text>
                        <circle cx="84" cy="50" r="4.5" fill="#3C2A21"/>
                        <text x="60" y="53" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Cook</text>
                      </svg>
                      <span className="font-sans text-[10px] text-[#6B625E]/95 mt-2 font-medium">Parallel: High chef efficiency, separate dry/wet sides</span>
                    </div>
                  )}

                  {kitchenShape === 'Island' && (
                    <div className="flex flex-col items-center transition-all duration-500">
                      <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-95 text-[#BFA15F]">
                        <path d="M10,10 L90,10" fill="none" stroke="#3C2A21" strokeWidth="6" strokeOpacity="0.2"/>
                        <rect x="30" y="55" width="40" height="25" rx="3" fill="#3C2A21" fillOpacity="0.2"/>
                        <polygon points="20,10 80,10 50,68" fill="none" stroke="#BFA15F" strokeWidth="1.5" strokeDasharray="3 3"/>
                        <circle cx="20" cy="10" r="4.5" fill="#3C2A21"/>
                        <text x="12" y="23" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Sink</text>
                        <circle cx="80" cy="10" r="4.5" fill="#3C2A21"/>
                        <text x="75" y="23" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Cook</text>
                        <circle cx="50" cy="68" r="4.5" fill="#3C2A21"/>
                        <text x="42" y="62" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Prep</text>
                      </svg>
                      <span className="font-sans text-[10px] text-[#6B625E]/95 mt-2 font-medium">Island: Elegant entertainment, highly visual master-cook prep</span>
                    </div>
                  )}

                  {kitchenShape === 'Straight' && (
                    <div className="flex flex-col items-center transition-all duration-500">
                      <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-95 text-[#BFA15F]">
                        <rect x="10" y="45" width="80" height="10" rx="1" fill="#3C2A21" fillOpacity="0.2"/>
                        <polygon points="20,50 50,50 80,50" fill="none" stroke="#BFA15F" strokeWidth="1.5" strokeDasharray="3 3_disabled"/>
                        <circle cx="20" cy="50" r="4.5" fill="#3C2A21"/>
                        <text x="15" y="40" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Sink</text>
                        <circle cx="50" cy="50" r="4.5" fill="#3C2A21"/>
                        <text x="45" y="40" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Prep</text>
                        <circle cx="80" cy="50" r="4.5" fill="#3C2A21"/>
                        <text x="75" y="40" fontSize="8" fill="#3C2A21" fontFamily="sans-serif">Cook</text>
                      </svg>
                      <span className="font-sans text-[10px] text-[#6B625E]/95 mt-2 font-medium">Straight: Inline workflow. Clean for narrow corridor spaces</span>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* 4. Room Concepts tone picker */}
            {serviceId === 'room-concepts' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1.5 text-[#BFA15F] font-mono text-[10px] uppercase font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  Aesthetic Swatch Layer Mixer
                </div>
                <h4 className="font-serif text-base text-[#3C2A21]">Simulate premium tactile pairings</h4>

                <div className="grid grid-cols-1 gap-3.5 mt-1">
                  
                  {/* Timber Option */}
                  <div>
                    <span className="font-mono text-[8px] uppercase text-[#6B625E] font-medium tracking-wide">1. Core Premium Wood/Veneer:</span>
                    <div className="grid grid-cols-3 gap-1.5 mt-1">
                      {['Oak', 'Walnut', 'Espresso'].map((wood) => (
                        <button
                          key={wood}
                          onClick={() => setSelectedTimber(wood)}
                          className={`font-sans text-[10px] py-1 border rounded cursor-pointer transition-all ${
                            selectedTimber === wood 
                              ? 'bg-[#3C2A21] text-[#FAF8F5] border-[#3C2A21]' 
                              : 'bg-stone-50 text-stone-700/80 hover:bg-stone-100 border-stone-200'
                          }`}
                        >
                          {wood === 'Espresso' ? 'Charcoal' : wood}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Marble Option */}
                  <div>
                    <span className="font-mono text-[8px] uppercase text-[#6B625E] font-medium tracking-wide">2. Main Sculptural Stone:</span>
                    <div className="grid grid-cols-3 gap-1.5 mt-1">
                      {['Travertine', 'Calacatta', 'Nero'].map((stone) => (
                        <button
                          key={stone}
                          onClick={() => setSelectedMarble(stone)}
                          className={`font-sans text-[10px] py-1 border rounded cursor-pointer transition-all ${
                            selectedMarble === stone 
                              ? 'bg-[#3C2A21] text-[#FAF8F5] border-[#3C2A21]' 
                              : 'bg-stone-50 text-stone-700/80 hover:bg-stone-100 border-stone-200'
                          }`}
                        >
                          {stone === 'Calacatta' ? 'Italian' : stone}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="bg-[#FAF8F5] border border-[#BFA15F]/20 rounded p-4 flex flex-col gap-1.5 mt-2 transition-all duration-300">
                  <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#BFA15F] font-bold">
                    Resulting Vibe: {getToneMatchOutput().title}
                  </span>
                  <p className="font-sans text-[11px] text-[#6B625E] font-light leading-relaxed">
                    {getToneMatchOutput().desc}
                  </p>
                </div>
              </div>
            )}

            {/* 5. Turnkey Construction Timeline reveal */}
            {serviceId === 'turnkey-execution' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1.5 text-[#BFA15F] font-mono text-[10px] uppercase font-bold">
                  <Hammer className="w-3.5 h-3.5" />
                  Site Execution Milestone Audit Stages
                </div>
                <h4 className="font-serif text-base text-[#3C2A21]">Check physical stage logs on-site</h4>

                <div className="flex flex-col gap-2 mt-1">
                  {phases.map((phase, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded border transition-all cursor-pointer ${
                        activePhaseTab === idx 
                          ? 'bg-[#FAF8F5] border-[#3C2A21] shadow-sm' 
                          : 'bg-white border-stone-200/60 hover:bg-stone-50'
                      }`}
                      onClick={() => setActivePhaseTab(idx)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-[11px] font-semibold text-[#3C2A21]">
                          {phase.title}
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 text-[#BFA15F] transition-transform ${activePhaseTab === idx ? 'rotate-90' : ''}`} />
                      </div>
                      {activePhaseTab === idx && (
                        <p className="font-sans text-[10.5px] text-[#6B625E] font-light leading-relaxed mt-1.5 border-t border-stone-200/50 pt-1.5">
                          {phase.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* C. MASSIVE SECURE CALL-TO-ACTION BOOKING BOX */}
          <div className="bg-[#1E1714] text-white rounded-lg p-6 flex flex-col gap-5 text-center items-center shadow-lg shadow-[#1E1714]/20 border border-[#BFA15F]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#BFA15F]/5 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-mono text-[8.5px] tracking-[0.2em] text-[#BFA15F] font-bold uppercase">
                Secure Studio Gateway Bookings
              </span>
              <h3 className="font-serif text-xl text-[#FAF8F5] tracking-tight">
                Designated Expert Consulting Integration
              </h3>
              <p className="font-sans text-xs text-stone-300 font-light leading-relaxed mt-1 max-w-[280px]">
                Initiate a high-definition consultation with Monica. Fully redeemable against executing retainers.
              </p>
            </div>

            <button
              onClick={() => {
                onBookService(current.packageId);
              }}
              className="w-full flex items-center justify-center gap-2.5 bg-[#BFA15F] hover:bg-[#FAF8F5] text-stone-900 font-sans text-xs font-bold uppercase tracking-[0.15em] py-3.5 px-6 rounded transition-all transform cursor-pointer active:scale-97 shadow-md"
              id="service-cta-book-btn"
            >
              🚀 Book Specified Consult Call &rarr;
            </button>
            
            <p className="font-sans text-[9px] text-[#BFA15F]/70 italic">
              * Active confirmations securely stored on Firestore server logs.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
