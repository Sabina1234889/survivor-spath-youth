import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { supabase } from '../supabase';

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

  // Sync to local storage for quick cache
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

  // ============================================================================
  // SUPABASE INITIAL LOAD & REALTIME SYNCHRONIZATION
  // ============================================================================
  useEffect(() => {
    let isMounted = true;

    const fetchSupabaseData = async () => {
      setIsLoading(true);
      try {
        // 1. Site Content & General Settings
        const { data: contentData, error: contentErr } = await supabase
          .from('site_content')
          .select('*');
        if (!contentErr && contentData && contentData.length > 0 && isMounted) {
          const contentMap: any = {};
          contentData.forEach((row) => {
            contentMap[row.id] = row.data || row;
          });
          setSiteContent((prev) => ({
            ...prev,
            hero: contentMap['hero'] || prev.hero,
            whoWeAre: contentMap['whoWeAre'] || prev.whoWeAre,
            cta: contentMap['cta'] || prev.cta,
            contactInfo: contentMap['contactInfo'] || prev.contactInfo,
            socialLinks: contentMap['socialLinks'] || prev.socialLinks,
            focusAreas: contentMap['focusAreas'] || prev.focusAreas,
            stats: contentMap['stats'] || prev.stats,
            siteName: contentMap['general']?.siteName || prev.siteName,
            maintenanceMode: contentMap['general']?.maintenanceMode ?? prev.maintenanceMode,
          }));
        }

        // 2. Events
        const { data: eventsData, error: eventsErr } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: false });
        if (!eventsErr && eventsData && isMounted) {
          setEvents(eventsData);
        }

        // 3. Event Attendees
        const { data: attData, error: attErr } = await supabase
          .from('event_attendees')
          .select('*');
        if (!attErr && attData && isMounted) {
          setEventAttendees(attData);
        }

        // 4. Programs
        const { data: progData, error: progErr } = await supabase
          .from('programs')
          .select('*')
          .order('number', { ascending: true });
        if (!progErr && progData && isMounted) {
          setPrograms(progData);
        }

        // 5. Team Members
        const { data: teamData, error: teamErr } = await supabase
          .from('team_members')
          .select('*')
          .order('order_index', { ascending: true });
        if (!teamErr && teamData && isMounted) {
          setTeamMembers(teamData);
        }

        // 6. Partners
        const { data: partnersData, error: partnersErr } = await supabase
          .from('partners')
          .select('*');
        if (!partnersErr && partnersData && isMounted) {
          setPartners(partnersData);
        }

        // 7. Complaints
        const { data: compData, error: compErr } = await supabase
          .from('complaints')
          .select('*')
          .order('dateSubmitted', { ascending: false });
        if (!compErr && compData && isMounted) {
          setComplaints(compData);
        }

        // 8. Inbox Items
        const { data: inbData, error: inbErr } = await supabase
          .from('inbox')
          .select('*')
          .order('dateSubmitted', { ascending: false });
        if (!inbErr && inbData && isMounted) {
          setInboxItems(inbData);
        }

        // 9. Impact Stories
        const { data: storiesData, error: storiesErr } = await supabase
          .from('impact_stories')
          .select('*');
        if (!storiesErr && storiesData && isMounted) {
          setImpactStories(storiesData);
        }

        // 10. Users
        const { data: usersData, error: usersErr } = await supabase
          .from('users')
          .select('*');
        if (!usersErr && usersData && isMounted) {
          setUsers(usersData);
        }

        // 11. System Settings / Team Categories / Approved Admins
        const { data: settingsData, error: settingsErr } = await supabase
          .from('system_settings')
          .select('*');
        if (!settingsErr && settingsData && isMounted) {
          const settingsMap: any = {};
          settingsData.forEach((row) => {
            settingsMap[row.id] = row.data || row;
          });
          if (settingsMap['team_categories']?.categories) {
            setTeamCategories(settingsMap['team_categories'].categories);
          }
          if (settingsMap['approved_admins']?.emails) {
            setApprovedAdminEmails(settingsMap['approved_admins'].emails);
          }
        }
      } catch (err) {
        console.warn('Supabase initial fetch notice (using local state fallback):', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSupabaseData();

    // Supabase Realtime Channel
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents((prev) => [payload.new as EventItem, ...prev.filter((e) => e.id !== payload.new.id)]);
          } else if (payload.eventType === 'UPDATE') {
            setEvents((prev) => prev.map((e) => (e.id === payload.new.id ? (payload.new as EventItem) : e)));
          } else if (payload.eventType === 'DELETE') {
            setEvents((prev) => prev.filter((e) => e.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'complaints' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComplaints((prev) => [payload.new as ComplaintItem, ...prev.filter((c) => c.id !== payload.new.id)]);
          } else if (payload.eventType === 'UPDATE') {
            setComplaints((prev) => prev.map((c) => (c.id === payload.new.id ? (payload.new as ComplaintItem) : c)));
          } else if (payload.eventType === 'DELETE') {
            setComplaints((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inbox' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setInboxItems((prev) => [payload.new as InboxItem, ...prev.filter((i) => i.id !== payload.new.id)]);
          } else if (payload.eventType === 'UPDATE') {
            setInboxItems((prev) => prev.map((i) => (i.id === payload.new.id ? (payload.new as InboxItem) : i)));
          } else if (payload.eventType === 'DELETE') {
            setInboxItems((prev) => prev.filter((i) => i.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Supabase Auth State Observer
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user?.email) {
          const cleanEmail = session.user.email.toLowerCase();
          const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
          if (found) {
            setCurrentUser(found);
          } else if (isSuperAdminEmail(cleanEmail)) {
            const superAdmin: UserAccount = {
              id: session.user.id || `user-superadmin-${Date.now()}`,
              name: session.user.user_metadata?.name || 'Md Anonto Sunny (Super Admin)',
              email: cleanEmail,
              role: 'admin',
              createdAt: new Date().toISOString(),
            };
            setCurrentUser(superAdmin);
          }
        } else if (event === 'SIGNED_OUT') {
          // Keep currentUser intact if logged in locally or reset if strictly signed out
        }
      }
    );

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Site Content Modifiers
  const updateHero = async (data: Partial<SiteContent['hero']>) => {
    let updatedHero = siteContent.hero;
    setSiteContent((prev) => {
      updatedHero = { ...prev.hero, ...data };
      return { ...prev, hero: updatedHero };
    });
    try {
      await supabase.from('site_content').upsert({ id: 'hero', data: updatedHero });
    } catch (e) {
      console.warn('Supabase updateHero error:', e);
    }
  };

  const updateWhoWeAre = async (data: Partial<SiteContent['whoWeAre']>) => {
    let updatedWho = siteContent.whoWeAre;
    setSiteContent((prev) => {
      updatedWho = { ...prev.whoWeAre, ...data };
      return { ...prev, whoWeAre: updatedWho };
    });
    try {
      await supabase.from('site_content').upsert({ id: 'whoWeAre', data: updatedWho });
    } catch (e) {
      console.warn('Supabase updateWhoWeAre error:', e);
    }
  };

  const updateFocusAreas = async (areas: FocusAreaItem[]) => {
    setSiteContent((prev) => ({ ...prev, focusAreas: areas }));
    try {
      await supabase.from('site_content').upsert({ id: 'focusAreas', data: areas });
    } catch (e) {
      console.warn('Supabase updateFocusAreas error:', e);
    }
  };

  const updateStats = async (stats: StatItem[]) => {
    setSiteContent((prev) => ({ ...prev, stats: stats }));
    try {
      await supabase.from('site_content').upsert({ id: 'stats', data: stats });
    } catch (e) {
      console.warn('Supabase updateStats error:', e);
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
    try {
      await supabase.from('site_content').upsert({ id: 'featuredEvent', data: event });
      if (event?.id) {
        await supabase.from('events').update({ isFeatured: true }).eq('id', event.id);
      }
    } catch (e) {
      console.warn('Supabase updateFeaturedEvent error:', e);
    }
  };

  const updateCta = async (data: Partial<SiteContent['cta']>) => {
    let updatedCta = siteContent.cta;
    setSiteContent((prev) => {
      updatedCta = { ...prev.cta, ...data };
      return { ...prev, cta: updatedCta };
    });
    try {
      await supabase.from('site_content').upsert({ id: 'cta', data: updatedCta });
    } catch (e) {
      console.warn('Supabase updateCta error:', e);
    }
  };

  const updateContactInfo = async (data: Partial<SiteContent['contactInfo']>) => {
    let updatedContact = siteContent.contactInfo;
    setSiteContent((prev) => {
      updatedContact = { ...prev.contactInfo, ...data };
      return { ...prev, contactInfo: updatedContact };
    });
    try {
      await supabase.from('site_content').upsert({ id: 'contactInfo', data: updatedContact });
    } catch (e) {
      console.warn('Supabase updateContactInfo error:', e);
    }
  };

  const updateSocialLinks = async (data: Partial<SocialLinks>) => {
    let updatedSocial = siteContent.socialLinks;
    setSiteContent((prev) => {
      updatedSocial = { ...prev.socialLinks, ...data };
      return { ...prev, socialLinks: updatedSocial };
    });
    try {
      await supabase.from('site_content').upsert({ id: 'socialLinks', data: updatedSocial });
    } catch (e) {
      console.warn('Supabase updateSocialLinks error:', e);
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

    try {
      await supabase.from('system_settings').upsert({
        id: 'general',
        data: {
          siteName: updatedSiteName,
          maintenanceMode: updatedMaintenanceMode,
          contactInfo: updatedContact,
          socialLinks: updatedSocial,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (e) {
      console.warn('Supabase updateSystemSettings error:', e);
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
      await supabase.from('events').insert([payload]);
    } catch (e) {
      console.warn('Supabase addEvent error:', e);
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
      await supabase.from('events').update(eventData).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateEvent error:', e);
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
      await supabase.from('events').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteEvent error:', e);
    }
  };

  const toggleFeaturedEvent = async (id: string | null) => {
    if (!id) {
      const updatedEvents = events.map((e) => ({ ...e, isFeatured: false }));
      setEvents(updatedEvents);
      safeLocalStorageSet('spy_cms_events', JSON.stringify(updatedEvents));
      updateFeaturedEvent(null);
      try {
        await supabase.from('events').update({ isFeatured: false }).neq('id', '');
      } catch (e) {
        console.warn('Supabase toggleFeaturedEvent clear error:', e);
      }
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
      try {
        await supabase.from('events').update({ isFeatured: false }).eq('id', id);
      } catch (e) {
        console.warn('Supabase toggleFeaturedEvent off error:', e);
      }
    } else {
      const updatedEvents = events.map((e) => ({
        ...e,
        isFeatured: e.id === id,
      }));
      setEvents(updatedEvents);
      safeLocalStorageSet('spy_cms_events', JSON.stringify(updatedEvents));
      const newFeatured = { ...target, isFeatured: true };
      updateFeaturedEvent(newFeatured);
      try {
        await supabase.from('events').update({ isFeatured: false }).neq('id', id);
        await supabase.from('events').update({ isFeatured: true }).eq('id', id);
      } catch (e) {
        console.warn('Supabase toggleFeaturedEvent on error:', e);
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
    try {
      await supabase.from('event_attendees').insert([newAttendee]);
    } catch (e) {
      console.warn('Supabase addEventAttendee error:', e);
    }
  };

  const deleteEventAttendee = async (id: string) => {
    setEventAttendees((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      safeLocalStorageSet('spy_cms_event_attendees', JSON.stringify(updated));
      return updated;
    });
    try {
      await supabase.from('event_attendees').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteEventAttendee error:', e);
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
      await supabase.from('programs').insert([newProgram]);
    } catch (e) {
      console.warn('Supabase addProgram error:', e);
    }
  };

  const updateProgram = async (id: string, progData: Partial<ProgramItem>) => {
    setPrograms((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...progData } : item))
    );
    try {
      await supabase.from('programs').update(progData).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateProgram error:', e);
    }
  };

  const deleteProgram = async (id: string) => {
    setPrograms((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_programs', JSON.stringify(updated));
      return updated;
    });
    try {
      await supabase.from('programs').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteProgram error:', e);
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
      await supabase.from('system_settings').upsert({ id: 'team_categories', data: { categories: updated } });
    } catch (e) {
      console.warn('Supabase addTeamCategory error:', e);
    }
  };

  const deleteTeamCategory = async (categoryName: string) => {
    const clean = categoryName.trim().toLowerCase();
    const updated = teamCategories.filter((cat) => cat.toLowerCase() !== clean);
    setTeamCategories(updated);
    safeLocalStorageSet('spy_cms_team_categories', JSON.stringify(updated));
    try {
      await supabase.from('system_settings').upsert({ id: 'team_categories', data: { categories: updated } });
    } catch (e) {
      console.warn('Supabase deleteTeamCategory error:', e);
    }
  };

  const updateTeamCategories = async (newCategories: string[]) => {
    const cleanList = newCategories.map((c) => c.trim()).filter(Boolean);
    setTeamCategories(cleanList);
    safeLocalStorageSet('spy_cms_team_categories', JSON.stringify(cleanList));
    try {
      await supabase.from('system_settings').upsert({ id: 'team_categories', data: { categories: cleanList } });
    } catch (e) {
      console.warn('Supabase updateTeamCategories error:', e);
    }
  };

  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
    const newId = `team-${Date.now()}`;
    const newMember: TeamMember = { ...memberData, id: newId };
    setTeamMembers((prev) => [...prev, newMember]);
    try {
      await supabase.from('team_members').insert([newMember]);
    } catch (e) {
      console.warn('Supabase addTeamMember error:', e);
    }
  };

  const updateTeamMember = async (id: string, memberData: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...memberData } : item))
    );
    try {
      await supabase.from('team_members').update(memberData).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateTeamMember error:', e);
    }
  };

  const deleteTeamMember = async (id: string) => {
    setTeamMembers((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_team', JSON.stringify(updated));
      return updated;
    });
    try {
      await supabase.from('team_members').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteTeamMember error:', e);
    }
  };

  // Partner CRUD
  const addPartner = async (partner: PartnerLogo) => {
    setPartners((prev) => [...prev, partner]);
    try {
      await supabase.from('partners').insert([partner]);
    } catch (e) {
      console.warn('Supabase addPartner error:', e);
    }
  };

  const updatePartner = async (oldName: string, partner: PartnerLogo) => {
    setPartners((prev) => prev.map((p) => (p.name === oldName ? partner : p)));
    try {
      await supabase.from('partners').update(partner).eq('name', oldName);
    } catch (e) {
      console.warn('Supabase updatePartner error:', e);
    }
  };

  const deletePartner = async (name: string) => {
    setPartners((prev) => {
      const updated = prev.filter((p) => p.name !== name);
      safeLocalStorageSet('spy_cms_partners', JSON.stringify(updated));
      return updated;
    });
    try {
      await supabase.from('partners').delete().eq('name', name);
    } catch (e) {
      console.warn('Supabase deletePartner error:', e);
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
      await supabase.from('complaints').insert([newComplaint]);
    } catch (e) {
      console.warn('Supabase addComplaint error:', e);
    }
  };

  const updateComplaintStatus = async (id: string, status: 'Pending' | 'In Review' | 'Resolved') => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    try {
      await supabase.from('complaints').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateComplaintStatus error:', e);
    }
  };

  const updateComplaintNotes = async (id: string, notes: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, adminNotes: notes } : c))
    );
    try {
      await supabase.from('complaints').update({ adminNotes: notes }).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateComplaintNotes error:', e);
    }
  };

  const deleteComplaint = async (id: string) => {
    setComplaints((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      safeLocalStorageSet('spy_cms_complaints', JSON.stringify(updated));
      return updated;
    });
    try {
      await supabase.from('complaints').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteComplaint error:', e);
    }
  };

  const clearAllComplaints = async () => {
    setComplaints([]);
    safeLocalStorageSet('spy_cms_complaints', JSON.stringify([]));
    try {
      await supabase.from('complaints').delete().neq('id', '');
    } catch (e) {
      console.warn('Supabase clearAllComplaints error:', e);
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
    try {
      await supabase.from('inbox').insert([newInbox]);
    } catch (e) {
      console.warn('Supabase addInboxItem error:', e);
    }
  };

  const updateInboxStatus = async (id: string, status: InboxItem['status']) => {
    setInboxItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    try {
      await supabase.from('inbox').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateInboxStatus error:', e);
    }
  };

  const updateInboxNotes = async (id: string, notes: string) => {
    setInboxItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, adminNotes: notes } : item))
    );
    try {
      await supabase.from('inbox').update({ adminNotes: notes }).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateInboxNotes error:', e);
    }
  };

  const deleteInboxItem = async (id: string) => {
    setInboxItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_inbox', JSON.stringify(updated));
      return updated;
    });
    try {
      await supabase.from('inbox').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteInboxItem error:', e);
    }
  };

  const clearAllInboxItems = async () => {
    setInboxItems([]);
    safeLocalStorageSet('spy_cms_inbox', JSON.stringify([]));
    try {
      await supabase.from('inbox').delete().neq('id', '');
    } catch (e) {
      console.warn('Supabase clearAllInboxItems error:', e);
    }
  };

  // Impact Stories CRUD
  const addImpactStory = async (storyData: Omit<ImpactStory, 'id'>) => {
    const newId = `story-${Date.now()}`;
    const newStory: ImpactStory = { ...storyData, id: newId };
    setImpactStories((prev) => [newStory, ...prev]);
    try {
      await supabase.from('impact_stories').insert([newStory]);
    } catch (e) {
      console.warn('Supabase addImpactStory error:', e);
    }
  };

  const updateImpactStory = async (id: string, storyData: Partial<ImpactStory>) => {
    setImpactStories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...storyData } : item))
    );
    try {
      await supabase.from('impact_stories').update(storyData).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateImpactStory error:', e);
    }
  };

  const deleteImpactStory = async (id: string) => {
    setImpactStories((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeLocalStorageSet('spy_cms_impact_stories', JSON.stringify(updated));
      return updated;
    });
    try {
      await supabase.from('impact_stories').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteImpactStory error:', e);
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

    // Try Supabase Auth
    if (password) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });
        if (!authError && authData?.user) {
          if (!foundUser) {
            foundUser = {
              id: authData.user.id,
              name: authData.user.user_metadata?.name || (isSuper ? 'Md Anonto Sunny (Super Admin)' : 'Staff Member'),
              email: cleanEmail,
              role: isSuper ? 'admin' : (authData.user.user_metadata?.role || 'user'),
              createdAt: new Date().toISOString(),
            };
          }
        }
      } catch (err) {
        console.warn('Supabase auth sign in error:', err);
      }
    }

    // Auto-create Super Admin
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
        await supabase.from('users').upsert(superAdminUser);
      } catch (e) {
        console.warn('Supabase superadmin sync error:', e);
      }
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
        await supabase.from('users').upsert(updatedSuperUser);
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

    let newUserId = `user-${Date.now()}`;

    // Try Supabase Auth Sign Up
    if (password) {
      try {
        const { data: authData } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              name: cleanName,
              role: assignedRole,
            },
          },
        });
        if (authData?.user?.id) {
          newUserId = authData.user.id;
        }
      } catch (err) {
        console.warn('Supabase auth sign up error:', err);
      }
    }

    const newUser: UserAccount = {
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      role: assignedRole,
      createdAt: new Date().toISOString(),
      password: password || 'user123',
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    try {
      await supabase.from('users').upsert(newUser);
    } catch (e) {
      console.warn('Supabase registerUser insert error:', e);
    }

    return { success: true, user: newUser };
  };

  const logoutUser = async () => {
    setCurrentUser(null);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut notice:', e);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
    try {
      await supabase.from('users').update({ role: newRole }).eq('id', userId);
    } catch (e) {
      console.warn('Supabase updateUserRole error:', e);
    }
  };

  const deleteUserAccount = async (userIdOrEmail: string) => {
    const cleanTarget = userIdOrEmail.trim().toLowerCase();
    setUsers((prev) => {
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
      await supabase.from('users').delete().or(`id.eq.${userIdOrEmail},email.eq.${cleanTarget}`);
    } catch (e) {
      console.warn('Supabase deleteUserAccount error:', e);
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
      await supabase.from('system_settings').upsert({ id: 'approved_admins', data: { emails: newList } });
    } catch (e) {
      console.warn('Supabase addApprovedAdminEmail error:', e);
    }
  };

  const removeApprovedAdminEmail = async (email: string) => {
    const clean = String(email || '').trim().toLowerCase();
    const newList = approvedAdminEmails.filter((e) => String(e || '').trim().toLowerCase() !== clean);
    setApprovedAdminEmails(newList);
    safeLocalStorageSet('spy_cms_approved_admins', JSON.stringify(newList));
    try {
      await supabase.from('system_settings').upsert({ id: 'approved_admins', data: { emails: newList } });
    } catch (e) {
      console.warn('Supabase removeApprovedAdminEmail error:', e);
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
