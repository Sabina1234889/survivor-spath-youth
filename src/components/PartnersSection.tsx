import React from 'react';
import { useCms } from '../context/CmsContext';
import { PartnerLogo } from '../types';

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

  // Fetch partners data from CmsContext (Local Storage array)
  const displayPartners: PartnerLogo[] = partners && partners.length > 0 ? partners : [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. CONTAINER: A large, soft light-lavender rounded rectangle containing the entire section */}
      <div className="bg-purple-50/70 rounded-3xl p-8 sm:p-12 lg:p-14 border border-purple-100/80 text-center space-y-10 shadow-xs">
        {/* 2. HEADER */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {/* Badge */}
          <div>
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-purple-700 bg-purple-100/90 px-4 py-1.5 rounded-full border border-purple-200/80 shadow-2xs">
              STRATEGIC NETWORK
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

        {/* 3. PARTNER CARDS (Grid Layout) */}
        {displayPartners.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
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
                  className="bg-white p-5 rounded-2xl border border-purple-100/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all hardware-accelerated flex flex-col items-center justify-center text-center space-y-3 group cursor-default"
                >
                  {/* Top: Small soft-purple rounded square containing abbreviation/initials or logo image */}
                  <div className="w-12 h-12 rounded-2xl bg-purple-100/90 text-purple-900 font-black flex items-center justify-center text-xs tracking-wider shadow-2xs group-hover:scale-105 group-hover:bg-purple-200 transition-all overflow-hidden p-1 flex-shrink-0 hardware-accelerated">
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
                  <div className="text-xs sm:text-sm font-extrabold text-purple-950 leading-snug line-clamp-2">
                    {partner.name}
                  </div>

                  {/* Bottom: Category/Type in lighter grey/purple text */}
                  <div className="text-[11px] font-medium text-purple-700/80 tracking-wide line-clamp-1">
                    {partner.category}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-gray-500 italic py-4">
            No partner organizations added yet.
          </div>
        )}
      </div>
    </section>
  );
};
