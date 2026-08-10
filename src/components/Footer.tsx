import React from 'react';
import { PageId } from '../types';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, ShieldAlert, Lock, ShieldCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface FooterProps {
  setActivePage: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const { siteContent, setAuthModalOpen, currentUser } = useCms();
  const { contactInfo } = siteContent;

  const handleNav = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-purple-950 via-[#230046] to-[#170030] text-white pt-16 pb-8 border-t border-purple-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-800/50">
          {/* Col 1 & 2: Organization Info */}
          <div className="lg:col-span-2 space-y-4">
            <div onClick={() => handleNav('home')}>
              <Logo variant="dark" />
            </div>
            <p className="text-purple-200/80 text-sm leading-relaxed max-w-md pt-2">
              {contactInfo.footerAbout}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteContent.socialLinks?.facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-purple-900/80 hover:bg-purple-600 flex items-center justify-center text-purple-200 hover:text-white transition-all shadow-xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteContent.socialLinks?.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-purple-900/80 hover:bg-purple-600 flex items-center justify-center text-purple-200 hover:text-white transition-all shadow-xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteContent.socialLinks?.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-purple-900/80 hover:bg-purple-600 flex items-center justify-center text-purple-200 hover:text-white transition-all shadow-xs"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={siteContent.socialLinks?.youtube || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-purple-900/80 hover:bg-purple-600 flex items-center justify-center text-purple-200 hover:text-white transition-all shadow-xs"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-widest text-purple-300 uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-purple-200/80">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('events')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Youth Fest & Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('impact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Impact
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('team')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Leadership & Team
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-widest text-purple-300 uppercase">
              Support & Confidentiality
            </h4>
            <ul className="space-y-2 text-sm text-purple-200/80">
              <li>
                <button
                  onClick={() => handleNav('complaint-box')}
                  className="flex items-center gap-1.5 text-purple-300 font-semibold hover:text-white transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  <span>Complaint Box</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('get-involved')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Get Involved / Volunteer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-widest text-purple-300 uppercase">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-purple-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>{contactInfo.officeLocations}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white">
                  {contactInfo.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/70">
          <p>{contactInfo.copyrightText}</p>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-purple-900/60 text-purple-200 border border-purple-800/60 font-semibold">
              An initiative of Survivor’s Path
            </span>
            <span className="text-purple-700/50">•</span>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="text-purple-300/60 hover:text-purple-100 transition-colors text-xs flex items-center gap-1 cursor-pointer select-none group"
              title={currentUser ? `Active session: ${currentUser.name} (${currentUser.role})` : 'Staff & Administrator Access Portal'}
            >
              {currentUser ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-200" />
                  <span className="hover:underline underline-offset-2">{currentUser.name} ({currentUser.role})</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-purple-400/80 group-hover:text-purple-200" />
                  <span className="hover:underline underline-offset-2">Staff Login</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
