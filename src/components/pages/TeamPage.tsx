import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Mail,
  Linkedin,
  Users,
  UserPlus,
  SlidersHorizontal,
  LayoutGrid,
  Filter,
  ChevronDown,
  X,
  Check,
  Award,
} from 'lucide-react';
import { TeamCarousel } from '../TeamCarousel';
import { TeamGridSkeleton, TeamCarouselSkeleton } from '../common/SkeletonLoader';
import { getMemberCategories } from '../../types';

export const TeamPage: React.FC = () => {
  const { teamMembers, teamCategories, isLoading } = useCms();
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Dedicated list of Chief Advisors (members tagged as Chief Advisor)
  const chiefAdvisors = teamMembers.filter((m) => {
    const cats = getMemberCategories(m);
    return cats.some((c) => c.toLowerCase() === 'chief advisor');
  });

  // Regular operational team members (excluding exclusive Chief Advisors)
  const regularTeamMembers = teamMembers.filter((m) => {
    const cats = getMemberCategories(m);
    return !cats.every((c) => c.toLowerCase() === 'chief advisor');
  });

  // Combine managed categories for regular team members (excluding Chief Advisor tab)
  const categoriesList = Array.from(
    new Set([
      'ALL',
      ...(teamCategories || []).filter((c) => c.toLowerCase() !== 'chief advisor'),
      ...regularTeamMembers
        .flatMap((m) => getMemberCategories(m))
        .filter((c) => c.toLowerCase() !== 'chief advisor'),
    ])
  );

  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredMembers =
    activeCategory === 'ALL'
      ? regularTeamMembers
      : regularTeamMembers.filter((m) => {
          const cats = getMemberCategories(m);
          return cats.some((c) => c.toLowerCase() === activeCategory.toLowerCase());
        });

  const getCategoryCount = (cat: string) => {
    if (cat === 'ALL') return regularTeamMembers.length;
    return regularTeamMembers.filter((m) =>
      getMemberCategories(m).some((c) => c.toLowerCase() === cat.toLowerCase())
    ).length;
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white py-14 sm:py-16 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-800/80 px-3.5 py-1 rounded-full border border-purple-600">
            PEOPLE BEHIND THE CAUSE
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight">
            Our Team & Heroes
          </h1>
          <p className="text-base sm:text-lg text-purple-200 font-medium max-w-2xl mx-auto">
            Passionate organizers, human rights advisors, program leads, and youth volunteers dedicated to Survivor’s Path Youth.
          </p>
        </div>
      </section>

      {/* Category Tabs & View Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-3.5 border-b border-purple-100/90 pb-4">
          {/* MOBILE VIEW: Compact Toggle Button + View Switcher */}
          <div className="flex items-center justify-between gap-2.5 sm:hidden">
            {/* Category Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(true)}
              className="flex-1 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 active:bg-purple-200 border border-purple-200 text-purple-950 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Filter className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span className="truncate">
                  {activeCategory === 'ALL' ? 'Filter Categories' : activeCategory}
                </span>
                <span className="text-[10px] bg-purple-200/80 text-purple-900 px-1.5 py-0.5 rounded-full font-extrabold shrink-0">
                  {filteredMembers.length}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-purple-700 shrink-0" />
            </button>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-purple-100/80 p-1 rounded-xl shrink-0 border border-purple-200/50">
              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-white text-purple-950 shadow-xs'
                    : 'text-purple-900/70 hover:text-purple-950'
                }`}
                title="Slider View"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-700" />
                <span className="text-[11px]">Slider</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-purple-950 shadow-xs'
                    : 'text-purple-900/70 hover:text-purple-950'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-purple-700" />
                <span className="text-[11px]">Grid</span>
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW: Full Horizontal Filter Pills */}
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none py-1.5 scroll-smooth flex-nowrap">
              {categoriesList.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap active:scale-95 select-none ${
                      isActive
                        ? 'bg-purple-800 text-white shadow-sm ring-2 ring-purple-800/30'
                        : 'bg-purple-50 text-purple-950 hover:bg-purple-100 hover:text-purple-800 border border-purple-100/90'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Desktop Sub-Bar: Active Category Info & Slider/Grid View Switcher */}
            <div className="flex items-center justify-between gap-3 pt-2.5">
              <div className="text-xs text-purple-900 font-semibold truncate flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-700 inline-block shrink-0" />
                <span className="truncate">
                  Showing <strong className="text-purple-950 font-extrabold">{filteredMembers.length}</strong> {filteredMembers.length === 1 ? 'member' : 'members'}
                  {activeCategory !== 'ALL' && (
                    <> in <span className="font-extrabold text-purple-800">"{activeCategory}"</span></>
                  )}
                </span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-purple-100/80 p-1 rounded-xl shrink-0 border border-purple-200/50">
                <button
                  type="button"
                  onClick={() => setViewMode('slider')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'slider'
                      ? 'bg-white text-purple-950 shadow-xs'
                      : 'text-purple-900/70 hover:text-purple-950'
                  }`}
                  title="Carousel Slider View"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-purple-700" />
                  <span>Slider View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-purple-950 shadow-xs'
                      : 'text-purple-900/70 hover:text-purple-950'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-purple-700" />
                  <span>Grid View</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY DROPDOWN / MODAL POPUP (SMOOTH ANIMATION & AUTO-CLOSE) */}
        {isCategoryDropdownOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-purple-950/60 backdrop-blur-xs transition-opacity duration-200"
              onClick={() => setIsCategoryDropdownOpen(false)}
            />

            {/* Popup Box / Sheet */}
            <div className="relative z-10 bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-purple-100 shadow-2xl p-5 max-h-[85vh] flex flex-col space-y-4 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-purple-950">Select Category</h3>
                    <p className="text-[11px] text-purple-800/70 font-medium">Filter team profiles by designated role or branch</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-purple-950 hover:bg-purple-50 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Options List */}
              <div className="overflow-y-auto max-h-[55vh] space-y-1.5 pr-1 no-scrollbar">
                {categoriesList.map((cat) => {
                  const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                  const count = getCategoryCount(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left active:scale-98 ${
                        isActive
                          ? 'bg-purple-800 text-white shadow-md'
                          : 'bg-purple-50/70 hover:bg-purple-100 text-purple-950 border border-purple-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black border shrink-0 ${
                            isActive
                              ? 'bg-white text-purple-900 border-white'
                              : 'bg-purple-100/80 border-purple-300 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span className="uppercase tracking-wider truncate">{cat}</span>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-purple-200/90 text-purple-950'
                        }`}
                      >
                        {count} {count === 1 ? 'member' : 'members'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Content Display: Slider or Grid */}
        {isLoading ? (
          viewMode === 'slider' ? (
            <div className="py-2 min-h-[420px]">
              <TeamCarouselSkeleton />
            </div>
          ) : (
            <div className="min-h-[420px]">
              <TeamGridSkeleton count={8} />
            </div>
          )
        ) : filteredMembers.length > 0 ? (
          viewMode === 'slider' ? (
            <div className="py-2 min-h-[420px] animate-fade-in">
              <TeamCarousel members={filteredMembers} autoPlayInterval={4500} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in min-h-[420px]">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all duration-300 hardware-accelerated p-6 space-y-4 flex flex-col justify-between items-center text-center group"
                >
                  <div className="space-y-4 flex flex-col items-center w-full">
                    {/* Circular Photo Frame */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                      {member.photo ? (
                        <img
                          src={member.photo || undefined}
                          alt={member.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full rounded-full object-cover border-4 border-purple-100 ring-4 ring-purple-600/10 shadow-md group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-purple-100 border-4 border-purple-100 ring-4 ring-purple-600/10 text-purple-900 font-extrabold text-2xl flex items-center justify-center shadow-md">
                          {(member.name || 'U').charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="w-full space-y-2">
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
                  </div>

                  {/* Contact Icons */}
                  <div className="w-full pt-3 border-t border-purple-50 flex items-center justify-between text-xs text-gray-500">
                    <span className="text-[10px] font-semibold text-purple-900/60 uppercase tracking-wider">
                      SPY Team
                    </span>
                    <div className="flex items-center gap-1.5">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
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
                          className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-800 hover:text-white transition-all shadow-2xs"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center space-y-3 max-w-md mx-auto shadow-xs min-h-[300px] flex flex-col justify-center items-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-purple-950">No profiles in this category yet</h3>
            <p className="text-xs text-gray-500">
              Profiles added via the Admin Panel under "{activeCategory}" will automatically appear here.
            </p>
          </div>
        )}

        {/* ESTEEMED CHIEF ADVISORS DEDICATED SECTION */}
        {(isLoading || chiefAdvisors.length > 0) && (
          <section className="mt-16 pt-12 border-t border-purple-100/90 space-y-8">
            {/* Section Heading */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200/80 text-[11px] font-extrabold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-purple-700" />
                  <span>Strategic Mentorship & Governance</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-purple-950">
                  Our Esteemed Chief Advisors
                </h2>
                <p className="text-xs sm:text-sm text-purple-900/80 font-medium leading-relaxed">
                  Distinguished legal advocates, health practitioners, and governance specialists guiding the strategic direction and safeguarding standards of Survivor’s Path Youth.
                </p>
              </div>

              <div className="text-xs font-bold text-purple-700 bg-purple-100/80 px-3.5 py-1.5 rounded-xl border border-purple-200/50 shrink-0 self-start sm:self-auto">
                {isLoading ? '...' : chiefAdvisors.length} {chiefAdvisors.length === 1 ? 'Advisor' : 'Advisors'} Guiding Our Mission
              </div>
            </div>

            {/* Chief Advisors Carousel Slider */}
            <div className="py-2 min-h-[420px]">
              {isLoading ? (
                <TeamCarouselSkeleton />
              ) : (
                <TeamCarousel
                  members={chiefAdvisors}
                  autoPlayInterval={5000}
                  showCategoryBadge={true}
                />
              )}
            </div>
          </section>
        )}

        {/* Join Team Banner */}
        <div className="mt-16 bg-purple-50 rounded-2xl p-6 border border-purple-100 text-center space-y-2 max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center mx-auto">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-purple-950">
            Want to join our core team or volunteer network?
          </h4>
          <p className="text-xs text-gray-600">
            We periodically recruit campus ambassadors, legal associates, and event managers across Bangladesh.
          </p>
        </div>
      </section>
    </div>
  );
};

