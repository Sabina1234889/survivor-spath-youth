import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { db, auth } from '../firebase';
import {
  SiteContent,
  FocusAreaItem,
  StatItem,
  EventItem,
  EventAttendee,
  ProgramItem,
  TeamMember,
  PartnerLogo,
  ComplaintItem,
  InboxItem,
  InboxCategory,
  SocialLinks,
  ImpactStory,
  UserAccount,
  UserRole,
} from '../types';
import {
  OFFICIAL_STATS,
  FOCUS_AREAS,
  DEFAULT_TEAM_CATEGORIES,
} from '../data/constants';
import { safeLocalStorageSet } from '../utils/imageCompressor';

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: 'https://facebook.com/survivorspathyouth',
  instagram: 'https://instagram.com/survivorspathyouth',
  linkedin: 'https://linkedin.com/company/survivorspathyouth',
  youtube: 'https://youtube.com/c/survivorspathyouth',
};

const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    badge: 'An Initiative of Survivor’s Path',
    headline: 'Empowering Young Voices.',
    headlineHighlight: 'Building a Better Future.',
    subheadline:
      'Survivor’s Path Youth creates safe, inclusive and empowering spaces where young people can learn, lead, speak and create positive change.',
    bgImage:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=80',
    primaryBtnText: 'EXPLORE OUR WORK',
    secondaryBtnText: 'GET INVOLVED',
  },
  whoWeAre: {
    title: 'Creating Safer Spaces. Empowering Young People.',
    description:
      'Survivor’s Path Youth works to engage young people through education, awareness, leadership development, mental wellness, digital innovation, community outreach and meaningful participation. We believe that when youth are equipped with legal knowledge, empathy, and institutional support, they become the primary drivers of an equitable and violence-free society.',
    image:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    bullet1: 'Survivor-Centered Approach',
    bullet2: 'School & Campus Leadership',
    bullet3: 'Confidential Counseling & Support',
  },
  focusAreas: FOCUS_AREAS,
  stats: OFFICIAL_STATS,
  featuredEvent: null,
  cta: {
    headline: '“Your Voice Can Create Change.”',
    description:
      'Join Survivor’s Path Youth as a volunteer, school partner, event sponsor, or institutional ally today.',
    primaryBtnText: 'JOIN US',
    secondaryBtnText: 'PARTNER WITH US',
  },
  contactInfo: {
    email: 'info@survivorspathyouth.org',
    phone: '+880 1700-000000',
    officeLocations: 'Dhaka & Jessore Division Headquarters, Bangladesh',
    footerAbout:
      'Survivor’s Path Youth is a youth-led initiative of Survivor’s Path dedicated to empowering youth, delivering institutional safety education, and fostering survivor-centered support across Bangladesh.',
    copyrightText: '© 2026 Survivor’s Path Youth. All Rights Reserved. An initiative of Survivor’s Path.',
  },
  socialLinks: DEFAULT_SOCIAL_LINKS,
};

// Storage Cache Version for Clean Slate
const CACHE_VERSION = 'spy_cms_clean_v7_zero_auto_inbox';
try {
  const currentVer = localStorage.getItem('spy_cms_cache_ver');
  if (currentVer !== CACHE_VERSION) {
    const legacyKeys = [
      'complaints',
      'complaint_list',
      'demo_complaints',
      'support_requests',
      'spy_cms_events',
      'spy_cms_programs',
      'spy_cms_team',
      'spy_cms_partners',
      'spy_cms_complaints',
      'spy_cms_inbox',
      'spy_cms_event_attendees',
      'spy_cms_impact_stories',
      'staff_list',
      'spy_cms_site_content',
    ];
    legacyKeys.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch (e) {}
    });
    localStorage.setItem('spy_cms_cache_ver', CACHE_VERSION);
  }
} catch (e) {
  console.warn('Cache busting check:', e);
}

interface CmsContextType {
  siteContent: SiteContent;
  events: EventItem[];
  eventAttendees: EventAttendee[];
  programs: ProgramItem[];
  teamMembers: TeamMember[];
  partners: PartnerLogo[];
  complaints: ComplaintItem[];
  inboxItems: InboxItem[];
  impactStories: ImpactStory[];
  users: UserAccount[];
  currentUser: UserAccount | null;
  isAdmin: boolean;
  approvedAdminEmails: string[];
  addApprovedAdminEmail: (email: string) => Promise<void>;
  removeApprovedAdminEmail: (email: string) => Promise<void>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  visitorCount: number;
  isLoading: boolean;
  
  // Site Content Modifiers
  updateHero: (data: Partial<SiteContent['hero']>) => void;
  updateWhoWeAre: (data: Partial<SiteContent['whoWeAre']>) => void;
  updateFocusAreas: (areas: FocusAreaItem[]) => void;
  updateStats: (stats: StatItem[]) => void;
  updateFeaturedEvent: (event: EventItem | null) => void;
  updateCta: (data: Partial<SiteContent['cta']>) => void;
  updateContactInfo: (data: Partial<SiteContent['contactInfo']>) => void;
  updateSocialLinks: (data: Partial<SocialLinks>) => void;
  updateSystemSettings: (data: {
    siteName?: string;
    maintenanceMode?: boolean;
    email?: string;
    phone?: string;
    officeLocations?: string;
    footerAbout?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  }) => Promise<void>;

  // Event CRUD & Attendees
  addEvent: (event: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, eventData: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  toggleFeaturedEvent: (id: string | null) => void;
  addEventAttendee: (attendee: Omit<EventAttendee, 'id' | 'registrationDate'>) => void;
  deleteEventAttendee: (id: string) => void;
  getAttendeesForEvent: (eventId: string) => EventAttendee[];

  // Program CRUD
  addProgram: (program: Omit<ProgramItem, 'id'>) => void;
  updateProgram: (id: string, programData: Partial<ProgramItem>) => void;
  deleteProgram: (id: string) => void;

  // Team CRUD & Category Management
  teamCategories: string[];
  addTeamCategory: (category: string) => Promise<void>;
  deleteTeamCategory: (category: string) => Promise<void>;
  updateTeamCategories: (categories: string[]) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, memberData: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Partner CRUD
  addPartner: (partner: PartnerLogo) => void;
  updatePartner: (oldName: string, partner: PartnerLogo) => void;
  deletePartner: (name: string) => void;

  // Complaint CRUD & Actions
  addComplaint: (complaint: Omit<ComplaintItem, 'id' | 'dateSubmitted' | 'status'>) => void;
  updateComplaintStatus: (id: string, status: 'Pending' | 'In Review' | 'Resolved') => void;
  updateComplaintNotes: (id: string, notes: string) => void;
  deleteComplaint: (id: string) => void;
  clearAllComplaints: () => Promise<void>;

  // Inbox CRUD & Actions
  addInboxItem: (item: Omit<InboxItem, 'id' | 'dateSubmitted' | 'status'> & { id?: string; dateSubmitted?: string; status?: InboxItem['status'] }) => void;
  updateInboxStatus: (id: string, status: InboxItem['status']) => void;
  updateInboxNotes: (id: string, notes: string) => void;
  deleteInboxItem: (id: string) => void;
  clearAllInboxItems: () => Promise<void>;

  // Impact Stories CRUD
  addImpactStory: (story: Omit<ImpactStory, 'id'>) => void;
  updateImpactStory: (id: string, storyData: Partial<ImpactStory>) => void;
  deleteImpactStory: (id: string) => void;

  // Authentication & User Accounts (RBAC)
  loginUser: (email: string, password?: string) => { success: boolean; message?: string; user?: UserAccount };
  registerUser: (name: string, email: string, password?: string) => { success: boolean; message?: string; user?: UserAccount };
  logoutUser: () => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deleteUserAccount: (userId: string) => void;

  // Utilities
  resetToDefaults: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_siteContent');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SITE_CONTENT;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [programs, setPrograms] = useState<ProgramItem[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_programs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_team');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [teamCategories, setTeamCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_team_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TEAM_CATEGORIES;
  });

  const [partners, setPartners] = useState<PartnerLogo[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_partners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [complaints, setComplaints] = useState<ComplaintItem[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_complaints');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [inboxItems, setInboxItems] = useState<InboxItem[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_inbox');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [eventAttendees, setEventAttendees] = useState<EventAttendee[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_event_attendees');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [impactStories, setImpactStories] = useState<ImpactStory[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_impact_stories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_users') || localStorage.getItem('staff_list');
      if (saved) {
        const parsed: UserAccount[] = JSON.parse(saved);
        const legacyEmails = [
          'admin@spybangladesh.org',
          'tanvir@spybangladesh.org',
          'nusrat@spybangladesh.org',
          'rafiq@gmail.com',
          'sadia.r@yahoo.com',
        ];
        const cleaned = parsed.filter(
          (u) => Boolean(u && u.email && !legacyEmails.includes(u.email.toLowerCase()))
        );
        return cleaned;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('spy_cms_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('spy_cms_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const [approvedAdminEmails, setApprovedAdminEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_approved_admins');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [visitorCount] = useState<number>(14850);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Instant hydration - no artificial setTimeout delays
    setIsLoading(false);
  }, []);

  // Sync to local storage & Firestore Realtime Sync
  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    const unsubInbox = onSnapshot(collection(db, 'inbox'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as InboxItem[];
        setInboxItems(items);
        safeLocalStorageSet('spy_cms_inbox', JSON.stringify(items));
      } else {
        setInboxItems([]);
        safeLocalStorageSet('spy_cms_inbox', JSON.stringify([]));
      }
    }, (err) => console.warn('Firestore inbox listener notice:', err));

    const unsubComplaints = onSnapshot(collection(db, 'complaints'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as ComplaintItem[];
        setComplaints(items);
        safeLocalStorageSet('spy_cms_complaints', JSON.stringify(items));
      } else {
        setComplaints([]);
        safeLocalStorageSet('spy_cms_complaints', JSON.stringify([]));
      }
    }, (err) => console.warn('Firestore complaints listener notice:', err));

    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as EventItem[];
        setEvents(items);
        safeLocalStorageSet('spy_cms_events', JSON.stringify(items));
      } else {
        setEvents([]);
        safeLocalStorageSet('spy_cms_events', JSON.stringify([]));
      }
    }, (err) => console.warn('Firestore events listener notice:', err));

    const unsubAttendees = onSnapshot(collection(db, 'event_attendees'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as EventAttendee[];
        setEventAttendees(items);
        safeLocalStorageSet('spy_cms_event_attendees', JSON.stringify(items));
      } else {
        setEventAttendees([]);
        safeLocalStorageSet('spy_cms_event_attendees', JSON.stringify([]));
      }
    }, (err) => console.warn('Firestore attendees listener notice:', err));

    const unsubTeam = onSnapshot(collection(db, 'team'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as TeamMember[];
        setTeamMembers(items);
        safeLocalStorageSet('spy_cms_team', JSON.stringify(items));
      } else {
        setTeamMembers([]);
        safeLocalStorageSet('spy_cms_team', JSON.stringify([]));
      }
    }, (err) => console.warn('Firestore team listener notice:', err));

    const unsubPartners = onSnapshot(collection(db, 'partners'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as PartnerLogo[];
        const unique = Array.from(new Map(items.map((it) => [it.name, it])).values());
        setPartners(unique);
        safeLocalStorageSet('spy_cms_partners', JSON.stringify(unique));
      } else {
        setPartners([]);
        safeLocalStorageSet('spy_cms_partners', JSON.stringify([]));
      }
    }, (err) => console.warn('Firestore partners listener notice:', err));

    const unsubPrograms = onSnapshot(collection(db, 'programs'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as ProgramItem[];
        setPrograms(items);
        safeLocalStorageSet('spy_cms_programs', JSON.stringify(items));
      } else {
        setPrograms([]);
        safeLocalStorageSet('spy_cms_programs', JSON.stringify([]));
      }
    }, (err) => console.warn('Firestore programs listener notice:', err));

    const unsubImpact = onSnapshot(collection(db, 'impact_stories'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as ImpactStory[];
        setImpactStories(items);
        safeLocalStorageSet('spy_cms_impact_stories', JSON.stringify(items));
      } else {
        setImpactStories([]);
        safeLocalStorageSet('spy_cms_impact_stories', JSON.stringify([]));
      }
    }, (err) => console.warn('Firestore impact_stories listener notice:', err));

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as UserAccount[];
        const unique = Array.from(new Map(items.map((it) => [it.id, it])).values());
        setUsers(unique);
        safeLocalStorageSet('spy_cms_users', JSON.stringify(unique));
      } else {
        setUsers([]);
        safeLocalStorageSet('spy_cms_users', JSON.stringify([]));
      }
    }, (err) => console.warn('Firestore users listener notice:', err));

    // Settings Listener (settings/general)
    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSiteContent((prev) => ({
          ...prev,
          siteName: data.siteName || prev.siteName || "Survivor's Path Youth",
          maintenanceMode: typeof data.maintenanceMode === 'boolean' ? data.maintenanceMode : prev.maintenanceMode,
          contactInfo: {
            ...prev.contactInfo,
            ...(data.contactInfo || {}),
            email: data.email || data.contactInfo?.email || prev.contactInfo.email,
            phone: data.phone || data.contactInfo?.phone || prev.contactInfo.phone,
            officeLocations: data.officeLocations || data.contactInfo?.officeLocations || prev.contactInfo.officeLocations,
            footerAbout: data.footerAbout || data.contactInfo?.footerAbout || prev.contactInfo.footerAbout,
          },
          socialLinks: {
            ...prev.socialLinks,
            ...(data.socialLinks || {}),
          },
        }));
      }
    }, (err) => console.warn('Firestore settings listener notice:', err));

    // Stats Listener (stats/impact)
    const unsubStats = onSnapshot(doc(db, 'stats', 'impact'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.stats && Array.isArray(data.stats)) {
          setSiteContent((prev) => ({
            ...prev,
            stats: data.stats,
          }));
        }
      }
    }, (err) => console.warn('Firestore stats listener notice:', err));

    // Approved Admins Listener (settings/approved_admins)
    const unsubApprovedAdmins = onSnapshot(doc(db, 'settings', 'approved_admins'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.emails)) {
          const cleanEmails = data.emails.map((e: string) => e.trim().toLowerCase());
          setApprovedAdminEmails(cleanEmails);
          safeLocalStorageSet('spy_cms_approved_admins', JSON.stringify(cleanEmails));
        }
      }
    }, (err) => console.warn('Firestore approved_admins listener notice:', err));

    // Content Manager Listener (content/homepage)
    const unsubContent = onSnapshot(doc(db, 'content', 'homepage'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSiteContent((prev) => ({
          ...prev,
          hero: data.hero ? { ...prev.hero, ...data.hero } : prev.hero,
          whoWeAre: data.whoWeAre ? { ...prev.whoWeAre, ...data.whoWeAre } : prev.whoWeAre,
          cta: data.cta ? { ...prev.cta, ...data.cta } : prev.cta,
          focusAreas: data.focusAreas ? data.focusAreas : prev.focusAreas,
        }));
      }
    }, (err) => console.warn('Firestore content listener notice:', err));

    // Team Categories Listener (settings/team_categories)
    const unsubTeamCategories = onSnapshot(doc(db, 'settings', 'team_categories'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setTeamCategories(data.categories);
          safeLocalStorageSet('spy_cms_team_categories', JSON.stringify(data.categories));
        }
      }
    }, (err) => console.warn('Firestore team_categories listener notice:', err));

    return () => {
      unsubInbox();
      unsubComplaints();
      unsubEvents();
      unsubAttendees();
      unsubTeam();
      unsubTeamCategories();
      unsubPartners();
      unsubPrograms();
      unsubImpact();
      unsubUsers();
      unsubSettings();
      unsubStats();
      unsubApprovedAdmins();
      unsubContent();
    };
  }, []);

  // Firebase Auth State Observer
  useEffect(() => {
    if (!auth) return;
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const email = firebaseUser.email.toLowerCase();
        const found = users.find((u) => u.email.toLowerCase() === email);
        if (found) {
          setCurrentUser(found);
        } else if (isSuperAdminEmail(email)) {
          const superAdmin: UserAccount = {
            id: firebaseUser.uid || `user-superadmin-${Date.now()}`,
            name: firebaseUser.displayName || 'Md Anonto Sunny (Super Admin)',
            email: email,
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(superAdmin);
        }
      }
    });
    return () => unsubAuth();
  }, [users]);

  useEffect(() => {
    safeLocalStorageSet('spy_cms_siteContent', JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    safeLocalStorageSet('spy_cms_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    safeLocalStorageSet('spy_cms_event_attendees', JSON.stringify(eventAttendees));
  }, [eventAttendees]);

  useEffect(() => {
    safeLocalStorageSet('spy_cms_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    safeLocalStorageSet('spy_cms_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    safeLocalStorageSet('spy_cms_partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    safeLocalStorageSet('spy_cms_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    safeLocalStorageSet('spy_cms_inbox', JSON.stringify(inboxItems));
  }, [inboxItems]);

  useEffect(() => {
    safeLocalStorageSet('spy_cms_impact_stories', JSON.stringify(impactStories));
  }, [impactStories]);

  useEffect(() => {
    safeLocalStorageSet('spy_cms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      safeLocalStorageSet('spy_cms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('spy_cms_current_user');
    }
  }, [currentUser]);

  // Modifiers
  const updateHero = async (data: Partial<SiteContent['hero']>) => {
    let updatedHero = siteContent.hero;
    setSiteContent((prev) => {
      updatedHero = { ...prev.hero, ...data };
      return { ...prev, hero: updatedHero };
    });
    if (db) {
      try {
        await setDoc(doc(db, 'content', 'homepage'), {
          hero: updatedHero,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.error('Firestore updateHero error:', e);
      }
    }
  };

  const updateWhoWeAre = async (data: Partial<SiteContent['whoWeAre']>) => {
    let updatedWho = siteContent.whoWeAre;
    setSiteContent((prev) => {
      updatedWho = { ...prev.whoWeAre, ...data };
      return { ...prev, whoWeAre: updatedWho };
    });
    if (db) {
      try {
        await setDoc(doc(db, 'content', 'homepage'), {
          whoWeAre: updatedWho,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.error('Firestore updateWhoWeAre error:', e);
      }
    }
  };

  const updateFocusAreas = async (areas: FocusAreaItem[]) => {
    setSiteContent((prev) => ({ ...prev, focusAreas: areas }));
    if (db) {
      try {
        await setDoc(doc(db, 'content', 'homepage'), {
          focusAreas: areas,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.error('Firestore updateFocusAreas error:', e);
      }
    }
  };

  const updateStats = async (stats: StatItem[]) => {
    setSiteContent((prev) => ({ ...prev, stats: stats }));
    if (db) {
      try {
        await setDoc(doc(db, 'stats', 'impact'), {
          stats: stats,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.error('Firestore updateStats error:', e);
      }
    }
  };

  const updateFeaturedEvent = async (event: EventItem | null) => {
    setSiteContent((prev) => ({ ...prev, featuredEvent: event }));
    if (event) {
      setEvents((prev) =>
        prev.map((e) => ({
          ...e,
          isFeatured: e.id === event.id,
          ...(e.id === event.id ? event : {}),
        }))
      );
    } else {
      setEvents((prev) => prev.map((e) => ({ ...e, isFeatured: false })));
    }
    if (db) {
      try {
        await setDoc(
          doc(db, 'content', 'homepage'),
          {
            featuredEvent: event,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        if (event && event.id) {
          await updateDoc(doc(db, 'events', event.id), { ...event, isFeatured: true });
        }
      } catch (e) {
        console.error('Firestore updateFeaturedEvent error:', e);
      }
    }
  };

  const updateCta = async (data: Partial<SiteContent['cta']>) => {
    let updatedCta = siteContent.cta;
    setSiteContent((prev) => {
      updatedCta = { ...prev.cta, ...data };
      return { ...prev, cta: updatedCta };
    });
    if (db) {
      try {
        await setDoc(doc(db, 'content', 'homepage'), {
          cta: updatedCta,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.error('Firestore updateCta error:', e);
      }
    }
  };

  const updateContactInfo = async (data: Partial<SiteContent['contactInfo']>) => {
    let updatedContact = siteContent.contactInfo;
    setSiteContent((prev) => {
      updatedContact = { ...prev.contactInfo, ...data };
      return { ...prev, contactInfo: updatedContact };
    });
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'general'), {
          contactInfo: updatedContact,
          email: updatedContact.email,
          phone: updatedContact.phone,
          officeLocations: updatedContact.officeLocations,
          footerAbout: updatedContact.footerAbout,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.error('Firestore updateContactInfo error:', e);
      }
    }
  };

  const updateSocialLinks = async (data: Partial<SocialLinks>) => {
    let updatedSocial = siteContent.socialLinks;
    setSiteContent((prev) => {
      updatedSocial = { ...prev.socialLinks, ...data };
      return { ...prev, socialLinks: updatedSocial };
    });
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'general'), {
          socialLinks: updatedSocial,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.error('Firestore updateSocialLinks error:', e);
      }
    }
  };

  const updateSystemSettings = async (data: {
    siteName?: string;
    maintenanceMode?: boolean;
    email?: string;
    phone?: string;
    officeLocations?: string;
    footerAbout?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  }) => {
    const updatedContact = {
      ...siteContent.contactInfo,
      email: data.email !== undefined ? data.email : siteContent.contactInfo.email,
      phone: data.phone !== undefined ? data.phone : siteContent.contactInfo.phone,
      officeLocations: data.officeLocations !== undefined ? data.officeLocations : siteContent.contactInfo.officeLocations,
      footerAbout: data.footerAbout !== undefined ? data.footerAbout : siteContent.contactInfo.footerAbout,
    };
    const updatedSocial = {
      ...siteContent.socialLinks,
      facebook: data.facebook !== undefined ? data.facebook : siteContent.socialLinks.facebook,
      instagram: data.instagram !== undefined ? data.instagram : siteContent.socialLinks.instagram,
      linkedin: data.linkedin !== undefined ? data.linkedin : siteContent.socialLinks.linkedin,
      youtube: data.youtube !== undefined ? data.youtube : siteContent.socialLinks.youtube,
    };
    const updatedSiteName = data.siteName !== undefined ? data.siteName : siteContent.siteName;
    const updatedMaintenanceMode = data.maintenanceMode !== undefined ? data.maintenanceMode : siteContent.maintenanceMode;

    setSiteContent((prev) => ({
      ...prev,
      siteName: updatedSiteName,
      maintenanceMode: updatedMaintenanceMode,
      contactInfo: updatedContact,
      socialLinks: updatedSocial,
    }));

    const formData = {
      siteName: updatedSiteName,
      maintenanceMode: updatedMaintenanceMode,
      contactInfo: updatedContact,
      email: updatedContact.email,
      phone: updatedContact.phone,
      officeLocations: updatedContact.officeLocations,
      footerAbout: updatedContact.footerAbout,
      socialLinks: updatedSocial,
      updatedAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'general'), formData, { merge: true });
      } catch (e) {
        console.error('Firestore updateSystemSettings error:', e);
      }
    }
  };

  // Event CRUD
  const addEvent = async (eventData: Omit<EventItem, 'id'>) => {
    const payload = {
      title: eventData.title || '',
      date: eventData.date || '',
      location: eventData.location || '',
      targetAudience: eventData.targetAudience || 'Youth & Students',
      shortDescription: eventData.shortDescription || '',
      fullDescription: eventData.fullDescription || eventData.shortDescription || '',
      image: eventData.image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      status: eventData.status || 'upcoming',
      isFeatured: eventData.isFeatured || false,
      whatsappGroupLink: eventData.whatsappGroupLink || '',
      highlights: eventData.highlights || ['Interactive Workshop', 'Legal Q&A'],
      registrationFields: eventData.registrationFields || {
        collectPhone: true,
        collectEmail: true,
        collectSchool: true,
        collectTShirtSize: false,
        collectEmergencyContact: false,
        collectCustomQuestion: false,
        customQuestionPrompt: '',
      },
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        const docRef = await addDoc(collection(db, 'events'), payload);
        const newEvent: EventItem = { ...payload, id: docRef.id };
        setEvents((prev) => [newEvent, ...prev.filter((i) => i.id !== newEvent.id)]);
        return newEvent;
      } catch (e) {
        console.error('Firestore addEvent error:', e);
        throw e;
      }
    } else {
      const newId = `event-${Date.now()}`;
      const newEvent: EventItem = { ...payload, id: newId };
      setEvents((prev) => [newEvent, ...prev]);
      return newEvent;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<EventItem>) => {
    let updatedItem: EventItem | undefined;
    setEvents((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          updatedItem = { ...item, ...eventData };
          return updatedItem;
        }
        return item;
      });
      safeLocalStorageSet('spy_cms_events', JSON.stringify(updated));
      return updated;
    });

    if (siteContent.featuredEvent && siteContent.featuredEvent.id === id && updatedItem) {
      setSiteContent((prev) => ({ ...prev, featuredEvent: updatedItem! }));
      if (db) {
        try {
          await setDoc(doc(db, 'content', 'homepage'), {
            featuredEvent: updatedItem,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        } catch (e) {
          console.error('Firestore sync updateFeaturedEvent error:', e);
        }
      }
    }

    if (db) {
      try {
        await updateDoc(doc(db, 'events', id), eventData);
      } catch (e) {
        console.error('Firestore updateEvent error:', e);
      }
    }
  };

  const deleteEvent = async (id: string) => {
    let remainingEvents: EventItem[] = [];
    setEvents((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      remainingEvents = updated;
      safeLocalStorageSet('spy_cms_events', JSON.stringify(updated));
      return updated;
    });

    // If deleting the currently featured event, auto-promote another event or clear featured
    if (siteContent.featuredEvent && siteContent.featuredEvent.id === id) {
      const nextFeatured = remainingEvents.find((e) => e.isFeatured) || remainingEvents[0] || null;
      if (nextFeatured) {
        updateFeaturedEvent(nextFeatured);
      } else {
        setSiteContent((prev) => ({ ...prev, featuredEvent: null }));
        if (db) {
          try {
            await setDoc(doc(db, 'content', 'homepage'), {
              featuredEvent: null,
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          } catch (e) {
            console.error('Firestore clear featuredEvent error:', e);
          }
        }
      }
    }

    if (db) {
      try {
        await deleteDoc(doc(db, 'events', id));
      } catch (e) {
        console.error('Firestore deleteEvent error:', e);
      }
    }
  };

  const toggleFeaturedEvent = async (id: string | null) => {
    if (!id) {
      const updatedEvents = events.map((e) => ({ ...e, isFeatured: false }));
      setEvents(updatedEvents);
      safeLocalStorageSet('spy_cms_events', JSON.stringify(updatedEvents));
      updateFeaturedEvent(null);
      if (db) {
        for (const e of updatedEvents) {
          try {
            await updateDoc(doc(db, 'events', e.id), { isFeatured: false });
          } catch (err) {
            console.error('Firestore unset isFeatured error:', err);
          }
        }
      }
      return;
    }

    const target = events.find((e) => e.id === id);
    if (!target) return;

    if (target.isFeatured) {
      // Toggle off!
      const updatedEvents = events.map((e) =>
        e.id === id ? { ...e, isFeatured: false } : e
      );
      setEvents(updatedEvents);
      safeLocalStorageSet('spy_cms_events', JSON.stringify(updatedEvents));
      updateFeaturedEvent(null);

      if (db) {
        try {
          await updateDoc(doc(db, 'events', id), { isFeatured: false });
        } catch (err) {
          console.error('Firestore toggleOff error:', err);
        }
      }
    } else {
      // Set as featured
      const updatedEvents = events.map((e) => ({
        ...e,
        isFeatured: e.id === id,
      }));
      setEvents(updatedEvents);
      safeLocalStorageSet('spy_cms_events', JSON.stringify(updatedEvents));
      const newFeatured = { ...target, isFeatured: true };
      updateFeaturedEvent(newFeatured);

      if (db) {
        for (const e of updatedEvents) {
          try {
            await updateDoc(doc(db, 'events', e.id), { isFeatured: e.isFeatured });
          } catch (err) {
            console.error('Firestore toggleFeaturedEvent doc update error:', err);
          }
        }
      }
    }
  };

  const addEventAttendee = async (
    attendeeData: Omit<EventAttendee, 'id' | 'registrationDate'>
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newAttendee: EventAttendee = {
      id: `att-${Date.now()}`,
      registrationDate: today,
      ...attendeeData,
    };
    setEventAttendees((prev) => [newAttendee, ...prev]);
    if (db) {
      try {
        await setDoc(doc(db, 'event_attendees', newAttendee.id), newAttendee);
      } catch (e) {
        console.error('Firestore addEventAttendee error:', e);
      }
    }
  };

  const deleteEventAttendee = async (id: string) => {
    setEventAttendees((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      safeLocalStorageSet('spy_cms_event_attendees', JSON.stringify(updated));
      return updated;
    });
    if (db) {
      try {
        await deleteDoc(doc(db, 'event_attendees', id));
      } catch (e) {
        console.error('Firestore deleteEventAttendee error:', e);
      }
    }
  };

  const getAttendeesForEvent = (eventId: string) => {
    return eventAttendees.filter((a) => a.eventId === eventId);
  };

  // Program CRUD
  const addProgram = async (progData: Omit<ProgramItem, 'id'>) => {
    const newId = `prog-${Date.now()}`;
    const newProgram: ProgramItem = {
      ...progData,
      id: newId,
      number: programs.length + 1,
    };
    setPrograms((prev) => [...prev, newProgram]);
    if (db) {
      try {
        await setDoc(doc(db, 'programs', newProgram.id), newProgram);
      } catch (e) {
        console.error('Firestore addProgram error:', e);
      }
    }
  };

  const updateProgram = async (id: string, progData: Partial<ProgramItem>) => {
    setPrograms((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...progData } : item))
    );
    if (db) {
      try {
        await updateDoc(doc(db, 'programs', id), progData);
      } catch (e) {
        console.error('Firestore updateProgram error:', e);
      }
    }
  };

  const deleteProgram = async (id: string) => {
    setPrograms((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try { localStorage.setItem('spy_cms_programs', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    if (db) {
      try {
        await deleteDoc(doc(db, 'programs', id));
      } catch (e) {
        console.error('Firestore deleteProgram error:', e);
      }
    }
  };

  // Team CRUD & Category Management
  const addTeamCategory = async (categoryName: string) => {
    const clean = categoryName.trim();
    if (!clean) return;
    if (teamCategories.some((cat) => cat.toLowerCase() === clean.toLowerCase())) return;

    const updated = [...teamCategories, clean];
    setTeamCategories(updated);
    safeLocalStorageSet('spy_cms_team_categories', JSON.stringify(updated));
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'team_categories'), { categories: updated }, { merge: true });
      } catch (e) {
        console.error('Firestore addTeamCategory error:', e);
      }
    }
  };

  const deleteTeamCategory = async (categoryName: string) => {
    const clean = categoryName.trim().toLowerCase();
    const updated = teamCategories.filter((cat) => cat.toLowerCase() !== clean);
    setTeamCategories(updated);
    safeLocalStorageSet('spy_cms_team_categories', JSON.stringify(updated));
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'team_categories'), { categories: updated }, { merge: true });
      } catch (e) {
        console.error('Firestore deleteTeamCategory error:', e);
      }
    }
  };

  const updateTeamCategories = async (newCategories: string[]) => {
    const cleanList = newCategories.map((c) => c.trim()).filter(Boolean);
    setTeamCategories(cleanList);
    safeLocalStorageSet('spy_cms_team_categories', JSON.stringify(cleanList));
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'team_categories'), { categories: cleanList }, { merge: true });
      } catch (e) {
        console.error('Firestore updateTeamCategories error:', e);
      }
    }
  };

  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
    const newId = `team-${Date.now()}`;
    const newMember: TeamMember = { ...memberData, id: newId };
    setTeamMembers((prev) => [...prev, newMember]);
    if (db) {
      try {
        await setDoc(doc(db, 'team', newMember.id), newMember);
      } catch (e) {
        console.error('Firestore addTeamMember error:', e);
      }
    }
  };

  const updateTeamMember = async (id: string, memberData: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...memberData } : item))
    );
    if (db) {
      try {
        await updateDoc(doc(db, 'team', id), memberData);
      } catch (e) {
        console.error('Firestore updateTeamMember error:', e);
      }
    }
  };

  const deleteTeamMember = async (id: string) => {
    setTeamMembers((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_team', JSON.stringify(updated));
      return updated;
    });
    if (db) {
      try {
        await deleteDoc(doc(db, 'team', id));
      } catch (e) {
        console.error('Firestore deleteTeamMember error:', e);
      }
    }
  };

  // Partner CRUD
  const addPartner = async (partner: PartnerLogo) => {
    setPartners((prev) => [...prev, partner]);
    if (db) {
      try {
        const partnerId = partner.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await setDoc(doc(db, 'partners', partnerId), partner);
      } catch (e) {
        console.error('Firestore addPartner error:', e);
      }
    }
  };

  const updatePartner = async (oldName: string, partner: PartnerLogo) => {
    setPartners((prev) => prev.map((p) => (p.name === oldName ? partner : p)));
    if (db) {
      try {
        const oldId = oldName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const newId = partner.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        if (oldId !== newId) {
          await deleteDoc(doc(db, 'partners', oldId));
        }
        await setDoc(doc(db, 'partners', newId), partner);
      } catch (e) {
        console.error('Firestore updatePartner error:', e);
      }
    }
  };

  const deletePartner = async (name: string) => {
    setPartners((prev) => {
      const updated = prev.filter((p) => p.name !== name);
      safeLocalStorageSet('spy_cms_partners', JSON.stringify(updated));
      return updated;
    });
    if (db) {
      try {
        const partnerId = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await deleteDoc(doc(db, 'partners', partnerId));
      } catch (e) {
        console.error('Firestore deletePartner error:', e);
      }
    }
  };

  // Complaint CRUD
  const addComplaint = async (complaintData: Omit<ComplaintItem, 'id' | 'dateSubmitted' | 'status'>) => {
    const newId = `COMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newComplaint: ComplaintItem = {
      ...complaintData,
      id: newId,
      dateSubmitted: dateStr,
      status: 'Pending',
      urgencyLevel: complaintData.urgencyLevel || 'Standard',
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    if (db) {
      try {
        await setDoc(doc(db, 'complaints', newComplaint.id), newComplaint);
      } catch (e) {
        console.error('Firestore addComplaint error:', e);
      }
    }
  };

  const updateComplaintStatus = async (id: string, status: 'Pending' | 'In Review' | 'Resolved') => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    if (db) {
      try {
        await updateDoc(doc(db, 'complaints', id), { status });
      } catch (e) {
        console.error('Firestore updateComplaintStatus error:', e);
      }
    }
  };

  const updateComplaintNotes = async (id: string, notes: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, adminNotes: notes } : c))
    );
    if (db) {
      try {
        await updateDoc(doc(db, 'complaints', id), { adminNotes: notes });
      } catch (e) {
        console.error('Firestore updateComplaintNotes error:', e);
      }
    }
  };

  const deleteComplaint = async (id: string) => {
    setComplaints((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      safeLocalStorageSet('spy_cms_complaints', JSON.stringify(updated));
      return updated;
    });
    if (db) {
      try {
        await deleteDoc(doc(db, 'complaints', id));
      } catch (e) {
        console.error('Firestore deleteComplaint error:', e);
      }
    }
  };

  const clearAllComplaints = async () => {
    setComplaints([]);
    safeLocalStorageSet('spy_cms_complaints', JSON.stringify([]));
    if (db) {
      try {
        const snap = await getDocs(collection(db, 'complaints'));
        const batch = writeBatch(db);
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      } catch (e) {
        console.error('Firestore clearAllComplaints error:', e);
      }
    }
  };

  // Inbox CRUD & Actions
  const addInboxItem = async (
    item: Omit<InboxItem, 'id' | 'dateSubmitted' | 'status'> & {
      id?: string;
      dateSubmitted?: string;
      status?: InboxItem['status'];
    }
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newId = item.id || `INB-2026-${String(Math.floor(Math.random() * 900 + 100))}`;
    const newInbox: InboxItem = {
      id: newId,
      dateSubmitted: item.dateSubmitted || today,
      status: item.status || 'New',
      ...item,
    };
    setInboxItems((prev) => [newInbox, ...prev]);
    if (db) {
      try {
        await setDoc(doc(db, 'inbox', newInbox.id), newInbox);
      } catch (e) {
        console.error('Firestore addInboxItem error:', e);
      }
    }
  };

  const updateInboxStatus = async (id: string, status: InboxItem['status']) => {
    setInboxItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    if (db) {
      try {
        await updateDoc(doc(db, 'inbox', id), { status });
      } catch (e) {
        console.error('Firestore updateInboxStatus error:', e);
      }
    }
  };

  const updateInboxNotes = async (id: string, notes: string) => {
    setInboxItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, adminNotes: notes } : item))
    );
    if (db) {
      try {
        await updateDoc(doc(db, 'inbox', id), { adminNotes: notes });
      } catch (e) {
        console.error('Firestore updateInboxNotes error:', e);
      }
    }
  };

  const deleteInboxItem = async (id: string) => {
    setInboxItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_inbox', JSON.stringify(updated));
      return updated;
    });
    if (db) {
      try {
        await deleteDoc(doc(db, 'inbox', id));
      } catch (e) {
        console.error('Firestore deleteInboxItem error:', e);
      }
    }
  };

  const clearAllInboxItems = async () => {
    setInboxItems([]);
    safeLocalStorageSet('spy_cms_inbox', JSON.stringify([]));
    if (db) {
      try {
        const snap = await getDocs(collection(db, 'inbox'));
        const batch = writeBatch(db);
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      } catch (e) {
        console.error('Firestore clearAllInboxItems error:', e);
      }
    }
  };

  // Impact Stories CRUD
  const addImpactStory = async (storyData: Omit<ImpactStory, 'id'>) => {
    const newId = `story-${Date.now()}`;
    const newStory: ImpactStory = { ...storyData, id: newId };
    setImpactStories((prev) => [newStory, ...prev]);
    if (db) {
      try {
        await setDoc(doc(db, 'impact_stories', newStory.id), newStory);
      } catch (e) {
        console.error('Firestore addImpactStory error:', e);
      }
    }
  };

  const updateImpactStory = async (id: string, storyData: Partial<ImpactStory>) => {
    setImpactStories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...storyData } : item))
    );
    if (db) {
      try {
        await updateDoc(doc(db, 'impact_stories', id), storyData);
      } catch (e) {
        console.error('Firestore updateImpactStory error:', e);
      }
    }
  };

  const deleteImpactStory = async (id: string) => {
    setImpactStories((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_impact_stories', JSON.stringify(updated));
      return updated;
    });
    if (db) {
      try {
        await deleteDoc(doc(db, 'impact_stories', id));
      } catch (e) {
        console.error('Firestore deleteImpactStory error:', e);
      }
    }
  };

  const isSuperAdminEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    return clean === 'mdanontosunny1068@mail.com' || clean === 'mdanontosunny1068@gmail.com';
  };

  // Auth & RBAC Methods
  const loginUser = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isSuper = isSuperAdminEmail(cleanEmail);

    let foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    // Try Firebase Auth in background
    if (auth && password) {
      signInWithEmailAndPassword(auth, cleanEmail, password).catch((authErr) => {
        console.warn('Firebase Auth signin notice:', authErr?.message || authErr);
        if (authErr?.code === 'auth/user-not-found' || authErr?.code === 'auth/invalid-credential') {
          createUserWithEmailAndPassword(auth, cleanEmail, password).catch(() => {});
        }
      });
    }

    // Auto-create Super Admin if attempting login for the first time
    if (!foundUser && isSuper) {
      const superAdminUser: UserAccount = {
        id: `user-superadmin-${Date.now()}`,
        name: 'Md Anonto Sunny (Super Admin)',
        email: cleanEmail,
        role: 'admin',
        createdAt: new Date().toISOString(),
        password: password || 'admin',
      };
      setUsers((prev) => [...prev, superAdminUser]);
      setCurrentUser(superAdminUser);
      if (db) {
        setDoc(doc(db, 'users', superAdminUser.id), superAdminUser).catch((e) => console.error(e));
      }
      return { success: true, user: superAdminUser };
    }

    if (!foundUser) {
      return { success: false, message: 'No account found with this email address.' };
    }

    if (password && foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    // Hardcoded Super Admin Override: Ensure role is permanently 'admin'
    if (isSuper && foundUser.role !== 'admin') {
      const updatedSuperUser = { ...foundUser, role: 'admin' as UserRole };
      setUsers((prev) => prev.map((u) => (u.id === foundUser!.id ? updatedSuperUser : u)));
      foundUser = updatedSuperUser;
      if (db) {
        setDoc(doc(db, 'users', updatedSuperUser.id), updatedSuperUser).catch((e) => console.error(e));
      }
    }

    setCurrentUser(foundUser);
    return { success: true, user: foundUser };
  };

  const registerUser = (name: string, email: string, password?: string, initialRole?: UserRole) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    if (!cleanName || !cleanEmail) {
      return { success: false, message: 'Please enter a valid name and email address.' };
    }
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    if (auth && password) {
      createUserWithEmailAndPassword(auth, cleanEmail, password).catch((e) => {
        console.warn('Firebase Auth register notice:', e?.message || e);
      });
    }

    // Hardcoded Super Admin Check: mdanontosunny1068@mail.com gets 'admin', all others default to 'user'
    const isSuper = isSuperAdminEmail(cleanEmail);
    const assignedRole: UserRole = isSuper ? 'admin' : (initialRole || 'user');

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: assignedRole,
      createdAt: new Date().toISOString(),
      password: password || 'user123',
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    if (db) {
      setDoc(doc(db, 'users', newUser.id), newUser).catch((e) => console.error(e));
    }

    return { success: true, user: newUser };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    if (auth) {
      signOut(auth).catch((e) => console.error(e));
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
    if (db) {
      try {
        await updateDoc(doc(db, 'users', userId), { role: newRole });
      } catch (e) {
        console.error('Firestore updateUserRole error:', e);
      }
    }
  };

  const deleteUserAccount = async (userIdOrEmail: string) => {
    const cleanTarget = userIdOrEmail.trim().toLowerCase();
    const targetUser = users.find(
      (u) => u.id === userIdOrEmail || u.email.trim().toLowerCase() === cleanTarget
    );

    setUsers((prev) => {
      const updated = prev.filter(
        (u) =>
          u.id !== userIdOrEmail &&
          u.email.trim().toLowerCase() !== cleanTarget
      );
      safeLocalStorageSet('spy_cms_users', JSON.stringify(updated));
      return updated;
    });

    if (targetUser && db) {
      try {
        await deleteDoc(doc(db, 'users', targetUser.id));
      } catch (e) {
        console.error('Firestore deleteUserAccount error:', e);
      }
    }

    if (
      currentUser &&
      (currentUser.id === userIdOrEmail ||
        (currentUser.email && currentUser.email.trim().toLowerCase() === cleanTarget))
    ) {
      logoutUser();
    }
  };

  const addApprovedAdminEmail = async (email: string) => {
    const clean = String(email || '').trim().toLowerCase();
    if (!clean) return;
    if (approvedAdminEmails.map((a) => String(a || '').trim().toLowerCase()).includes(clean)) return;

    const newList = [...approvedAdminEmails, clean];
    setApprovedAdminEmails(newList);
    safeLocalStorageSet('spy_cms_approved_admins', JSON.stringify(newList));
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'approved_admins'), { emails: newList }, { merge: true });
      } catch (e) {
        console.error('Firestore addApprovedAdminEmail error:', e);
      }
    }
  };

  const removeApprovedAdminEmail = async (email: string) => {
    const clean = String(email || '').trim().toLowerCase();
    const newList = approvedAdminEmails.filter((e) => String(e || '').trim().toLowerCase() !== clean);
    setApprovedAdminEmails(newList);
    safeLocalStorageSet('spy_cms_approved_admins', JSON.stringify(newList));
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'approved_admins'), { emails: newList }, { merge: true });
      } catch (e) {
        console.error('Firestore removeApprovedAdminEmail error:', e);
      }
    }
  };

  const resetToDefaults = () => {
    setSiteContent(DEFAULT_SITE_CONTENT);
    setEvents([]);
    setEventAttendees([]);
    setPrograms([]);
    setTeamMembers([]);
    setTeamCategories(DEFAULT_TEAM_CATEGORIES);
    setPartners([]);
    setComplaints([]);
    setInboxItems([]);
    setImpactStories([]);
    setUsers([]);
    setCurrentUser(null);
    try {
      localStorage.removeItem('spy_cms_siteContent');
      localStorage.removeItem('spy_cms_events');
      localStorage.removeItem('spy_cms_event_attendees');
      localStorage.removeItem('spy_cms_programs');
      localStorage.removeItem('spy_cms_team');
      localStorage.removeItem('spy_cms_team_categories');
      localStorage.removeItem('spy_cms_partners');
      localStorage.removeItem('spy_cms_complaints');
      localStorage.removeItem('spy_cms_inbox');
      localStorage.removeItem('spy_cms_impact_stories');
      localStorage.removeItem('spy_cms_users');
      localStorage.removeItem('spy_cms_current_user');
      localStorage.removeItem('spy_cms_approved_admins');
    } catch (e) {
      console.error(e);
    }
  };

  const userEmailClean = String(currentUser?.email || '').trim().toLowerCase();
  const isSuperAdmin = userEmailClean === 'mdanontosunny1068@mail.com' || userEmailClean === 'mdanontosunny1068@gmail.com';
  const isApprovedAdmin = Boolean(userEmailClean && approvedAdminEmails.map((a) => String(a || '').trim().toLowerCase()).includes(userEmailClean));

  const isAdmin = Boolean(currentUser && (isSuperAdmin || isApprovedAdmin));

  return (
    <CmsContext.Provider
      value={{
        siteContent,
        events,
        eventAttendees,
        programs,
        teamMembers,
        partners,
        complaints,
        inboxItems,
        impactStories,
        users,
        currentUser,
        isAdmin,
        approvedAdminEmails,
        addApprovedAdminEmail,
        removeApprovedAdminEmail,
        authModalOpen,
        setAuthModalOpen,
        visitorCount,
        updateHero,
        updateWhoWeAre,
        updateFocusAreas,
        updateStats,
        updateFeaturedEvent,
        updateCta,
        updateContactInfo,
        updateSocialLinks,
        updateSystemSettings,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleFeaturedEvent,
        addEventAttendee,
        deleteEventAttendee,
        getAttendeesForEvent,
        addProgram,
        updateProgram,
        deleteProgram,
        teamCategories,
        addTeamCategory,
        deleteTeamCategory,
        updateTeamCategories,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addPartner,
        updatePartner,
        deletePartner,
        addComplaint,
        updateComplaintStatus,
        updateComplaintNotes,
        deleteComplaint,
        clearAllComplaints,
        addInboxItem,
        updateInboxStatus,
        updateInboxNotes,
        deleteInboxItem,
        clearAllInboxItems,
        addImpactStory,
        updateImpactStory,
        deleteImpactStory,
        loginUser,
        registerUser,
        logoutUser,
        updateUserRole,
        deleteUserAccount,
        resetToDefaults,
        isAdminOpen,
        setIsAdminOpen,
        isLoading,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
