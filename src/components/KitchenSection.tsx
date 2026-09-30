import React, { useEffect, useRef, useState } from 'react';

export const KitchenSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const text = "SPOTLESS HYGIENE & MARKET-FRESH VEGGIES SOURCED EVERY SINGLE DAY.";
  const words = text.split(' ');

  return (
    <section 
      id="section-kitchen" 
      ref={sectionRef}
      className="w-full flex flex-col md:flex-row bg-white overflow-hidden"
    >
      {/* Left Side Content */}
      <div className="w-full md:w-1/2 px-6 md:px-12 lg:px-24 py-20 md:py-32 flex flex-col justify-center text-left bg-white z-10 relative">
        
        {/* Main Text */}
        <div className={`max-w-xl transition-all duration-1000 ease-out transform mb-16 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#34150F] uppercase tracking-tight leading-[1.2] cursor-default">
            {words.map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.3em]">
                {word.split('').map((char, cIdx) => (
                  <span 
                    key={cIdx} 
                    className="inline-block transition-transform duration-200 hover:-translate-y-2 hover:text-[#E5E9D8]"
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        {/* Sub Text */}
        <div className={`max-w-sm lg:max-w-md transition-all duration-1000 ease-out transform delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
           <h3 className="font-placard font-bold text-2xl text-[#34150F] uppercase tracking-wider mb-4 opacity-70">
             FARM TO TABLE
           </h3>
           <p className="font-body font-medium text-[#34150F] text-lg leading-relaxed opacity-90">
             We hand-pick our produce every morning to guarantee the perfect crunch and uncompromising quality in every bite.
           </p>
        </div>

      </div>

      {/* Right Side Image */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-0 relative">
        <img 
          src="/image copy 7.png" 
          alt="Fresh Ingredients" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
      </div>
    </section>
  );
};
