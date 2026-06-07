/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ConsultationType, Testimonial, DesignQuizQuestion } from './types';

export const COMPLEMENTARY_COLORS = {
  espresso: '#3C2A21',
  latte: '#7F675B',
  creamPlaster: '#FAF8F5',
  brassAccent: '#BFA15F',
  monochromeMuted: '#6B625E',
  brandingNavy: '#1E2941', // Matches the indigo dot in her logo
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'p1',
    title: 'Aesthetic Living Room Sanctuary',
    category: 'Residential',
    description: 'A complete redesign of a premium living room, featuring elegant plaster finish walls, custom curved arches, and luxury marble elements.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200', // simple barren room
    location: 'Bandra West, Mumbai',
    scope: 'Space planning, Premium furniture and lighting selection, Custom wall painting finish',
    materials: ['Premium Marble', 'Textured Plaster Walls', 'Soft Linen Fabrics', 'Golden Brass Accents']
  },
  {
    id: 'p2',
    title: 'Modern Modular Luxury Kitchen',
    category: 'Residential',
    description: 'A beautiful modern modular kitchen with premium dark wooden cabinets, a large white marble counter top, and an efficient easy-to-use smart layout.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    beforeImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200', // outdated cabinetry
    location: 'DLF Phase 5, Gurugram',
    scope: 'Dismantling, Modular kitchen cabinets installation, Layout design',
    materials: ['Premium Dark Wood', 'White Veined Marble', 'Bronze handles', 'Premium Modular Fitting Hardware']
  },
  {
    id: 'p3',
    title: 'The Peaceful Bedroom Sanctuary',
    category: 'Residential',
    description: 'A deeply peaceful and beautiful bedroom design using cozy lighting, elegant custom bed headboard, and soft airy curtains.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200',
    beforeImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200', // plain old room
    location: 'Jubilee Hills, Hyderabad',
    scope: 'Smart lighting plan, Premium curtains & fabrics, Color coordination',
    materials: ['Soft Pure Linen', 'Custom Wooden Shelves', 'Plaster Finishes', 'Warm Hidden LED Lighting']
  },
  {
    id: 'p4',
    title: 'Elegant Boutique Lounge',
    category: 'Commercial',
    description: 'A premium cafe and lounge design featuring high arched wall patterns, durable floor finishes, comfortable velvet sofas, and modern elegant light fixtures.',
    image: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=1200',
    location: 'Koregaon Park, Pune',
    scope: 'Lounge interior design, Customized sofa seating, Brand styling',
    materials: ['Rich Green Velvet', 'Terrazzo Flooring', 'Curved Arch Partition Walls', 'Warm Copper Accents']
  },
  {
    id: 'p5',
    title: 'Modern Office Boardroom',
    category: 'Commercial',
    description: 'A professional corporate conference room design with clean smooth walls, custom wooden executive tables, and wooden acoustic wall panels.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    location: 'Aerocity, New Delhi',
    scope: 'Soundproofing design, Corporate lighting setup, Custom conference table',
    materials: ['Wooden Soundproof Panels', 'Textured Walls', 'Decorative Fluted Glass', 'Sleek Led Hanging Lights']
  }
];

export const CONSULTATION_PACKAGES: ConsultationType[] = [
  {
    id: 'c1',
    name: 'Spatial Discovery & Layout Audit',
    price: 250,
    duration: '60 Minutes',
    description: 'A focused call to address layout bottlenecks, optimize clearances, and plan strategic zoning structures before starting construction.',
    features: [
      'Space Planning & Layout Optimization guidance',
      'Review of 1BHK / 2BHK / 3BHK to Villa layouts',
      'Actionable blueprint & furniture flow suggestions',
      'Follow-up digital layout assessment report'
    ]
  },
  {
    id: 'c2',
    name: 'Premium Concept & Materiality',
    price: 250,
    duration: '120 Minutes',
    description: 'Deep dive into bespoke styling palette curation. Ideal for Living Room, Bedroom & Kids Room Concepts, selecting premium timber, veneer, and marbles.',
    features: [
      'Tailored color schemes aligned with Indian homes',
      'Modular Kitchen & Wardrobe design suggestions',
      'Marble, granite, walnut, and luxury fabric curation',
      'Premium moodboard digital checklist delivered',
      'Priority scheduling for bespoke execution'
    ],
    highlight: true
  },
  {
    id: 'c3',
    name: 'Turnkey Luxury Masterplan',
    price: 250,
    duration: '180 Minutes',
    description: 'A comprehensive, end-to-end design formulation. Best suited for clients seeking Turnkey Interior Execution with complete site hand-holding.',
    features: [
      'End-to-end complete home interior spatial blueprint',
      'Plastering, civil layout & electrical location guidance',
      'Vastu-friendly orientation & spatial clearance advice',
      'Turnkey vendor integration budget projection list',
      'Fee 100% redeemable against turnkey execution retainer'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    author: 'Caroline & Richard V.',
    role: 'Homeowners',
    project: 'Aesthetic Living Room Sanctuary',
    quote: 'Monica transformed our home. Her spacing ideas and wall finishes are beautiful and make the whole room feel incredibly welcoming.',
    rating: 5
  },
  {
    id: 't2',
    author: 'Hale & Mercer Hospitality',
    role: 'Creative Directors',
    project: 'Elegant Boutique Lounge',
    quote: 'Her placement of materials is excellent. The beautiful contrast of flooring, green velvet seating, and curved wall arches made our space beloved by everyone.',
    rating: 5
  },
  {
    id: 't3',
    author: 'Elena Rostova',
    role: 'Art Collector',
    project: 'The Peaceful Bedroom Sanctuary',
    quote: 'A masterpiece of understated comfort. Her attention to warm lighting and soft textures created a peaceful bedroom where we can relax away from the busy city.',
    rating: 5
  }
];

export const MOODBOARD_OPTIONS = {
  timbers: [
    { id: 't-espresso', name: 'Premium Dark Charcoal Oak', color: '#1F1714', texture: 'Espresso grain with matte texture' },
    { id: 't-honey', name: 'Natural Light Oak wood', color: '#E1C9B3', texture: 'Light, sandblasted open grain' },
    { id: 't-walnut', name: 'Custom Walnut veneer', color: '#4A3326', texture: 'Deep warm amber tones with cathedral swirls' }
  ],
  marbles: [
    { id: 'm-calacatta', name: 'White Polish Italian Marble', color: '#F1EFEA', pattern: 'Bold charcoal gray veins on creamy backing' },
    { id: 'm-travertine', name: 'Warm Beige Travertine Stone', color: '#E7DFD4', pattern: 'Porous linear warm volcanic beige texture' },
    { id: 'm-nero', name: 'Black Marquina Marble', color: '#1C1C1D', pattern: 'Stark white calcite lightning cracks on pitch black' }
  ],
  fabrics: [
    { id: 'f-boucle', name: 'Soft Ivory Boucle Craft Fabric', color: '#F6F4F0', style: 'Highly coiled heavy nubby linen wool' },
    { id: 'f-rust', name: 'Terracotta Soft Velvet Fabric', color: '#A05C3F', style: 'Intense rich short-pile silky velvet' },
    { id: 'f-navy', name: 'Premium Deep Navy Linen Fabric', color: '#1B243B', style: 'Crisp rustic pure linen structure' }
  ],
  metals: [
    { id: 'me-brass', name: 'Premium Golden Brass Finishes', color: '#C5A059', style: 'Gently brushed golden warm hue that patinas' },
    { id: 'me-bronze', name: 'Rustic Dark Blackened Bronze', color: '#2B2521', style: 'Deep mineral iron casting' }
  ]
};

export const QUIZ_QUESTIONS: DesignQuizQuestion[] = [
  {
    id: 1,
    question: 'Select the material composition that immediately catches your eye:',
    options: [
      { id: 'q1-a', text: 'Textured chalky plaster, soft white boucle, light travertine', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400', style: 'Aesthetic Minimalist' },
      { id: 'q1-b', text: 'Rich high-vein marble, polished unlacquered brass, dark walnut', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400', style: 'Modern Classic' },
      { id: 'q1-c', text: 'Warm honey oak, raw linen curtains, soft earth pottery', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=400', style: 'Warm Contemporary' },
      { id: 'q1-d', text: 'Sage green velvet, poured terrazzo, curved archways, indoor plants', image: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=400', style: 'Biophilic Luxe' }
    ]
  },
  {
    id: 2,
    question: 'How do you want your space to behave emotionally?',
    options: [
      { id: 'q2-a', text: 'A completely silent gallery, free of clutter and visual noise', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400', style: 'Aesthetic Minimalist' },
      { id: 'q2-b', text: 'A dramatic, sophisticated backdrop designed for luxury hosting', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400', style: 'Modern Classic' },
      { id: 'q2-c', text: 'A deeply personal, cocoon-like refuge with warm, soft textures', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=400', style: 'Warm Contemporary' },
      { id: 'q2-d', text: 'An organic escape connected to nature, sunlight, and flowing forms', image: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=400', style: 'Biophilic Luxe' }
    ]
  },
  {
    id: 3,
    question: 'Select the window scenario that represents your dream lighting:',
    options: [
      { id: 'q3-a', text: 'Massive minimalist industrial black frames, clean shadows', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400', style: 'Aesthetic Minimalist' },
      { id: 'q3-b', text: 'Double-glazed classical moldings with soft sheer curtains', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400', style: 'Modern Classic' },
      { id: 'q3-c', text: 'A sun-drenched architectural bay window with custom wood shutters', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400', style: 'Warm Contemporary' },
      { id: 'q3-d', text: 'Double-height glass walls looking out to a private lush garden courtyard', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400', style: 'Biophilic Luxe' }
    ]
  }
];
