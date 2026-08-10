export type PageId =
  | 'home'
  | 'about'
  | 'programs'
  | 'events'
  | 'impact'
  | 'team'
  | 'complaint-box'
  | 'faq'
  | 'contact'
  | 'get-involved'
  | 'admin';

export type InboxCategory =
  | 'General Messages'
  | 'Volunteer Applications'
  | 'Partnership & Sponsorships'
  | 'School Collaborations';

export interface InboxItem {
  id: string;
  dateSubmitted: string;
  category: InboxCategory;
  name: string;
  email: string;
  phone?: string;
  subjectOrRole?: string;
  organizationOrSchool?: string;
  districtOrLocation?: string;
  message: string;
  status: 'New' | 'In Review' | 'Replied' | 'Archived';
  adminNotes?: string;
}

export interface ComplaintItem {
  id: string;
  dateSubmitted: string;
  category: string;
  subject: string;
  description: string;
  fullName?: string;
  emailOrPhone?: string;
  institution?: string;
  division?: string;
  district?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  status: 'Pending' | 'In Review' | 'Resolved';
  urgencyLevel?: 'Standard' | 'Urgent' | 'Critical';
  adminNotes?: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export type UserRole = 'user' | 'staff' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  password?: string;
}

export interface ProgramItem {
  id: string;
  number: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  keyObjectives: string[];
  targetAudience: string;
  category: string;
}

export interface EventRegistrationConfig {
  collectPhone?: boolean;
  collectEmail?: boolean;
  collectSchool?: boolean;
  collectTShirtSize?: boolean;
  collectEmergencyContact?: boolean;
  collectCustomQuestion?: boolean;
  customQuestionPrompt?: string;
}

export interface EventAttendee {
  id: string;
  eventId: string;
  eventTitle: string;
  registrationDate: string;
  fullName: string;
  phone?: string;
  email?: string;
  schoolOrInstitution?: string;
  tShirtSize?: string;
  emergencyContact?: string;
  customQuestionAnswer?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  targetAudience: string;
  shortDescription: string;
  fullDescription: string;
  isFeatured?: boolean;
  image: string;
  highlights?: string[];
  status: 'upcoming' | 'past';
  whatsappGroupLink?: string;
  registrationFields?: EventRegistrationConfig;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category:
    | 'Founder'
    | 'Chief Advisor'
    | 'Human Resources'
    | 'Core Team'
    | 'Program Team'
    | 'PR & Sponsorship Team'
    | 'Volunteers';
  bio: string;
  photo: string;
  email?: string;
  linkedin?: string;
}

export interface FaqItem {
  id: string;
  category: 'GENERAL' | 'EVENTS' | 'VOLUNTEERING' | 'PARTNERSHIP' | 'COMPLAINT BOX';
  question: string;
  answer: string;
}

export interface ImpactStory {
  id: string;
  title: string;
  category: string;
  summary: string;
  fullStory: string;
  image: string;
  location: string;
}

export interface ComplaintForm {
  fullName?: string;
  emailOrPhone?: string;
  institution?: string;
  category: string;
  subject: string;
  description: string;
  attachmentName?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  subject: string;
  message: string;
}

export interface PartnerLogo {
  name: string;
  category: string;
  logoText: string;
}

export interface FocusAreaItem {
  title: string;
  description: string;
  iconName: string;
}

export interface StatItem {
  value: string;
  label: string;
  description: string;
}

export interface SiteContent {
  siteName?: string;
  maintenanceMode?: boolean;
  hero: {
    badge: string;
    headline: string;
    headlineHighlight: string;
    subheadline: string;
    bgImage: string;
    primaryBtnText: string;
    secondaryBtnText: string;
  };
  whoWeAre: {
    title: string;
    description: string;
    image: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
  };
  focusAreas: FocusAreaItem[];
  stats: StatItem[];
  featuredEvent: EventItem;
  cta: {
    headline: string;
    description: string;
    primaryBtnText: string;
    secondaryBtnText: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    officeLocations: string;
    footerAbout: string;
    copyrightText: string;
  };
  socialLinks: SocialLinks;
}
