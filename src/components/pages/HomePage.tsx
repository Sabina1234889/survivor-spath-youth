import React from 'react';
import { PageId, EventItem } from '../../types';
import { useCms } from '../../context/CmsContext';
import { PartnersSection } from '../PartnersSection';
import {
  Sparkles,
  GraduationCap,
  HeartHandshake,
  Users,
  Lightbulb,
  ShieldCheck,
  Calendar,
  MapPin,
  ArrowRight,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';

interface HomePageProps {
  setActivePage: (page: PageId) => void;
  onOpenEventRegister: (event?: EventItem) => void;
  onOpenProgramModal: (programId: string) => void;
  onOpenInvolvementModal: (type: 'Volunteer' | 'Partner With Us') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActivePage,
  onOpenEventRegister,
  onOpenProgramModal,
  onOpenInvolvementModal,
}) => {
  const { siteContent, events } = useCms();
  const { hero, whoWeAre, focusAreas, stats, cta } = siteContent;

  const featuredEvent =
    events.find((e) => e.isFeatured) ||
    (siteContent.featuredEvent && events.some((e) => e.id === siteContent.featuredEvent?.id)
      ? siteContent.featuredEvent
      : null) ||
    events[0] ||
    null;

  const getFocusIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-purple-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-purple-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-purple-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-purple-600" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6 text-purple-600" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-12">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden bg-purple-950 text-white rounded-b-[2.5rem] lg:rounded-b-[3.5rem] shadow-xl">
        {/* Background Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.bgImage || undefined}
            alt="Youth participating in educational activity"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Purple Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-purple-900/80 to-purple-950/70" />
          <div className="absolute inset-0 bg-radial from-purple-600/20 via-transparent to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-800/70 backdrop-blur-md border border-purple-400/30 text-purple-200 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>{hero.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.15] text-white max-w-4xl mx-auto drop-shadow-md">
            {hero.headline}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-300 to-indigo-200">
              {hero.headlineHighlight}
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-purple-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
            {hero.subheadline}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActivePage('events')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm tracking-wider uppercase text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/40 btn-3d-push cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{hero.primaryBtnText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage('get-involved')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm tracking-wider uppercase text-purple-100 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-purple-300/30 btn-3d-push cursor-pointer"
            >
              {hero.secondaryBtnText}
            </button>
          </div>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50/50 rounded-3xl p-8 sm:p-12 lg:p-16 border border-purple-100 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                WHO WE ARE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-950 font-display leading-tight">
                {whoWeAre.title}
              </h2>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                {whoWeAre.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-purple-900 bg-white px-3.5 py-2 rounded-xl border border-purple-100 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  {whoWeAre.bullet1}
                </span>
                <span className="flex items-center gap-2 text-xs font-semibold text-purple-900 bg-white px-3.5 py-2 rounded-xl border border-purple-100 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  {whoWeAre.bullet2}
                </span>
                <span className="flex items-center gap-2 text-xs font-semibold text-purple-900 bg-white px-3.5 py-2 rounded-xl border border-purple-100 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  {whoWeAre.bullet3}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white aspect-4/3">
                <img
                  src={whoWeAre.image || undefined}
                  alt="Students sitting in a school awareness program"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR FOCUS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full">
            OUR STRATEGIC PILLARS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-950 font-display">
            OUR FOCUS
          </h2>
          <p className="text-gray-600 text-base">
            Comprehensive domains designed to address gender-based safety, leadership, and youth well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusAreas.map((area, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-2xl border border-purple-100 shadow-xs card-3d-hover space-y-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100/80 group-hover:bg-purple-600 flex items-center justify-center transition-colors">
                {React.cloneElement(getFocusIcon(area.iconName), {
                  className: 'w-6 h-6 text-purple-700 group-hover:text-white transition-colors',
                })}
              </div>
              <h3 className="text-xl font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
                {area.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= IMPACT IN NUMBERS ================= */}
      <section className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-900/80 px-3.5 py-1 rounded-full border border-purple-700">
              VERIFIED IMPACT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              IMPACT IN NUMBERS
            </h2>
            <p className="text-purple-200/80 text-sm sm:text-base">
              Concrete milestones achieved through our dedicated campaigns and survivor interventions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-purple-900/40 backdrop-blur-md p-8 rounded-2xl border border-purple-700/50 text-center space-y-3 hover:border-purple-400/80 transition-colors group"
              >
                <div className="text-4xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200 group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-base font-bold text-white">{stat.label}</div>
                <p className="text-xs text-purple-200/70 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED EVENT ================= */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white rounded-3xl overflow-hidden shadow-xl border border-purple-800">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Content */}
              <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 space-y-6 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/80 text-purple-200 text-xs font-bold uppercase tracking-wider border border-purple-600">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>FLAGSHIP FEATURED EVENT</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white leading-tight">
                  {featuredEvent.title}
                </h2>

                <div className="flex flex-wrap gap-4 text-sm text-purple-200">
                  <span className="flex items-center gap-1.5 font-semibold bg-purple-900/80 px-3 py-1.5 rounded-lg border border-purple-700">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    {featuredEvent.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold bg-purple-900/80 px-3 py-1.5 rounded-lg border border-purple-700">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    {featuredEvent.location}
                  </span>
                </div>

                <p className="text-purple-100/90 text-base leading-relaxed">
                  {featuredEvent.shortDescription}
                </p>

                {/* Highlights Preview */}
                {featuredEvent.highlights && featuredEvent.highlights.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">
                      Event Highlights & Activities:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {featuredEvent.highlights.slice(0, 6).map((hl, i) => (
                        <div
                          key={i}
                          className="text-xs text-purple-200 bg-purple-900/50 px-2.5 py-1.5 rounded-md border border-purple-800 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setActivePage('events')}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-purple-950 bg-white hover:bg-purple-50 btn-3d-push shadow-md cursor-pointer"
                  >
                    View Event Details
                  </button>
                  <button
                    onClick={() => onOpenEventRegister(featuredEvent)}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 btn-3d-push shadow-md cursor-pointer"
                  >
                    Get Involved / Register
                  </button>
                </div>
              </div>

              {/* Right Photo */}
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
                <img
                  src={featuredEvent.image || undefined}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950 lg:bg-gradient-to-r lg:from-purple-950 lg:to-transparent" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= PARTNERS & COLLABORATORS ================= */}
      <PartnersSection />

      {/* ================= CALL TO ACTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-900 text-white rounded-3xl p-10 sm:p-16 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-tight">
              {cta.headline}
            </h2>
            <p className="text-purple-200/90 text-base sm:text-lg">
              {cta.description}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenInvolvementModal('Volunteer')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-purple-950 bg-white hover:bg-purple-50 btn-3d-push shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-purple-700" />
                <span>{cta.primaryBtnText}</span>
              </button>
              <button
                onClick={() => onOpenInvolvementModal('Partner With Us')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-700 hover:bg-purple-800 btn-3d-push shadow-md cursor-pointer"
              >
                {cta.secondaryBtnText}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
