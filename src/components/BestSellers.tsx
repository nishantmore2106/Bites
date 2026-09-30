import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export const BestSellers: React.FC = () => {
  return (
    <section 
      id="section-best-sellers" 
      className="w-full bg-cover bg-center bg-no-repeat text-[#34150F] py-24 md:py-32 px-6 md:px-12 lg:px-24 relative"
      style={{ backgroundImage: 'url("/image copy 12.png")' }}
    >
      
      {/* Header section: Title, Philosophy, Button */}
      <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between mb-16 gap-10 relative z-10">
        <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight shrink-0">
          OUR BEST SELLER DISHES
        </h2>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-end w-full lg:w-auto flex-1 lg:ml-20 gap-8">
          <div className="max-w-sm">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-3 opacity-70">OUR PHILOSOPHY</h4>
            <p className="font-body text-base font-medium opacity-90 leading-relaxed">
              Every dish is thoughtfully crafted to balance atmosphere, flavor, and form—bringing quiet elegance and unforgettable taste into everyday dining.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section: Cascading heights aligned to the bottom */}
      <div className="w-full flex flex-col md:flex-row items-end gap-6 h-auto md:h-[650px] relative z-10">
        


        {/* Big Image (Left) */}
        <div className="w-full md:w-[35%] h-[400px] md:h-full relative rounded-3xl overflow-hidden group">
          <img src="/image copy 16.png" alt="Veg Cheese Hot Dog" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 p-3 md:p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white transition-all duration-300 group-hover:bg-black/50">
            <div>
              <h3 className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Veg Cheese Hot Dog</h3>
              <p className="text-xs md:text-sm opacity-80">Our signature creation</p>
            </div>
          </div>
        </div>

        {/* Medium Image (Center) */}
        <div className="w-full md:w-[35%] h-[300px] md:h-[500px] relative rounded-3xl overflow-hidden group">
          <img src="/image copy 17.png" alt="Veg Cheese Sandwich" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 p-3 md:p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white transition-all duration-300 group-hover:bg-black/50">
            <div>
              <h3 className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Veg Cheese Sandwich</h3>
              <p className="text-xs md:text-sm opacity-80">Melted perfection</p>
            </div>
          </div>
        </div>

        {/* Small Image (Right) */}
        <div className="w-full md:w-[30%] h-[250px] md:h-[350px] relative rounded-3xl overflow-hidden group">
          <img src="/image copy 18.png" alt="Stuffed Bun Paratha" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 p-3 md:p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white transition-all duration-300 group-hover:bg-black/50">
            <div>
              <h3 className="font-bold text-lg md:text-xl mb-0.5 md:mb-1">Stuffed Bun Paratha</h3>
              <p className="text-xs md:text-sm opacity-80">A fiery delight</p>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
