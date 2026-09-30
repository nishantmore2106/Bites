import React, { useState } from 'react';
import { INGREDIENT_LAYERS } from '../data';
import { IngredientLayer } from '../types';

export const IngredientShowcase: React.FC = () => {
  const [activeIngredient, setActiveIngredient] = useState<IngredientLayer | null>(null);

  // Background stacked bold phrases matching the spec & image texture
  const textureLines = [
    "COMPARES TO",
    "THE SINKING",
    "YOUR TEETH",
    "INTO SMOKY",
    "FLAVOUR HOT",
    "JUICY BURGER",
    "STACKED WITH",
    "FLAVOUR STEAK",
    "HIGH GRILLED",
    "JUICY LOADED",
    "WITH FLAVOUR",
    "THE BURGER",
    "THAT NEVER",
    "DISAPPOINTS"
  ];

  return (
    <section
      id="section-ingredient-showcase"
      className="w-full py-16 md:py-24 bg-[#EACEAA] relative overflow-hidden min-h-[750px] md:min-h-[1050px] flex items-center justify-center select-none"
    >
      {/* BACKGROUND TYPOGRAPHY PATTERN (Stacked dense uppercase phrases in Burnt Coffee at ~15-20% opacity) */}
      <div
        id="ingredient-bg-typography"
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-18 z-0 px-4"
        aria-hidden="true"
      >
        <div className="w-full max-w-[1200px] text-center flex flex-col items-center justify-center space-y-[-0.2em] md:space-y-[-0.3em]">
          {textureLines.map((line, idx) => (
            <span
              key={idx}
              className="font-display font-black text-[38px] sm:text-[62px] md:text-[84px] lg:text-[104px] text-[#34150F] uppercase tracking-tighter leading-none block whitespace-nowrap"
            >
              {line}
            </span>
          ))}
        </div>
      </div>

      {/* FOREGROUND: VERTICAL CASCADE OF DECONSTRUCTED FALLING INGREDIENTS */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-15 flex flex-col items-center">
        
        {/* Subtle section label */}
        <div className="mb-6 md:mb-10 text-center">
          <span className="text-xs md:text-sm font-display font-extrabold uppercase tracking-[0.2em] text-[#85431E] bg-[#D39858]/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Crafted Layer By Layer
          </span>
        </div>

        {/* The Falling Ingredients Stack */}
        <div
          id="deconstructed-cascade-container"
          className="relative w-full max-w-[580px] flex flex-col items-center space-y-[-24px] sm:space-y-[-32px] md:space-y-[-44px] py-4"
        >
          {INGREDIENT_LAYERS.map((layer, index) => {
            const isMobileHidden = index > 4; // On mobile, show top 5 key layers to keep clean
            const isActive = activeIngredient?.id === layer.id;

            return (
              <div
                key={layer.id}
                id={`ingredient-layer-${layer.id}`}
                className={`relative transition-all duration-300 transform group cursor-pointer ${
                  isMobileHidden ? 'hidden md:block' : 'block'
                }`}
                style={{
                  transform: `rotate(${layer.rotation}deg) translateX(${layer.offsetX}px)`,
                  zIndex: 20 + index
                }}
                onMouseEnter={() => setActiveIngredient(layer)}
                onMouseLeave={() => setActiveIngredient(null)}
                onClick={() => setActiveIngredient(isActive ? null : layer)}
              >
                {/* Floating Ingredient Card / Visual */}
                <div
                  className={`relative px-4 py-2 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'scale-110 shadow-warm-lg ring-4 ring-[#85431E]'
                      : 'hover:scale-105 shadow-warm'
                  }`}
                >
                  <div className="w-[240px] sm:w-[320px] md:w-[400px] h-[72px] sm:h-[88px] md:h-[110px] rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#EACEAA]/80 backdrop-blur-md border-2 border-[#34150F]/20 relative shadow-warm-sm flex items-center p-2">
                    <img
                      src={layer.image}
                      alt={layer.alt}
                      referrerPolicy="no-referrer"
                      className="w-20 sm:w-24 md:w-28 h-full object-cover rounded-[14px] shadow-sm flex-shrink-0"
                    />
                    <div className="ml-3 sm:ml-4 flex-1 overflow-hidden pr-2">
                      <p className="font-display font-extrabold text-xs sm:text-sm md:text-base text-[#34150F] uppercase tracking-tight truncate">
                        {layer.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-[#85431E] font-bold line-clamp-1">
                        {layer.subtext}
                      </p>
                      <span className="inline-block mt-0.5 text-[9px] sm:text-[10px] font-semibold text-[#34150F]/70 uppercase tracking-wider">
                        📍 {layer.origin}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Detail Tooltip */}
                {isActive && (
                  <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 hidden lg:block w-64 p-4 rounded-2xl bg-[#34150F] text-[#EACEAA] shadow-warm-lg z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between pb-1 border-b border-[#EACEAA]/20">
                      <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-[#D39858]">
                        Layer {index + 1} of 8
                      </span>
                      <span className="text-[10px] text-[#EACEAA]/60">{layer.origin}</span>
                    </div>
                    <p className="mt-2 text-xs font-bold text-white uppercase">{layer.name}</p>
                    <p className="mt-1 text-[11px] text-[#EACEAA]/90 leading-relaxed">{layer.subtext}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile helper notice */}
        <p className="mt-6 text-center text-xs font-bold text-[#85431E] md:hidden">
          Tap any layer to inspect our farm-sourced ingredients
        </p>
      </div>
    </section>
  );
};
