import React, { useRef } from 'react';
import { TESTIMONIALS } from '../data';

export const TestimonialSlider: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -350,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 350,
        behavior: 'smooth'
      });
    }
  };

  const productImages = [
    '/image copy 17.png',
    '/image copy 18.png',
    '/image copy 16.png',
    '/image copy 17.png',
    '/image copy 18.png',
    '/image copy 16.png',
    '/image copy 17.png',
    '/image copy 18.png',
    '/image copy 16.png',
    '/image copy 17.png',
    '/image copy 18.png',
    '/image copy 16.png',
    '/image copy 17.png',
    '/image copy 18.png',
  ];

  return (
    <section
      id="section-testimonials"
      className="w-full bg-[#FDFBF7] py-16 md:py-24 border-t border-[#34150F]/5 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

        {/* Left Side: Title & Nav */}
        <div className="md:col-span-4 flex flex-col justify-center">
          <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#34150F]/50 uppercase mb-4">
            Hear from our customers
          </p>

          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-[56px] text-[#34150F] leading-[1.1] tracking-tight mb-10">
            What people<br />are saying
          </h2>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 bg-[#85431E] rounded-xl flex items-center justify-center text-[#EACEAA] hover:bg-[#683315] transition-colors active:scale-95 shadow-sm"
              aria-label="Previous Testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={scrollRight}
              className="w-12 h-12 bg-[#85431E] rounded-xl flex items-center justify-center text-[#EACEAA] hover:bg-[#683315] transition-colors active:scale-95 shadow-sm"
              aria-label="Next Testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side: Cards */}
        <div className="md:col-span-8 overflow-visible relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-8 pt-2 px-2 -mx-2"
          >
            {TESTIMONIALS.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-[24px] p-8 border border-[#34150F]/10 shadow-sm flex flex-col justify-between min-w-[300px] w-[320px] md:w-[380px] snap-center flex-shrink-0"
              >
                <div>

                  {/* ⭐ Rating */}
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className="text-[#F4B400] text-lg leading-none"
                        aria-hidden="true"
                      >
                        {index < review.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>

                  {/* Review */}
                  <p className="text-sm md:text-base text-[#34150F]/80 leading-relaxed font-body">
                    {review.quote}
                  </p>
                </div>

                <div className="mt-8 flex flex-col">

                  {/* Reviewer */}
                  <span className="font-display font-extrabold text-lg text-[#34150F]">
                    {review.author}
                  </span>

                  {/* Review information */}
                  <span className="text-xs text-[#34150F]/50 mt-1">
                    {review.reviewsCount > 0
                      ? `${review.reviewsCount} reviews · `
                      : ''}
                    {review.date}
                  </span>

                  {/* Huge quote icon at bottom left */}
                  <span className="text-6xl font-display font-black text-[#85431E] leading-none mt-2 -mb-4">
                    "
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row Images */}
      <div className="mt-16 w-full overflow-hidden">
        <div className="flex gap-4 md:gap-6 px-6 pb-4">
          {productImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Bites item"
              className={`w-24 h-24 md:w-32 md:h-32 object-cover flex-shrink-0 shadow-sm ${i % 2 === 0
                ? 'rounded-[28px]'
                : 'rounded-full'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};