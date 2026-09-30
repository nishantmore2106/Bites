import React, { useEffect, useRef, useState } from 'react';

export const HeroBanner: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameCount = 300;

    // Pad number with leading zeros (e.g., 001, 002)
    const currentFrame = (index: number) =>
      `/ezgif-6c7c8fed768e4d34-png-split/ezgif-frame-${index.toString().padStart(3, '0')}.png`;

    const images: HTMLImageElement[] = [];
    let isLoaded = false;

    const firstImage = new Image();
    firstImage.src = currentFrame(1);
    firstImage.onload = () => {
      canvas.width = firstImage.width;
      canvas.height = firstImage.height;
      ctx.drawImage(firstImage, 0, 0);
      images[1] = firstImage;
      isLoaded = true;

      // Preload remaining images
      for (let i = 2; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images[i] = img;
      }
    };

    let requestRef: number;
    let lastDrawnFrame = -1;

    const handleScroll = () => {
      if (!isLoaded || !sectionRef.current) return;

      const { top, height } = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const maxScroll = height - viewportHeight;
      const scrollPos = -top;

      if (scrollPos < 0) return;
      if (scrollPos > maxScroll) return;

      const scrollFraction = scrollPos / maxScroll;

      let frameIndex = Math.min(
        frameCount,
        Math.floor(scrollFraction * (frameCount - 1)) + 1
      );

      if (frameIndex < 1) frameIndex = 1;
      if (frameIndex > frameCount) frameIndex = frameCount;

      if (frameIndex !== lastDrawnFrame && images[frameIndex] && images[frameIndex].complete) {
        if (requestRef) cancelAnimationFrame(requestRef);
        requestRef = requestAnimationFrame(() => {
          ctx.drawImage(images[frameIndex], 0, 0);
          setCurrentFrame(frameIndex);
          lastDrawnFrame = frameIndex;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Appears after 10 frames and hides before the box frame
  const isAirFrame = currentFrame >= 10 && currentFrame <= 140;

  // Title visible only at the very beginning (first 20 frames)
  const isTitleVisible = currentFrame < 20;

  return (
    <section
      ref={sectionRef}
      id="hero-banner"
      className="w-full h-[300vh] bg-bites-blue relative z-0"
    >
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-[-1] bg-black">
        <canvas ref={canvasRef} className="w-full h-full object-cover"></canvas>

        {/* Giant Static Typography (Pops out on scroll) */}
        <div className={`absolute inset-0 pointer-events-none p-6 md:p-12 z-0 transition-all duration-700 ease-in-out transform origin-center ${isTitleVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl flex justify-center items-center">
            <img
              src="/image copy 28.png"
              alt="Brand Banner"
              className="w-[90%] md:w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Floating Ingredient Labels */}
        <div className="absolute inset-0 pointer-events-none w-full px-4 md:px-12 lg:px-24 mx-auto hidden md:flex md:flex-col justify-center md:justify-start pt-0 md:pt-32 gap-6 md:gap-16 z-10 text-shadow-md">
          <div className={`flex items-center gap-2 md:gap-8 ml-4 md:ml-16 lg:ml-32 transition-all duration-700 ease-out transform ${isAirFrame ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <span className="font-cursive text-lg md:text-3xl text-white tracking-wide">Top Bread</span>
            <div className="h-0.5 w-8 md:w-32 lg:w-48 bg-bites-orange shadow-[0_0_8px_rgba(243,107,33,0.6)]"></div>
          </div>

          <div className={`flex items-center justify-end gap-2 md:gap-8 transition-all duration-700 delay-100 ease-out transform ${isAirFrame ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="h-0.5 w-8 md:w-32 lg:w-48 bg-bites-orange shadow-[0_0_8px_rgba(243,107,33,0.6)]"></div>
            <span className="font-cursive text-lg md:text-3xl text-white tracking-wide text-right">Extra Cheese</span>
          </div>

          <div className={`flex items-center gap-2 md:gap-8 transition-all duration-700 delay-200 ease-out transform ${isAirFrame ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <span className="font-cursive text-lg md:text-3xl text-white tracking-wide">Fresh Lettuce & Veggies</span>
            <div className="h-0.5 w-8 md:w-32 lg:w-48 bg-bites-orange shadow-[0_0_8px_rgba(243,107,33,0.6)]"></div>
          </div>

          <div className={`flex items-center justify-end mt-24 md:mt-64 lg:mt-72 gap-2 md:gap-8 transition-all duration-700 delay-300 ease-out transform ${isAirFrame ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="h-0.5 w-8 md:w-32 lg:w-48 bg-bites-orange shadow-[0_0_8px_rgba(243,107,33,0.6)]"></div>
            <span className="font-cursive text-lg md:text-3xl text-white tracking-wide text-right">Bottom Bread</span>
          </div>
        </div>

        {/* Watermark Cover */}
        <div className="absolute bottom-4 right-10 z-50">
          <img
            src="/image copy 3.png"
            alt="Logo cover"
            className="w-32 h-32 md:w-48 md:h-48 object-contain"
          />
        </div>
      </div>
    </section>
  );
};
