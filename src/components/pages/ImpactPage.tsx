import React, { useState } from 'react';
import { OFFICIAL_STATS } from '../../data/mockData';
import { useCms } from '../../context/CmsContext';
import { ImpactStory } from '../../types';
import { CheckCircle2, Shield, Heart, ArrowRight, X } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { siteContent, impactStories } = useCms();
  const [selectedStory, setSelectedStory] = useState<ImpactStory | null>(null);
  const statsToDisplay = siteContent?.stats && siteContent.stats.length > 0 ? siteContent.stats : OFFICIAL_STATS;

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white py-16 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-800/80 px-3.5 py-1 rounded-full border border-purple-600">
            TRANSPARENT METRICS
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight">
            Our Impact
          </h1>
          <p className="text-base sm:text-lg text-purple-200 font-medium max-w-2xl mx-auto">
            Measurable progress in youth empowerment, legal advocacy, and survivor support across Bangladesh.
          </p>
        </div>
      </section>

      {/* Large Visual Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsToDisplay.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-purple-100 shadow-sm text-center space-y-3 hover:border-purple-300 transition-all hover:-translate-y-1"
            >
              <div className="text-5xl font-black font-display text-purple-900">
                {stat.value}
              </div>
              <h3 className="text-base font-bold text-purple-950">{stat.label}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full">
            REAL STORIES OF CHANGE
          </span>
          <h2 className="text-3xl font-extrabold text-purple-950 font-display">
            Stories from the Field
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impactStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-purple-100">
                  <img
                    src={story.image || undefined}
                    alt={story.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-purple-900 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                    {story.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-xs font-bold text-purple-700">{story.location}</span>
                  <h3 className="text-lg font-bold text-purple-950 leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{story.summary}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedStory(story)}
                  className="w-full py-2.5 rounded-xl border border-purple-200 text-xs font-bold uppercase tracking-wider text-purple-800 hover:bg-purple-700 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Read Full Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MAKING CHANGE THROUGH ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-14 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              ACTION FRAMEWORK
            </span>
            <h2 className="text-3xl font-extrabold font-display">
              Making Change Through Action
            </h2>
            <p className="text-purple-200 text-sm">
              How Survivor’s Path Youth translates institutional advocacy into tangible protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-purple-900/60 p-6 rounded-2xl border border-purple-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700/80 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Preventative Education</h3>
              <p className="text-xs text-purple-200/90 leading-relaxed">
                Directly engaging school boards, headmasters, and student councils to implement safe reporting channels and anti-harassment codes of conduct.
              </p>
            </div>

            <div className="bg-purple-900/60 p-6 rounded-2xl border border-purple-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700/80 flex items-center justify-center text-white">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Compassionate Care</h3>
              <p className="text-xs text-purple-200/90 leading-relaxed">
                Connecting survivors with free legal advocacy, medical consultation referrals, and confidential psychological counseling without red tape.
              </p>
            </div>

            <div className="bg-purple-900/60 p-6 rounded-2xl border border-purple-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700/80 flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Systemic Reform</h3>
              <p className="text-xs text-purple-200/90 leading-relaxed">
                Publishing youth research findings, presenting policy papers to ministry officials, and holding authorities accountable to legal standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              {selectedStory.category} • {selectedStory.location}
            </span>
            <h3 className="text-2xl font-extrabold text-purple-950 font-display">
              {selectedStory.title}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{selectedStory.fullStory}</p>
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedStory(null)}
                className="px-6 py-2 rounded-xl font-bold text-xs uppercase bg-purple-800 text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
