import React from 'react';
import { InvolvementType } from '../modals/GetInvolvedModal';
import { Heart, Users, Building, School, ArrowRight } from 'lucide-react';

interface GetInvolvedPageProps {
  onOpenInvolvementModal: (type: InvolvementType) => void;
}

export const GetInvolvedPage: React.FC<GetInvolvedPageProps> = ({ onOpenInvolvementModal }) => {
  const cards: {
    type: InvolvementType;
    title: string;
    description: string;
    icon: React.ReactNode;
    buttonText: string;
  }[] = [
    {
      type: 'Volunteer',
      title: 'Become a Youth Volunteer',
      description:
        'Join over 500+ student advocates across Bangladesh. Gain hands-on experience in community organizing, event logistics, digital campaigns, and peer mentoring.',
      icon: <Heart className="w-8 h-8 text-purple-600" />,
      buttonText: 'Apply as Volunteer',
    },
    {
      type: 'Partner With Us',
      title: 'Partner With Us',
      description:
        'Local and international NGOs, human rights organizations, and legal aid societies can partner with Survivor’s Path Youth to execute joint campaigns and policy research.',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      buttonText: 'Propose Partnership',
    },
    {
      type: 'Sponsor an Event',
      title: 'Sponsor an Event',
      description:
        'Corporations, donors, and foundations can sponsor flagship youth events like Youth Fest 2026, providing gift kits, venue support, and educational literature.',
      icon: <Building className="w-8 h-8 text-purple-600" />,
      buttonText: 'Become a Sponsor',
    },
    {
      type: 'School Collaboration',
      title: 'School Collaboration',
      description:
        'Bring Survivor’s Path Youth safety and consent awareness workshops directly to your high school or college campus. We provide certified trainers and materials.',
      icon: <School className="w-8 h-8 text-purple-600" />,
      buttonText: 'Request School Session',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white py-16 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-800/80 px-3.5 py-1 rounded-full border border-purple-600">
            TAKE ACTION
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight">
            Get Involved
          </h1>
          <p className="text-base sm:text-lg text-purple-200 font-medium max-w-2xl mx-auto">
            Whether you are a student, educator, corporate sponsor, or community organizer, there is a place for you in our movement.
          </p>
        </div>
      </section>

      {/* 4 Pillar Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-100/80 group-hover:bg-purple-600 flex items-center justify-center transition-colors">
                  {React.cloneElement(card.icon as React.ReactElement, {
                    className:
                      'w-7 h-7 text-purple-700 group-hover:text-white transition-colors',
                  })}
                </div>
                <h2 className="text-2xl font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
                  {card.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
              </div>

              <button
                onClick={() => onOpenInvolvementModal(card.type)}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-700 hover:bg-purple-800 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{card.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
