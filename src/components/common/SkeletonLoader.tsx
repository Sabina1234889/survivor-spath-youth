import React from 'react';

/**
 * Skeleton placeholder for individual Team & Chief Advisor cards.
 * Exact shape and dimensions of the live TeamCard (rounded-3xl, p-6, avatar, title, role, bio, footer).
 */
export const TeamCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-purple-100/90 p-6 shadow-xs flex flex-col justify-between items-center text-center space-y-4 relative overflow-hidden min-h-[360px] sm:min-h-[380px] animate-pulse">
      {/* Top subtle bar */}
      <div className="w-12 h-1 bg-purple-100 rounded-full mx-auto" />

      {/* Top Section: Avatar + Details */}
      <div className="space-y-4 flex flex-col items-center w-full">
        {/* Avatar Circle */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-purple-100/80 border-4 border-purple-50 ring-4 ring-purple-600/5 relative" />

        {/* Categories / Tag Badges */}
        <div className="flex items-center justify-center gap-1.5">
          <div className="h-4 w-16 bg-purple-100 rounded-full" />
          <div className="h-4 w-12 bg-purple-100/60 rounded-full" />
        </div>

        {/* Member Name */}
        <div className="h-5 w-3/4 bg-purple-200/70 rounded-md mx-auto" />

        {/* Member Role */}
        <div className="h-3.5 w-1/2 bg-purple-100 rounded-md mx-auto" />

        {/* Bio lines */}
        <div className="space-y-2 w-full pt-1">
          <div className="h-2.5 w-full bg-gray-100 rounded-full" />
          <div className="h-2.5 w-5/6 bg-gray-100 rounded-full mx-auto" />
          <div className="h-2.5 w-2/3 bg-gray-100 rounded-full mx-auto" />
        </div>
      </div>

      {/* Footer / Social placeholders */}
      <div className="w-full pt-3 border-t border-purple-50 flex items-center justify-between">
        <div className="h-3 w-20 bg-purple-100/60 rounded-md" />
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-purple-50" />
          <div className="w-7 h-7 rounded-lg bg-purple-50" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton placeholder for the Team & Advisors horizontal Carousel Slider.
 */
export const TeamCarouselSkeleton: React.FC = () => {
  return (
    <div className="relative space-y-6 select-none min-h-[420px] sm:min-h-[440px] animate-fade-in">
      {/* Slider Controls Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="h-6 w-36 bg-purple-100 rounded-full animate-pulse" />
          <div className="hidden sm:block h-3.5 w-44 bg-purple-50 rounded-md animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-50 border border-purple-100 animate-pulse" />
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-50 border border-purple-100 animate-pulse" />
        </div>
      </div>

      {/* Slider items row */}
      <div className="flex gap-4 sm:gap-6 overflow-hidden py-2 px-1">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="shrink-0 w-[84%] sm:w-[46%] md:w-[44%] lg:w-[31%] xl:w-[23.5%]"
          >
            <TeamCardSkeleton />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        <div className="h-2 w-7 bg-purple-200 rounded-full animate-pulse" />
        <div className="h-2 w-2 bg-purple-100 rounded-full animate-pulse" />
        <div className="h-2 w-2 bg-purple-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

/**
 * Skeleton placeholder for individual Partner cards.
 */
export const PartnerCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-purple-100/90 p-6 shadow-xs flex flex-col justify-between items-center text-center space-y-4 min-h-[220px] animate-pulse">
      {/* Top logo frame */}
      <div className="w-16 h-16 rounded-2xl bg-purple-100/80 border-2 border-purple-50" />

      {/* Partner name */}
      <div className="space-y-2 w-full">
        <div className="h-4 w-3/4 bg-purple-200/70 rounded-md mx-auto" />
        <div className="h-3 w-1/2 bg-purple-100 rounded-full mx-auto" />
      </div>

      {/* Footer */}
      <div className="w-full pt-2 border-t border-purple-50 flex items-center justify-center">
        <div className="h-2.5 w-24 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
};

/**
 * Skeleton placeholder for the Partners horizontal Carousel.
 */
export const PartnersCarouselSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 select-none min-h-[320px] animate-fade-in">
      {/* Controls Bar */}
      <div className="flex items-center justify-between px-2 sm:px-4">
        <div className="h-6 w-32 bg-purple-100/80 rounded-full animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-100/80 animate-pulse" />
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-100/80 animate-pulse" />
        </div>
      </div>

      {/* Cards Row */}
      <div className="flex gap-4 sm:gap-5 overflow-hidden py-3 px-1">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="shrink-0 w-[82%] sm:w-[46%] md:w-[45%] lg:w-[23.5%]"
          >
            <PartnerCardSkeleton />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        <div className="h-2 w-7 bg-purple-200 rounded-full animate-pulse" />
        <div className="h-2 w-2 bg-purple-100 rounded-full animate-pulse" />
        <div className="h-2 w-2 bg-purple-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

/**
 * Generic Grid Skeleton for Team & Member pages.
 */
export const TeamGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {Array.from({ length: count }).map((_, idx) => (
        <TeamCardSkeleton key={idx} />
      ))}
    </div>
  );
};
