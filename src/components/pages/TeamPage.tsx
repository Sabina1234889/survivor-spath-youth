import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Mail, Linkedin, Users, UserPlus } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { teamMembers } = useCms();

  const defaultCategories = [
    'ALL',
    'Founder',
    'Chief Advisor',
    'Human Resources',
    'Core Team',
    'Program Team',
    'PR & Sponsorship Team',
    'Volunteers',
  ];

  // Derive all unique categories from team members plus defaults
  const customCategories = Array.from(new Set(teamMembers.map((m) => m.category))).filter(
    (cat): cat is string => Boolean(cat) && !defaultCategories.map((c) => c.toLowerCase()).includes((cat as string).toLowerCase())
  );

  const categories = [...defaultCategories, ...customCategories];

  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredMembers =
    activeCategory === 'ALL'
      ? teamMembers
      : teamMembers.filter(
          (m) => m.category && m.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white py-16 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-800/80 px-3.5 py-1 rounded-full border border-purple-600">
            PEOPLE BEHIND THE CAUSE
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight">
            Our Team
          </h1>
          <p className="text-base sm:text-lg text-purple-200 font-medium max-w-2xl mx-auto">
            Passionate organizers, human rights advisors, program leads, and youth volunteers dedicated to Survivor’s Path Youth.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-purple-800 text-white shadow-md scale-105'
                  : 'bg-purple-50 text-purple-950 hover:bg-purple-100 hover:text-purple-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Team Cards Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl border border-purple-100 overflow-hidden shadow-xs hover:shadow-lg hover:border-purple-300 transition-all p-6 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {member.photo ? (
                      <img
                        src={member.photo || undefined}
                        alt={member.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-purple-100 border-2 border-purple-200 text-purple-900 font-black text-xl flex items-center justify-center flex-shrink-0">
                        {(member.name || 'U').charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block truncate max-w-full">
                        {member.category}
                      </span>
                      <h3 className="text-lg font-bold text-purple-950 mt-1 leading-snug truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-purple-800 truncate">{member.role}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{member.bio}</p>
                </div>

                {/* Contact Icons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="text-[11px] text-gray-400 font-medium">Survivor’s Path Youth</span>
                  <div className="flex items-center gap-2">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-800 hover:text-white transition-colors"
                        title={member.email}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-800 hover:text-white transition-colors"
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
        ) : (
          <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center space-y-3 max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-purple-950">No profiles in this category yet</h3>
            <p className="text-xs text-gray-500">
              Profiles added via the Admin Panel under "{activeCategory}" will automatically appear here.
            </p>
          </div>
        )}

        {/* Join Team Banner */}
        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 text-center space-y-2 max-w-xl mx-auto">
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
