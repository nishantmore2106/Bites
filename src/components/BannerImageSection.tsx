import React from 'react';

export const BannerImageSection: React.FC = () => {
  return (
    <section 
      id="section-banner-image"
      className="w-full relative bg-[#F7F5F0]"
    >
      <img 
        src="/image copy 22.png" 
        alt="Burger Banner Desktop" 
        className="hidden md:block w-full h-auto"
      />
      <img 
        src="/image copy 10.png" 
        alt="Burger Banner Mobile" 
        className="block md:hidden w-full h-auto"
      />
    </section>
  );
};
