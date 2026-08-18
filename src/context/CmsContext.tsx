import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
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

// Helper to remove any `undefined` values that cause Firestore errors
function sanitizeForFirestore<T>(data: T): any {
  if (data === null || data === undefined) return null;
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item));
  }
  if (typeof data === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleanObj[key] = sanitizeForFirestore(value);
      }
    }
    return cleanObj;
  }
  return data;
}

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
  updateHero: (data: Partial<SiteContent['hero']>) => Promise<void>;
  updateWhoWeAre: (data: Partial<SiteContent['whoWeAre']>) => Promise<void>;
  updateFocusAreas: (areas: FocusAreaItem[]) => Promise<void>;
  updateStats: (stats: StatItem[]) => Promise<void>;
  updateFeaturedEvent: (event: EventItem | null) => Promise<void>;
  updateCta: (data: Partial<SiteContent['cta']>) => Promise<void>;
  updateContactInfo: (data: Partial<SiteContent['contactInfo']>) => Promise<void>;
  updateSocialLinks: (data: Partial<SocialLinks>) => Promise<void>;
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
  addEvent: (event: Omit<EventItem, 'id'>) => Promise<EventItem>;
  updateEvent: (id: string, eventData: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleFeaturedEvent: (id: string | null) => Promise<void>;
  addEventAttendee: (attendee: Omit<EventAttendee, 'id' | 'registrationDate'>) => Promise<void>;
  deleteEventAttendee: (id: string) => Promise<void>;
  getAttendeesForEvent: (eventId: string) => EventAttendee[];

  // Program CRUD
  addProgram: (program: Omit<ProgramItem, 'id'>) => Promise<void>;
  updateProgram: (id: string, programData: Partial<ProgramItem>) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;

  // Team CRUD & Category Management
  teamCategories: string[];
  addTeamCategory: (category: string) => Promise<void>;
  deleteTeamCategory: (category: string) => Promise<void>;
  updateTeamCategories: (categories: string[]) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (id: string, memberData: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  // Partner CRUD
  addPartner: (partner: PartnerLogo) => Promise<void>;
  updatePartner: (oldName: string, partner: PartnerLogo) => Promise<void>;
  deletePartner: (name: string) => Promise<void>;

  // Complaint CRUD & Actions
  addComplaint: (complaint: Omit<ComplaintItem, 'id' | 'dateSubmitted' | 'status'>) => Promise<void>;
  updateComplaintStatus: (id: string, status: 'Pending' | 'In Review' | 'Resolved') => Promise<void>;
  updateComplaintNotes: (id: string, notes: string) => Promise<void>;
  deleteComplaint: (id: string) => Promise<void>;
  clearAllComplaints: () => Promise<void>;

  // Inbox CRUD & Actions
  addInboxItem: (item: Omit<InboxItem, 'id' | 'dateSubmitted' | 'status'> & { id?: string; dateSubmitted?: string; status?: InboxItem['status'] }) => Promise<void>;
  updateInboxStatus: (id: string, status: InboxItem['status']) => Promise<void>;
  updateInboxNotes: (id: string, notes: string) => Promise<void>;
  deleteInboxItem: (id: string) => Promise<void>;
  clearAllInboxItems: () => Promise<void>;

  // Impact Stories CRUD
  addImpactStory: (story: Omit<ImpactStory, 'id'>) => Promise<void>;
  updateImpactStory: (id: string, storyData: Partial<ImpactStory>) => Promise<void>;
  deleteImpactStory: (id: string) => Promise<void>;

  // Authentication & User Accounts (RBAC)
  loginUser: (email: string, password?: string) => Promise<{ success: boolean; message?: string; user?: UserAccount }>;
  registerUser: (name: string, email: string, password?: string, initialRole?: UserRole) => Promise<{ success: boolean; message?: string; user?: UserAccount }>;
  logoutUser: () => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  deleteUserAccount: (userId: string) => Promise<void>;

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
      const saved = localStorage.getItem('spy_cms_users');
      if (saved) {
        const parsed: UserAccount[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
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
  const [isLoading, setIsLoading] = useState(false);

  // Firestore Real-time Listeners and Synchronization with safe error handling
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    try {
      // 1. Site Content
      const unsubSite = onSnapshot(
        doc(db, 'site_content', 'main'),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as SiteContent;
            setSiteContent(data);
            safeLocalStorageSet('spy_cms_siteContent', JSON.stringify(data));
          }
        },
        (err) => {
          console.warn('Firestore site_content note:', err.message);
        }
      );
      unsubs.push(unsubSite);

      // 2. Events
      const unsubEvents = onSnapshot(
        collection(db, 'events'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as EventItem);
            setEvents(list);
            safeLocalStorageSet('spy_cms_events', JSON.stringify(list));
          }
        },
        (err) => {
          console.warn('Firestore events note:', err.message);
        }
      );
      unsubs.push(unsubEvents);

      // 3. Programs
      const unsubPrograms = onSnapshot(
        collection(db, 'programs'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as ProgramItem);
            setPrograms(list);
            safeLocalStorageSet('spy_cms_programs', JSON.stringify(list));
          }
        },
        (err) => {
          console.warn('Firestore programs note:', err.message);
        }
      );
      unsubs.push(unsubPrograms);

      // 4. Team Members
      const unsubTeam = onSnapshot(
        collection(db, 'team_members'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as TeamMember);
            setTeamMembers(list);
            safeLocalStorageSet('spy_cms_team', JSON.stringify(list));
          }
        },
        (err) => {
          console.warn('Firestore team note:', err.message);
        }
      );
      unsubs.push(unsubTeam);

      // 5. Partners
      const unsubPartners = onSnapshot(
        collection(db, 'partners'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as PartnerLogo);
            setPartners(list);
            safeLocalStorageSet('spy_cms_partners', JSON.stringify(list));
          }
        },
        (err) => {
          console.warn('Firestore partners note:', err.message);
        }
      );
      unsubs.push(unsubPartners);

      // 6. Complaints
      const unsubComplaints = onSnapshot(
        collection(db, 'complaints'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as ComplaintItem);
            setComplaints(list);
            safeLocalStorageSet('spy_cms_complaints', JSON.stringify(list));
          }
        },
        (err) => {
          console.warn('Firestore complaints note:', err.message);
        }
      );
      unsubs.push(unsubComplaints);

      // 7. Inbox
      const unsubInbox = onSnapshot(
        collection(db, 'inbox'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as InboxItem);
            setInboxItems(list);
            safeLocalStorageSet('spy_cms_inbox', JSON.stringify(list));
          }
        },
        (err) => {
          console.warn('Firestore inbox note:', err.message);
        }
      );
      unsubs.push(unsubInbox);

      // 8. Event Attendees
      const unsubAttendees = onSnapshot(
        collection(db, 'event_attendees'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as EventAttendee);
            setEventAttendees(list);
            safeLocalStorageSet('spy_cms_event_attendees', JSON.stringify(list));
          }
        },
        (err) => {
          console.warn('Firestore attendees note:', err.message);
        }
      );
      unsubs.push(unsubAttendees);

      // 9. Impact Stories
      const unsubStories = onSnapshot(
        collection(db, 'impact_stories'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as ImpactStory);
            setImpactStories(list);
            safeLocalStorageSet('spy_cms_impact_stories', JSON.stringify(list));
          }
        },
        (err) => {
          console.warn('Firestore impact stories note:', err.message);
        }
      );
      unsubs.push(unsubStories);

      // 10. Users
      const unsubUsers = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as UserAccount);
            setUsers(list);
            safeLocalStorageSet('spy_cms_users', JSON.stringify(list));
          }
        },
        (err) => {
          console.warn('Firestore users note:', err.message);
        }
      );
      unsubs.push(unsubUsers);
    } catch (err) {
      console.warn('Firestore subscription initialized safely:', err);
    }

    return () => {
      unsubs.forEach((unsub) => {
        try {
          unsub();
        } catch (e) {}
      });
    };
  }, []);

  // Sync state to local storage as durable backup
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

  // Site Content Modifiers
  const updateHero = async (data: Partial<SiteContent['hero']>) => {
    const updated = {
      ...siteContent,
      hero: { ...siteContent.hero, ...data },
    };
    setSiteContent(updated);
    try {
      await setDoc(doc(db, 'site_content', 'main'), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firestore updateHero saved locally:', e);
    }
  };

  const updateWhoWeAre = async (data: Partial<SiteContent['whoWeAre']>) => {
    const updated = {
      ...siteContent,
      whoWeAre: { ...siteContent.whoWeAre, ...data },
    };
    setSiteContent(updated);
    try {
      await setDoc(doc(db, 'site_content', 'main'), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firestore updateWhoWeAre saved locally:', e);
    }
  };

  const updateFocusAreas = async (areas: FocusAreaItem[]) => {
    const updated = { ...siteContent, focusAreas: areas };
    setSiteContent(updated);
    try {
      await setDoc(doc(db, 'site_content', 'main'), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firestore updateFocusAreas saved locally:', e);
    }
  };

  const updateStats = async (stats: StatItem[]) => {
    const updated = { ...siteContent, stats: stats };
    setSiteContent(updated);
    try {
      await setDoc(doc(db, 'site_content', 'main'), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firestore updateStats saved locally:', e);
    }
  };

  const updateFeaturedEvent = async (event: EventItem | null) => {
    const updated = { ...siteContent, featuredEvent: event };
    setSiteContent(updated);
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
    try {
      await setDoc(doc(db, 'site_content', 'main'), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firestore updateFeaturedEvent saved locally:', e);
    }
  };

  const updateCta = async (data: Partial<SiteContent['cta']>) => {
    const updated = {
      ...siteContent,
      cta: { ...siteContent.cta, ...data },
    };
    setSiteContent(updated);
    try {
      await setDoc(doc(db, 'site_content', 'main'), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firestore updateCta saved locally:', e);
    }
  };

  const updateContactInfo = async (data: Partial<SiteContent['contactInfo']>) => {
    const updated = {
      ...siteContent,
      contactInfo: { ...siteContent.contactInfo, ...data },
    };
    setSiteContent(updated);
    try {
      await setDoc(doc(db, 'site_content', 'main'), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firestore updateContactInfo saved locally:', e);
    }
  };

  const updateSocialLinks = async (data: Partial<SocialLinks>) => {
    const updated = {
      ...siteContent,
      socialLinks: { ...siteContent.socialLinks, ...data },
    };
    setSiteContent(updated);
    try {
      await setDoc(doc(db, 'site_content', 'main'), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firestore updateSocialLinks saved locally:', e);
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

    const updated = {
      ...siteContent,
      siteName: updatedSiteName,
      maintenanceMode: updatedMaintenanceMode,
      contactInfo: updatedContact,
      socialLinks: updatedSocial,
    };

    setSiteContent(updated);
    try {
      await setDoc(doc(db, 'site_content', 'main'), sanitizeForFirestore(updated), { merge: true });
    } catch (e) {
      console.warn('Firestore updateSystemSettings saved locally:', e);
    }
  };

  // Event CRUD
  const addEvent = async (eventData: Omit<EventItem, 'id'>): Promise<EventItem> => {
    const newId = `event-${Date.now()}`;
    const payload: EventItem = {
      id: newId,
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
    };

    setEvents((prev) => [payload, ...prev]);
    try {
      await setDoc(doc(db, 'events', newId), sanitizeForFirestore(payload));
    } catch (e) {
      console.warn('Firestore addEvent saved locally:', e);
    }
    return payload;
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
    }

    try {
      await updateDoc(doc(db, 'events', id), sanitizeForFirestore(eventData));
    } catch (e) {
      console.warn('Firestore updateEvent saved locally:', e);
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

    if (siteContent.featuredEvent && siteContent.featuredEvent.id === id) {
      const nextFeatured = remainingEvents.find((e) => e.isFeatured) || remainingEvents[0] || null;
      if (nextFeatured) {
        updateFeaturedEvent(nextFeatured);
      } else {
        setSiteContent((prev) => ({ ...prev, featuredEvent: null }));
      }
    }

    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (e) {
      console.warn('Firestore deleteEvent performed locally:', e);
    }
  };

  const toggleFeaturedEvent = async (id: string | null) => {
    if (!id) {
      const updatedEvents = events.map((e) => ({ ...e, isFeatured: false }));
      setEvents(updatedEvents);
      safeLocalStorageSet('spy_cms_events', JSON.stringify(updatedEvents));
      updateFeaturedEvent(null);
      return;
    }

    const target = events.find((e) => e.id === id);
    if (!target) return;

    if (target.isFeatured) {
      const updatedEvents = events.map((e) =>
        e.id === id ? { ...e, isFeatured: false } : e
      );
      setEvents(updatedEvents);
      safeLocalStorageSet('spy_cms_events', JSON.stringify(updatedEvents));
      updateFeaturedEvent(null);
    } else {
      const updatedEvents = events.map((e) => ({
        ...e,
        isFeatured: e.id === id,
      }));
      setEvents(updatedEvents);
      safeLocalStorageSet('spy_cms_events', JSON.stringify(updatedEvents));
      const newFeatured = { ...target, isFeatured: true };
      updateFeaturedEvent(newFeatured);
    }
  };

  const addEventAttendee = async (
    attendeeData: Omit<EventAttendee, 'id' | 'registrationDate'>
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newId = `att-${Date.now()}`;
    const newAttendee: EventAttendee = {
      id: newId,
      registrationDate: today,
      ...attendeeData,
    };
    setEventAttendees((prev) => [newAttendee, ...prev]);
    try {
      await setDoc(doc(db, 'event_attendees', newId), sanitizeForFirestore(newAttendee));
    } catch (e) {
      console.warn('Firestore addEventAttendee saved locally:', e);
    }
  };

  const deleteEventAttendee = async (id: string) => {
    setEventAttendees((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      safeLocalStorageSet('spy_cms_event_attendees', JSON.stringify(updated));
      return updated;
    });
    try {
      await deleteDoc(doc(db, 'event_attendees', id));
    } catch (e) {
      console.warn('Firestore deleteEventAttendee performed locally:', e);
    }
  };

  const getAttendeesForEvent = (eventId: string) => {
    return (eventAttendees || []).filter((a) => a?.eventId === eventId);
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
    try {
      await setDoc(doc(db, 'programs', newId), sanitizeForFirestore(newProgram));
    } catch (e) {
      console.warn('Firestore addProgram saved locally:', e);
    }
  };

  const updateProgram = async (id: string, progData: Partial<ProgramItem>) => {
    setPrograms((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...progData } : item))
    );
    try {
      await updateDoc(doc(db, 'programs', id), sanitizeForFirestore(progData));
    } catch (e) {
      console.warn('Firestore updateProgram saved locally:', e);
    }
  };

  const deleteProgram = async (id: string) => {
    setPrograms((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_programs', JSON.stringify(updated));
      return updated;
    });
    try {
      await deleteDoc(doc(db, 'programs', id));
    } catch (e) {
      console.warn('Firestore deleteProgram performed locally:', e);
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
    try {
      await setDoc(doc(db, 'site_settings', 'team_categories'), sanitizeForFirestore({ categories: updated }));
    } catch (e) {
      console.warn('Firestore addTeamCategory saved locally:', e);
    }
  };

  const deleteTeamCategory = async (categoryName: string) => {
    const clean = categoryName.trim().toLowerCase();
    const updated = teamCategories.filter((cat) => cat.toLowerCase() !== clean);
    setTeamCategories(updated);
    safeLocalStorageSet('spy_cms_team_categories', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'site_settings', 'team_categories'), sanitizeForFirestore({ categories: updated }));
    } catch (e) {
      console.warn('Firestore deleteTeamCategory saved locally:', e);
    }
  };

  const updateTeamCategories = async (newCategories: string[]) => {
    const cleanList = newCategories.map((c) => c.trim()).filter(Boolean);
    setTeamCategories(cleanList);
    safeLocalStorageSet('spy_cms_team_categories', JSON.stringify(cleanList));
    try {
      await setDoc(doc(db, 'site_settings', 'team_categories'), sanitizeForFirestore({ categories: cleanList }));
    } catch (e) {
      console.warn('Firestore updateTeamCategories saved locally:', e);
    }
  };

  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
    const newId = `team-${Date.now()}`;
    const newMember: TeamMember = { ...memberData, id: newId };
    setTeamMembers((prev) => [...prev, newMember]);
    try {
      await setDoc(doc(db, 'team_members', newId), sanitizeForFirestore(newMember));
    } catch (e) {
      console.warn('Firestore addTeamMember saved locally:', e);
    }
  };

  const updateTeamMember = async (id: string, memberData: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...memberData } : item))
    );
    try {
      await updateDoc(doc(db, 'team_members', id), sanitizeForFirestore(memberData));
    } catch (e) {
      console.warn('Firestore updateTeamMember saved locally:', e);
    }
  };

  const deleteTeamMember = async (id: string) => {
    setTeamMembers((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_team', JSON.stringify(updated));
      return updated;
    });
    try {
      await deleteDoc(doc(db, 'team_members', id));
    } catch (e) {
      console.warn('Firestore deleteTeamMember performed locally:', e);
    }
  };

  // Partner CRUD
  const addPartner = async (partner: PartnerLogo) => {
    setPartners((prev) => [...prev, partner]);
    try {
      await setDoc(doc(db, 'partners', partner.name.replace(/\//g, '_')), sanitizeForFirestore(partner));
    } catch (e) {
      console.warn('Firestore addPartner saved locally:', e);
    }
  };

  const updatePartner = async (oldName: string, partner: PartnerLogo) => {
    setPartners((prev) => prev.map((p) => (p.name === oldName ? partner : p)));
    try {
      if (oldName !== partner.name) {
        await deleteDoc(doc(db, 'partners', oldName.replace(/\//g, '_')));
      }
      await setDoc(doc(db, 'partners', partner.name.replace(/\//g, '_')), sanitizeForFirestore(partner));
    } catch (e) {
      console.warn('Firestore updatePartner saved locally:', e);
    }
  };

  const deletePartner = async (name: string) => {
    setPartners((prev) => {
      const updated = prev.filter((p) => p.name !== name);
      safeLocalStorageSet('spy_cms_partners', JSON.stringify(updated));
      return updated;
    });
    try {
      await deleteDoc(doc(db, 'partners', name.replace(/\//g, '_')));
    } catch (e) {
      console.warn('Firestore deletePartner performed locally:', e);
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
    try {
      await setDoc(doc(db, 'complaints', newId), sanitizeForFirestore(newComplaint));
    } catch (e) {
      console.warn('Firestore addComplaint saved locally:', e);
    }
  };

  const updateComplaintStatus = async (id: string, status: 'Pending' | 'In Review' | 'Resolved') => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    try {
      await updateDoc(doc(db, 'complaints', id), { status });
    } catch (e) {
      console.warn('Firestore updateComplaintStatus saved locally:', e);
    }
  };

  const updateComplaintNotes = async (id: string, notes: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, adminNotes: notes } : c))
    );
    try {
      await updateDoc(doc(db, 'complaints', id), { adminNotes: notes });
    } catch (e) {
      console.warn('Firestore updateComplaintNotes saved locally:', e);
    }
  };

  const deleteComplaint = async (id: string) => {
    setComplaints((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      safeLocalStorageSet('spy_cms_complaints', JSON.stringify(updated));
      return updated;
    });
    try {
      await deleteDoc(doc(db, 'complaints', id));
    } catch (e) {
      console.warn('Firestore deleteComplaint performed locally:', e);
    }
  };

  const clearAllComplaints = async () => {
    setComplaints([]);
    safeLocalStorageSet('spy_cms_complaints', JSON.stringify([]));
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
    try {
      await setDoc(doc(db, 'inbox', newId), sanitizeForFirestore(newInbox));
    } catch (e) {
      console.warn('Firestore addInboxItem saved locally:', e);
    }
  };

  const updateInboxStatus = async (id: string, status: InboxItem['status']) => {
    setInboxItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    try {
      await updateDoc(doc(db, 'inbox', id), { status });
    } catch (e) {
      console.warn('Firestore updateInboxStatus saved locally:', e);
    }
  };

  const updateInboxNotes = async (id: string, notes: string) => {
    setInboxItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, adminNotes: notes } : item))
    );
    try {
      await updateDoc(doc(db, 'inbox', id), { adminNotes: notes });
    } catch (e) {
      console.warn('Firestore updateInboxNotes saved locally:', e);
    }
  };

  const deleteInboxItem = async (id: string) => {
    setInboxItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_inbox', JSON.stringify(updated));
      return updated;
    });
    try {
      await deleteDoc(doc(db, 'inbox', id));
    } catch (e) {
      console.warn('Firestore deleteInboxItem performed locally:', e);
    }
  };

  const clearAllInboxItems = async () => {
    setInboxItems([]);
    safeLocalStorageSet('spy_cms_inbox', JSON.stringify([]));
  };

  // Impact Stories CRUD
  const addImpactStory = async (storyData: Omit<ImpactStory, 'id'>) => {
    const newId = `story-${Date.now()}`;
    const newStory: ImpactStory = { ...storyData, id: newId };
    setImpactStories((prev) => [newStory, ...prev]);
    try {
      await setDoc(doc(db, 'impact_stories', newId), sanitizeForFirestore(newStory));
    } catch (e) {
      console.warn('Firestore addImpactStory saved locally:', e);
    }
  };

  const updateImpactStory = async (id: string, storyData: Partial<ImpactStory>) => {
    setImpactStories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...storyData } : item))
    );
    try {
      await updateDoc(doc(db, 'impact_stories', id), sanitizeForFirestore(storyData));
    } catch (e) {
      console.warn('Firestore updateImpactStory saved locally:', e);
    }
  };

  const deleteImpactStory = async (id: string) => {
    setImpactStories((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_impact_stories', JSON.stringify(updated));
      return updated;
    });
    try {
      await deleteDoc(doc(db, 'impact_stories', id));
    } catch (e) {
      console.warn('Firestore deleteImpactStory performed locally:', e);
    }
  };

  const isSuperAdminEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    return clean === 'mdanontosunny1068@mail.com' || clean === 'mdanontosunny1068@gmail.com';
  };

  // Auth & RBAC Methods
  const loginUser = async (email: string, password?: string): Promise<{ success: boolean; message?: string; user?: UserAccount }> => {
    const cleanEmail = email.trim().toLowerCase();
    const isSuper = isSuperAdminEmail(cleanEmail);

    let foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    // Auto-create Super Admin on login if needed
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
      try {
        await setDoc(doc(db, 'users', superAdminUser.id), sanitizeForFirestore(superAdminUser));
      } catch (e) {}
      return { success: true, user: superAdminUser };
    }

    if (!foundUser) {
      return { success: false, message: 'No account found with this email address.' };
    }

    if (password && foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    if (isSuper && foundUser.role !== 'admin') {
      const updatedSuperUser = { ...foundUser, role: 'admin' as UserRole };
      setUsers((prev) => prev.map((u) => (u.id === foundUser!.id ? updatedSuperUser : u)));
      foundUser = updatedSuperUser;
      try {
        await updateDoc(doc(db, 'users', foundUser.id), { role: 'admin' });
      } catch (e) {}
    }

    setCurrentUser(foundUser);
    return { success: true, user: foundUser };
  };

  const registerUser = async (name: string, email: string, password?: string, initialRole?: UserRole): Promise<{ success: boolean; message?: string; user?: UserAccount }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    if (!cleanName || !cleanEmail) {
      return { success: false, message: 'Please enter a valid name and email address.' };
    }
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

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
    try {
      await setDoc(doc(db, 'users', newUser.id), sanitizeForFirestore(newUser));
    } catch (e) {
      console.warn('Firestore registerUser saved locally:', e);
    }
    return { success: true, user: newUser };
  };

  const logoutUser = async () => {
    setCurrentUser(null);
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    } catch (e) {
      console.warn('Firestore updateUserRole saved locally:', e);
    }
  };

  const deleteUserAccount = async (userIdOrEmail: string) => {
    const cleanTarget = userIdOrEmail.trim().toLowerCase();
    let targetId = userIdOrEmail;
    setUsers((prev) => {
      const target = prev.find((u) => u.id === userIdOrEmail || u.email.trim().toLowerCase() === cleanTarget);
      if (target) targetId = target.id;
      const updated = prev.filter(
        (u) =>
          u.id !== userIdOrEmail &&
          u.email.trim().toLowerCase() !== cleanTarget
      );
      safeLocalStorageSet('spy_cms_users', JSON.stringify(updated));
      return updated;
    });

    if (
      currentUser &&
      (currentUser.id === userIdOrEmail ||
        (currentUser.email && currentUser.email.trim().toLowerCase() === cleanTarget))
    ) {
      logoutUser();
    }

    try {
      await deleteDoc(doc(db, 'users', targetId));
    } catch (e) {
      console.warn('Firestore deleteUserAccount performed locally:', e);
    }
  };

  const addApprovedAdminEmail = async (email: string) => {
    const clean = String(email || '').trim().toLowerCase();
    if (!clean) return;
    if (approvedAdminEmails.map((a) => String(a || '').trim().toLowerCase()).includes(clean)) return;

    const newList = [...approvedAdminEmails, clean];
    setApprovedAdminEmails(newList);
    safeLocalStorageSet('spy_cms_approved_admins', JSON.stringify(newList));
    try {
      await setDoc(doc(db, 'site_settings', 'approved_admins'), sanitizeForFirestore({ emails: newList }));
    } catch (e) {
      console.warn('Firestore addApprovedAdminEmail saved locally:', e);
    }
  };

  const removeApprovedAdminEmail = async (email: string) => {
    const clean = String(email || '').trim().toLowerCase();
    const newList = approvedAdminEmails.filter((e) => String(e || '').trim().toLowerCase() !== clean);
    setApprovedAdminEmails(newList);
    safeLocalStorageSet('spy_cms_approved_admins', JSON.stringify(newList));
    try {
      await setDoc(doc(db, 'site_settings', 'approved_admins'), sanitizeForFirestore({ emails: newList }));
    } catch (e) {
      console.warn('Firestore removeApprovedAdminEmail saved locally:', e);
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
