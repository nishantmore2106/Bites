import React from 'react';

const Placeholder = ({ className, src }: { className?: string; src?: string }) => (
  <div className={`relative bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] w-full shadow-xl overflow-hidden ${className}`}>
    {src && <img src={src} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Gallery item" />}
  </div>
);

export const VideoSection: React.FC<{ onOpenMenu: () => void }> = ({ onOpenMenu }) => {
  return (
    <section id="section-video" className="relative w-full min-h-screen h-auto overflow-hidden bg-[#34150F]">
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        src="/download.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      {/* Dark Overlay to make content pop */}
      <div className="absolute inset-0 bg-[#34150F]/40 pointer-events-none"></div>

      {/* Gallery Layout Overlay */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row gap-4 md:gap-6 min-h-screen">

        {/* Column 1 */}
        <div className="flex-1 flex flex-col gap-4 relative md:min-h-[800px]">
          <div className="md:absolute top-0 left-0 w-full md:w-[240%] z-20 mb-12 md:mb-0">
            <h2 className="font-display font-extrabold text-5xl md:text-7xl lg:text-[88px] text-white leading-[1.05] tracking-tight mb-6 drop-shadow-lg">
              Beyond Taste.<br />Pure Delight.
            </h2>
            <p className="font-body text-lg md:text-xl text-white/90 max-w-sm mb-10 font-medium drop-shadow-md">
              Timeless recipes and fresh ingredients that speak for themselves.
            </p>
            <button onClick={onOpenMenu} className="flex items-center gap-3 bg-white text-[#34150F] px-8 py-4 rounded-full uppercase tracking-wider text-sm font-bold hover:bg-[#EACEAA] hover:text-[#34150F] transition-all cursor-pointer border-none shadow-xl group">
              Enter Menu
              <div className="bg-white text-[#34150F] p-1.5 rounded-full group-hover:bg-[#34150F] group-hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
            </button>
          </div>
          <div className="hidden md:block flex-grow"></div>
          <Placeholder src="/Archive 2/DSC07993.JPG" className="h-[250px] md:h-[300px] mt-auto" />
        </div>

        {/* Column 2 */}
        <div className="flex-1 flex flex-col gap-4 pt-0 md:pt-[380px]">
          <Placeholder src="/Archive 2/DSC07998.JPG" className="h-[300px] md:h-[350px]" />
          <Placeholder src="/WhatsApp Unknown 2026-10-01 at 8.48.41 PM/WhatsApp Image 2026-10-01 at 8.45.45 PM (7).jpeg" className="h-[200px] md:h-[250px]" />
        </div>

        {/* Column 3 */}
        <div className="flex-1 flex flex-col gap-4 pt-0 md:pt-[280px]">
          <Placeholder src="/WhatsApp Unknown 2026-10-01 at 8.48.41 PM/WhatsApp Image 2026-10-01 at 8.45.45 PM (5).jpeg" className="h-[250px] md:h-[300px]" />
          <Placeholder src="/Archive 2/DSC08022.JPG" className="h-[300px] md:h-[380px]" />
        </div>

        {/* Column 4 */}
        <div className="flex-1 flex flex-col gap-4 pt-0 md:pt-[200px]">
          <div className="flex flex-col gap-5 px-2 mb-6">

          </div>
          <Placeholder src="/WhatsApp Unknown 2026-10-01 at 8.48.41 PM\WhatsApp Image 2026-10-01 at 8.45.45 PM (11).jpeg" className="h-[350px] md:h-[450px]" />
          <Placeholder src="/WhatsApp Unknown 2026-10-01 at 8.48.41 PM\WhatsApp Image 2026-10-01 at 8.45.45 PM (3).jpeg" className="h-[150px] md:h-[250px]" />
        </div>

        {/* Column 5 */}
        <div className="flex-1 flex flex-col gap-4 pt-0 md:pt-6">
          <Placeholder src="/Archive 2/DSC08048.JPG" className="h-[180px] md:h-[220px]" />
          <Placeholder src="/Archive 2/DSC08063.JPG" className="h-[400px] md:h-[500px]" />
          <Placeholder src="/Archive 2/DSC08070.JPG" className="h-[150px] md:h-[180px]" />
        </div>

      </div>
    </section>
  );
};
