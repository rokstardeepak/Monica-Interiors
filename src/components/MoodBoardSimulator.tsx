/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MOODBOARD_OPTIONS } from '../data';
import { Layers, Palette, Sparkles, Check, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function MoodBoardSimulator() {
  const [selectedTimber, setSelectedTimber] = useState(MOODBOARD_OPTIONS.timbers[1]); // honeycomb blonde default
  const [selectedMarble, setSelectedMarble] = useState(MOODBOARD_OPTIONS.marbles[1]); // travertine default
  const [selectedFabric, setSelectedFabric] = useState(MOODBOARD_OPTIONS.fabrics[0]); // bouclé default
  const [selectedMetal, setSelectedMetal] = useState(MOODBOARD_OPTIONS.metals[0]);   // brass default

  return (
    <div className="bg-[#FAF8F5] border border-[#3C2A21]/10 rounded-lg p-6 md:p-8 shadow-sm flex flex-col gap-8" id="moodboard-simulator-container">
      
      {/* Headings */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#BFA15F] uppercase block mb-1">
            Studio Experience &bull; Material Mixer
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-[#3C2A21] tracking-tight leading-snug">
            Interactive Moodboard Curations
          </h3>
          <p className="font-sans text-sm text-[#6B625E] font-light mt-1.5 max-w-2xl">
            We hand-pick beautiful materials that match together. Mix and match premium woods, marbles, fabrics and metals below to view your custom style combination in real-time.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#BFA15F] font-mono border border-[#BFA15F]/20 px-3 py-1.5 rounded bg-white">
          <Palette className="w-4 h-4" />
          <span>Material Combos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Materials Control Board */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Section 1: Timbers */}
          <div>
            <span className="font-mono text-[10px] uppercase text-[#7F675B] tracking-widest font-semibold block mb-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F]" />
              Signature Premium Woods
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOODBOARD_OPTIONS.timbers.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedTimber(item)}
                  className={`p-3 relative text-left border rounded transition-all flex flex-col justify-between h-20 ${
                    selectedTimber.id === item.id 
                      ? 'border-[#3C2A21] bg-white ring-1 ring-[#3C2A21]' 
                      : 'border-[#3C2A21]/10 bg-white/50 hover:bg-white hover:border-[#3C2A21]/30'
                  }`}
                  id={`board-timber-${item.id}`}
                >
                  <span className="font-sans text-xs text-[#3C2A21] font-semibold block leading-tight">{item.name}</span>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span 
                      className="w-8 h-3 border border-[#3C2A21]/10 rounded-sm"
                      style={{ backgroundColor: item.color }} 
                    />
                    {selectedTimber.id === item.id && <Check className="w-3.5 h-3.5 text-[#BFA15F]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Marbles */}
          <div>
            <span className="font-mono text-[10px] uppercase text-[#7F675B] tracking-widest font-semibold block mb-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F]" />
              Premium Marbles and Stones
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOODBOARD_OPTIONS.marbles.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMarble(item)}
                  className={`p-3 relative text-left border rounded transition-all flex flex-col justify-between h-20 ${
                    selectedMarble.id === item.id 
                      ? 'border-[#3C2A21] bg-white ring-1 ring-[#3C2A21]' 
                      : 'border-[#3C2A21]/10 bg-white/50 hover:bg-white hover:border-[#3C2A21]/30'
                  }`}
                  id={`board-marble-${item.id}`}
                >
                  <span className="font-sans text-xs text-[#3C2A21] font-semibold block leading-tight">{item.name}</span>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span 
                      className="w-8 h-3 border border-[#3C2A21]/10 rounded-sm"
                      style={{ backgroundColor: item.color }} 
                    />
                    {selectedMarble.id === item.id && <Check className="w-3.5 h-3.5 text-[#BFA15F]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Fabrics */}
          <div>
            <span className="font-mono text-[10px] uppercase text-[#7F675B] tracking-widest font-semibold block mb-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F]" />
              Soft Upholstery and Fabrics
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOODBOARD_OPTIONS.fabrics.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedFabric(item)}
                  className={`p-3 relative text-left border rounded transition-all flex flex-col justify-between h-20 ${
                    selectedFabric.id === item.id 
                      ? 'border-[#3C2A21] bg-white ring-1 ring-[#3C2A21]' 
                      : 'border-[#3C2A21]/10 bg-white/50 hover:bg-white hover:border-[#3C2A21]/30'
                  }`}
                  id={`board-fabric-${item.id}`}
                >
                  <span className="font-sans text-xs text-[#3C2A21] font-semibold block leading-tight">{item.name}</span>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span 
                      className="w-8 h-3 border border-[#3C2A21]/10 rounded-sm animate-pulse"
                      style={{ backgroundColor: item.color }} 
                    />
                    {selectedFabric.id === item.id && <Check className="w-3.5 h-3.5 text-[#BFA15F]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Metals */}
          <div>
            <span className="font-mono text-[10px] uppercase text-[#7F675B] tracking-widest font-semibold block mb-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F]" />
              Metal Fixtures and Accents
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOODBOARD_OPTIONS.metals.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMetal(item)}
                  className={`p-3 relative text-left border rounded transition-all flex flex-col justify-between h-20 ${
                    selectedMetal.id === item.id 
                      ? 'border-[#3C2A21] bg-white ring-1 ring-[#3C2A21]' 
                      : 'border-[#3C2A21]/10 bg-white/50 hover:bg-white hover:border-[#3C2A21]/30'
                  }`}
                  id={`board-metal-${item.id}`}
                >
                  <span className="font-sans text-xs text-[#3C2A21] font-semibold block leading-tight">{item.name}</span>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span 
                      className="w-8 h-3 border border-[#3C2A21]/10 rounded-sm"
                      style={{ backgroundColor: item.color }} 
                    />
                    {selectedMetal.id === item.id && <Check className="w-3.5 h-3.5 text-[#BFA15F]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Render Canvas */}
        <div className="lg:col-span-5 bg-white border border-[#3C2A21]/12 p-6 rounded-lg shadow-lg flex flex-col justify-between gap-6 overflow-hidden">
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-[#6B625E] uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#BFA15F]" />
                Palette Compilation
              </span>
              <span className="font-mono text-[9px] bg-[#BFA15F]/15 text-[#3C2A21] px-2 py-0.5 rounded uppercase">
                Active Render
              </span>
            </div>

            {/* Simulated 3D overlaps */}
            <div className="h-56 relative bg-[#FAF8F5] border border-[#3C2A21]/10 overflow-hidden flex items-center justify-center rounded">
              
              {/* background plaster shade */}
              <div className="absolute inset-0 bg-gradient-to-r from-stone-100 to-transparent opacity-80" />
              
              {/* Plaster texture rendering details */}
              <div className="absolute top-4 left-4 font-mono text-[8px] text-stone-400">
                LIME WASH BASE
              </div>

              {/* TIMBER block */}
              <motion.div
                animate={{ scale: [0.95, 1], rotate: -4 }}
                transition={{ duration: 0.3 }}
                className="absolute shadow-lg border border-[#3C2A21]/15 w-40 h-28 left-6 bottom-4 flex flex-col justify-end p-2"
                style={{ backgroundColor: selectedTimber.color }}
              >
                <div className="bg-black/80 px-1.5 py-0.5 rounded text-[8px] text-white font-mono uppercase inline-block self-start">
                  TIMBER
                </div>
              </motion.div>

              {/* MARBLE tile block */}
              <motion.div
                animate={{ scale: [0.95, 1], rotate: 4 }}
                transition={{ duration: 0.3 }}
                className="absolute shadow-lg border border-[#3C2A21]/15 w-32 h-36 right-8 top-6 flex flex-col justify-end p-2 overflow-hidden"
                style={{ backgroundColor: selectedMarble.color }}
              >
                {/* simulated marble vein lines */}
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-600 via-transparent" />
                <div className="bg-black/80 px-1.5 py-0.5 rounded text-[8px] text-white font-mono uppercase inline-block self-start z-10">
                  MARBLE SLAB
                </div>
              </motion.div>

              {/* FABRIC wool block */}
              <motion.div
                animate={{ scale: [0.95, 1], rotate: -8 }}
                transition={{ duration: 0.3 }}
                className="absolute shadow-md border-2 border-white/50 w-24 h-24 left-1/3 top-1/4 rounded-full flex flex-col items-center justify-center p-2 text-center"
                style={{ backgroundColor: selectedFabric.color }}
              >
                <div className="bg-black/80 px-1.5 py-0.5 rounded text-[7px] text-white font-mono uppercase z-10 scale-90">
                  FABRIC
                </div>
              </motion.div>

              {/* METAL accent ring */}
              <motion.div
                animate={{ scale: [0.9, 1.1, 1], y: [4, -2, 0] }}
                transition={{ duration: 0.4 }}
                className="absolute right-4 bottom-6 w-12 h-12 shadow-md rounded-full border-[6px]"
                style={{ borderColor: selectedMetal.color }}
              />

            </div>
          </div>

          {/* Compilation recipe details */}
          <div className="border-t border-[#3C2A21]/10 pt-4 flex flex-col gap-3">
            <span className="font-sans text-[11px] font-semibold text-[#3C2A21] tracking-wider uppercase block">
              TEXTURAL COMPOSITION SPECS:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans text-[#6B625E]">
              <div>
                <span className="font-semibold block text-[#3C2A21]">timber:</span>
                <span className="font-light">{selectedTimber.name}</span>
              </div>
              <div>
                <span className="font-semibold block text-[#3C2A21]">marble:</span>
                <span className="font-light">{selectedMarble.name}</span>
              </div>
              <div className="mt-1">
                <span className="font-semibold block text-[#3C2A21]">upholstery:</span>
                <span className="font-light">{selectedFabric.name}</span>
              </div>
              <div className="mt-1">
                <span className="font-semibold block text-[#3C2A21]">fixtures:</span>
                <span className="font-light">{selectedMetal.name}</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#3C2A21]/10 p-3 mt-2 text-[11px] text-[#7F675B] font-sans font-light flex gap-2 items-start">
              <Sparkles className="w-4 h-4 text-[#BFA15F] flex-shrink-0 mt-0.5" />
              <span>Monica's pairing advice: This layout yields a beautifully grounded aesthetic, marrying earthy natural stone with tactile materials. Perfect for bright South-facing exposures.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
