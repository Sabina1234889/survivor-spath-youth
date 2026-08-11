import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { EventItem } from '../../types';
import { Calendar, MapPin, Sparkles, CheckCircle2, Ticket } from 'lucide-react';

interface EventsPageProps {
  onOpenRegisterModal: (event?: EventItem) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onOpenRegisterModal }) => {
  const { events, siteContent } = useCms();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');

  const featuredEvent =
    events.find((e) => e.isFeatured) ||
    (siteContent.featuredEvent && events.some((e) => e.id === siteContent.featuredEvent?.id)
      ? siteContent.featuredEvent
      : null) ||
    events[0] ||
    null;
  const otherEvents = featuredEvent ? events.filter((e) => e.id !== featuredEvent.id) : events;

  const upcomingEvents = otherEvents.filter((e) => e.status === 'upcoming');
  const pastEvents = otherEvents.filter((e) => e.status === 'past');

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white py-16 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-800/80 px-3.5 py-1 rounded-full border border-purple-600">
            EVENTS & FESTIVALS
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight">
            Youth Gatherings & Festivals
          </h1>
          <p className="text-base sm:text-lg text-purple-200 font-medium max-w-2xl mx-auto">
            Interactive forums, mental wellness sessions, and youth festivals uniting changemakers across Bangladesh.
          </p>
        </div>
      </section>

      {/* FEATURED EVENT */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-purple-800">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Main Info Left */}
              <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800 text-purple-200 text-xs font-bold uppercase tracking-wider border border-purple-600">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>FEATURED FLAGSHIP FESTIVAL</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-white">
                  {featuredEvent.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-purple-900/80 p-3 rounded-xl border border-purple-700/80">
                    <div className="text-purple-300 font-bold uppercase">Date</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{featuredEvent.date}</div>
                  </div>
                  <div className="bg-purple-900/80 p-3 rounded-xl border border-purple-700/80">
                    <div className="text-purple-300 font-bold uppercase">Location</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{featuredEvent.location}</div>
                  </div>
                  <div className="bg-purple-900/80 p-3 rounded-xl border border-purple-700/80">
                    <div className="text-purple-300 font-bold uppercase">Target Audience</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{featuredEvent.targetAudience}</div>
                  </div>
                </div>

                <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                  {featuredEvent.fullDescription || featuredEvent.shortDescription}
                </p>

                {/* Event Highlights Grid */}
                {featuredEvent.highlights && featuredEvent.highlights.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">
                      Festival Highlights & Key Segments
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {featuredEvent.highlights.map((hl, i) => (
                        <div
                          key={i}
                          className="bg-purple-900/50 p-2.5 rounded-xl border border-purple-800 text-xs text-purple-100 flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => onOpenRegisterModal(featuredEvent)}
                    className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-purple-950 bg-white hover:bg-purple-50 btn-3d-push shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-purple-700" />
                    <span>Register Free Ticket</span>
                  </button>
                </div>
              </div>

              {/* Photo Right */}
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

      {/* OTHER EVENTS LISTING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-purple-100 pb-4">
          <h2 className="text-2xl font-extrabold text-purple-950 font-display">
            ALL ORGANIZATIONAL EVENTS
          </h2>

          <div className="flex items-center gap-2 bg-purple-50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100'
              }`}
            >
              Past ({pastEvents.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTab === 'all' || activeTab === 'upcoming') &&
            upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-xs card-3d-hover flex flex-col sm:flex-row"
              >
                <div className="sm:w-2/5 relative h-48 sm:h-auto bg-purple-100">
                  <img
                    src={evt.image || undefined}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-purple-900 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                    Upcoming
                  </span>
                </div>
                <div className="p-5 sm:w-3/5 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-purple-950 leading-snug">
                      {evt.title}
                    </h3>
                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5 font-semibold text-purple-800">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {evt.shortDescription}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenRegisterModal(evt)}
                    className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider btn-3d-push cursor-pointer"
                  >
                    Register / Details
                  </button>
                </div>
              </div>
            ))}

          {(activeTab === 'all' || activeTab === 'past') &&
            pastEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-gray-50/80 rounded-2xl border border-gray-200 overflow-hidden shadow-2xs flex flex-col sm:flex-row"
              >
                <div className="sm:w-2/5 relative h-48 sm:h-auto bg-gray-200">
                  <img
                    src={evt.image || undefined}
                    alt={evt.title}
                    className="w-full h-full object-cover filter grayscale-20"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-gray-700 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                    Completed
                  </span>
                </div>
                <div className="p-5 sm:w-3/5 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                      {evt.title}
                    </h3>
                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {evt.shortDescription}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 italic">
                    Successfully Concluded
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};
