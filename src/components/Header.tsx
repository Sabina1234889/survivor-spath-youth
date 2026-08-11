import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { Logo } from './Logo';
import { Menu, X, ChevronRight, HeartHandshake, Settings, User, LogIn, ShieldCheck } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface HeaderProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, setActivePage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, isAdmin, setAuthModalOpen } = useCms();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'events', label: 'EVENTS' },
    { id: 'impact', label: 'IMPACT' },
    { id: 'team', label: 'TEAM' },
    { id: 'complaint-box', label: 'COMPLAINT BOX' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'CONTACT US' },
  ];

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAccess = () => {
    if (!isAdmin) {
      alert('Access Denied: Admin privileges required to access the Staff & Admin Panel.');
      setAuthModalOpen(true);
      return;
    }
    handleNavClick('admin');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-purple-100 py-1.5 sm:py-2.5'
          : 'bg-white border-purple-100/60 py-2 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo Left */}
          <div onClick={() => handleNavClick('home')} className="shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-100 text-purple-900 font-extrabold shadow-xs'
                      : 'text-gray-700 hover:text-purple-800 hover:bg-purple-50/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleAdminAccess}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activePage === 'admin'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                }`}
                title="Open Admin Panel"
              >
                <Settings className="w-3.5 h-3.5 text-purple-700" />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('get-involved')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 shadow-md shadow-purple-900/20 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                activePage === 'get-involved' ? 'ring-2 ring-purple-400 ring-offset-2' : ''
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-purple-200" />
              <span>GET INVOLVED</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-1 sm:gap-2 xl:hidden shrink-0">
            {isAdmin && (
              <button
                onClick={handleAdminAccess}
                className="p-1.5 sm:p-2 rounded-lg text-purple-900 bg-purple-100/70 cursor-pointer"
                title="CMS Admin"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleNavClick('get-involved')}
              className="sm:hidden px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider text-white bg-purple-700 cursor-pointer whitespace-nowrap"
            >
              GET INVOLVED
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl text-purple-950 hover:bg-purple-50 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-purple-100 shadow-xl px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-gray-800 hover:bg-purple-50 hover:text-purple-900'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                </button>
              );
            })}
            <div className={`grid ${isAdmin ? 'grid-cols-2' : 'grid-cols-1'} gap-2 pt-2`}>
              {isAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAdminAccess();
                  }}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-200 cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
              )}
              <button
                onClick={() => handleNavClick('get-involved')}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-800 shadow-md cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>GET INVOLVED</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
