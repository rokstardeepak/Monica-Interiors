/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Layers, 
  Sun, 
  Moon, 
  Compass, 
  Home, 
  Sliders 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Design options for our modern living room simulator
const WALL_OPTIONS = [
  { id: 'slate', name: 'Midnight Slate', color: '#2B353E', styleName: 'Classic Panel Molding', description: 'Deep, moody blue-grey backing that adds immense dimension.' },
  { id: 'clay', name: 'Warm Terracotta', color: '#D28E73', styleName: 'Smooth Plaster', description: 'Rustic clay tone with cozy thermal warmth and grounding texture.' },
  { id: 'sage', name: 'Pistachio Sage', color: '#CCD6C9', styleName: 'Minimalist Arc Arch', description: 'Fresh, organic earthy green that feels serene and breathable.' },
  { id: 'greige', name: 'Grounded Sand', color: '#E5DFD5', styleName: 'Double Arch Inlays', description: 'Elegant, modern soft slate-cream which expands smaller spaces beautifully.' },
  { id: 'fluted', name: 'Fluted Oak', color: '#D4C3A3', styleName: 'Vertical Timber Slat Wall', description: 'Luxurious architectural vertical wood panelling for rich textures.' }
];

const SOFA_OPTIONS = [
  { id: 'boucle', name: 'Cream Bouclé', color: '#F6F2FF', displayColor: '#F5F2EC', darkColor: '#DCD6C7', lightColor: '#FDFBF7', description: 'Cozy, highly tactile looped loop wool that defines quiet luxury.' },
  { id: 'forest', name: 'Forest Velvet', color: '#1B3C2D', displayColor: '#1B3C2D', darkColor: '#0E2118', lightColor: '#2B5E45', description: 'Rich, luxurious jewel-toned velvet with spectacular reflection.' },
  { id: 'amber', name: 'Ochre Linen', color: '#C97746', displayColor: '#C97746', darkColor: '#A15124', lightColor: '#E69C6F', description: 'Tuscan burnt orange flat weave that adds vibrant Mediterranean energy.' },
  { id: 'charcoal', name: 'Dapple Charcoal', color: '#444444', displayColor: '#444444', darkColor: '#282828', lightColor: '#636363', description: 'Sophisticated heathered grey linen with durable architectural character.' },
  { id: 'linen', name: 'Powder Blue Felt', color: '#B0C2CD', displayColor: '#A8BDC9', darkColor: '#7F9BA9', lightColor: '#C5D6E0', description: 'Soft, airy wool felt that diffuses afternoon Mumbai light peacefully.' }
];

const TABLE_OPTIONS = [
  { id: 'travertine', name: 'Royal Travertine', color: '#E8E3D8', baseColor: '#D8CEBF', description: 'Porous limestone plinth containing warm, fossilized organic patterns.' },
  { id: 'smokey', name: 'Smoked Oak', color: '#3E3430', baseColor: '#2C2320', description: 'Dark, sand-blasted premium timber highlighting rich fibrous grain lines.' },
  { id: 'black', name: 'Nero Marquina', color: '#1F1F1F', baseColor: '#131313', description: 'Bold black Spanish marble detailed with dramatic crystalline white veins.' },
  { id: 'brass', name: 'Brushed Brass', color: '#D3B173', baseColor: '#B09156', description: 'Fine architectural golden metallic plinth casting warm studio glares.' }
];

const RUG_OPTIONS = [
  { id: 'jute', name: 'Chevron Jute', color: '#DECDB5', patternColor: '#CBB295', patternType: 'chevron', description: 'Hand-woven desert plant fiber adding natural, gritty organic texture.' },
  { id: 'mint', name: 'Moss Meadow Blend', color: '#7E8B7F', patternColor: '#5C6C5E', patternType: 'organic', description: 'Low-pile blended wool mimicking soft forest floor patterns.' },
  { id: 'cream', name: 'Nordic Greige Shag', color: '#EBE6DE', patternColor: '#D7CEC4', patternType: 'minimalist', description: 'Ultra-plush Scandinavian off-white base with simple charcoal accent traces.' },
  { id: 'vintage', name: 'Rust Medallion', color: '#BF8973', patternColor: '#965D46', patternType: 'vintage', description: 'Faded antique orange wash bringing history and depth to modern setups.' }
];

const CUSHION_OPTIONS = [
  { name: 'Contrast Ochre', color: '#C97746' },
  { name: 'Earthy Olive', color: '#5A6352' },
  { name: 'Warm Charcoal', color: '#3D3634' },
  { name: 'Desert Coral', color: '#D28E73' },
  { name: 'Royal Ivory', color: '#F1ECE2' }
];

export default function MoodBoardSimulator() {
  const [activeTab, setActiveTab] = useState<'wall' | 'sofa' | 'table' | 'rug'>('sofa');
  const [selectedWall, setSelectedWall] = useState(WALL_OPTIONS[3]); // Sand default
  const [selectedSofa, setSelectedSofa] = useState(SOFA_OPTIONS[0]); // Bouclé default
  const [selectedTable, setSelectedTable] = useState(TABLE_OPTIONS[0]); // Travertine default
  const [selectedRug, setSelectedRug] = useState(RUG_OPTIONS[0]); // Chevron Jute
  const [selectedCushion, setSelectedCushion] = useState(CUSHION_OPTIONS[1]); // Earthy Olive
  const [isLampOn, setIsLampOn] = useState(false);

  // Dynamic feedback matches the design mood
  const getPairingScoreAndAdvice = () => {
    const wallId = selectedWall.id;
    const sofaId = selectedSofa.id;
    const tableId = selectedTable.id;

    if (wallId === 'slate' && sofaId === 'charcoal' && tableId === 'brass') {
      return {
        badge: "Moody Atelier Masterpiece",
        rating: "Perfect Contrast Match",
        advice: "A striking dramatic pairing. Deep Midnight Slate wall panels form an impressive dark envelope, with Brushed Brass reflecting warm ambient metal beams."
      };
    }
    if (wallId === 'greige' && sofaId === 'boucle' && tableId === 'travertine') {
      return {
        badge: "Warm Serene Sanctuary",
        rating: "9.8 Designer Harmony Score",
        advice: "Soft grounded greige plaster meets high-tactile cream bouclé and organic limestone travertine. An absolute quiet-luxury statement suited for gentle morning views."
      };
    }
    if (wallId === 'sage' && sofaId === 'forest' && tableId === 'smokey') {
      return {
        badge: "Biophilic Earth Harmony",
        rating: "10/10 Natural Balance",
        advice: "Coordinating Pistachio Sage with deep Forest Velvet and dark Smoked Oak creates a highly textured woodland cocoon. Absolute peace and spatial relaxation."
      };
    }
    if (wallId === 'clay' && sofaId === 'amber' && tableId === 'black') {
      return {
        badge: "Terracotta Earth & Stone",
        rating: "Earthy Warmth Contrast",
        advice: "A highly grounding combo. Saturated clay mud and Mediterranean ochre linen are structured beautifully by the striking physical weight of hand-rubbed Black Marble."
      };
    }

    return {
      badge: "Custom Curated Synergy",
      rating: "Balanced Spatial Rhythm",
      advice: "Your bespoke mix creates a beautiful balance of textures. By combining different material densities, you trigger high visual rhythm while keeping things incredibly cohesive."
    };
  };

  const adviceSpecs = getPairingScoreAndAdvice();

  const renderRecipeSpecs = () => (
    <div className="bg-white border border-[#3C2A21]/12 p-4 md:p-5 rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center pb-3 border-b border-[#3C2A21]/10">
        <span className="font-sans text-[11px] font-semibold text-[#3C2A21] tracking-wider uppercase flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-[#BFA15F]" />
          Interactive Recipe Specs:
        </span>
        <span className="font-sans text-[10px] text-[#BFA15F] font-bold uppercase py-0.5 px-2 bg-[#BFA15F]/10 rounded">
          Active Combination
        </span>
      </div>

      {/* Speclist grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans text-[#6B625E]">
        <div className="border-r border-[#3C2A21]/10 pr-2 text-left">
          <span className="font-semibold block text-[#3C2A21] text-[10px] uppercase font-mono tracking-wider">Wall Finish</span>
          <span className="font-light">{selectedWall.name}</span>
          <span className="text-[10px] text-stone-400 block mt-0.5 italic">{selectedWall.styleName}</span>
        </div>
        <div className="border-r border-[#3C2A21]/10 pr-2 sm:pl-2 text-left">
          <span className="font-semibold block text-[#3C2A21] text-[10px] uppercase font-mono tracking-wider">Sofa fabric</span>
          <span className="font-light">{selectedSofa.name}</span>
          <span className="text-[10px] text-stone-400 block mt-0.5 italic">Upholstery</span>
        </div>
        <div className="border-r border-[#3C2A21]/10 pr-2 sm:pl-2 text-left">
          <span className="font-semibold block text-[#3C2A21] text-[10px] uppercase font-mono tracking-wider">Coffee Table</span>
          <span className="font-light">{selectedTable.name}</span>
          <span className="text-[10px] text-stone-400 block mt-0.5 italic">Sculptural Base</span>
        </div>
        <div className="sm:pl-2 text-left">
          <span className="font-semibold block text-[#3C2A21] text-[10px] uppercase font-mono tracking-wider">Weaved Rug</span>
          <span className="font-light">{selectedRug.name}</span>
          <span className="text-[10px] text-stone-400 block mt-0.5 italic">Floor Covering</span>
        </div>
      </div>

      {/* DYNAMIC DESIGN STRATEGIC OPINION VIEWPORT */}
      <div className="bg-[#FAF8F5] border border-[#BFA15F]/15 p-4.5 rounded-lg flex gap-3 items-start transition-all duration-300 text-left">
        <Sparkles className="w-5 h-5 text-[#BFA15F] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-sans text-[11px] font-bold text-[#3C2A21] block tracking-wide uppercase mb-0.5">
            {adviceSpecs.badge} &bull; {adviceSpecs.rating}
          </span>
          <p className="font-sans text-[11.5px] text-[#6B625E] font-light leading-relaxed">
            {adviceSpecs.advice}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FAF8F5] border border-[#3C2A21]/10 rounded-lg p-6 md:p-8 shadow-sm flex flex-col gap-8" id="moodboard-simulator-container">
      
      {/* SECTION HEADINGS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#BFA15F] uppercase block mb-1">
            Studio Experience &bull; Visual Planner
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-[#3C2A21] tracking-tight leading-snug">
            Interactive Moodboard Curations
          </h3>
          <p className="font-sans text-sm text-[#6B625E] font-light mt-1.5 max-w-2xl">
            Unleash your creativity. Tap the hotspots on the modern living room illustration below, or toggle the material controls to custom-curate your ultimate Mumbai studio layout in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-[#BFA15F]/20 px-3.5 py-1.5 rounded-lg bg-white shadow-sm font-sans text-xs font-semibold text-[#3C2A21]">
          <Home className="w-4 h-4 text-[#BFA15F]" />
          <span>Interactive Living Room</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: PRIMARY INTERACTIVE RENDER CANVAS (7/12 width) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          <div className="relative bg-stone-100 border border-[#3C2A21]/12 rounded-xl shadow-md overflow-hidden aspect-[4/3] sm:aspect-[1.5/1] xl:aspect-[1.6/1]" id="interactive-render-canvas">
            
            {/* Ambient Lighting Background Sky Glow (visible behind arches or plaster) */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-stone-200/40 to-transparent" />

            {/* REAL-TIME INTERACTIVE SVG ROOM GRAPHICS */}
            <svg 
              viewBox="0 0 800 500" 
              className="w-full h-full object-cover select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Definitions for Gradients, Patterns, Glows */}
              <defs>
                {/* 1. Yellow spotlight light cone effect */}
                <linearGradient id="lampSpotlightBeam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFF2CC" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#FFE08F" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FFE08F" stopOpacity="0" />
                </linearGradient>

                {/* 2. Soft shadow fill for sofa base */}
                <radialGradient id="sofaDropShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1E1714" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#1E1714" stopOpacity="0" />
                </radialGradient>

                {/* 3. Soft shadow for coffee table plinth */}
                <radialGradient id="tableDropShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1E1714" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1E1714" stopOpacity="0" />
                </radialGradient>

                {/* 4. Canvas Art painting gradient */}
                <linearGradient id="artPaintingGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={selectedSofa.lightColor} />
                  <stop offset="50%" stopColor={selectedWall.color} />
                  <stop offset="100%" stopColor={selectedCushion.color} />
                </linearGradient>

                {/* 5. Linear light overlay for travertine marble columns */}
                <linearGradient id="travertineVeining" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="50%" stopColor="rgba(0,0,0,0.05)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
                </linearGradient>
              </defs>

              {/* SECTION A: THE WALL BACKGROUND */}
              <rect 
                x="0" 
                y="0" 
                width="800" 
                height="340" 
                fill={selectedWall.color} 
                className="transition-all duration-700" 
              />

              {/* Structural elements on the wall depending on Wall style selected */}
              {selectedWall.id === 'fluted' ? (
                // Wood Slats loop across full width
                <g opacity="0.16">
                  {Array.from({ length: 80 }).map((_, i) => (
                    <line 
                      key={i}
                      x1={i * 10} 
                      y1="0" 
                      x2={i * 10} 
                      y2="340" 
                      stroke="#000000" 
                      strokeWidth="2.5" 
                    />
                  ))}
                  {Array.from({ length: 80 }).map((_, i) => (
                    <line 
                      key={i}
                      x1={i * 10 + 4} 
                      y1="0" 
                      x2={i * 10 + 4} 
                      y2="340" 
                      stroke="#FFFFFF" 
                      strokeWidth="1.2" 
                    />
                  ))}
                </g>
              ) : selectedWall.id === 'sage' ? (
                // Minimalist Arc Trim
                <g opacity="0.2" className="text-white">
                  <path d="M 200,340 A 150,150 0 0,1 500,340 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                  <path d="M 240,340 A 110,110 0 0,1 460,340 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M 520,340 L 520,160 A 80,80 0 0,1 680,160 L 680,340" fill="none" stroke="currentColor" strokeWidth="2" />
                </g>
              ) : selectedWall.id === 'greige' ? (
                // Classical elegant plaster wall moldings
                <g opacity="0.22" className="text-white">
                  {/* Left arched panel */}
                  <rect x="70" y="50" width="160" height="250" rx="80" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="80" y="60" width="140" height="230" rx="70" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  {/* Central arched panel */}
                  <rect x="320" y="30" width="160" height="270" rx="80" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="330" y="40" width="140" height="250" rx="70" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  {/* Right arched panel */}
                  <rect x="570" y="50" width="160" height="250" rx="80" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="580" y="60" width="140" height="230" rx="70" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </g>
              ) : (
                // Standard modern architectural molding squares (Midnight / Clay)
                <g opacity="0.14" className="text-white">
                  <rect x="60" y="40" width="200" height="260" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="75" y="55" width="170" height="230" fill="none" stroke="currentColor" strokeWidth="1" />
                  <rect x="290" y="40" width="220" height="260" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="305" y="55" width="190" height="230" fill="none" stroke="currentColor" strokeWidth="1" />
                  <rect x="540" y="40" width="200" height="260" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="555" y="55" width="170" height="230" fill="none" stroke="currentColor" strokeWidth="1" />
                </g>
              )}

              {/* SECTION B: FLOOR PLATES */}
              {/* Natural wooden floor perspective polygon */}
              <polygon points="0,340 800,340 800,500 0,500" fill="#EADCC9" />
              
              {/* Floor wood planks joints lines */}
              <g opacity="0.25" stroke="#CDAE89" strokeWidth="1">
                <line x1="0" y1="365" x2="800" y2="365" />
                <line x1="0" y1="395" x2="800" y2="395" />
                <line x1="0" y1="432" x2="800" y2="432" />
                <line x1="0" y1="465" x2="800" y2="465" />
                {/* Perspective diagonal lines representing modern floor planks */}
                <line x1="120" y1="340" x2="40" y2="500" />
                <line x1="280" y1="340" x2="220" y2="500" />
                <line x1="440" y1="340" x2="400" y2="500" />
                <line x1="600" y1="340" x2="580" y2="500" />
                <line x1="720" y1="340" x2="750" y2="500" />
              </g>

              {/* Wall-Floor Skirting board divider */}
              <rect x="0" y="334" width="800" height="8" fill="#FBF8F3" opacity="0.9" />
              <line x1="0" y1="334" x2="800" y2="334" stroke="#DCD6C7" strokeWidth="1.2" />

              {/* MODERN ARCHITECTURAL PAINTING ON THE WALL */}
              <g id="hotspot-art-frame">
                {/* Elegant floating canvas drop shadow */}
                <rect x="333" y="63" width="134" height="154" fill="#000000" opacity="0.2" filter="blur(4px)" rx="1" />
                {/* Painting Gold Frame */}
                <rect x="330" y="60" width="140" height="160" fill="none" stroke="#D3B173" strokeWidth="3" rx="1" />
                {/* White mat board border */}
                <rect x="333" y="63" width="134" height="154" fill="#FBF9F6" />
                {/* Abstract dynamic canvas print inside that adapts palette shades */}
                <rect x="345" y="75" width="110" height="130" fill="url(#artPaintingGrad)" opacity="0.9" />
                {/* Minimalism brush lines on active art */}
                <path d="M 360,190 Q 380,105 400,140 T 440,110" stroke="#FAF8F5" strokeWidth="4.5" fill="none" strokeLinecap="round" opacity="0.75" />
                <circle cx="410" cy="110" r="14" fill="#D3B173" opacity="0.8" />
                <circle cx="370" cy="160" r="8" fill="rgba(60,42,33,0.35)" />
              </g>

              {/* SECTION C: THE TEXTILE AREA RUG */}
              {/* Rug shadow underlying */}
              <ellipse cx="400" cy="435" rx="280" ry="50" fill="url(#sofaDropShadow)" opacity="0.85" />
              
              {/* The dynamic rug overlay */}
              <ellipse 
                cx="400" 
                cy="435" 
                rx="270" 
                ry="46" 
                fill={selectedRug.color} 
                className="transition-all duration-700 stroke-white/20" 
                strokeWidth="1"
              />

              {/* Rug details depends on Pattern toggled */}
              {selectedRug.patternType === 'chevron' ? (
                // Elegant geometric chevron lines on Rug
                <g opacity="0.14" stroke="#33241C" strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <path d="M 160,435 L 200,410 L 240,435 L 280,410 L 320,435 L 360,410 L 400,435 L 440,410 L 480,435 L 520,410 L 560,435 L 600,410 L 640,435" />
                  <path d="M 170,445 L 210,420 L 250,445 L 290,420 L 330,445 L 370,420 L 410,445 L 450,420 L 490,445 L 530,420 L 570,445 L 610,420 L 650,445" />
                </g>
              ) : selectedRug.patternType === 'organic' ? (
                // Organic ring blobs representing soft meadows wool textures
                <g opacity="0.18" fill="none" stroke="#FFFFFF" strokeWidth="1.8">
                  <ellipse cx="320" cy="430" rx="40" ry="12" />
                  <ellipse cx="480" cy="440" rx="55" ry="16" />
                  <ellipse cx="380" cy="420" rx="30" ry="8" />
                  <path d="M 210,430 C 230,422 260,438 280,428" />
                  <path d="M 520,435 C 550,445 580,425 610,435" />
                </g>
              ) : selectedRug.patternType === 'minimalist' ? (
                // Modern abstract grid lines
                <g opacity="0.12" stroke="#000000" strokeWidth="1.5" fill="none">
                  {/* Diagonal geometric cross grids */}
                  <line x1="150" y1="435" x2="650" y2="435" />
                  <line x1="200" y1="410" x2="600" y2="460" />
                  <line x1="240" y1="460" x2="560" y2="410" />
                </g>
              ) : (
                // Vintage distress details
                <g opacity="0.18" fill="none" stroke="#D49A80" strokeWidth="1">
                  <ellipse cx="400" cy="435" rx="100" ry="24" strokeWidth="2.5" />
                  <circle cx="400" cy="435" r="8" fill="#D49A80" />
                  <path d="M 220,435 T 260,420 T 300,435" />
                  <path d="M 500,435 T 540,420 T 580,435" />
                </g>
              )}

              {/* FIDDLE LEAF FIG HOUSEPLANT */}
              <g id="decor-houseplant">
                {/* Shadow */}
                <ellipse cx="680" cy="415" rx="20" ry="5" fill="#1E1714" opacity="0.15" />
                {/* Terracotta Pot */}
                <polygon points="665,370 695,370 690,415 670,415" fill="#CF8767" stroke="#905035" strokeWidth="1.5" />
                {/* Pot Rim */}
                <rect x="662" y="367" width="36" height="5" rx="1" fill="#DF9677" stroke="#905035" strokeWidth="1" />
                {/* Plant stem structure */}
                <path d="M 680,368 Q 682,290 680,180" fill="none" stroke="#66554F" strokeWidth="5" strokeLinecap="round" />
                <path d="M 681,280 Q 700,250 710,230" fill="none" stroke="#68554F" strokeWidth="3" />
                <path d="M 680,240 Q 660,210 650,195" fill="none" stroke="#68554F" strokeWidth="3" />
                
                {/* Elegant layered broad leaf scales */}
                {/* Under/Deep Shadows */}
                <path d="M 680,180 Q 705,150 720,165 Q 700,195 680,180" fill="#193822" />
                <path d="M 680,200 Q 652,180 642,192 Q 658,215 680,200" fill="#152F1C" />
                
                <path d="M 680,210 Q 712,185 722,210 Q 695,235 680,210" fill="#254F31" />
                <path d="M 682,250 Q 718,225 724,248 Q 698,272 682,250" fill="#2E5A39" />
                
                <path d="M 680,240 Q 650,220 638,245 Q 655,268 680,240" fill="#1F4229" />
                <path d="M 681,290 Q 648,272 642,298 Q 659,320 681,290" fill="#285233" />
                
                <path d="M 680,280 Q 720,265 722,290 Q 698,312 680,280" fill="#31633F" />
                <path d="M 680,315 Q 715,300 718,328 Q 698,345 680,315" fill="#2E5C3B" />
                <path d="M 680,335 Q 650,320 645,348 Q 662,365 680,335" fill="#1F4229" />
              </g>

              {/* SECTION D: THE PREMIUM SOFA */}
              <g id="composition-sofa" className="transition-all duration-700">
                {/* Primary overall floor shadow wrapper */}
                <ellipse cx="400" cy="342" rx="220" ry="18" fill="url(#sofaDropShadow)" opacity="0.95" />

                {/* SOFA SLENDER OAK WOODEN LEGS */}
                {/* Back Left Leg */}
                <line x1="230" y1="318" x2="222" y2="348" stroke="#2B1D17" strokeWidth="6.5" strokeLinecap="round" />
                {/* Back Right Leg */}
                <line x1="570" y1="318" x2="578" y2="348" stroke="#2B1D17" strokeWidth="6.5" strokeLinecap="round" />
                {/* Front Left Angle Leg */}
                <line x1="210" y1="318" x2="198" y2="352" stroke="#3E2B23" strokeWidth="8" strokeLinecap="round" strokeLinejoin="miter" />
                <line x1="210" y1="318" x2="198" y2="352" stroke="#B09156" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" /> {/* brass tip */}
                {/* Front Right Angle Leg */}
                <line x1="590" y1="318" x2="602" y2="352" stroke="#3E2B23" strokeWidth="8" strokeLinecap="round" />
                <line x1="590" y1="318" x2="602" y2="352" stroke="#B09156" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" /> {/* brass tip */}

                {/* Bottom Frame Rail */}
                <rect x="187" y="312" width="426" height="13" rx="4.5" fill="#34251F" stroke="#231713" strokeWidth="0.8" />

                {/* THE CHIC SOFA BODY CONTOURS */}
                {/* Sofa Core Back Panel Shell */}
                <rect 
                  x="187" 
                  y="218" 
                  width="426" 
                  height="94" 
                  rx="30" 
                  fill={selectedSofa.displayColor} 
                  className="transition-all duration-700" 
                />

                {/* Rounded Inner Back Cushions (Split back cushions) */}
                {/* Cushions have 3D bevel colors */}
                {/* Left cushion */}
                <rect 
                  x="202" 
                  y="226" 
                  width="194" 
                  height="68" 
                  rx="18" 
                  fill={selectedSofa.lightColor} 
                  className="transition-all duration-700" 
                />
                {/* Right cushion */}
                <rect 
                  x="404" 
                  y="226" 
                  width="194" 
                  height="68" 
                  rx="18" 
                  fill={selectedSofa.lightColor} 
                  className="transition-all duration-700" 
                />

                {/* Cozy Left side Roll-Arm Cushion */}
                <rect 
                  x="176" 
                  y="256" 
                  width="38" 
                  height="60" 
                  rx="15" 
                  fill={selectedSofa.darkColor} 
                  className="transition-all duration-700" 
                />
                
                {/* Cozy Right side Roll-Arm Cushion */}
                <rect 
                  x="586" 
                  y="256" 
                  width="38" 
                  height="60" 
                  rx="15" 
                  fill={selectedSofa.darkColor} 
                  className="transition-all duration-700" 
                />

                {/* Thick Left/Right Seat Cushions overlay (Fat squishy base) */}
                {/* Left Seat pad */}
                <rect 
                  x="204" 
                  y="284" 
                  width="194" 
                  height="34" 
                  rx="11" 
                  fill={selectedSofa.displayColor} 
                  className="transition-all duration-700" 
                />
                {/* Right Seat pad */}
                <rect 
                  x="402" 
                  y="284" 
                  width="194" 
                  height="34" 
                  rx="11" 
                  fill={selectedSofa.displayColor} 
                  className="transition-all duration-700" 
                />

                {/* TWO COZY ACCENT PILLOWS / CUSHIONS */}
                {/* Left Pillow (Clicking customizes cushion) */}
                <rect 
                  x="215" 
                  y="266" 
                  width="44" 
                  height="44" 
                  rx="12" 
                  fill={selectedCushion.color} 
                  transform="rotate(-15, 237, 288)" 
                  className="transition-all duration-500 cursor-pointer shadow hover:brightness-110"
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="0.5"
                />
                {/* Accent pattern weave on cushion 1 */}
                <line x1="222" y1="270" x2="252" y2="300" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" transform="rotate(-15, 237, 288)" pointerEvents="none" />
                <line x1="250" y1="270" x2="220" y2="300" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" transform="rotate(-15, 237, 288)" pointerEvents="none" />

                {/* Right Pillow */}
                <rect 
                  x="542" 
                  y="268" 
                  width="42" 
                  height="42" 
                  rx="11" 
                  fill={selectedCushion.color} 
                  transform="rotate(14, 563, 289)" 
                  className="transition-all duration-500 shadow-sm border border-black/5"
                  pointerEvents="none"
                />
                <circle cx="563" cy="289" r="3.2" fill="#CF9D71" transform="rotate(14, 563, 289)" /> {/* button detail */}

              </g>

              {/* SECTION E: THE COFFEE TABLE */}
              <g id="composition-table" className="transition-all duration-700">
                {/* Underlying Table Shadow */}
                <ellipse cx="400" cy="428" rx="112" ry="18" fill="url(#tableDropShadow)" opacity="0.9" />

                {/* Table Solid Architectural Plinth Base */}
                <g fill={selectedTable.baseColor} className="transition-all duration-700">
                  <path d="M 334,395 C 334,395 330,424 350,424 C 370,424 430,424 450,424 C 470,424 466,395 466,395 Z" />
                  {/* Subtle 3D stone texture details for bases */}
                  <path d="M 353,396 L 358,421 M 447,396 L 442,421" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                </g>

                {/* Table Thick Overhanging Flat Slab Plate */}
                <ellipse 
                  cx="400" 
                  cy="394" 
                  rx="108" 
                  ry="18" 
                  fill={selectedTable.color} 
                  className="transition-all duration-700 stroke-[#3C2A21]/15" 
                  strokeWidth="1.2"
                />

                {/* Beautiful marble white vein cracks loop (only rendered on Black Nero option) */}
                {selectedTable.id === 'black' && (
                  <g stroke="#FFFFFF" opacity="0.4" strokeWidth="1" fill="none">
                    <path d="M 320,392 Q 360,398 420,390" />
                    <path d="M 370,394 Q 390,390 440,396" />
                    <path d="M 350,396 L 358,390" />
                    <path d="M 444,391 Q 458,388 472,393" />
                  </g>
                )}

                {/* Travertine porous highlights */}
                {selectedTable.id === 'travertine' && (
                  <g stroke="#CDBEB0" opacity="0.32" strokeWidth="2.5" fill="none">
                    <line x1="330" y1="395" x2="335" y2="395" />
                    <line x1="375" y1="392" x2="384" y2="392" />
                    <line x1="420" y1="396" x2="435" y2="396" />
                    <line x1="465" y1="393" x2="472" y2="393" />
                  </g>
                )}

                {/* Elegant gold plate shine on brass */}
                {selectedTable.id === 'brass' && (
                  <ellipse cx="400" cy="390" rx="98" ry="12" fill="none" stroke="#FFE9BE" strokeWidth="1" opacity="0.35" />
                )}

                {/* Beautiful Still-life Decor items on the Coffee table */}
                <g id="table-decor" className="pointer-events-none">
                  {/* Decorative modern ceramic vase */}
                  <path d="M 383,387 L 388,387 L 391,374 L 380,374 Z" fill="#F9F6F0" opacity="0.95" />
                  <ellipse cx="385" cy="374" rx="5.5" ry="2" fill="#E6DFC7" />
                  <ellipse cx="385.5" cy="387" rx="2.5" ry="1" fill="#131313" opacity="0.2" />
                  {/* Dry eucalyptus twig */}
                  <path d="M 385,373 Q 380,340 376,330" fill="none" stroke="#7E7260" strokeWidth="1.2" />
                  <circle cx="379" cy="358" r="4" fill="#999E91" opacity="0.8" />
                  <circle cx="375" cy="344" r="3.5" fill="#919989" opacity="0.8" />
                  <circle cx="377" cy="334" r="2.5" fill="#848D7C" opacity="0.8" />
                </g>
              </g>

              {/* AMBIENT SPOTLIGHT GLOW FLOOR LAMP */}
              <g id="decor-floor-lamp">
                {/* Lamp Bottom Plate on Floor */}
                <ellipse cx="140" cy="390" rx="22" ry="6.5" fill="#D3B173" stroke="#907038" strokeWidth="1.2" />
                <ellipse cx="140" cy="389" rx="19" ry="5" fill="#EADAA2" />

                {/* Infinite curved slender neck steel pole */}
                <path 
                  d="M 140,388 C 140,160 170,80 280,105" 
                  fill="none" 
                  stroke="#D3B173" 
                  strokeWidth="3.8" 
                  strokeLinecap="round" 
                />
                {/* Secondary reflective silver core */}
                <path 
                  d="M 140,388 C 140,160 170,80 280,105" 
                  fill="none" 
                  stroke="#FAF2CE" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  opacity="0.6"
                />

                {/* Bell-shaped Shade */}
                <path d="M 264,103 L 298,110 L 292,130 L 268,124 Z" fill="#D3B173" stroke="#876831" strokeWidth="1" />
                
                {/* Glowing Spotlight Overlay if Enabled */}
                {isLampOn && (
                  <g>
                    {/* Golden radiant light cone cone */}
                    <polygon points="280,120 120,490 680,490" fill="url(#lampSpotlightBeam)" opacity="0.38" className="pointer-events-none" />
                    {/* Glowing light bulb capsule */}
                    <circle cx="280" cy="118" r="5" fill="#FFFBEB" filter="blur(1.5px)" />
                    <circle cx="280" cy="118" r="1.5" fill="#FFFFFF" />
                  </g>
                )}
              </g>

              {/* PULSING HOTSPOTS TO SWAP ACTIVE PANEL TABS DIRECTLY */}
              {/* Hotspot 1: Wall Area */}
              <g 
                className="cursor-pointer group/spot transition-all duration-300"
                onClick={() => setActiveTab('wall')}
                id="hotspot-trigger-wall"
              >
                <circle cx="160" cy="100" r={activeTab === 'wall' ? "18" : "14"} fill="rgba(191,161,95,0.22)" className="animate-pulse" />
                <circle cx="160" cy="100" r="6" fill="#BFA15F" className="stroke-white stroke-[2] shadow-lg group-hover/spot:scale-125 duration-300" />
              </g>

              {/* Hotspot 2: Sofa Upholstery Area */}
              <g 
                className="cursor-pointer group/spot transition-all duration-300"
                onClick={() => setActiveTab('sofa')}
                id="hotspot-trigger-sofa"
              >
                <circle cx="400" cy="270" r={activeTab === 'sofa' ? "18" : "14"} fill="rgba(191,161,95,0.22)" className="animate-pulse" />
                <circle cx="400" cy="270" r="6" fill="#BFA15F" className="stroke-white stroke-[2] shadow-lg group-hover/spot:scale-125 duration-300" />
              </g>

              {/* Hotspot 3: Coffee Table Finish */}
              <g 
                className="cursor-pointer group/spot transition-all duration-300"
                onClick={() => setActiveTab('table')}
                id="hotspot-trigger-table"
              >
                <circle cx="480" cy="392" r={activeTab === 'table' ? "18" : "14"} fill="rgba(191,161,95,0.22)" className="animate-pulse" />
                <circle cx="480" cy="392" r="6" fill="#BFA15F" className="stroke-white stroke-[2] shadow-lg group-hover/spot:scale-125 duration-300" />
              </g>

              {/* Hotspot 4: Floor Carpet Section */}
              <g 
                className="cursor-pointer group/spot transition-all duration-300"
                onClick={() => setActiveTab('rug')}
                id="hotspot-trigger-rug"
              >
                <circle cx="280" cy="450" r={activeTab === 'rug' ? "18" : "14"} fill="rgba(191,161,95,0.22)" className="animate-pulse" />
                <circle cx="280" cy="450" r="6" fill="#BFA15F" className="stroke-white stroke-[2] shadow-lg group-hover/spot:scale-125 duration-300" />
              </g>

            </svg>

            {/* LIGHT SWITCH BUTTON FLOATING AT TOP-RIGHT - DESKTOP ONLY */}
            <div className="hidden sm:flex absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#3C2A21]/15 shadow-sm">
              <Sun className={`w-3.5 h-3.5 ${isLampOn ? 'text-amber-500 animate-spin-slow' : 'text-stone-400'}`} />
              <button 
                onClick={() => setIsLampOn(!isLampOn)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${isLampOn ? 'bg-[#BFA15F]' : 'bg-stone-300'}`}
                aria-label="Toggle Living Room Spotlight"
                id="lamp-spotlight-toggle"
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${isLampOn ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <span className="font-mono text-[9px] text-[#3C2A21] uppercase tracking-wider font-semibold">
                Spotlight
              </span>
            </div>

            {/* FLOATING TEXT NOTATION - ACTIVE TABS TRIGGER INDICATORS - DESKTOP ONLY */}
            <div className="hidden sm:flex absolute bottom-4 left-4 flex gap-1.5 bg-black/60 backdrop-blur-sm shadow px-2.5 py-1 rounded-md text-[9px] text-[#F3EFE9] font-mono tracking-wider items-center">
              <Compass className="w-3.5 h-3.5 text-[#BFA15F]" />
              <span>CLICK THE PULSING CIRCLES TO SHIFT FOCUS</span>
            </div>

          </div>

          {/* MOBILE CONTROLS & INFO BAR - ELEGANT INTEGRATED TOOLBAR FOR SMALL SCREENS */}
          <div className="sm:hidden flex flex-col gap-2 bg-white border border-[#3C2A21]/12 p-3 rounded-xl shadow-sm text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#6B625E] uppercase tracking-wider font-semibold">
                <Compass className="w-3.5 h-3.5 text-[#BFA15F]" />
                <span>Tap circles to focus layout</span>
              </div>
              
              <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#3C2A21]/10 px-2 px-1.5 py-1 rounded-md">
                <Sun className={`w-3.5 h-3.5 ${isLampOn ? 'text-amber-500 animate-spin-slow' : 'text-stone-400'}`} />
                <button 
                  onClick={() => setIsLampOn(!isLampOn)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${isLampOn ? 'bg-[#BFA15F]' : 'bg-stone-300'}`}
                  aria-label="Toggle Living Room Spotlight (Mobile)"
                  id="lamp-spotlight-toggle-mobile"
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${isLampOn ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className="font-mono text-[9px] text-[#3C2A21] uppercase tracking-wider font-semibold">
                  Spotlight
                </span>
              </div>
            </div>
          </div>

          {/* COLOR PALETTE RECIPE MATRIX SHADOW CARD */}
          <div className="hidden lg:block">
            {renderRecipeSpecs()}
          </div>

        </div>

        {/* RIGHT COLUMN: REFINED CONTROL BOARD WITH TAB CONTROLS (5/12 width) */}
        <div className="lg:col-span-5 flex flex-col gap-6" id="simulator-control-panel-wrapper">
          <div className="bg-white border border-[#3C2A21]/12 p-5 md:p-6 rounded-xl shadow-lg flex flex-col gap-6" id="simulator-control-panel">
          
          <div className="flex items-center justify-between border-b border-[#3C2A21]/10 pb-3">
            <span className="font-mono text-[10px] text-[#6B625E] uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Sliders className="w-4 h-4 text-[#BFA15F]" />
              Control Panel
            </span>
            <span className="font-mono text-[9px] bg-stone-100 text-[#3C2A21] px-2 py-0.5 rounded leading-none uppercase font-semibold">
              v1.5 Live
            </span>
          </div>

          {/* TAB HEADERS FOR SELECTABLE ROOM ELEMENTS */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-100 rounded-lg">
            {(['wall', 'sofa', 'table', 'rug'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 text-[11px] font-sans font-semibold uppercase tracking-wider rounded-md text-center transition-all ${
                    isActive 
                      ? 'bg-white text-[#3C2A21] shadow-sm' 
                      : 'text-stone-500 hover:text-[#3C2A21]'
                  }`}
                  id={`tab-header-${tab}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* TAB BODY INTERACTIVE OPTIONS DESCRIPTORS */}
          <div className="min-h-[250px] flex flex-col justify-between gap-6">
            
            {/* Active option list selection */}
            <div>
              <AnimatePresence mode="wait">
                {activeTab === 'wall' && (
                  <motion.div
                    key="wall-tab"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <span className="text-[11px] font-semibold font-mono text-[#D28E73] uppercase tracking-wider block mb-1">
                        Select Accent Wall Theme
                      </span>
                      <p className="text-xs text-[#6B625E] font-light leading-relaxed">
                        Customize the backdrop of the living room layout. Changing this updates both the wall plaster color and geometric panel molding styles automatically.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {WALL_OPTIONS.map((item) => {
                        const isSelected = selectedWall.id === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedWall(item)}
                            className={`p-3 text-left border rounded-lg transition-all flex items-center justify-between ${
                              isSelected 
                                ? 'border-[#3C2A21] bg-[#FAF8F5] ring-2 ring-[#3C2A21]/15 shadow-sm' 
                                : 'border-[#3C2A21]/10 bg-white hover:bg-stone-50'
                            }`}
                            id={`opt-wall-${item.id}`}
                          >
                            <div className="flex items-center gap-3">
                              <span 
                                className="w-5 h-5 rounded border border-black/10 flex-shrink-0 shadow-inner" 
                                style={{ backgroundColor: item.color }} 
                              />
                              <div>
                                <span className="font-sans text-xs font-semibold block text-[#3C2A21]">{item.name}</span>
                                <span className="text-[10px] text-stone-400 block">{item.styleName}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#BFA15F]" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'sofa' && (
                  <motion.div
                    key="sofa-tab"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <span className="text-[11px] font-semibold font-mono text-[#1B3C2D] uppercase tracking-wider block mb-1">
                        Select Sofa Fabric &amp; Weave
                      </span>
                      <p className="text-xs text-[#6B625E] font-light leading-relaxed">
                        Choose the primary focal point upholstery textile. Our selection comprises heavy organic weave wool, deep dense velvet pile, and light linen textures.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {SOFA_OPTIONS.map((item) => {
                        const isSelected = selectedSofa.id === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedSofa(item)}
                            className={`p-3 text-left border rounded-lg transition-all flex items-center justify-between ${
                              isSelected 
                                ? 'border-[#3C2A21] bg-[#FAF8F5] ring-2 ring-[#3C2A21]/15 shadow-sm' 
                                : 'border-[#3C2A21]/10 bg-white hover:bg-stone-50'
                            }`}
                            id={`opt-sofa-${item.id}`}
                          >
                            <div className="flex items-center gap-3">
                              <span 
                                className="w-5 h-5 rounded border border-black/10 flex-shrink-0 shadow-inner" 
                                style={{ backgroundColor: item.displayColor }} 
                              />
                              <div>
                                <span className="font-sans text-xs font-semibold block text-[#3C2A21]">{item.name}</span>
                                <span className="text-[10px] text-stone-400 block truncate max-w-[200px]">{item.description}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#BFA15F]" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* DECOR PILLOWS MINI COLOURED CHOSEN SELECTOR */}
                    <div className="border-t border-stone-100 pt-3 mt-1">
                      <span className="text-[10.5px] font-semibold text-[#3C2A21] block uppercase tracking-wider mb-2">
                        Customize Accent Pillow Color:
                      </span>
                      <div className="flex gap-2">
                        {CUSHION_OPTIONS.map((cust) => {
                          const isCustSelected = selectedCushion.name === cust.name;
                          return (
                            <button
                              key={cust.name}
                              onClick={() => setSelectedCushion(cust)}
                              className={`w-6 h-6 rounded-full border shadow-sm transition-all relative flex-shrink-0 select-none ${
                                isCustSelected 
                                  ? 'border-[#3C2A21] scale-110 ring-2 ring-[#BFA15F]/40' 
                                  : 'border-white hover:scale-105'
                              }`}
                              style={{ backgroundColor: cust.color }}
                              title={cust.name}
                              id={`opt-cushion-${cust.name.replace(/\s+/g, '-').toLowerCase()}`}
                            >
                              {isCustSelected && (
                                <span className="absolute inset-0 flex items-center justify-center text-white text-[9px] font-bold">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'table' && (
                  <motion.div
                    key="table-tab"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <span className="text-[11px] font-semibold font-mono text-[#D3B173] uppercase tracking-wider block mb-1">
                        Select Coffee Table Material
                      </span>
                      <p className="text-xs text-[#6B625E] font-light leading-relaxed">
                        Structure the foreground layout. Swap between coarse sand-blasted timber textures, polished spanish marbles, or solid un-lacquered metals.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {TABLE_OPTIONS.map((item) => {
                        const isSelected = selectedTable.id === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedTable(item)}
                            className={`p-3 text-left border rounded-lg transition-all flex items-center justify-between ${
                              isSelected 
                                ? 'border-[#3C2A21] bg-[#FAF8F5] ring-2 ring-[#3C2A21]/15 shadow-sm' 
                                : 'border-[#3C2A21]/10 bg-white hover:bg-stone-50'
                            }`}
                            id={`opt-table-${item.id}`}
                          >
                            <div className="flex items-center gap-3">
                              <span 
                                className="w-5 h-5 rounded border border-black/10 flex-shrink-0 shadow-inner" 
                                style={{ backgroundColor: item.color }} 
                              />
                              <div>
                                <span className="font-sans text-xs font-semibold block text-[#3C2A21]">{item.name}</span>
                                <span className="text-[10px] text-stone-400 block truncate max-w-[200px]">{item.description}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#BFA15F]" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'rug' && (
                  <motion.div
                    key="rug-tab"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <span className="text-[11px] font-semibold font-mono text-[#7E8B7F] uppercase tracking-wider block mb-1">
                        Select Area Rug Covering
                      </span>
                      <p className="text-xs text-[#6B625E] font-light leading-relaxed">
                        Tie the whole furniture composition together with elegant underlay textures. Ranging from minimal Jute paths to cozy dapple wool.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {RUG_OPTIONS.map((item) => {
                        const isSelected = selectedRug.id === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedRug(item)}
                            className={`p-3 text-left border rounded-lg transition-all flex items-center justify-between ${
                              isSelected 
                                ? 'border-[#3C2A21] bg-[#FAF8F5] ring-2 ring-[#3C2A21]/15 shadow-sm' 
                                : 'border-[#3C2A21]/10 bg-white hover:bg-stone-50'
                            }`}
                            id={`opt-rug-${item.id}`}
                          >
                            <div className="flex items-center gap-3">
                              <span 
                                className="w-5 h-5 rounded border border-black/10 flex-shrink-0 shadow-inner" 
                                style={{ backgroundColor: item.color }} 
                              />
                              <div>
                                <span className="font-sans text-xs font-semibold block text-[#3C2A21]">{item.name}</span>
                                <span className="text-[10px] text-stone-400 block truncate max-w-[200px]">{item.description}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#BFA15F]" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* STATIC FOOTER ACTION BUTTONS */}
            <div className="border-t border-stone-100 pt-4 flex gap-2">
              <button 
                onClick={() => {
                  // Reset all coordinates to standard elegant default layout
                  setSelectedWall(WALL_OPTIONS[3]); // sand
                  setSelectedSofa(SOFA_OPTIONS[0]); // cream
                  setSelectedTable(TABLE_OPTIONS[0]); // travertine
                  setSelectedRug(RUG_OPTIONS[0]); // jute
                  setSelectedCushion(CUSHION_OPTIONS[1]); // olive
                  setIsLampOn(true);
                  setActiveTab('sofa');
                }}
                className="flex-1 py-2.5 border border-[#3C2A21]/15 rounded-lg text-xs font-sans font-semibold text-[#6B625E] hover:bg-stone-100 transition-all font-mono tracking-wide"
                id="reset-simulator-btn"
              >
                Reset Layout
              </button>
              <button 
                onClick={() => {
                  // Prompt showing successful layout capture simulation
                  const mailMessage = `Hi Monica! I customized your Living Room Scene moodboard:\n- Accent Wall: ${selectedWall.name}\n- Sofa: ${selectedSofa.name}\n- Table: ${selectedTable.name}\n- Rug: ${selectedRug.name}\n- Cushion: ${selectedCushion.name}.\nLet's integrate this vibe into my home layout!`;
                  const encodedStr = encodeURIComponent(mailMessage);
                  window.open(`https://wa.me/919137062574?text=${encodedStr}`, '_blank');
                }}
                className="flex-2 py-2.5 bg-[#BFA15F] hover:bg-[#a6894c] text-white rounded-lg text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm uppercase tracking-wider"
                id="share-recipe-btn"
              >
                <Compass className="w-4 h-4" />
                Discuss Combination
              </button>
            </div>

          </div>

          {/* Close the simulator-control-panel div */}
          </div>

          {/* DYNAMIC RECIPE VIEW FOR MOBILE ONLY */}
          <div className="block lg:hidden">
            {renderRecipeSpecs()}
          </div>

        </div>

      </div>

    </div>
  );
}
