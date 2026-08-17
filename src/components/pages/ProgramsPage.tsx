import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Search, ArrowRight } from 'lucide-react';

interface ProgramsPageProps {
  onOpenProgramModal: (programId: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ onOpenProgramModal }) => {
  const { programs } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Leadership',
    'Education',
    'Wellness',
    'Skills',
    'Awareness',
    'Outreach',
    'Innovation',
    'Volunteering',
    'Support',
    'Advocacy',
  ];

  const filteredPrograms = programs.filter((prog) => {
    const q = (searchTerm || '').trim().toLowerCase();
    const matchesSearch =
      !q ||
      (prog.title && prog.title.toLowerCase().includes(q)) ||
      (prog.shortDescription && prog.shortDescription.toLowerCase().includes(q));
    const matchesCategory =
      selectedCategory === 'ALL' || prog.category === selectedCategory;
    return Boolean(matchesSearch) && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white py-16 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-800/80 px-3.5 py-1 rounded-full border border-purple-600">
            PROGRAM DIRECTORY
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight">
            Our Programs & Initiatives
          </h1>
          <p className="text-base sm:text-lg text-purple-200 font-medium max-w-2xl mx-auto">
            Targeted youth empowerment, school safety, mental wellness, and community advocacy initiatives across Bangladesh.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-purple-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-purple-100 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-purple-100">
                <img
                  src={prog.image || undefined}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-purple-900/90 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full backdrop-blur-xs">
                  0{prog.number} • {prog.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                    {prog.shortDescription}
                  </p>
                </div>

                <button
                  onClick={() => onOpenProgramModal(prog.id)}
                  className="w-full py-2.5 rounded-xl border border-purple-200 text-xs font-bold uppercase tracking-wider text-purple-800 hover:bg-purple-700 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12 bg-purple-50/50 rounded-2xl border border-purple-100">
            <p className="text-gray-600 text-sm">No programs found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  );
};
