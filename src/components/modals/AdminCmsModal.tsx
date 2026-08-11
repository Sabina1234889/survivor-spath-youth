import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { X, Save, RotateCcw, Layout, Users, BarChart3, Calendar, PhoneCall, Sparkles, Plus, Trash2 } from 'lucide-react';

export const AdminCmsModal: React.FC = () => {
  const {
    siteContent,
    updateHero,
    updateWhoWeAre,
    updateFocusAreas,
    updateStats,
    updateFeaturedEvent,
    updateCta,
    updateContactInfo,
    resetToDefaults,
    isAdminOpen,
    setIsAdminOpen,
  } = useCms();

  const [activeTab, setActiveTab] = useState<
    'hero' | 'whoWeAre' | 'focus' | 'stats' | 'event' | 'ctaAndContact'
  >('hero');

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-purple-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-purple-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-800/80 border border-purple-600 flex items-center justify-center text-purple-200">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-display">CMS Admin Content Editor</h2>
              <p className="text-xs text-purple-200">
                Live edit home page text, numbers, featured events & contact details
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 rounded-xl text-purple-200 hover:text-white hover:bg-purple-800/60 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-purple-50 border-b border-purple-100 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Hero Section</span>
          </button>

          <button
            onClick={() => setActiveTab('whoWeAre')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'whoWeAre'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Who We Are</span>
          </button>

          <button
            onClick={() => setActiveTab('focus')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'focus'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Focus Pillars (6)</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Impact Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('event')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'event'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Featured Event</span>
          </button>

          <button
            onClick={() => setActiveTab('ctaAndContact')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ctaAndContact'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>CTA & Contact</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-purple-900 tracking-wider">
                Edit Hero Banner Content
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero.badge}
                    onChange={(e) => updateHero({ badge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={siteContent.hero.primaryBtnText}
                    onChange={(e) => updateHero({ primaryBtnText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Main Headline Part 1
                </label>
                <input
                  type="text"
                  value={siteContent.hero.headline}
                  onChange={(e) => updateHero({ headline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Main Headline Part 2 (Gradient Highlight)
                </label>
                <input
                  type="text"
                  value={siteContent.hero.headlineHighlight}
                  onChange={(e) => updateHero({ headlineHighlight: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Subheadline / Paragraph
                </label>
                <textarea
                  rows={3}
                  value={siteContent.hero.subheadline}
                  onChange={(e) => updateHero({ subheadline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Background Image Image URL
                </label>
                <input
                  type="text"
                  value={siteContent.hero.bgImage}
                  onChange={(e) => updateHero({ bgImage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: WHO WE ARE */}
          {activeTab === 'whoWeAre' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-purple-900 tracking-wider">
                Edit Who We Are Section
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={siteContent.whoWeAre.title}
                  onChange={(e) => updateWhoWeAre({ title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Intro Description
                </label>
                <textarea
                  rows={4}
                  value={siteContent.whoWeAre.description}
                  onChange={(e) => updateWhoWeAre({ description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Highlight Bullet 1
                  </label>
                  <input
                    type="text"
                    value={siteContent.whoWeAre.bullet1}
                    onChange={(e) => updateWhoWeAre({ bullet1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Highlight Bullet 2
                  </label>
                  <input
                    type="text"
                    value={siteContent.whoWeAre.bullet2}
                    onChange={(e) => updateWhoWeAre({ bullet2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Highlight Bullet 3
                  </label>
                  <input
                    type="text"
                    value={siteContent.whoWeAre.bullet3}
                    onChange={(e) => updateWhoWeAre({ bullet3: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Section Photo URL
                </label>
                <input
                  type="text"
                  value={siteContent.whoWeAre.image}
                  onChange={(e) => updateWhoWeAre({ image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: FOCUS AREAS */}
          {activeTab === 'focus' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-purple-900 tracking-wider">
                Edit Strategic Focus Areas (6 Cards Grid)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {siteContent.focusAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-800 uppercase">
                        Card #{idx + 1}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={area.title}
                      onChange={(e) => {
                        const next = [...siteContent.focusAreas];
                        next[idx].title = e.target.value;
                        updateFocusAreas(next);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                      placeholder="Title"
                    />
                    <textarea
                      rows={2}
                      value={area.description}
                      onChange={(e) => {
                        const next = [...siteContent.focusAreas];
                        next[idx].description = e.target.value;
                        updateFocusAreas(next);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: IMPACT STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-purple-900 tracking-wider">
                Edit Verified Impact Statistics (4 Counters)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {siteContent.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2"
                  >
                    <div className="text-xs font-bold text-purple-800 uppercase">
                      Statistic #{idx + 1}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const next = [...siteContent.stats];
                          next[idx].value = e.target.value;
                          updateStats(next);
                        }}
                        className="w-24 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-bold text-purple-950 focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                        placeholder="e.g. 132+"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const next = [...siteContent.stats];
                          next[idx].label = e.target.value;
                          updateStats(next);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                        placeholder="Label"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={stat.description}
                      onChange={(e) => {
                        const next = [...siteContent.stats];
                        next[idx].description = e.target.value;
                        updateStats(next);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                      placeholder="Short Description"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FEATURED EVENT */}
          {activeTab === 'event' && (() => {
            const currentFeatEvent = siteContent.featuredEvent || {
              id: 'event-youth-fest-2026',
              title: 'SURVIVOR’S PATH YOUTH FEST 2026',
              date: '21 August 2026',
              location: 'Jessore, Bangladesh',
              shortDescription: 'A flagship youth-focused festival celebrating empowerment.',
              fullDescription: '',
              isFeatured: true,
              image: '',
              status: 'upcoming' as const,
            };
            return (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-purple-900 tracking-wider">
                  Edit Flagship Featured Event
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={currentFeatEvent.title}
                    onChange={(e) =>
                      updateFeaturedEvent({ ...currentFeatEvent, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Event Date
                    </label>
                    <input
                      type="text"
                      value={currentFeatEvent.date}
                      onChange={(e) =>
                        updateFeaturedEvent({ ...currentFeatEvent, date: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={currentFeatEvent.location}
                      onChange={(e) =>
                        updateFeaturedEvent({
                          ...currentFeatEvent,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={currentFeatEvent.shortDescription}
                    onChange={(e) =>
                      updateFeaturedEvent({
                        ...currentFeatEvent,
                        shortDescription: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={currentFeatEvent.image}
                    onChange={(e) =>
                      updateFeaturedEvent({ ...currentFeatEvent, image: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>
            );
          })()}

          {/* TAB 6: CTA & CONTACT */}
          {activeTab === 'ctaAndContact' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-purple-900 tracking-wider">
                Edit CTA Banner & Contact Details
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  CTA Banner Headline
                </label>
                <input
                  type="text"
                  value={siteContent.cta.headline}
                  onChange={(e) => updateCta({ headline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  CTA Banner Subtext
                </label>
                <input
                  type="text"
                  value={siteContent.cta.description}
                  onChange={(e) => updateCta({ description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    value={siteContent.contactInfo.email}
                    onChange={(e) => updateContactInfo({ email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Helpline Phone Number
                  </label>
                  <input
                    type="text"
                    value={siteContent.contactInfo.phone}
                    onChange={(e) => updateContactInfo({ phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Office Location Text
                </label>
                <input
                  type="text"
                  value={siteContent.contactInfo.officeLocations}
                  onChange={(e) => updateContactInfo({ officeLocations: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-purple-50 border-t border-purple-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 rounded-xl border border-purple-300 text-purple-900 hover:bg-purple-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-purple-700" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply CMS Updates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
