import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useCms } from '../context/CmsContext';
import { PartnerLogo } from '../types';
import { ChevronLeft, ChevronRight, Handshake, Sparkles, Building2 } from 'lucide-react';

function getPartnerAbbreviation(name: string, logoText?: string): string {
  if (logoText && !logoText.startsWith('data:') && !logoText.startsWith('http')) {
    return logoText;
  }
  if (!name) return 'PRTN';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 3) {
    return words.slice(0, 4).map((w) => w[0].toUpperCase()).join('');
  } else if (words.length === 2) {
    return (words[0].substring(0, 2) + words[1].substring(0, 2)).toUpperCase();
  } else {
    return name.substring(0, 4).toUpperCase();
  }
}

export const PartnersSection: React.FC = () => {
  const { partners } = useCms();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch partners data from CmsContext
  const displayPartners: PartnerLogo[] = partners && partners.length > 0 ? partners : [];

  // Update navigation scroll state
  const updateScrollState = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Estimate active index based on item width
      const firstChild = scrollRef.current.firstElementChild as HTMLElement;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth + 20; // width + gap
        const index = Math.round(scrollLeft / itemWidth);
        setCurrentIndex(Math.max(0, Math.min(index, displayPartners.length - 1)));
      }
    }
  }, [displayPartners.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, displayPartners]);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const items = scrollRef.current.children;
    if (items[index]) {
      const targetItem = items[index] as HTMLElement;
      scrollRef.current.scrollTo({
        left: targetItem.offsetLeft - scrollRef.current.offsetLeft - 16,
        behavior: 'smooth',
      });
    }
  };

  const scrollByDirection = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Auto-play interval
  useEffect(() => {
    if (isPaused || displayPartners.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // If at end, loop back to beginning
      if (scrollLeft >= scrollWidth - clientWidth - 20) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const firstChild = scrollRef.current.firstElementChild as HTMLElement;
        const itemWidth = firstChild ? firstChild.offsetWidth + 20 : clientWidth * 0.5;
        scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, displayPartners.length]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. CONTAINER: Soft light-lavender rounded section */}
      <div className="bg-purple-50/70 rounded-3xl p-6 sm:p-10 lg:p-12 border border-purple-100/80 text-center space-y-8 shadow-xs relative overflow-hidden">
        {/* 2. HEADER */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {/* Badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-purple-700 bg-purple-100/90 px-4 py-1.5 rounded-full border border-purple-200/80 shadow-2xs">
              <Handshake className="w-3.5 h-3.5 text-purple-600" />
              <span>STRATEGIC NETWORK</span>
            </span>
          </div>
          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl font-black text-purple-950 font-display tracking-tight">
            PARTNERS & COLLABORATORS
          </h2>
          {/* Subtitle */}
          <p className="text-gray-600 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Collaborating with human rights bodies, legal societies, youth networks, and educational boards.
          </p>
        </div>

        {/* 3. SLIDER CONTROLS BAR & STATUS */}
        {displayPartners.length > 0 && (
          <div className="flex items-center justify-between px-2 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 bg-purple-100/90 px-3 py-1 rounded-full uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-purple-700" />
                <span>
                  {displayPartners.length} {displayPartners.length === 1 ? 'Partner' : 'Partners & Allies'}
                </span>
              </span>
              <span className="hidden sm:inline-block text-xs text-gray-500 font-medium">
                (Swipe or use controls to browse)
              </span>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByDirection('left')}
                disabled={!canScrollLeft}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'bg-white text-purple-950 border-purple-200 shadow-sm hover:bg-purple-800 hover:text-white hover:border-purple-800 active:scale-95'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                }`}
                aria-label="Previous partners"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByDirection('right')}
                disabled={!canScrollRight}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  canScrollRight
                    ? 'bg-white text-purple-950 border-purple-200 shadow-sm hover:bg-purple-800 hover:text-white hover:border-purple-800 active:scale-95'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                }`}
                aria-label="Next partners"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 4. PARTNERS CAROUSEL SLIDER */}
        {displayPartners.length > 0 ? (
          <div
            className="relative select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 px-1 scrollbar-none hardware-accelerated"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {displayPartners.map((partner, idx) => {
                const isImage =
                  partner.logoText &&
                  (partner.logoText.startsWith('data:') ||
                    partner.logoText.startsWith('http://') ||
                    partner.logoText.startsWith('https://'));

                const abbreviation = getPartnerAbbreviation(partner.name, partner.logoText);

                return (
                  <div
                    key={partner.name || idx}
                    className="shrink-0 w-[82%] sm:w-[46%] md:w-[45%] lg:w-[23.5%] snap-start"
                  >
                    <div className="bg-white h-full p-6 rounded-3xl border border-purple-100/90 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between items-center text-center space-y-4 group relative overflow-hidden min-h-[220px]">
                      {/* Subtle top ambient glow */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Top: Soft-purple rounded frame containing abbreviation or logo image */}
                      <div className="w-16 h-16 rounded-2xl bg-purple-100/90 text-purple-900 font-black flex items-center justify-center text-sm tracking-wider shadow-2xs group-hover:scale-105 group-hover:bg-purple-200 transition-all overflow-hidden p-2 flex-shrink-0 hardware-accelerated border-2 border-purple-100">
                        {isImage ? (
                          <img
                            src={partner.logoText || undefined}
                            alt={partner.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain rounded-xl"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="select-none font-black text-purple-900">{abbreviation}</span>
                        )}
                      </div>

                      {/* Middle: Partner Full Name in bold dark purple text */}
                      <div className="space-y-1.5 w-full">
                        <h3 className="text-base sm:text-lg font-extrabold font-display text-purple-950 leading-snug group-hover:text-purple-800 transition-colors line-clamp-2">
                          {partner.name}
                        </h3>

                        {/* Bottom: Category/Type pill */}
                        <div className="pt-1">
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100/90 px-3 py-0.5 rounded-full border border-purple-200/60 shadow-2xs truncate max-w-full">
                            {partner.category || 'Strategic Partner'}
                          </span>
                        </div>
                      </div>

                      {/* Subtle decorative bottom footer tag */}
                      <div className="w-full pt-2 border-t border-purple-50 flex items-center justify-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                        <span>Verified Collaborator</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Dot Indicators */}
            {displayPartners.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-4">
                {displayPartners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx ? 'w-7 bg-purple-800' : 'w-2 bg-purple-200 hover:bg-purple-300'
                    }`}
                    aria-label={`Go to partner slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-500 italic py-6">
            No partner organizations added yet.
          </div>
        )}
      </div>
    </section>
  );
};
