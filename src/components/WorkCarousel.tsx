import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Eye, Sparkles, Plus } from 'lucide-react';

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Kitchen' | 'Bedroom' | 'Ceiling' | 'Bathroom' | 'Living Room';
  description: string;
  image: string;
  fallbackImage?: string; // Curated original high-quality back up if local /assets/pX.jpg has not been uploaded yet
  isRender?: boolean; // True if it's a 3D design render illustration instead of photo
  isVideo?: boolean; // Supports video playback (.mp4, .mov, etc.)
  details?: string[];
}

// Curated high-fidelity representations of the 14 pictures uploaded by Monica Interiors
const INITIAL_WORK_ITEMS: PortfolioItem[] = [
  {
    id: 'pw-1',
    title: 'Designer False Ceiling with Silent Fan',
    category: 'Ceiling',
    description: 'A beautiful false ceiling design with soft, hidden lighting and a quiet black ceiling fan.',
    image: '/assets/p1.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    details: ['Elegant layered panel design', 'Warm hidden light strips', 'Quiet, high-speed ceiling fan']
  },
  {
    id: 'pw-2',
    title: 'Luxe Bedroom Suite with Fluted Faux-Leather Headboard',
    category: 'Bedroom',
    description: 'A custom-made leather headboard paired with a deep navy blue bed frame and cozy bedside tables.',
    image: '/assets/p2.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200',
    details: ['Elegant vertical lining work', 'White brick style wallpaper', 'Large glass balcony view']
  },
  {
    id: 'pw-3',
    title: 'Clean-Line False Ceiling with Sleek Fan',
    category: 'Ceiling',
    description: 'A beautiful two-tiered false ceiling with hidden lights and a modern matte ceiling fan.',
    image: '/assets/p3.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    details: ['Easy-to-dim warm lighting', 'Clean geometric ceiling borders', 'Optimized quiet ceiling fan']
  },
  {
    id: 'pw-4',
    title: 'Modern Dark Ceilings with Subtle Fan',
    category: 'Ceiling',
    description: 'A stylish charcoal dark ceiling frame with elegant glowing side panels and a black fan.',
    image: '/assets/p4.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    details: ['Glowing LED border lights', 'Textured dark feature wall', 'Smooth and silent ceiling fan']
  },
  {
    id: 'pw-5',
    title: 'Elegant Double Floating Ceiling with Lights',
    category: 'Ceiling',
    description: 'A double-floating clean white ceiling with glowing side borders and a designer fan.',
    image: '/assets/p5.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=1200',
    details: ['Warm LED glow accents', 'Matte black modern fan', 'Accent wallpaper combination']
  },
  {
    id: 'pw-6',
    title: 'Classic Wall Moldings & Warm Ceiling Glow',
    category: 'Ceiling',
    description: 'Elegant wall panel borders paired with a modern glowing ceiling and a quiet white fan.',
    image: '/assets/p6.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    details: ['Classic wall panel borders', 'Quiet, sleek white fan', 'Warm hidden ceiling light strips']
  },
  {
    id: 'pw-7',
    title: '3D Teal & Slate Laminate Modular Kitchen',
    category: 'Kitchen',
    isRender: true,
    description: 'A practical and beautiful modular kitchen with navy blue and grey cabinets.',
    image: '/assets/p7.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200',
    details: ['Two-sided straight counter setup', 'Sleek handle-free drawers', 'Deep stainless steel sink']
  },
  {
    id: 'pw-8',
    title: 'Dune Sand Plaster Dining Arena',
    category: 'Living Room',
    isRender: true,
    description: 'Elegant wall arches carved with soft dining wallpaper details and classic wooden dining chairs.',
    image: '/assets/p8.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1200',
    details: ['Carved display wall niches', 'Beautiful hand-drawn wallpaper', 'Polished rich wood chairs']
  },
  {
    id: 'pw-9',
    title: 'Finished Three-Section Modular Kitchen Portfolio',
    category: 'Kitchen',
    description: 'A complete high-quality kitchen featuring modern warm beige cabinets and elegant dark countertops.',
    image: '/assets/p9.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    details: ['Perfect layout for daily cooking', 'Tall cabinets for maximum storage', 'Granite countertops']
  },
  {
    id: 'pw-10',
    title: 'Sleek Matt Graphite Heavy-Hardware Kitchen',
    category: 'Kitchen',
    isRender: true,
    description: 'A modern dark grey kitchen with elegant under-cabinet spot lights and custom cabinet handles.',
    image: '/assets/p10.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=1200',
    details: ['Spacious storage drawers', 'Built-in chimney hood system', 'Bright backsplash tiles']
  },
  {
    id: 'pw-11',
    title: 'Earthy Micro-Cement Plaster Powder Room',
    category: 'Bathroom',
    description: 'A minimalist bathroom design with a round concrete basin, clean wood table, and twin mirrors.',
    image: '/assets/p11.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
    details: ['Hand-crafted pink stone basin', 'Natural curving wood counter', 'Smart wall-hung modern toilet']
  },
  {
    id: 'pw-12',
    title: 'Polished Stone & Wood Bathroom Render',
    category: 'Bathroom',
    isRender: true,
    description: 'A beautiful marble-pattern bathroom concept with a matching copper sink on natural wood planks.',
    image: '/assets/p12.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=1200',
    details: ['Crafted warm copper basin', 'Hidden yellow ambient light bars', 'Sleek wall-mounted modern toilet']
  },
  {
    id: 'pw-13',
    title: 'Custom Arched Glass Sliding Door',
    category: 'Living Room',
    description: 'A solid wooden sliding door with elegant curves and textured glass for privacy and style.',
    image: '/assets/p13.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    details: ['Signature clean glass selection', 'Textured ribbed glass for privacy', 'Super smooth overhead slider tracking']
  },
  {
    id: 'pw-14',
    title: 'Elegant Matte Grey Kitchen',
    category: 'Kitchen',
    description: 'A beautiful modern kitchen featuring simple grey cabinets and a white marble backsplash.',
    image: '/assets/p14.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200',
    details: ['Hidden high-efficiency exhaust', 'High-quality stone countertops', 'Sleek handle-free cabinet doors']
  }
];

// Smart helper function to convert standard Google Drive links or File IDs into direct web rendering links on the fly!
export function getRenderableUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Pattern 1: Google drive sharing folder viewer link /file/d/FILE_ID/view
  const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
  }

  // Pattern 2: Typical query argument format (?id=FILE_ID or &id=FILE_ID)
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  // Pattern 3: If client just pasted a raw alphanumeric google drive file ID (25 to 50 chars)
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return `https://lh3.googleusercontent.com/d/${trimmed}`;
  }

  return trimmed;
}

export default function WorkCarousel() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover'); // default to 'cover' (fill mode) as requested by the user
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Setup initial items: attempt scanning /assets folder via API first, fallback to localStorage/mock data!
  useEffect(() => {
    async function loadPortfolioMedia() {
      try {
        const res = await fetch("/api/portfolio/media");
        const data = await res.json();
        if (data.success && Array.isArray(data.media) && data.media.length > 0) {
          console.log(`Successfully auto-detected ${data.media.length} user media items from /assets!`);
          
          // List of generic premium categories to cycle through for non-detected items
          const categories: ('Kitchen' | 'Bedroom' | 'Ceiling' | 'Bathroom' | 'Living Room')[] = [
            'Kitchen', 'Living Room', 'Ceiling', 'Bedroom', 'Bathroom'
          ];

          const scannedItems: PortfolioItem[] = data.media.map((item: any, idx: number) => {
            const filename = item.filename;
            const filenameLower = filename.toLowerCase();
            
            // Intelligently guess category based on file naming keywords
            let category: 'Kitchen' | 'Bedroom' | 'Ceiling' | 'Bathroom' | 'Living Room' = categories[idx % categories.length];
            let title = `Monica Interiors Design Concept #${idx + 1}`;
            let description = `A beautiful and practical interior design featuring custom wood details and modern styling.`;
            let details = ["Custom high-end styling", "Durable quality hardware", "Selected premium materials"];

            if (filenameLower.includes('kitchen') || filenameLower.includes('cook')) {
              category = 'Kitchen';
              title = `Custom Luxury Kitchen`;
              description = `A modern kitchen design with glossy doors, soft-close drawers, and beautiful countertops.`;
              details = ["Under-cabinet LED task lights", "Water-resistant cabinet doors", "Premium horizontal handles"];
            } else if (filenameLower.includes('bath') || filenameLower.includes('toilet') || filenameLower.includes('powder') || filenameLower.includes('wash') || filenameLower.includes('bathrrom')) {
              category = 'Bathroom';
              title = `Modern Cozy Plaster Bathroom`;
              description = `A beautiful bathroom with elegant beige plaster walls, a stone washbasin, and shiny copper hardware.`;
              details = ["Seamless waterproof finish", "Hand-crafted round washbasins", "Warm glowing accent lighting"];
            } else if (filenameLower.includes('ceiling') || filenameLower.includes('celing') || filenameLower.includes('roof') || filenameLower.includes('cove') || filenameLower.includes('pop')) {
              category = 'Ceiling';
              if (filenameLower.includes('fan')) {
                title = `Custom False Ceiling with Silent Fan`;
                description = `A beautiful modern false ceiling with warm hidden lighting and a sleek, quiet fan.`;
                details = ["Comfortable warm ceiling lights", "Quiet but powerful cooling fan", "Beautifully finished flat plaster work"];
              } else {
                title = `Modern Ceiling with Glowing Lights`;
                description = `Sleek double-layered drywall design with soft, dimmable LED glow strips.`;
                details = ["Soft dimmable light tracks", "Quiet, premium cooling fans", "Perfect plaster border finish"];
              }
            } else if (filenameLower.includes('passage') || filenameLower.includes('entrance') || filenameLower.includes('living passage')) {
              category = 'Living Room';
              title = `Elegant Corridor & Entryway`;
              description = `A welcoming entryway featuring lovely wood panels and warm, bright spot lights.`;
              details = ["Spacious entryway design", "Invisible door frames", "Beautiful custom wood wall panels"];
            } else if (filenameLower.includes('leaving') || filenameLower.includes('leaving room')) {
              category = 'Living Room';
              title = `Spacious Luxury Living Room`;
              description = `A highly comfortable living area pairing beautiful neutral sofas with custom vertical wood paneling and gentle ambient lights.`;
              details = ["Soft, high-quality seating", "Stylish false ceiling styling", "Warm and inviting spot lighting"];
            } else if (filenameLower.includes('live') || filenameLower.includes('tv') || filenameLower.includes('hall') || filenameLower.includes('sofa') || filenameLower.includes('living')) {
              category = 'Living Room';
              title = `Cozy Living Room Entertainment Area`;
              description = `A beautiful TV wall with custom marble backdrops, vertical wood panels, and a clean storage console.`;
              details = ["Elegant vertical wooden plates", "Wall-mounted storage drawers", "Clever hidden cable storage"];
            } else if (filenameLower.includes('bed') || filenameLower.includes('room') || filenameLower.includes('sleep')) {
              category = 'Bedroom';
              title = `Luxury Master Bedroom Suite`;
              description = `A cozy master bedroom featuring custom paneling on the main wall, warm hidden lights, and spacious wardrobes.`;
              details = ["Beautiful wall board design", "Hidden warm background lighting", "Large sliding wardrobe doors"];
            }

            // Custom video adjustments
            if (item.isVideo) {
              title = `Cinematic Spatial Walkthrough Tour`;
              description = `Experience the layout and materials in high detail with a walkthrough video of our actual design setup.`;
              details = ["Real project walkthrough", "360-degree room layouts", "Detailed view of materials"];
            }

            const defaultFills: Record<string, string> = {
              'Kitchen': 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=1200',
              'Bedroom': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200',
              'Ceiling': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
              'Bathroom': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
              'Living Room': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
            };

            return {
              id: `scanned-${idx}`,
              title: title,
              category: category,
              description: description,
              image: item.path,
              fallbackImage: defaultFills[category] || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
              isVideo: item.isVideo,
              details: details
            };
          });

          setItems(scannedItems);
          return;
        }
      } catch (err) {
        console.warn("Dynamic scanning fetch failed, falling back to cached list:", err);
      }

      // Local storage cache or standard fallback items
      const saved = localStorage.getItem('monica_portfolio_items');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
            return;
          }
        } catch (e) {}
      }
      setItems(INITIAL_WORK_ITEMS);
    }

    loadPortfolioMedia();
  }, []);

  // Guarantee currentIndex bounds when items change dynamically
  useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  // Sync to local storage
  const saveItems = (updated: PortfolioItem[]) => {
    setItems(updated);
    localStorage.setItem('monica_portfolio_items', JSON.stringify(updated));
  };

  // Manage sliding timers
  useEffect(() => {
    const safeIdx = currentIndex < items.length ? currentIndex : 0;
    const currentItem = items[safeIdx];
    const isCurrentVideo = currentItem?.isVideo;

    if (isAutoPlaying && !isManagerOpen && items.length > 0 && !isCurrentVideo) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 3500); // Speeds up the automatic carousel rotation
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying, isManagerOpen, items]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Pause auto rotation on direct click
  };

  // Safe file upload instruction for the client
  const triggerImageUploadInfo = () => {
    setUploadMessage('✨ Fully automated! You DO NOT need to rename your files: simply drag-and-drop your 17 photos and videos (with any filenames of your choice) straight into the "/assets/" folder. The system will auto-scan, categorize, and play videos natively in place of the stock previews instantly!');
    setTimeout(() => setUploadMessage(null), 15000);
  };

  // Custom portfolio modifier form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Kitchen' | 'Bedroom' | 'Ceiling' | 'Bathroom' | 'Living Room'>('Kitchen');
  const [formDesc, setFormDesc] = useState('');
  const [formUrl, setFormUrl] = useState('');

  const handleUpdateImage = (id: string, newUrl: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, image: newUrl };
      }
      return item;
    });
    saveItems(updated);
    setImageErrorMap(prev => ({ ...prev, [id]: false }));
  };

  const handleReset = () => {
    saveItems(INITIAL_WORK_ITEMS);
    setCurrentIndex(0);
    setImageErrorMap({});
  };

  if (items.length === 0) return null;

  // Safe clamping of index for interim render passes when files update dynamically
  const safeIndex = currentIndex < items.length ? currentIndex : 0;
  const activeItem = items[safeIndex] || items[0];

  if (!activeItem) return null;

  return (
    <div className="w-full bg-[#FAF8F5] border-t border-b border-[#3C2A21]/10 py-16 md:py-24" id="real-works-showcase">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#BFA15F] font-semibold flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#BFA15F]" />
              Monica Interiors Complete Renovations &amp; 3D Designs
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#3C2A21] tracking-tight leading-none">
              Client Project Showcase
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#6B625E] font-light mt-3 leading-relaxed">
              Auto-sliding real-life portfolio walkthrough. Witness complete installations and detailed 3D spatial models delivered by our studio. Click the navigation arrows to inspect individual assets in high resolution.
            </p>
          </div>
        </div>

        {/* PRIMARY IMMERSIVE AUTO-SLIDING VIEW CAROUSEL */}
        <div 
          className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-[#3C2A21]/15 rounded-xl overflow-hidden shadow-xl"
          id="carousel-slider-body"
        >
          {/* IMAGE SIDE CONTAINER - 7/12 grid */}
          <div className="lg:col-span-7 relative h-[350px] sm:h-[450px] md:h-[550px] overflow-hidden bg-stone-900 group">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={safeIndex}
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-stone-950 flex items-center justify-center overflow-hidden"
              >
                {activeItem.isVideo ? (
                  <video
                    src={activeItem.image}
                    autoPlay
                    muted
                    playsInline
                    controls
                    onEnded={handleNext}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {/* Immersive blurred canvas backdrop when in contain mode */}
                    {fitMode === 'contain' && (
                      <img
                        src={imageErrorMap[activeItem.id] ? (activeItem.fallbackImage || activeItem.image) : getRenderableUrl(activeItem.image)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-105 pointer-events-none select-none"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    
                    <img
                      src={imageErrorMap[activeItem.id] ? (activeItem.fallbackImage || activeItem.image) : getRenderableUrl(activeItem.image)}
                      alt={activeItem.title}
                      className={`relative z-10 select-none transition-all duration-500 ${
                        fitMode === 'cover' ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain p-6 md:p-8'
                      }`}
                      referrerPolicy="no-referrer"
                      onError={() => {
                        if (!imageErrorMap[activeItem.id]) {
                          setImageErrorMap(prev => ({ ...prev, [activeItem.id]: true }));
                        }
                      }}
                    />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
              </motion.div>
            </AnimatePresence>
 
            {/* Slider visual category badge */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pr-16 md:pr-0">
              <span className="font-mono text-[9px] font-semibold text-white uppercase tracking-[0.2em] bg-[#1E1714]/85 px-3 py-1.5 rounded border border-white/15">
                {activeItem.category}
              </span>
              {activeItem.isRender && (
                <span className="font-mono text-[9px] font-semibold text-[#BFA15F] uppercase tracking-[0.2em] bg-yellow-400/10 backdrop-blur-md px-3 py-1.5 rounded border border-[#BFA15F]/30 font-bold">
                  3D Render Concept
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFitMode(prev => prev === 'cover' ? 'contain' : 'cover');
                }}
                className="font-mono text-[9px] font-semibold text-white uppercase tracking-[0.15em] bg-black/60 hover:bg-[#BFA15F] hover:text-[#3C2A21] px-2.5 py-1.5 rounded border border-white/10 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer pointer-events-auto active:scale-95 whitespace-nowrap"
                title="Toggle fit/zoom to see complete image"
              >
                {fitMode === 'cover' ? '🖼 Fit Whole Photo' : '🔍 Fill Screen'}
              </button>
            </div>
 
            {/* Slide Index Badge */}
            <div className="absolute top-4 right-4 z-10 font-mono text-[10px] text-white/80 bg-black/45 px-2.5 py-1.5 rounded font-bold backdrop-blur-xs">
              {safeIndex + 1} / {items.length}
            </div>

            {/* FLOATING DIRECT NAVIGATION CONTROLS */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 px-4 flex justify-between pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/95 backdrop-blur-md text-white hover:text-[#3C2A21] flex items-center justify-center transition-all shadow-lg border border-white/20 select-none cursor-pointer pointer-events-auto hover:scale-105 active:scale-95"
                aria-label="Previous Slide"
                id="carousel-prev-arrow"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/95 backdrop-blur-md text-white hover:text-[#3C2A21] flex items-center justify-center transition-all shadow-lg border border-white/20 select-none cursor-pointer pointer-events-auto hover:scale-105 active:scale-95"
                aria-label="Next Slide"
                id="carousel-next-arrow"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom dynamic progress bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-stone-100/20 z-10 overflow-hidden">
              <motion.div 
                className="h-full bg-[#BFA15F]"
                initial={{ width: '0%' }}
                animate={{ width: `${((safeIndex + 1) / items.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* DETAIL CONTENT SIDE - 5/12 grid */}
          <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-white text-[#3C2A21]">
            <div className="flex flex-col gap-6">
              
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#BFA15F] font-bold block mb-1">
                  Active Asset Details
                </span>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={safeIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#3C2A21] tracking-tight leading-snug">
                      {activeItem.title}
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Description */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={safeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="font-sans text-sm text-[#6B625E] font-light leading-relaxed"
                >
                  {activeItem.description}
                </motion.p>
              </AnimatePresence>

              {/* Bullets lists */}
              <div className="pt-4 border-t border-[rgba(60,42,33,0.08)]">
                <span className="font-mono text-[10px] uppercase font-bold text-[#7F675B] tracking-wider block mb-3">
                  Design &amp; Finishing Specs
                </span>
                <ul className="flex flex-col gap-2 font-sans text-xs text-[#6B625E]/95">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={safeIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {activeItem.details?.map((detail, dId) => (
                        <li key={dId} className="flex items-center gap-2 mb-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F] flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </ul>
              </div>

            </div>

            {/* NAVIGATION INDICATORS DOTS AT BOTTOM RIGHT CAROUSEL CONTAINER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 mt-8 border-t border-[rgba(60,42,33,0.08)]">
              <span className="text-[10px] font-mono text-[#6B625E]/80 uppercase">
                {isAutoPlaying ? '● Autoplay Active' : '⏸ Autoplay Paused'}
              </span>

              <div className="flex flex-wrap gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleIndicatorClick(i)}
                    className={`h-2 transition-all duration-400 rounded-full ${
                      safeIndex === i 
                        ? 'w-6 bg-[#BFA15F]' 
                        : 'w-2 bg-stone-200 hover:bg-stone-400'
                    }`}
                    id={`carousel-slide-dot-${i}`}
                    aria-label={`Show slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
