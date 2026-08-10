import React from 'react';
import { CORE_VALUES, OBJECTIVES, KEY_ACTIVITIES } from '../../data/mockData';
import { PartnersSection } from '../PartnersSection';
import {
  Scale,
  Megaphone,
  BookOpen,
  MapPin,
  FileText,
  UserCheck,
  CheckCircle,
  Heart,
  Shield,
  Eye,
  Handshake,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-6 h-6 text-purple-600" />;
      case 'Megaphone':
        return <Megaphone className="w-6 h-6 text-purple-600" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-purple-600" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-purple-600" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-purple-600" />;
      case 'UserCheck':
      default:
        return <UserCheck className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 text-white py-16 sm:py-20 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-800/80 px-3.5 py-1 rounded-full border border-purple-600">
            OUR IDENTITY & CAUSE
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight">
            About Survivor’s Path
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 font-medium">
            “Every Voice Heard, Every Story Matters.”
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-950 text-white p-8 sm:p-10 rounded-3xl border border-purple-800 shadow-md space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-800/80 text-purple-200 flex items-center justify-center mb-4 border border-purple-600">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
                OUR MISSION
              </span>
              <h2 className="text-2xl font-extrabold font-display mt-1 text-white">
                Combating Sexual Violence & Empowering Survivors
              </h2>
              <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed mt-3">
                “We are a nonprofit organization dedicated to combating rape and all forms of sexual
                violence. Our mission is to raise awareness, support survivors, and advocate for
                justice and policy change. Through education, community outreach, legal aid, and
                survivor-centered services, we strive to break the silence surrounding sexual assault
                and build a society where everyone feels safe, respected, and empowered.”
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-purple-100 shadow-md space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                OUR VISION
              </span>
              <h2 className="text-2xl font-extrabold text-purple-950 font-display mt-3">
                A Safer, Respected Future
              </h2>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mt-3 italic font-serif">
                “A world free from rape culture, where survivors are believed, supported, and empowered
                to heal and thrive.”
              </p>
            </div>
            <div className="pt-4 border-t border-purple-100 flex items-center gap-2 text-xs font-semibold text-purple-900">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Rooted in human dignity and equal protection under law.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full">
            WHAT GUIDES US
          </span>
          <h2 className="text-3xl font-extrabold text-purple-950 font-display">
            OUR CORE VALUES
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_VALUES.map((val, idx) => (
            <div
              key={idx}
              className="bg-purple-50/60 p-6 rounded-2xl border border-purple-100 shadow-2xs space-y-2"
            >
              <h3 className="text-lg font-bold text-purple-950 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                {val.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              KEY GOALS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-950 font-display">
              OUR OBJECTIVES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {OBJECTIVES.map((obj, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-purple-50/50 border border-purple-100"
              >
                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-800 leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-purple-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              INSTITUTIONAL SYNERGY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            PARTNERSHIPS & ALLIANCES
          </h2>
          <p className="text-purple-100 text-base sm:text-lg leading-relaxed max-w-4xl">
            “We actively partner with local NGOs, human rights defenders, women’s groups, and mental
            health professionals. Our organization seeks alliances with media, government bodies, and
            international donors to scale impact.”
          </p>
        </div>
      </section>

      {/* Dynamic Partners Grid */}
      <PartnersSection />

      {/* Key Activities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full">
            HOW WE OPERATE
          </span>
          <h2 className="text-3xl font-extrabold text-purple-950 font-display">
            KEY ACTIVITIES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {KEY_ACTIVITIES.map((act, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                {getActivityIcon(act.iconName)}
              </div>
              <h3 className="text-lg font-bold text-purple-950">{act.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {act.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
