import React, { useRef, useState, useEffect, useCallback } from 'react';
import { TeamMember, getMemberCategories } from '../types';
import { Mail, Linkedin, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { TeamCarouselSkeleton } from './common/SkeletonLoader';
import { useCms } from '../context/CmsContext';

interface TeamCarouselProps {
  members: TeamMember[];
  autoPlayInterval?: number; // ms, 0 for off
  showCategoryBadge?: boolean;
  isLoading?: boolean;
}

export const TeamCarousel: React.FC<TeamCarouselProps> = ({
  members,
  autoPlayInterval = 4000,
  showCategoryBadge = true,
  isLoading: propIsLoading,
}) => {
  const { isLoading: contextIsLoading } = useCms();
  const isLoading = propIsLoading !== undefined ? propIsLoading : contextIsLoading;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Update scroll bounds and active index
  const updateScrollStatus = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active index
    const totalItems = members.length;
    if (totalItems <= 1) {
      setCurrentIndex(0);
      return;
    }
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setCurrentIndex(0);
      return;
    }
    const progress = Math.max(0, Math.min(1, scrollLeft / maxScroll));
    const calculatedIndex = Math.round(progress * (totalItems - 1));
    setCurrentIndex(calculatedIndex);
  }, [members.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollStatus();
    const handleScroll = () => {
      window.requestAnimationFrame(updateScrollStatus);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateScrollStatus, members]);

  // Scroll to direction
  const scrollByCard = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.firstElementChild as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 20 : 320;
    const delta = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: delta,
      behavior: 'smooth',
    });
  };

  // Scroll to index
  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const items = container.children;
    if (items[index]) {
      (items[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    }
  };

  // Autoplay functionality (pauses when hovering or dragging)
  useEffect(() => {
    if (!autoPlayInterval || isHovered || isDragging || members.length <= 1) return;

    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft >= scrollWidth - clientWidth - 20) {
        // Loop back to start
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByCard('right');
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlayInterval, isHovered, isDragging, members.length]);

  // Mouse Drag Handlers for Desktop Swiping
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Prevent layout shift: while loading or when data is empty
  if (isLoading) {
    return <TeamCarouselSkeleton />;
  }

  if (members.length === 0) {
    return (
      <div className="min-h-[380px] flex items-center justify-center bg-purple-50/50 rounded-3xl border border-purple-100 p-8 text-center">
        <p className="text-sm font-semibold text-purple-900/70">
          No team members found in this category.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative space-y-6 select-none min-h-[420px] sm:min-h-[440px] animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseUpOrLeave();
      }}
    >
      {/* Slider Controls Header / Status bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 bg-purple-100/90 px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>
              {members.length} {members.length === 1 ? 'Hero' : 'Heroes & Leaders'}
            </span>
          </span>
          <span className="hidden sm:inline-block text-xs text-gray-500 font-medium">
            (Swipe or use arrows to navigate)
          </span>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              canScrollLeft
                ? 'bg-white text-purple-950 border-purple-200 shadow-sm hover:bg-purple-800 hover:text-white hover:border-purple-800 active:scale-95'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
            }`}
            aria-label="Previous team member"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => scrollByCard('right')}
            disabled={!canScrollRight}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              canScrollRight
                ? 'bg-white text-purple-950 border-purple-200 shadow-sm hover:bg-purple-800 hover:text-white hover:border-purple-800 active:scale-95'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
            }`}
            aria-label="Next team member"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track with Touch & Drag Support */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        className={`flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-3 px-1 snap-x snap-mandatory scroll-smooth ${
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {members.map((member, idx) => (
          <div
            key={member.id || idx}
            className="shrink-0 w-[84%] sm:w-[46%] md:w-[44%] lg:w-[31%] xl:w-[23.5%] snap-start"
          >
            <div className="bg-white h-full rounded-3xl border border-purple-100 hover:border-purple-300 p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between items-center text-center space-y-4 group">
              {/* Circular Photo Frame */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full rounded-full object-cover border-4 border-purple-100 ring-4 ring-purple-600/10 group-hover:scale-105 transition-transform duration-300 shadow-md pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-purple-100 border-4 border-purple-100 ring-4 ring-purple-600/10 text-purple-900 font-extrabold text-2xl flex items-center justify-center shadow-md">
                    {(member.name || 'U').charAt(0)}
                  </div>
                )}
              </div>

              {/* Member Details */}
              <div className="w-full space-y-2">
                {showCategoryBadge && (
                  <div className="flex flex-wrap items-center justify-center gap-1 max-w-full">
                    {getMemberCategories(member).map((cat) => (
                      <span
                        key={cat}
                        className="inline-block text-[9px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100/90 px-2 py-0.5 rounded-full shadow-2xs truncate"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="text-lg font-extrabold text-purple-950 font-display leading-snug group-hover:text-purple-800 transition-colors line-clamp-1">
                  {member.name}
                </h3>

                <p className="text-xs font-bold text-purple-700 uppercase tracking-wide line-clamp-1">
                  {member.role}
                </p>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 pt-1 text-center">
                  {member.bio}
                </p>
              </div>

              {/* Footer / Contact Social Icons */}
              <div className="w-full pt-3 border-t border-purple-50 flex items-center justify-between text-xs text-gray-500">
                <span className="text-[10px] font-semibold text-purple-900/60 uppercase tracking-wider">
                  SPY Team
                </span>

                <div className="flex items-center gap-1.5">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-800 hover:text-white transition-all shadow-2xs"
                      title={`Email ${member.name}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-800 hover:text-white transition-all shadow-2xs"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dot Indicators */}
      {members.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {members.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-7 bg-purple-800'
                  : 'w-2 bg-purple-200 hover:bg-purple-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
