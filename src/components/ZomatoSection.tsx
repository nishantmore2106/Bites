import React from 'react';

export const ZomatoSection: React.FC = () => {
  return (
    <section className="w-full bg-[#FDFBF7] py-16 md:py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">

        {/* Left Side: Text and Button */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#34150F] leading-tight tracking-tight mb-8">
            We are on zomato<br />for Vadodara
          </h2>
          <a
            href="https://zomato.onelink.me/xqzv/byvtc8g9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#E23744] text-white px-8 py-4 rounded-full uppercase tracking-wider text-sm font-bold hover:bg-[#Cb202d] transition-colors shadow-lg cursor-pointer group"
          >
            Order Now
            <div className="bg-white text-[#E23744] p-1.5 rounded-full group-hover:scale-110 transition-transform">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
          </a>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src="/image copy 26.png"
            alt="Zomato Vadodara"
            className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-xl transform scale-125 lg:scale-150 origin-center md:origin-right"
          />
        </div>

      </div>
    </section>
  );
};
