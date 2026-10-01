import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="global-footer" className="w-full bg-[#34150F] text-[#EACEAA] py-12 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left: Brand */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <img src="/image copy 2.png" alt="BITes Logo" className="w-16 h-16 object-contain" />
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-display font-extrabold text-3xl tracking-tight uppercase text-white">
              BITES
            </span>
            <span className="font-body text-sm text-[#EACEAA]/80">
              The Original Bombay Sandwich
            </span>
          </div>
        </div>

        {/* Center/Right: Contact Info */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 font-body text-sm md:text-base text-white/90">
          <a href="mailto:BitesBombaySandwhich2514@gmail.com" className="hover:text-[#EACEAA] transition-colors flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            BitesBombaySandwhich2514@gmail.com
          </a>

          <a href="https://instagram.com/bites.bombay.sandwich_vadodara" target="_blank" rel="noopener noreferrer" className="hover:text-[#EACEAA] transition-colors flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            bites.bombay.sandwich_vadodara
          </a>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-6 pt-6 border-t border-white/10 relative">
        <div className="w-full sm:w-1/2 flex justify-center sm:justify-start">
          <p>&copy; {new Date().getFullYear()} BITes. All rights reserved.</p>
        </div>

        <div className="w-full sm:w-1/2 flex items-center justify-center sm:justify-end gap-2">
          <span>Made by</span>
          <img src="/Artboard 7 copy 3@2x.png" alt="Made by Logo" className="h-4 md:h-5 object-contain opacity-70 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </footer>
  );
};
