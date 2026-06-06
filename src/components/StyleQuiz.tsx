/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QUIZ_QUESTIONS, COMPLEMENTARY_COLORS, CONSULTATION_PACKAGES } from '../data';
import { Sparkles, ArrowRight, RotateCcw, Calendar, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StyleQuizProps {
  onBookSelectedType: (packageId: string) => void;
}

export default function StyleQuiz({ onBookSelectedType }: StyleQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [matchingStyle, setMatchingStyle] = useState('');

  const handleAnswerSelect = (style: string) => {
    const updatedAnswers = [...answers, style];
    setAnswers(updatedAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate dominant style
      const frequencyMap: { [key: string]: number } = {};
      updatedAnswers.forEach((ans) => {
        frequencyMap[ans] = (frequencyMap[ans] || 0) + 1;
      });

      let dominantStyle = '';
      let maxCount = 0;
      Object.keys(frequencyMap).forEach((styleKey) => {
        if (frequencyMap[styleKey] > maxCount) {
          maxCount = frequencyMap[styleKey];
          dominantStyle = styleKey;
        }
      });

      setMatchingStyle(dominantStyle || 'Warm Contemporary');
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResult(false);
    setMatchingStyle('');
  };

  const getStyleDescription = (style: string) => {
    switch (style) {
      case 'Aesthetic Minimalist':
        return {
          tag: 'Simple Minimalist &bull; Elegant Clarity',
          intro: 'You love spacious, bright, and clutter-free rooms where natural light plays beautifully.',
          description: 'Your taste features soft textured walls, quality stone elements, elegant woodwork, and comfortable linen fabrics. Clutter is completely gone, leaving a fresh and relaxing atmosphere.',
          recommendedPackage: 'c1', // Spatial Discovery
          colors: ['#FAF8F5', '#8C827A', '#1E1714'],
          materials: ['Premium Plaster', 'Travertine Marble', 'Pure Flax Linen', 'Matte Steel']
        };
      case 'Modern Classic':
        return {
          tag: 'Modern Classic &bull; Elegant Styling',
          intro: 'You look for elegant and timeless designs that combine traditional luxury with modern simplicity.',
          description: 'Your style is perfect for beautiful veined marbles, elegant warm brass fittings, beautiful dark wood cabinets, and custom velvet seating. Every detail shines with high quality.',
          recommendedPackage: 'c3', // Masterplan
          colors: ['#3C2A21', '#E1D9D1', '#C5A059'],
          materials: ['Premium White Marble', 'Dark Polish Oak', 'Bronze Fittings', 'Comfortable Velvet']
        };
      case 'Warm Contemporary':
        return {
          tag: 'Cozy Modern &bull; Comfort Living',
          intro: 'You believe home should be a deeply comfortable and cozy place built with soft textures.',
          description: 'Your style is centered around warm light woods, textured ceramic details, soft fabric sofa chairs, and natural warm colors. The furniture placement is designed for cozy family conversations.',
          recommendedPackage: 'c2', // Moodboard
          colors: ['#FAF8F5', '#E1C9B3', '#7F675B'],
          materials: ['Light Wood', 'Cozy Boucle Fabric', 'Textured Ceramics', 'Polished Copper']
        };
      case 'Biophilic Luxe':
      default:
        return {
          tag: 'Eco Luxury &bull; Natural Living',
          intro: 'You want your premium home to connect beautifully with nature, greenery, and bright sunlight.',
          description: 'Your space is suited for elegant curved wall designs, custom planters and indoor greenery, premium flooring, and lovely high glass windows that bring in the sun. It is fresh, airy, and full of life.',
          recommendedPackage: 'c2', // Moodboard
          colors: ['#F3EFE9', '#5E6F62', '#212A26'],
          materials: ['Terrazzo Flooring', 'Green Wool Velvet', 'Oakwood Partition Slats', 'Natural Slate Stone']
        };
    }
  };

  // Get matching package
  const matchedData = getStyleDescription(matchingStyle);
  const matchedPackage = CONSULTATION_PACKAGES.find((pkg) => pkg.id === matchedData.recommendedPackage);

  return (
    <div className="bg-[#FAF8F5] border border-[#3C2A21]/10 rounded-lg p-6 md:p-10 shadow-sm" id="style-quiz-panel">
      
      {/* Container Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 bg-[#BFA15F]/15 text-[#3C2A21] text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-[#BFA15F]" />
          Visual Style Matcher
        </span>
        <h3 className="font-serif text-2xl md:text-3xl text-[#3C2A21] mt-3">
          Find Your Interior Style
        </h3>
        <p className="font-sans text-xs sm:text-sm text-[#6B625E] font-light mt-2">
          Select your favorite designs in our brief 3-step quiz, and let Monica Interiors recommend the perfect materials and services for your home.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz-question"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Steps tracker */}
            <div className="flex items-center justify-between text-xs font-mono text-[#6B625E]/60 max-w-sm mx-auto w-full">
              <span>Step {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              <div className="flex gap-1.5">
                {QUIZ_QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i <= currentStep ? 'w-6 bg-[#BFA15F]' : 'w-2 bg-[#3C2A21]/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question title */}
            <h4 className="font-sans text-base md:text-lg text-center text-[#3C2A21] font-medium tracking-wide max-w-2xl mx-auto">
              {QUIZ_QUESTIONS[currentStep].question}
            </h4>

            {/* Choices Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto w-full pt-2">
              {QUIZ_QUESTIONS[currentStep].options.map((opt, oIdx) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswerSelect(opt.style)}
                  className="flex flex-col text-left group overflow-hidden border border-[#3C2A21]/10 bg-white rounded hover:border-[#BFA15F] hover:shadow-lg transition-all focus:outline-none"
                  id={`quiz-opt-${currentStep}-${oIdx}`}
                >
                  <div className="w-full h-36 md:h-44 overflow-hidden relative">
                    <img
                      src={opt.image}
                      alt={opt.text}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <p className="font-sans text-xs md:text-sm text-[#3C2A21] leading-relaxed font-light">
                      {opt.text}
                    </p>
                    <span className="text-[10px] font-mono text-[#BFA15F] uppercase tracking-[0.15em] mt-3 group-hover:text-[#3C2A21] transition-colors flex items-center gap-1">
                      Choose option <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto w-full pt-2"
          >
            {/* Visual Result Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-[#3C2A21]/10 p-6 md:p-8 rounded-lg shadow-md">
              
              {/* Left Column - Diagnostic */}
              <div className="md:col-span-7 flex flex-col gap-6">
                <div>
                  <span 
                    className="text-[10px] font-mono uppercase tracking-[0.25em] px-2.5 py-1 text-white"
                    style={{ backgroundColor: COMPLEMENTARY_COLORS.espresso }}
                  >
                    Your Design Typology
                  </span>
                  <h4 className="font-serif text-3xl text-[#3C2A21] tracking-tight mt-3">
                    {matchingStyle}
                  </h4>
                  <p className="font-sans text-xs md:text-sm font-semibold text-[#BFA15F] tracking-wider uppercase mt-1">
                    {matchedData.tag}
                  </p>
                </div>

                <div className="border-l-2 border-[#BFA15F] pl-4 py-1">
                  <p className="font-serif text-md italic text-[#3C2A21]/90">
                    "{matchedData.intro}"
                  </p>
                </div>

                <p className="font-sans text-sm text-[#6B625E] font-light leading-relaxed">
                  {matchedData.description}
                </p>

                {/* Material palette breakdown */}
                <div>
                  <span className="font-mono text-[10px] text-[#6B625E] uppercase tracking-widest block mb-2 font-semibold">
                    Signature Materials Preferred:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {matchedData.materials.map((mat, idx) => (
                      <span
                        key={idx}
                        className="bg-[#FAF8F5] border border-[#3C2A21]/10 px-3 py-1 text-xs font-sans text-[#3C2A21] rounded"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Recommended Consultation */}
              <div className="md:col-span-5 bg-[#FAF8F5] border border-[#3C2A21]/10 p-6 rounded flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#BFA15F] uppercase tracking-[0.15em] block mb-1">
                    Recommended Consultation
                  </span>
                  <h5 className="font-serif text-lg text-[#3C2A21] font-semibold">
                    {matchedPackage?.name}
                  </h5>
                  
                  {/* Price Bubble */}
                  <div className="my-4 flex items-baseline gap-1">
                    <span className="font-serif text-3xl font-bold text-[#3C2A21]">${matchedPackage?.price}</span>
                    <span className="font-mono text-[11px] text-[#6B625E]/60 uppercase">/ Non-refundable fee</span>
                  </div>

                  <p className="font-sans text-xs text-[#6B625E] leading-relaxed font-light mb-4">
                    {matchedPackage?.description}
                  </p>

                  <ul className="flex flex-col gap-2 font-sans text-xs text-[#3C2A21]/95 mb-4 font-light">
                    {matchedPackage?.features.slice(0, 3).map((feat, fId) => (
                      <li key={fId} className="flex gap-2">
                        <Check className="w-3.5 h-3.5 text-[#BFA15F] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-[#3C2A21]/10">
                  <button
                    onClick={() => onBookSelectedType(matchedData.recommendedPackage)}
                    className="w-full flex items-center justify-center gap-2 bg-[#3C2A21] hover:bg-[#1E2941] text-[#FAF8F5] py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all"
                    id="quiz-result-book-btn"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#BFA15F]" />
                    Book This Consultation
                  </button>

                  <button
                    onClick={handleRestart}
                    className="w-full flex items-center justify-center gap-2 border border-[#3C2A21]/20 hover:border-[#3C2A21] text-[#3C2A21] py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all"
                    id="quiz-restart-btn"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restart Quiz
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
