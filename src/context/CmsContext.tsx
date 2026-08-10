import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
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
  FEATURED_EVENT,
  EVENTS as INITIAL_EVENTS,
  INITIAL_EVENT_ATTENDEES,
  PROGRAMS as INITIAL_PROGRAMS,
  TEAM_MEMBERS as INITIAL_TEAM,
  PARTNER_LOGOS as INITIAL_PARTNERS,
  IMPACT_STORIES as INITIAL_IMPACT_STORIES,
  INITIAL_USER_ACCOUNTS,
} from '../data/mockData';

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
  featuredEvent: FEATURED_EVENT,
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

const INITIAL_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'COMP-2026-001',
    dateSubmitted: '2026-08-05',
    category: 'School Harassment',
    subject: 'Unaddressed safety issue on campus premises',
    description:
      'I filed a report with our campus safety committee last month regarding verbal harassment near the auditorium. Requesting confidential support and institutional followup.',
    fullName: 'Anonymous Complainant',
    institution: 'Jessore Model College',
    division: 'Khulna',
    district: 'Jessore',
    status: 'Pending',
    urgencyLevel: 'Critical',
    attachmentName: 'incident_notes_redacted.pdf',
    attachmentUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1000',
    adminNotes: 'Assigned to Legal Aid & School Outreach Committee for review.',
  },
  {
    id: 'COMP-2026-002',
    dateSubmitted: '2026-08-02',
    category: 'Cyber Harassment',
    subject: 'Unconsented photo distribution on social media',
    description:
      'A fake Facebook page was created using photos taken without consent. Need legal advice on cyber crime reporting in Bangladesh and platform takedown steps.',
    fullName: 'Farhana Akter',
    emailOrPhone: 'farhana.a@example.com',
    institution: 'Dhaka City College',
    division: 'Dhaka',
    district: 'Dhaka',
    status: 'In Review',
    urgencyLevel: 'Urgent',
    attachmentName: 'screenshot_evidence.png',
    attachmentUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    adminNotes: 'Cyber safety unit contacted; drafted takedown notice template.',
  },
  {
    id: 'COMP-2026-003',
    dateSubmitted: '2026-07-28',
    category: 'Institutional Request',
    subject: 'Request for school workshop on consent and safety',
    description:
      'Our student council requests Survivor’s Path Youth to host an interactive awareness session for 300+ students on rights, boundaries, and safe reporting.',
    fullName: 'Student Council President',
    emailOrPhone: '+880 1711-223344',
    institution: 'Khulna Public School & College',
    division: 'Khulna',
    district: 'Khulna',
    status: 'Resolved',
    urgencyLevel: 'Standard',
    adminNotes: 'Workshop scheduled for September 2026; trainer assigned.',
  },
];

const INITIAL_INBOX_ITEMS: InboxItem[] = [
  {
    id: 'INB-2026-001',
    dateSubmitted: '2026-08-08',
    category: 'General Messages',
    name: 'Tanvir Hossain',
    email: 'tanvir.h@example.com',
    phone: '+880 1711-223344',
    organizationOrSchool: 'Dhaka University',
    subjectOrRole: 'Inquiry regarding upcoming Youth Fest 2026 registration',
    districtOrLocation: 'Dhaka',
    message:
      'Hello Survivor’s Path Youth team! I am a student at DU interested in attending the Youth Fest 2026 workshop. Could you please share details on how students can register?',
    status: 'New',
  },
  {
    id: 'INB-2026-002',
    dateSubmitted: '2026-08-07',
    category: 'Volunteer Applications',
    name: 'Nusrat Jahan',
    email: 'nusrat.j@example.com',
    phone: '+880 1822-334455',
    organizationOrSchool: 'Jessore Government Girls School',
    subjectOrRole: 'Youth Volunteer Advocate',
    districtOrLocation: 'Jessore',
    message:
      'I want to advocate for safe school campuses in Jessore. I have prior experience leading student clubs and organizing peer awareness drives.',
    status: 'New',
  },
  {
    id: 'INB-2026-003',
    dateSubmitted: '2026-08-06',
    category: 'Partnership & Sponsorships',
    name: 'Kazi Rayhan',
    email: 'kazi.rayhan@partner-ngo.org',
    phone: '+880 1933-445566',
    organizationOrSchool: 'Youth Action Bangladesh',
    subjectOrRole: 'Institutional Co-Sponsorship Proposal',
    districtOrLocation: 'Dhaka',
    message:
      'We would love to co-sponsor the upcoming legal literacy drives and provide educational booklets for 500+ participants.',
    status: 'In Review',
    adminNotes: 'Contacted partnership lead for follow-up call.',
  },
  {
    id: 'INB-2026-004',
    dateSubmitted: '2026-08-05',
    category: 'School Collaborations',
    name: 'Principal Mahfuzur Rahman',
    email: 'principal@khulnamodel.edu.bd',
    phone: '+880 1744-556677',
    organizationOrSchool: 'Khulna Model Higher Secondary School',
    subjectOrRole: 'Campus Consent & Safety Workshop Request',
    districtOrLocation: 'Khulna',
    message:
      'We request Survivor’s Path Youth to conduct an interactive cyber safety & anti-harassment session for our Grade 9-12 students next month.',
    status: 'Replied',
    adminNotes: 'Session scheduled for September 12.',
  },
  {
    id: 'INB-2026-005',
    dateSubmitted: '2026-08-04',
    category: 'Volunteer Applications',
    name: 'Arif Chowdhury',
    email: 'arif.c@example.com',
    phone: '+880 1655-667788',
    organizationOrSchool: 'Chittagong College',
    subjectOrRole: 'Digital Media & Campaign Volunteer',
    districtOrLocation: 'Chittagong',
    message:
      'I specialize in graphic design and social media strategy. I would love to support Survivor’s Path Youth digital campaigns.',
    status: 'New',
  },
];

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
  
  // Site Content Modifiers
  updateHero: (data: Partial<SiteContent['hero']>) => void;
  updateWhoWeAre: (data: Partial<SiteContent['whoWeAre']>) => void;
  updateFocusAreas: (areas: FocusAreaItem[]) => void;
  updateStats: (stats: StatItem[]) => void;
  updateFeaturedEvent: (event: EventItem) => void;
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
  toggleFeaturedEvent: (id: string) => void;
  addEventAttendee: (attendee: Omit<EventAttendee, 'id' | 'registrationDate'>) => void;
  deleteEventAttendee: (id: string) => void;
  getAttendeesForEvent: (eventId: string) => EventAttendee[];

  // Program CRUD
  addProgram: (program: Omit<ProgramItem, 'id'>) => void;
  updateProgram: (id: string, programData: Partial<ProgramItem>) => void;
  deleteProgram: (id: string) => void;

  // Team CRUD
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

  // Inbox CRUD & Actions
  addInboxItem: (item: Omit<InboxItem, 'id' | 'dateSubmitted' | 'status'> & { id?: string; dateSubmitted?: string; status?: InboxItem['status'] }) => void;
  updateInboxStatus: (id: string, status: InboxItem['status']) => void;
  updateInboxNotes: (id: string, notes: string) => void;
  deleteInboxItem: (id: string) => void;

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
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EVENTS;
  });

  const [programs, setPrograms] = useState<ProgramItem[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_programs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROGRAMS;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_team');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TEAM;
  });

  const [partners, setPartners] = useState<PartnerLogo[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_partners');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PARTNERS;
  });

  const [complaints, setComplaints] = useState<ComplaintItem[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_complaints');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMPLAINTS;
  });

  const [inboxItems, setInboxItems] = useState<InboxItem[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_inbox');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INBOX_ITEMS;
  });

  const [eventAttendees, setEventAttendees] = useState<EventAttendee[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_event_attendees');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EVENT_ATTENDEES;
  });

  const [impactStories, setImpactStories] = useState<ImpactStory[]>(() => {
    try {
      const saved = localStorage.getItem('spy_cms_impact_stories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_IMPACT_STORIES;
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
          (u) => !legacyEmails.includes(u.email.toLowerCase())
        );

        const result = [...cleaned];
        for (const superUser of INITIAL_USER_ACCOUNTS) {
          if (!result.some((u) => u.email.toLowerCase() === superUser.email.toLowerCase())) {
            result.unshift(superUser);
          }
        }
        return result;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER_ACCOUNTS;
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

  // Sync to local storage
  // Sync to local storage & Firestore Realtime Sync
  useEffect(() => {
    if (!db) return;

    const unsubInbox = onSnapshot(collection(db, 'inbox'), (snapshot) => {
      if (snapshot.empty) {
        setInboxItems([]);
        try { localStorage.setItem('spy_cms_inbox', JSON.stringify([])); } catch (e) {}
      } else {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as InboxItem[];
        setInboxItems(items);
        try { localStorage.setItem('spy_cms_inbox', JSON.stringify(items)); } catch (e) {}
      }
    }, (err) => console.warn('Firestore inbox listener notice:', err));

    const unsubComplaints = onSnapshot(collection(db, 'complaints'), (snapshot) => {
      if (snapshot.empty) {
        setComplaints([]);
        try { localStorage.setItem('spy_cms_complaints', JSON.stringify([])); } catch (e) {}
      } else {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as ComplaintItem[];
        setComplaints(items);
        try { localStorage.setItem('spy_cms_complaints', JSON.stringify(items)); } catch (e) {}
      }
    }, (err) => console.warn('Firestore complaints listener notice:', err));

    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      if (snapshot.empty) {
        setEvents([]);
        try { localStorage.setItem('spy_cms_events', JSON.stringify([])); } catch (e) {}
      } else {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as EventItem[];
        setEvents(items);
        try { localStorage.setItem('spy_cms_events', JSON.stringify(items)); } catch (e) {}
      }
    }, (err) => console.warn('Firestore events listener notice:', err));

    const unsubAttendees = onSnapshot(collection(db, 'event_attendees'), (snapshot) => {
      if (snapshot.empty) {
        setEventAttendees([]);
        try { localStorage.setItem('spy_cms_event_attendees', JSON.stringify([])); } catch (e) {}
      } else {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as EventAttendee[];
        setEventAttendees(items);
        try { localStorage.setItem('spy_cms_event_attendees', JSON.stringify(items)); } catch (e) {}
      }
    }, (err) => console.warn('Firestore attendees listener notice:', err));

    const unsubTeam = onSnapshot(collection(db, 'team'), (snapshot) => {
      if (snapshot.empty) {
        setTeamMembers([]);
        try { localStorage.setItem('spy_cms_team', JSON.stringify([])); } catch (e) {}
      } else {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as TeamMember[];
        setTeamMembers(items);
        try { localStorage.setItem('spy_cms_team', JSON.stringify(items)); } catch (e) {}
      }
    }, (err) => console.warn('Firestore team listener notice:', err));

    const unsubPartners = onSnapshot(collection(db, 'partners'), (snapshot) => {
      if (snapshot.empty) {
        setPartners([]);
        try { localStorage.setItem('spy_cms_partners', JSON.stringify([])); } catch (e) {}
      } else {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as PartnerLogo[];
        setPartners(Array.from(new Map(items.map((it) => [it.name, it])).values()));
        try { localStorage.setItem('spy_cms_partners', JSON.stringify(items)); } catch (e) {}
      }
    }, (err) => console.warn('Firestore partners listener notice:', err));

    const unsubPrograms = onSnapshot(collection(db, 'programs'), (snapshot) => {
      if (snapshot.empty) {
        setPrograms([]);
        try { localStorage.setItem('spy_cms_programs', JSON.stringify([])); } catch (e) {}
      } else {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as ProgramItem[];
        setPrograms(items);
        try { localStorage.setItem('spy_cms_programs', JSON.stringify(items)); } catch (e) {}
      }
    }, (err) => console.warn('Firestore programs listener notice:', err));

    const unsubImpact = onSnapshot(collection(db, 'impact_stories'), (snapshot) => {
      if (snapshot.empty) {
        setImpactStories([]);
        try { localStorage.setItem('spy_cms_impact_stories', JSON.stringify([])); } catch (e) {}
      } else {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as ImpactStory[];
        setImpactStories(items);
        try { localStorage.setItem('spy_cms_impact_stories', JSON.stringify(items)); } catch (e) {}
      }
    }, (err) => console.warn('Firestore impact_stories listener notice:', err));

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as UserAccount[];
        setUsers(Array.from(new Map(items.map((it) => [it.id, it])).values()));
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
          try {
            localStorage.setItem('spy_cms_approved_admins', JSON.stringify(cleanEmails));
          } catch (e) {
            console.error(e);
          }
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

    return () => {
      unsubInbox();
      unsubComplaints();
      unsubEvents();
      unsubAttendees();
      unsubTeam();
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
    try {
      localStorage.setItem('spy_cms_siteContent', JSON.stringify(siteContent));
    } catch (e) {
      console.error(e);
    }
  }, [siteContent]);

  useEffect(() => {
    try {
      localStorage.setItem('spy_cms_events', JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('spy_cms_event_attendees', JSON.stringify(eventAttendees));
    } catch (e) {
      console.error(e);
    }
  }, [eventAttendees]);

  useEffect(() => {
    try {
      localStorage.setItem('spy_cms_programs', JSON.stringify(programs));
    } catch (e) {
      console.error(e);
    }
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem('spy_cms_team', JSON.stringify(teamMembers));
    } catch (e) {
      console.error(e);
    }
  }, [teamMembers]);

  useEffect(() => {
    try {
      localStorage.setItem('spy_cms_partners', JSON.stringify(partners));
    } catch (e) {
      console.error(e);
    }
  }, [partners]);

  useEffect(() => {
    try {
      localStorage.setItem('spy_cms_complaints', JSON.stringify(complaints));
    } catch (e) {
      console.error(e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem('spy_cms_inbox', JSON.stringify(inboxItems));
    } catch (e) {
      console.error(e);
    }
  }, [inboxItems]);

  useEffect(() => {
    try {
      localStorage.setItem('spy_cms_impact_stories', JSON.stringify(impactStories));
    } catch (e) {
      console.error(e);
    }
  }, [impactStories]);

  useEffect(() => {
    try {
      localStorage.setItem('spy_cms_users', JSON.stringify(users));
      localStorage.setItem('staff_list', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

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

  const updateFeaturedEvent = async (event: EventItem) => {
    setSiteContent((prev) => ({ ...prev, featuredEvent: event }));
    if (db) {
      try {
        await setDoc(doc(db, 'content', 'homepage'), {
          featuredEvent: event,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
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
    setEvents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...eventData } : item))
    );
    if (db) {
      try {
        await updateDoc(doc(db, 'events', id), eventData);
      } catch (e) {
        console.error('Firestore updateEvent error:', e);
      }
    }
  };

  const deleteEvent = async (id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try { localStorage.setItem('spy_cms_events', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    if (db) {
      try {
        await deleteDoc(doc(db, 'events', id));
      } catch (e) {
        console.error('Firestore deleteEvent error:', e);
      }
    }
  };

  const toggleFeaturedEvent = (id: string) => {
    const target = events.find((e) => e.id === id);
    if (target) {
      updateFeaturedEvent(target);
      setEvents((prev) =>
        prev.map((e) => ({ ...e, isFeatured: e.id === id }))
      );
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
      try { localStorage.setItem('spy_cms_event_attendees', JSON.stringify(updated)); } catch (e) {}
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

  // Team CRUD
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
      try { localStorage.setItem('spy_cms_team', JSON.stringify(updated)); } catch (e) {}
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
      try { localStorage.setItem('spy_cms_partners', JSON.stringify(updated)); } catch (e) {}
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
      try { localStorage.setItem('spy_cms_complaints', JSON.stringify(updated)); } catch (e) {}
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
      try { localStorage.setItem('spy_cms_inbox', JSON.stringify(updated)); } catch (e) {}
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
      try { localStorage.setItem('spy_cms_impact_stories', JSON.stringify(updated)); } catch (e) {}
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
      try {
        localStorage.setItem('spy_cms_users', JSON.stringify(updated));
        localStorage.setItem('staff_list', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
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
        currentUser.email.trim().toLowerCase() === cleanTarget)
    ) {
      logoutUser();
    }
  };

  const addApprovedAdminEmail = async (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    if (approvedAdminEmails.includes(clean)) return;

    const newList = [...approvedAdminEmails, clean];
    setApprovedAdminEmails(newList);
    try {
      localStorage.setItem('spy_cms_approved_admins', JSON.stringify(newList));
      if (db) {
        await setDoc(doc(db, 'settings', 'approved_admins'), { emails: newList }, { merge: true });
      }
    } catch (e) {
      console.error('Firestore addApprovedAdminEmail error:', e);
    }
  };

  const removeApprovedAdminEmail = async (email: string) => {
    const clean = email.trim().toLowerCase();
    const newList = approvedAdminEmails.filter((e) => e !== clean);
    setApprovedAdminEmails(newList);
    try {
      localStorage.setItem('spy_cms_approved_admins', JSON.stringify(newList));
      if (db) {
        await setDoc(doc(db, 'settings', 'approved_admins'), { emails: newList }, { merge: true });
      }
    } catch (e) {
      console.error('Firestore removeApprovedAdminEmail error:', e);
    }
  };

  const resetToDefaults = () => {
    setSiteContent(DEFAULT_SITE_CONTENT);
    setEvents(INITIAL_EVENTS);
    setEventAttendees(INITIAL_EVENT_ATTENDEES);
    setPrograms(INITIAL_PROGRAMS);
    setTeamMembers(INITIAL_TEAM);
    setPartners(INITIAL_PARTNERS);
    setComplaints(INITIAL_COMPLAINTS);
    setInboxItems(INITIAL_INBOX_ITEMS);
    setImpactStories(INITIAL_IMPACT_STORIES);
    setUsers(INITIAL_USER_ACCOUNTS);
    setCurrentUser(null);
    try {
      localStorage.removeItem('spy_cms_siteContent');
      localStorage.removeItem('spy_cms_events');
      localStorage.removeItem('spy_cms_event_attendees');
      localStorage.removeItem('spy_cms_programs');
      localStorage.removeItem('spy_cms_team');
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

  const userEmailClean = currentUser?.email?.trim().toLowerCase() || '';
  const isSuperAdmin = userEmailClean === 'mdanontosunny1068@mail.com' || userEmailClean === 'mdanontosunny1068@gmail.com';
  const isApprovedAdmin = approvedAdminEmails.includes(userEmailClean);

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
        addInboxItem,
        updateInboxStatus,
        updateInboxNotes,
        deleteInboxItem,
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
