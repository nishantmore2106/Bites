import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: inline-flex;
            white-space: nowrap;
            animation: marquee 30s linear infinite;
          }
        `}
      </style>

      {/* Marquee Banner */}
      <div className="absolute top-0 left-0 right-0 z-[60] bg-[#34150F] text-[#E5E9D8] py-2 overflow-hidden flex items-center border-b border-[#E5E9D8]/10">
        <div className="animate-marquee font-bold text-xs md:text-sm tracking-widest uppercase">
          {/* First set of text */}
          <div className="flex items-center pr-8">
            <span>Open daily from 11:00 AM to 11:00 PM</span><span className="px-8">•</span>
            <span>Original Alkapuri Outlet</span><span className="px-8">•</span>
            <span>Branches: Alkapuri, Sama & Nizampura</span><span className="px-8">•</span>
            <span>Call +91 93272 40219</span><span className="px-8">•</span>
            <span>Open daily from 11:00 AM to 11:00 PM</span><span className="px-8">•</span>
            <span>Original Alkapuri Outlet</span><span className="px-8">•</span>
            <span>Branches: Alkapuri, Sama & Nizampura</span><span className="px-8">•</span>
            <span>Call +91 93272 40219</span>
          </div>
          {/* Exact duplicate for seamless looping */}
          <div className="flex items-center pr-8">
            <span className="px-8">•</span>
            <span>Open daily from 11:00 AM to 11:00 PM</span><span className="px-8">•</span>
            <span>Original Alkapuri Outlet</span><span className="px-8">•</span>
            <span>Branches: Alkapuri, Sama & Nizampura</span><span className="px-8">•</span>
            <span>Call +91 93272 40219</span><span className="px-8">•</span>
            <span>Open daily from 11:00 AM to 11:00 PM</span><span className="px-8">•</span>
            <span>Original Alkapuri Outlet</span><span className="px-8">•</span>
            <span>Branches: Alkapuri, Sama & Nizampura</span><span className="px-8">•</span>
            <span>Call +91 93272 40219</span>
          </div>
        </div>
      </div>

      <header
        id="global-header"
        className="absolute left-0 right-0 z-50 bg-transparent top-[32px] md:top-[36px] py-4 md:py-6"
      >

      <div className="w-full px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <a
          id="header-brand-logo"
          href="#"
          className="flex items-center gap-3 group transition-transform duration-200 active:scale-95"
          aria-label="BITes Home"
        >
          <img
            src="/image copy 2.png"
            alt="BITes Logo"
            className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain transition-transform group-hover:scale-105"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 lg:gap-10">
          {[
            { name: 'ABOUT US', id: 'section-feature-highlight' },
            { name: 'BEST SELLERS', id: 'section-best-sellers' },
            { name: 'FARM TO TABLE', id: 'section-kitchen' }
          ].map((link) => (
            <a
              key={link.name}
              href={`#${link.id}`}
              className="font-placard font-bold text-white text-base lg:text-lg uppercase tracking-widest hover:opacity-75 transition-opacity"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div id="header-action-buttons" className="flex items-center gap-3">
          {/* Outlined Menu Button (Desktop only) */}
          <button
            id="header-menu-button"
            onClick={onOpenMenu}
            className="hidden lg:block relative overflow-hidden px-5 md:px-6 py-2 md:py-2.5 rounded-full border-2 border-white text-white font-display font-bold text-sm md:text-base tracking-wide transition-all active:scale-95 cursor-pointer whitespace-nowrap group"
          >
            <span className="relative z-10 group-hover:text-[#34150F] transition-colors duration-300">Menu</span>
            <div className="absolute -top-[150%] left-0 w-full h-[150%] bg-[#FBBF24] rounded-b-[80%] group-hover:top-0 transition-all duration-1000 ease-in-out z-0"></div>
          </button>

          {/* Mobile Menu Hamburger Icon */}
          <button 
            className="lg:hidden text-white p-2 cursor-pointer hover:opacity-75 transition-opacity"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#34150F] border-t border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
          {[
            { name: 'ABOUT US', id: 'section-feature-highlight' },
            { name: 'BEST SELLERS', id: 'section-best-sellers' },
            { name: 'FARM TO TABLE', id: 'section-kitchen' }
          ].map((link) => (
            <a
              key={link.name}
              href={`#${link.id}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-placard font-bold text-white text-lg uppercase tracking-widest hover:opacity-75 transition-opacity border-b border-white/10 pb-4"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenMenu();
            }}
            className="mt-4 relative overflow-hidden px-6 py-3 rounded-full border-2 border-white text-white font-display font-bold text-base tracking-wide transition-all active:scale-95 cursor-pointer group"
          >
            <span className="relative z-10 group-hover:text-[#34150F] transition-colors duration-300">Menu</span>
            <div className="absolute -top-[150%] left-0 w-full h-[150%] bg-[#FBBF24] rounded-b-[80%] group-hover:top-0 transition-all duration-1000 ease-in-out z-0"></div>
          </button>
        </div>
      )}
    </header>
    </>
  );
};
