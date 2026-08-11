import React, { useState } from 'react';
import { FAQS } from '../../data/mockData';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const categories = ['ALL', 'GENERAL', 'EVENTS', 'VOLUNTEERING', 'PARTNERSHIP', 'COMPLAINT BOX'];

  const filteredFaqs = FAQS.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white py-16 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-800/80 px-3.5 py-1 rounded-full border border-purple-600">
            KNOWLEDGE BASE
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-purple-200 font-medium max-w-2xl mx-auto">
            Find clear answers about our youth initiatives, school collaborations, volunteer programs, and safety policies.
          </p>
        </div>
      </section>

      {/* Filter and Search Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-purple-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-purple-100 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
            />
          </div>

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

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-purple-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-[10px] font-bold text-purple-800 uppercase tracking-wider flex-shrink-0">
                      {faq.category}
                    </span>
                    <span className="text-base font-bold text-purple-950 font-display">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-600 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-gray-700 leading-relaxed border-t border-purple-50 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
              <HelpCircle className="w-8 h-8 text-purple-400 mx-auto" />
              <p className="text-gray-600 text-sm">No FAQs found matching your query.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
