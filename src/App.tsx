import React, { useState, useEffect } from 'react';
import { PageId, ProgramItem, EventItem } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { EventsPage } from './components/pages/EventsPage';
import { ImpactPage } from './components/pages/ImpactPage';
import { TeamPage } from './components/pages/TeamPage';
import { ComplaintBoxPage } from './components/pages/ComplaintBoxPage';
import { FaqPage } from './components/pages/FaqPage';
import { ContactPage } from './components/pages/ContactPage';
import { GetInvolvedPage } from './components/pages/GetInvolvedPage';
import { ProgramDetailModal } from './components/modals/ProgramDetailModal';
import { EventRegistrationModal } from './components/modals/EventRegistrationModal';
import { GetInvolvedModal, InvolvementType } from './components/modals/GetInvolvedModal';
import { AuthModal } from './components/modals/AuthModal';
import { AdminCmsModal } from './components/modals/AdminCmsModal';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { CmsProvider, useCms } from './context/CmsContext';
import { PROGRAMS, FEATURED_EVENT } from './data/mockData';

function AppContent() {
  const { authModalOpen, setAuthModalOpen, isAdmin, currentUser } = useCms();
  const [activePage, setActivePage] = useState<PageId>('home');

  // Modal States
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);
  const [involvementType, setInvolvementType] = useState<InvolvementType | null>(null);

  // Safety Guard: Automatically kick non-admin users out of admin page
  useEffect(() => {
    if (activePage === 'admin' && !isAdmin) {
      alert('Access Denied: Admin privileges required to access the Staff & Admin Panel.');
      setActivePage('home');
      window.location.hash = 'home';
      if (!currentUser) {
        setAuthModalOpen(true);
      }
    }
  }, [activePage, isAdmin, currentUser, setAuthModalOpen]);

  // Sync state with URL hash on load and change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (hash === ('programs' as any)) {
        setActivePage('events');
        return;
      }
      const validPages: PageId[] = [
        'home',
        'about',
        'events',
        'impact',
        'team',
        'complaint-box',
        'faq',
        'contact',
        'get-involved',
        'admin',
      ];
      if (hash && validPages.includes(hash)) {
        if (hash === 'admin' && !isAdmin) {
          alert('Access Denied: Admin privileges required to access the Staff & Admin Panel.');
          window.location.hash = 'home';
          setActivePage('home');
          if (!currentUser) {
            setAuthModalOpen(true);
          }
          return;
        }
        setActivePage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdmin, currentUser, setAuthModalOpen]);

  const handlePageChange = (page: PageId) => {
    if (page === 'admin' && !isAdmin) {
      alert('Access Denied: Admin privileges required to access the Staff & Admin Panel.');
      if (!currentUser) {
        setAuthModalOpen(true);
      }
      return;
    }
    setActivePage(page);
    window.location.hash = page;
  };

  const handleOpenProgramModal = (programId: string) => {
    const prog = PROGRAMS.find((p) => p.id === programId) || null;
    setSelectedProgram(prog);
  };

  const handleInquireProgram = (programTitle: string) => {
    // Open partner/collaboration modal pre-filled context
    setInvolvementType('School Collaboration');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Sticky Header */}
      <Header activePage={activePage} setActivePage={handlePageChange} />

      {/* Main Page View */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={handlePageChange}
            onOpenEventRegister={() => setRegisterEvent(FEATURED_EVENT)}
            onOpenProgramModal={handleOpenProgramModal}
            onOpenInvolvementModal={(type) => setInvolvementType(type)}
          />
        )}

        {activePage === 'about' && <AboutPage />}

        {activePage === 'events' && (
          <EventsPage onOpenRegisterModal={() => setRegisterEvent(FEATURED_EVENT)} />
        )}

        {activePage === 'impact' && <ImpactPage />}

        {activePage === 'team' && <TeamPage />}

        {activePage === 'complaint-box' && <ComplaintBoxPage />}

        {activePage === 'faq' && <FaqPage />}

        {activePage === 'contact' && (
          <ContactPage onOpenInvolvementModal={(type) => setInvolvementType(type)} />
        )}

        {activePage === 'get-involved' && (
          <GetInvolvedPage onOpenInvolvementModal={(type) => setInvolvementType(type)} />
        )}

        {activePage === 'admin' && (
          <AdminDashboardPage setActivePage={handlePageChange} />
        )}
      </main>

      {/* Modals */}
      <ProgramDetailModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onInquire={handleInquireProgram}
      />

      <EventRegistrationModal
        event={registerEvent}
        onClose={() => setRegisterEvent(null)}
      />

      <GetInvolvedModal
        type={involvementType}
        onClose={() => setInvolvementType(null)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Admin CMS Editor Drawer */}
      <AdminCmsModal />

      {/* Deep Royal Purple Footer */}
      <Footer setActivePage={handlePageChange} />
    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <AppContent />
    </CmsProvider>
  );
}
