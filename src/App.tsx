import React, { useState, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FeatureHighlight } from './components/FeatureHighlight';
import { MenuModal } from './components/MenuModal';
import { MENU_ITEMS } from './data';
import { MenuItem } from './types';

// Code Splitting & Lazy Loading for below-the-fold components
const BestSellers = lazy(() => import('./components/BestSellers').then(module => ({ default: module.BestSellers })));
const KitchenSection = lazy(() => import('./components/KitchenSection').then(module => ({ default: module.KitchenSection })));
const BannerImageSection = lazy(() => import('./components/BannerImageSection').then(module => ({ default: module.BannerImageSection })));
const TestimonialSlider = lazy(() => import('./components/TestimonialSlider').then(module => ({ default: module.TestimonialSlider })));
const VideoSection = lazy(() => import('./components/VideoSection').then(module => ({ default: module.VideoSection })));
const ZomatoSection = lazy(() => import('./components/ZomatoSection').then(module => ({ default: module.ZomatoSection })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));

// Minimal skeleton while lazy sections load
const SectionSkeleton = () => (
  <div className="w-full h-64 bg-[#EACEAA]/50 animate-pulse" />
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-[#34150F] flex flex-col relative selection:bg-[#34150F] selection:text-[#EACEAA]">
      {/* Global Header (Persistent with dynamic scroll style) */}
      <Header onOpenMenu={() => setIsMenuOpen(true)} />

      {/* Section 1 — Hero / Banner (always eager loaded) */}
      <HeroBanner />

      <div className="bg-[#EACEAA] relative z-10 w-full flex flex-col flex-1">
        <main className="flex-1 w-full flex flex-col">
          {/* Section 2 — Feature Highlight (eager, above the fold) */}
          <FeatureHighlight />

          <Suspense fallback={<SectionSkeleton />}>
            {/* Section 3 — Best Sellers */}
            <BestSellers />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            {/* Section 4 — Kitchen & Ingredients */}
            <KitchenSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            {/* Section 5 — Banner Image */}
            <BannerImageSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            {/* Section 6 — Testimonials */}
            <TestimonialSlider />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            {/* Section 7 — Ambient Video Gallery */}
            <VideoSection onOpenMenu={() => setIsMenuOpen(true)} />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            {/* Section 8 — Zomato Link */}
            <ZomatoSection />
          </Suspense>

          <Suspense fallback={<div className="h-32 bg-[#34150F]" />}>
            {/* Section 9 — Minimal Footer */}
            <Footer />
          </Suspense>
        </main>
      </div>

      {/* Interactive Menu Modal */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}
