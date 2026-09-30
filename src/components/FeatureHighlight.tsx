import React, { useEffect, useRef, useState } from 'react';

export const FeatureHighlight: React.FC = () => {
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

  const text = "THE ORIGINAL BOMBAY SANDWICH. ESTABLISHED 1990.";
  const words = text.split(' ');

  return (
    <section 
      id="section-feature-highlight" 
      ref={sectionRef}
      className="w-full min-h-[80vh] md:min-h-screen py-32 md:py-56 flex items-center relative overflow-hidden"
    >
      {/* Mobile Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden z-0"
        style={{ backgroundImage: 'url("/image copy 11.png")' }}
      />
      {/* Desktop Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block z-0"
        style={{ backgroundImage: 'url("/image copy 6.png")' }}
      />

      <div className="w-full px-6 md:px-12 lg:pr-24 flex justify-center md:justify-end relative z-10">
        <div className={`max-w-sm sm:max-w-lg lg:max-w-2xl text-center md:text-right transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[72px] text-white uppercase tracking-tight leading-[1.1] drop-shadow-2xl cursor-default">
            {words.map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.3em]">
                {word.split('').map((char, cIdx) => (
                  <span 
                    key={cIdx} 
                    className="inline-block transition-transform duration-200 hover:-translate-y-2 md:hover:-translate-y-4 hover:text-bites-orange"
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
};

