/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Eye, ChevronsLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
  location: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
  description,
  location
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="bg-[#FAF8F5] border border-[#3C2A21]/10 rounded-lg p-6 shadow-sm flex flex-col gap-6" id="renovation-slider-container">
      
      {/* Header and details */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#BFA15F] uppercase block mb-1">
            Renovation Case Study &bull; {location}
          </span>
          <h3 className="font-serif text-2xl text-[#3C2A21] tracking-tight leading-snug">
            {title}
          </h3>
          <p className="font-sans text-sm text-[#6B625E] font-light mt-1.5 max-w-2xl">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#6B625E]/80 border border-[#3C2A21]/10 px-3 py-1.5 rounded bg-white">
          <Eye className="w-3.5 h-3.5 text-[#BFA15F]" />
          <span>Slide to compare</span>
        </div>
      </div>

      {/* Interactive slider stage */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className="relative h-[300px] md:h-[450px] w-full overflow-hidden select-none cursor-ew-resize border border-[#3C2A21]/15"
        id="interactive-drag-stage"
      >
        {/* BEFORE IMAGE (Full sized background) */}
        <img
          src={beforeImage}
          alt="Before renovation"
          className="absolute inset-0 w-full h-full object-cover grayscale-[30%] brightness-[85%]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-4 left-4 bg-black/75 text-white text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 rounded z-10">
          Prior Layout
        </div>

        {/* AFTER IMAGE (Cropped overlay) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img
            src={afterImage}
            alt="After renovation by Monica Interiors"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: containerRef.current?.offsetWidth || '100%' }}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute bottom-4 right-4 bg-[#BFA15F]/95 text-white text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 rounded z-10 shadow-md">
          Renovation Completed
        </div>

        {/* REVEALER HANDLE BAR */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize z-20 group"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circular Button */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#3C2A21] border border-[#3C2A21]/20 shadow-xl flex items-center justify-center transition-transform group-hover:scale-110">
            <ChevronsLeftRight className="w-4 h-4 text-[#3C2A21]" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between items-center text-xs text-[#6B625E] font-sans font-light">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span> Old Structure
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#BFA15F]"></span> Completed Renovation
        </span>
      </div>

    </div>
  );
}
