import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCms } from '../../context/CmsContext';
import { PageId, EventItem, ProgramItem, TeamMember, PartnerLogo, ComplaintItem, InboxItem, InboxCategory, ImpactStory, UserAccount, UserRole } from '../../types';
import { BANGLADESH_DIVISIONS, BANGLADESH_DISTRICTS } from '../../data/mockData';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Calendar,
  ShieldAlert,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Lock,
  ArrowUpRight,
  RotateCcw,
  Save,
  Search,
  Filter,
  ExternalLink,
  Sparkles,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Building2,
  ChevronRight,
  ShieldCheck,
  Download,
  Inbox,
  MessageSquare,
  Building,
  School,
  Heart,
  Send,
  BookOpen,
  UserCheck,
  UserPlus,
  LogIn,
  User,
  Bell,
  BellRing,
  Volume2,
  AlertCircle,
} from 'lucide-react';

interface AdminDashboardPageProps {
  setActivePage: (page: PageId) => void;
}

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (base64OrUrl: string) => void;
  required?: boolean;
  helpText?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  helpText = 'Upload PNG, JPG, WEBP from device',
}) => {
  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase text-gray-700">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
          }
        }}
        className="relative group p-4 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-500 transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-4"
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          title="Click to upload photo from device"
        />

        {value ? (
          <div className="relative group/img w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-400 flex-shrink-0 shadow-xs bg-white">
            <img src={value || undefined} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-purple-200/80 text-purple-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6 text-purple-700" />
          </div>
        )}

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="text-xs font-bold text-purple-950 group-hover:text-purple-800 flex items-center gap-1.5 justify-center sm:justify-start">
            <Upload className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />
            <span>Click to upload photo from device, or drag and drop</span>
          </div>
          <div className="text-[11px] text-gray-500 font-medium mt-0.5">
            {helpText}
          </div>
          {value && (
            <div className="text-[10px] font-bold text-emerald-700 mt-1 flex items-center gap-1 justify-center sm:justify-start">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Image loaded! Click or drop new file to replace.</span>
            </div>
          )}
        </div>

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onChange('');
            }}
            className="z-20 px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
            title="Remove image"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ setActivePage }) => {
  const {
    siteContent,
    events,
    eventAttendees,
    deleteEventAttendee,
    getAttendeesForEvent,
    programs,
    teamMembers,
    partners,
    complaints,
    inboxItems,
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
    addProgram,
    updateProgram,
    deleteProgram,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addPartner,
    updatePartner,
    deletePartner,
    updateComplaintStatus,
    updateComplaintNotes,
    deleteComplaint,
    addInboxItem,
    updateInboxStatus,
    updateInboxNotes,
    deleteInboxItem,
    impactStories,
    addImpactStory,
    updateImpactStory,
    deleteImpactStory,
    users,
    currentUser,
    isAdmin,
    approvedAdminEmails,
    addApprovedAdminEmail,
    removeApprovedAdminEmail,
    logoutUser,
    updateUserRole,
    deleteUserAccount,
    setAuthModalOpen,
    registerUser,
    resetToDefaults,
  } = useCms();

  const [newAdminEmailInput, setNewAdminEmailInput] = useState('');
  const [adminActionMsg, setAdminActionMsg] = useState('');

  // Navigation state for Sidebar
  const [activeTab, setActiveTab] = useState<
    'overview' | 'content' | 'impact' | 'impact-stories' | 'events' | 'inbox' | 'complaints' | 'team-partners' | 'settings' | 'staff'
  >('overview');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContainerRef = useRef<HTMLElement>(null);

  // Scroll content area to top when activeTab changes
  useEffect(() => {
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [activeTab]);

  // Real-Time Notification & Browser Notification API state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [liveToast, setLiveToast] = useState<{
    id: string;
    title: string;
    body: string;
    type: 'complaint' | 'inbox';
    time: string;
  } | null>(null);

  const isInitialComplaints = useRef(true);
  const isInitialInbox = useRef(true);
  const isInitialMessages = useRef(true);

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          new Notification("Survivor's Path Youth CMS", {
            body: 'Real-time browser notifications are now active! You will receive instant alerts for new complaints and messages.',
            icon: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=120&q=80',
          });
        }
      } catch (e) {
        console.warn('Error asking for notification permission:', e);
      }
    } else {
      alert('Browser Notification API is not supported in this browser environment.');
    }
  };

  // FIRESTORE TRIGGER: Listen via onSnapshot to "complaints", "inbox", and "messages" collections
  useEffect(() => {
    if (!db || !currentUser || (!isAdmin && currentUser.role !== 'admin')) return;

    // 1. Complaints Collection Real-time Trigger
    const unsubComplaints = onSnapshot(
      collection(db, 'complaints'),
      (snapshot) => {
        if (isInitialComplaints.current) {
          isInitialComplaints.current = false;
          return;
        }
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data() as Partial<ComplaintItem>;
            const alertTitle = `🚨 New Complaint Received (${data.category || 'Anonymous'})`;
            const alertBody = data.subject || data.description?.slice(0, 90) || 'A new confidential complaint has been logged in the system.';

            // Browser Notification API
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification(alertTitle, {
                  body: alertBody,
                  tag: `complaint-${change.doc.id}`,
                });
              } catch (e) {
                console.warn('Browser notification popup error:', e);
              }
            }

            // In-app Notification Banner
            setLiveToast({
              id: change.doc.id,
              title: alertTitle,
              body: alertBody,
              type: 'complaint',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          }
        });
      },
      (err) => console.warn('Real-time complaints trigger notice:', err)
    );

    // 2. Inbox Collection Real-time Trigger
    const unsubInbox = onSnapshot(
      collection(db, 'inbox'),
      (snapshot) => {
        if (isInitialInbox.current) {
          isInitialInbox.current = false;
          return;
        }
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data() as Partial<InboxItem>;
            const alertTitle = `📥 New Message from ${data.name || 'Visitor'}`;
            const alertBody = data.subjectOrRole || data.message?.slice(0, 90) || 'A new inquiry was received in the CMS inbox.';

            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification(alertTitle, {
                  body: alertBody,
                  tag: `inbox-${change.doc.id}`,
                });
              } catch (e) {
                console.warn('Browser notification popup error:', e);
              }
            }

            setLiveToast({
              id: change.doc.id,
              title: alertTitle,
              body: alertBody,
              type: 'inbox',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          }
        });
      },
      (err) => console.warn('Real-time inbox trigger notice:', err)
    );

    // 3. Messages Collection Real-time Trigger
    const unsubMessages = onSnapshot(
      collection(db, 'messages'),
      (snapshot) => {
        if (isInitialMessages.current) {
          isInitialMessages.current = false;
          return;
        }
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data() as any;
            const alertTitle = `💬 New Message Received`;
            const alertBody = data.subject || data.message || data.text || 'A new direct message document was logged.';

            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification(alertTitle, {
                  body: alertBody,
                  tag: `messages-${change.doc.id}`,
                });
              } catch (e) {
                console.warn('Browser notification popup error:', e);
              }
            }

            setLiveToast({
              id: change.doc.id,
              title: alertTitle,
              body: alertBody,
              type: 'inbox',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          }
        });
      },
      (err) => console.warn('Real-time messages trigger notice:', err)
    );

    return () => {
      unsubComplaints();
      unsubInbox();
      unsubMessages();
    };
  }, [currentUser, isAdmin]);

  // Modals & Forms State
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [viewAttendeesEvent, setViewAttendeesEvent] = useState<EventItem | null>(null);
  const [attendeeSearch, setAttendeeSearch] = useState('');

  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);

  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);

  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerLogo | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  // Impact Stories State
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [editingStory, setEditingStory] = useState<ImpactStory | null>(null);
  const [storyForm, setStoryForm] = useState({
    title: '',
    category: 'SCHOOL CAMPAIGN',
    location: '',
    summary: '',
    fullStory: '',
    image: '',
  });

  // System Settings State & Firestore Real-Time Load
  const [settingsForm, setSettingsForm] = useState({
    siteName: siteContent.siteName || "Survivor's Path Youth",
    maintenanceMode: !!siteContent.maintenanceMode,
    email: siteContent.contactInfo?.email || '',
    phone: siteContent.contactInfo?.phone || '',
    officeLocations: siteContent.contactInfo?.officeLocations || '',
    footerAbout: siteContent.contactInfo?.footerAbout || '',
    facebook: siteContent.socialLinks?.facebook || '',
    instagram: siteContent.socialLinks?.instagram || '',
    linkedin: siteContent.socialLinks?.linkedin || '',
    youtube: siteContent.socialLinks?.youtube || '',
  });

  useEffect(() => {
    const loadSettingsFromFirestore = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'general'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettingsForm({
            siteName: data.siteName || data.siteTitle || siteContent.siteName || "Survivor's Path Youth",
            maintenanceMode: typeof data.maintenanceMode === 'boolean' ? data.maintenanceMode : !!siteContent.maintenanceMode,
            email: data.email || data.contactInfo?.email || siteContent.contactInfo?.email || '',
            phone: data.phone || data.contactInfo?.phone || siteContent.contactInfo?.phone || '',
            officeLocations: data.officeLocations || data.contactInfo?.officeLocations || siteContent.contactInfo?.officeLocations || '',
            footerAbout: data.footerAbout || data.contactInfo?.footerAbout || siteContent.contactInfo?.footerAbout || '',
            facebook: data.socialLinks?.facebook ?? data.facebook ?? siteContent.socialLinks?.facebook ?? '',
            instagram: data.socialLinks?.instagram ?? data.instagram ?? siteContent.socialLinks?.instagram ?? '',
            linkedin: data.socialLinks?.linkedin ?? data.linkedin ?? siteContent.socialLinks?.linkedin ?? '',
            youtube: data.socialLinks?.youtube ?? data.youtube ?? siteContent.socialLinks?.youtube ?? '',
          });
        }
      } catch (err) {
        console.warn('Failed to load settings from Firestore:', err);
      }
    };

    loadSettingsFromFirestore();
  }, [activeTab]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const formData = {
      siteName: settingsForm.siteName,
      maintenanceMode: settingsForm.maintenanceMode,
      contactInfo: {
        ...siteContent.contactInfo,
        email: settingsForm.email,
        phone: settingsForm.phone,
        officeLocations: settingsForm.officeLocations,
        footerAbout: settingsForm.footerAbout,
      },
      email: settingsForm.email,
      phone: settingsForm.phone,
      officeLocations: settingsForm.officeLocations,
      footerAbout: settingsForm.footerAbout,
      socialLinks: {
        facebook: settingsForm.facebook,
        instagram: settingsForm.instagram,
        linkedin: settingsForm.linkedin,
        youtube: settingsForm.youtube,
      },
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'settings', 'general'), formData, { merge: true });
      await updateSystemSettings(settingsForm);
      alert('System settings successfully saved and synced to Firestore (settings/general)!');
    } catch (err: any) {
      console.error('Save settings error:', err);
      alert('Failed to save settings: ' + (err?.message || 'Check connection'));
    } finally {
      setIsSaving(false);
    }
  };

  // Staff & RBAC State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | UserRole>('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleDelete = (emailToDelete: string) => {
    if (window.confirm(`Are you sure you want to revoke access and delete the account for '${emailToDelete}'?`)) {
      deleteUserAccount(emailToDelete);
      alert('Account deleted successfully!');
    }
  };
  
  // Inbox State
  const [inboxCategoryTab, setInboxCategoryTab] = useState<InboxCategory>('General Messages');
  const [inboxSearch, setInboxSearch] = useState('');
  const [inboxStatusFilter, setInboxStatusFilter] = useState<'All' | 'New' | 'In Review' | 'Replied' | 'Archived'>('All');
  const [selectedInboxItem, setSelectedInboxItem] = useState<InboxItem | null>(null);
  const [inboxNotesInput, setInboxNotesInput] = useState('');

  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; filename: string } | null>(null);
  const [saveToast, setSaveToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintFilter, setComplaintFilter] = useState<'All' | 'Pending' | 'In Review' | 'Resolved'>('All');
  const [complaintDivisionFilter, setComplaintDivisionFilter] = useState<string>('All');
  const [complaintDistrictFilter, setComplaintDistrictFilter] = useState<string>('All');

  // Event Form State
  const [eventForm, setEventForm] = useState<Omit<EventItem, 'id'>>({
    title: '',
    date: '',
    location: '',
    targetAudience: '',
    shortDescription: '',
    fullDescription: '',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    status: 'upcoming',
    isFeatured: false,
    whatsappGroupLink: '',
    highlights: ['Interactive Workshop', 'Legal Q&A'],
    registrationFields: {
      collectPhone: true,
      collectEmail: true,
      collectSchool: true,
      collectTShirtSize: false,
      collectEmergencyContact: false,
      collectCustomQuestion: false,
      customQuestionPrompt: '',
    },
  });

  const exportAttendeesToCsv = (eventItem: EventItem, attendeesList: any[]) => {
    if (attendeesList.length === 0) {
      alert('No registered attendees found for this event.');
      return;
    }

    const headers = [
      'Registration Date',
      'Full Name',
      'Phone Number',
      'Email Address',
      'School / Institution',
      'T-Shirt Size',
      'Emergency Contact',
      'Custom Question Answer',
    ];

    const escapeCsv = (val?: string) => {
      if (val === undefined || val === null || val === '') return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = attendeesList.map((att) => [
      escapeCsv(att.registrationDate),
      escapeCsv(att.fullName),
      escapeCsv(att.phone || 'N/A'),
      escapeCsv(att.email || 'N/A'),
      escapeCsv(att.schoolOrInstitution || 'N/A'),
      escapeCsv(att.tShirtSize || 'N/A'),
      escapeCsv(att.emergencyContact || 'N/A'),
      escapeCsv(att.customQuestionAnswer || 'N/A'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // Add UTF-8 BOM so Excel & Google Sheets open special characters seamlessly
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const safeTitle = eventItem.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.setAttribute('download', `${safeTitle}_Attendees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Program Form State
  const [programForm, setProgramForm] = useState<Omit<ProgramItem, 'id'>>({
    number: programs.length + 1,
    title: '',
    shortDescription: '',
    fullDescription: '',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    keyObjectives: ['Raise student awareness', 'Empower peer leaders'],
    targetAudience: 'Youth & Students',
    category: 'Education',
  });

  // Team Form State
  const [teamForm, setTeamForm] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: '',
    category: 'Core Team',
    bio: '',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    email: '',
    linkedin: '',
  });

  // Partner Form State
  const [partnerForm, setPartnerForm] = useState<PartnerLogo>({
    name: '',
    category: 'Youth & Development',
    logoText: '',
  });

  // Derived Statistics
  const pendingComplaintsCount = complaints.filter((c) => c.status === 'Pending').length;
  const inReviewComplaintsCount = complaints.filter((c) => c.status === 'In Review').length;
  const upcomingEventsCount = events.filter((e) => e.status === 'upcoming').length;
  const newInboxCount = inboxItems.filter((i) => i.status === 'New').length;

  const filteredInboxItems = inboxItems.filter((item) => {
    const matchesCategory = item.category === inboxCategoryTab;
    const matchesStatus = inboxStatusFilter === 'All' || item.status === inboxStatusFilter;
    const searchLower = inboxSearch.toLowerCase();
    const matchesSearch =
      !inboxSearch ||
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      (item.phone && item.phone.toLowerCase().includes(searchLower)) ||
      (item.organizationOrSchool && item.organizationOrSchool.toLowerCase().includes(searchLower)) ||
      (item.subjectOrRole && item.subjectOrRole.toLowerCase().includes(searchLower)) ||
      item.message.toLowerCase().includes(searchLower);

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.subject.toLowerCase().includes(complaintSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(complaintSearch.toLowerCase()) ||
      (c.institution && c.institution.toLowerCase().includes(complaintSearch.toLowerCase())) ||
      (c.fullName && c.fullName.toLowerCase().includes(complaintSearch.toLowerCase())) ||
      (c.division && c.division.toLowerCase().includes(complaintSearch.toLowerCase())) ||
      (c.district && c.district.toLowerCase().includes(complaintSearch.toLowerCase()));

    const matchesStatusFilter = complaintFilter === 'All' || c.status === complaintFilter;
    const matchesDivisionFilter = complaintDivisionFilter === 'All' || c.division === complaintDivisionFilter;
    const matchesDistrictFilter = complaintDistrictFilter === 'All' || c.district === complaintDistrictFilter;

    return matchesSearch && matchesStatusFilter && matchesDivisionFilter && matchesDistrictFilter;
  });

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date.trim() || !eventForm.location.trim()) {
      alert('Please fill in Event Title, Date, and Location.');
      return;
    }

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventForm);
        alert(`Event "${eventForm.title}" updated successfully!`);
        setEditingEvent(null);
      } else {
        await addEvent(eventForm);
        alert(`Event "${eventForm.title}" posted to Firestore successfully!`);
      }
      setShowAddEventModal(false);
    } catch (err: any) {
      console.error('Failed to post event to Firestore:', err);
      alert(`Error posting event to Firestore: ${err?.message || 'Unknown error occurred. Please try again.'}`);
    }
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      updateProgram(editingProgram.id, programForm);
      setEditingProgram(null);
    } else {
      addProgram(programForm);
    }
    setShowAddProgramModal(false);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeamMember) {
      updateTeamMember(editingTeamMember.id, teamForm);
      setEditingTeamMember(null);
    } else {
      addTeamMember(teamForm);
    }
    setShowAddTeamModal(false);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerForm.name) {
      if (editingPartner) {
        updatePartner(editingPartner.name, {
          ...partnerForm,
          logoText: partnerForm.logoText || partnerForm.name,
        });
        setEditingPartner(null);
      } else {
        addPartner({
          ...partnerForm,
          logoText: partnerForm.logoText || partnerForm.name,
        });
      }
      setShowAddPartnerModal(false);
      setPartnerForm({ name: '', category: 'Youth & Development', logoText: '' });
    }
  };

  const handleGlobalSaveAll = async () => {
    setIsSaving(true);
    try {
      const formData = {
        siteName: settingsForm.siteName,
        maintenanceMode: settingsForm.maintenanceMode,
        contactInfo: {
          ...siteContent.contactInfo,
          email: settingsForm.email,
          phone: settingsForm.phone,
          officeLocations: settingsForm.officeLocations,
          footerAbout: settingsForm.footerAbout,
        },
        email: settingsForm.email,
        phone: settingsForm.phone,
        officeLocations: settingsForm.officeLocations,
        footerAbout: settingsForm.footerAbout,
        socialLinks: {
          facebook: settingsForm.facebook,
          instagram: settingsForm.instagram,
          linkedin: settingsForm.linkedin,
          youtube: settingsForm.youtube,
        },
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'settings', 'general'), formData, { merge: true });
      await updateSystemSettings(settingsForm);

      localStorage.setItem('spy_cms_siteContent', JSON.stringify(siteContent));
      localStorage.setItem('spy_cms_events', JSON.stringify(events));
      localStorage.setItem('spy_cms_programs', JSON.stringify(programs));
      localStorage.setItem('spy_cms_team', JSON.stringify(teamMembers));
      localStorage.setItem('spy_cms_partners', JSON.stringify(partners));
      localStorage.setItem('spy_cms_complaints', JSON.stringify(complaints));
      localStorage.setItem('spy_cms_inbox', JSON.stringify(inboxItems));

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    } catch (e: any) {
      console.error('Save all error:', e);
      alert('Notice: ' + (e?.message || 'Error saving settings to Firestore'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const backupData = {
      siteContent,
      events,
      programs,
      teamMembers,
      partners,
      complaints,
      inboxItems,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survivors_path_cms_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-purple-900/50 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white font-display">Access Restricted</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              The Survivor’s Path Youth Admin Panel is protected by Role-Based Access Control (RBAC). Authorized <span className="font-bold text-amber-300">Staff</span> or <span className="font-bold text-purple-300">Admin</span> credentials are required.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-1 text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Session Details</div>
            {currentUser ? (
              <div>
                <div className="font-bold text-slate-200">{currentUser.name} ({currentUser.email})</div>
                <div className="text-rose-400 font-bold mt-0.5">Role: {currentUser.role.toUpperCase()} (Standard User - Access Blocked)</div>
              </div>
            ) : (
              <div className="text-amber-400 font-medium">No active user session detected. Please sign in.</div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as Staff or Admin</span>
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Back to Live Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen h-[100dvh] bg-gray-100 flex flex-col font-sans text-gray-900 overflow-hidden">
      {/* Top Admin Bar */}
      <header className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white px-3 sm:px-6 py-2 sm:py-3.5 flex items-center justify-between border-b border-purple-800/60 shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-purple-800/80 text-purple-200 hover:text-white shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-800 border border-purple-600 flex items-center justify-center text-white font-bold shadow-xs shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-xs sm:text-sm uppercase tracking-wider font-display truncate">
                  SURVIVOR’S PATH YOUTH
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-purple-800 text-purple-200 border border-purple-600 shrink-0">
                  CMS
                </span>
              </div>
              <p className="text-xs text-purple-200/80 hidden sm:block">
                NGO Administrator Control Center & Content Management Console
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Permission Toggle Button */}
          <button
            onClick={requestNotificationPermission}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              notificationPermission === 'granted'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : notificationPermission === 'denied'
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
                : 'bg-purple-900/80 border-purple-500/50 text-purple-200 hover:bg-purple-800 animate-pulse'
            }`}
            title={
              notificationPermission === 'granted'
                ? 'Real-time Browser Desktop Notifications active!'
                : 'Click to enable real-time browser notifications for incoming complaints and inbox messages'
            }
          >
            <BellRing className={`w-3.5 h-3.5 ${notificationPermission === 'granted' ? 'text-emerald-400' : 'text-purple-300'}`} />
            <span className="hidden lg:inline">
              {notificationPermission === 'granted' ? 'Alerts Active' : notificationPermission === 'denied' ? 'Alerts Muted' : 'Enable Live Alerts'}
            </span>
          </button>

          <button
            onClick={() => setActivePage('home')}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-purple-400/30 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden sm:inline">Live Website</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </button>

          <div className="h-6 w-px bg-purple-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-700 border border-purple-400 flex items-center justify-center text-xs font-bold text-white uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-purple-300 font-bold uppercase">{currentUser.role} Level</div>
            </div>
          </div>
        </div>
      </header>

      {/* Real-time Incoming Live Notification Banner Toast */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full bg-purple-950 text-white rounded-2xl p-4 shadow-2xl border-2 border-purple-400 flex items-start gap-3"
          >
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                liveToast.type === 'complaint'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}
            >
              {liveToast.type === 'complaint' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
              ) : (
                <Inbox className="w-5 h-5 text-purple-300 animate-pulse" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-black uppercase text-purple-100 truncate">{liveToast.title}</h4>
                <span className="text-[10px] text-purple-300 font-mono">{liveToast.time}</span>
              </div>
              <p className="text-xs text-purple-200 mt-1 line-clamp-2">{liveToast.body}</p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab(liveToast.type === 'complaint' ? 'complaints' : 'inbox');
                    setLiveToast(null);
                  }}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
                >
                  Open {liveToast.type === 'complaint' ? 'Complaint Box' : 'Inbox'}
                </button>
                <button
                  onClick={() => setLiveToast(null)}
                  className="px-2 py-1 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-300 font-bold text-[10px] uppercase cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <button onClick={() => setLiveToast(null)} className="text-purple-400 hover:text-white p-0.5 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Panel Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Fixed Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 bg-purple-950 text-purple-100 flex flex-col transition-transform duration-300 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } border-r border-purple-900/80 shadow-xl overflow-hidden`}
        >
          {/* Mobile close button */}
          <div className="lg:hidden p-4 flex justify-between items-center border-b border-purple-900 shrink-0">
            <span className="text-xs font-bold uppercase text-purple-300">Admin Navigation</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-purple-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-purple-900/60 shrink-0">
            <div className="bg-purple-900/50 rounded-2xl p-3 border border-purple-800/80 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-white">System Status: Active</div>
                <div className="text-[10px] text-purple-300">All API Endpoints Live</div>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-3 space-y-1 flex-1 min-h-0 overflow-y-auto">
            <button
              onClick={() => {
                setActiveTab('overview');
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-purple-800 text-white shadow-sm border border-purple-600'
                  : 'text-purple-300 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-purple-300" />
                <span>Dashboard</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                setActiveTab('content');
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-purple-800 text-white shadow-sm border border-purple-600'
                  : 'text-purple-300 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-purple-300" />
                <span>Content Manager</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                setActiveTab('impact');
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'impact'
                  ? 'bg-purple-800 text-white shadow-sm border border-purple-600'
                  : 'text-purple-300 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-purple-300" />
                <span>Impact Stats</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                setActiveTab('impact-stories');
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'impact-stories'
                  ? 'bg-purple-800 text-white shadow-sm border border-purple-600'
                  : 'text-purple-300 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-purple-300" />
                <span>Impact Stories</span>
              </div>
              <span className="text-[10px] bg-purple-900 px-2 py-0.5 rounded-md font-extrabold text-purple-200">
                {impactStories.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('events');
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-purple-800 text-white shadow-sm border border-purple-600'
                  : 'text-purple-300 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-purple-300" />
                <span>Events & Programs</span>
              </div>
              <span className="text-[10px] bg-purple-900 px-2 py-0.5 rounded-md font-extrabold text-purple-200">
                {events.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('inbox');
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-purple-800 text-white shadow-sm border border-purple-600'
                  : 'text-purple-300 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-purple-300" />
                <span>Inbox & Requests</span>
              </div>
              {newInboxCount > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
                  </span>
                  <span className="text-[10px] bg-purple-500 text-white font-black px-2 py-0.5 rounded-full shadow-xs">
                    {newInboxCount} New
                  </span>
                </div>
              ) : (
                <span className="text-[10px] bg-purple-900/80 text-purple-300 px-2 py-0.5 rounded-md font-bold">
                  {inboxItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('complaints');
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'complaints'
                  ? 'bg-purple-800 text-white shadow-sm border border-purple-600'
                  : 'text-purple-300 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <span>Complaint Box</span>
              </div>
              {pendingComplaintsCount > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span className="text-[10px] bg-rose-600 text-white font-black px-2 py-0.5 rounded-full shadow-xs">
                    {pendingComplaintsCount} Pending
                  </span>
                </div>
              ) : (
                <span className="text-[10px] bg-purple-900/80 text-purple-300 px-2 py-0.5 rounded-md font-bold">
                  {complaints.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('team-partners');
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'team-partners'
                  ? 'bg-purple-800 text-white shadow-sm border border-purple-600'
                  : 'text-purple-300 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-purple-300" />
                <span>Team & Partners</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                setActiveTab('staff');
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-purple-800 text-white shadow-sm border border-purple-600'
                  : 'text-purple-300 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Staff & Access</span>
              </div>
              <span className="text-[10px] bg-purple-900 px-2 py-0.5 rounded-md font-extrabold text-purple-200">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-purple-800 text-white shadow-sm border border-purple-600'
                  : 'text-purple-300 hover:bg-purple-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-purple-300" />
                <span>System Settings</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </nav>

          {/* Bottom Backup & Logout Action */}
          <div className="p-4 border-t border-purple-900/80 space-y-2 shrink-0">
            <button
              onClick={handleExportData}
              className="w-full px-3 py-2 rounded-xl bg-purple-900/70 hover:bg-purple-900 text-purple-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-purple-800"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CMS Backup</span>
            </button>

            <button
              onClick={() => {
                logoutUser();
                setActivePage('home');
              }}
              className="w-full px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-rose-800/80"
              title="End active user session"
            >
              <LogIn className="w-3.5 h-3.5 rotate-180" />
              <span>Sign Out Session</span>
            </button>

            <div className="text-[10px] text-purple-400 text-center">
              Active: {currentUser.name} ({currentUser.role})
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main ref={mainContainerRef} className="flex-1 min-h-0 bg-gray-50 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="space-y-8"
            >
              {/* MODULE 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Banner Welcome */}
              <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-800">
                <div className="space-y-2 max-w-2xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/80 text-purple-200 text-xs font-bold border border-purple-600">
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span>Welcome back, Executive Administrator</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
                    Survivor’s Path Youth CMS Dashboard
                  </h1>
                  <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
                    All website contents, statistics, upcoming flagship events, confidential reports, and administrative parameters are currently connected and active.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative z-10">
                  <button
                    onClick={() => {
                      setEditingEvent(null);
                      setEventForm({
                        title: '',
                        date: '',
                        location: '',
                        targetAudience: '',
                        shortDescription: '',
                        fullDescription: '',
                        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
                        status: 'upcoming',
                        isFeatured: false,
                        highlights: ['Interactive Session'],
                      });
                      setShowAddEventModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Event</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('impact')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-purple-400/40 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Update Stats</span>
                  </button>
                </div>
              </div>

              {/* Quick Stat Cards (4 Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Total Site Visitors
                    </div>
                    <div className="text-2xl font-black text-purple-950 font-display">
                      {visitorCount.toLocaleString()}+
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+18.4% this month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Upcoming Events
                    </div>
                    <div className="text-2xl font-black text-purple-950 font-display">
                      {upcomingEventsCount} Active
                    </div>
                    <div className="text-[11px] text-purple-700 font-semibold">
                      Featured: {events.find((e) => e.isFeatured)?.title.slice(0, 20) || 'None'}...
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Pending Complaints
                    </div>
                    <div className="text-2xl font-black text-amber-950 font-display flex items-center gap-2">
                      <span>{pendingComplaintsCount}</span>
                      {pendingComplaintsCount > 0 && (
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          Requires Action
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      In Review: {inReviewComplaintsCount}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Total Programs
                    </div>
                    <div className="text-2xl font-black text-purple-950 font-display">
                      {programs.length} Initiatives
                    </div>
                    <div className="text-[11px] text-purple-700 font-semibold">
                      Team Members: {teamMembers.length}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Pending Complaints & Live Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Complaints Overview */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-purple-950 font-display">
                          Confidential Complaint Box
                        </h3>
                        <p className="text-xs text-gray-500">
                          Trauma-informed, encrypted submission queue
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All Inbox</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {complaints.slice(0, 3).map((comp) => (
                      <div
                        key={comp.id}
                        className="p-4 rounded-2xl border border-gray-100 bg-purple-50/40 hover:bg-purple-50 transition-colors flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                              {comp.id}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                comp.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : comp.status === 'In Review'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {comp.status}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-gray-900 truncate">
                            {comp.subject}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate flex items-center gap-1.5 flex-wrap">
                            <span>Category: {comp.category} • {comp.institution || 'Individual Student'}</span>
                            {comp.division && (
                              <span className="inline-flex items-center gap-0.5 text-purple-800 font-semibold bg-purple-100/80 px-1.5 py-0.2 rounded text-[10px]">
                                <MapPin className="w-2.5 h-2.5 text-purple-600" />
                                <span>{comp.district ? `${comp.district}, ` : ''}{comp.division}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedComplaint(comp);
                            setActiveTab('complaints');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold cursor-pointer flex-shrink-0"
                        >
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Content Highlights & Control Panel */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-purple-950 font-display">
                          Quick CMS Control Shortcuts
                        </h3>
                        <p className="text-xs text-gray-500">
                          Instant homepage content management options
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveTab('content')}
                      className="p-4 rounded-2xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100/60 transition-colors text-left space-y-2 cursor-pointer group"
                    >
                      <FileText className="w-5 h-5 text-purple-700 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-purple-950">Edit Hero Banner</div>
                      <div className="text-[11px] text-gray-500">
                        Update main tagline & hero image
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('impact')}
                      className="p-4 rounded-2xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100/60 transition-colors text-left space-y-2 cursor-pointer group"
                    >
                      <BarChart3 className="w-5 h-5 text-purple-700 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-purple-950">Live Statistics</div>
                      <div className="text-[11px] text-gray-500">
                        Campaigns, Victims & Legal Cases
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('events')}
                      className="p-4 rounded-2xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100/60 transition-colors text-left space-y-2 cursor-pointer group"
                    >
                      <Calendar className="w-5 h-5 text-purple-700 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-purple-950">Flagship Events</div>
                      <div className="text-[11px] text-gray-500">
                        Manage Youth Fest 2026 & workshops
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('team-partners')}
                      className="p-4 rounded-2xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100/60 transition-colors text-left space-y-2 cursor-pointer group"
                    >
                      <Users className="w-5 h-5 text-purple-700 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-purple-950">Team & Sponsors</div>
                      <div className="text-[11px] text-gray-500">
                        Update staff bios & partner logos
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: CONTENT MANAGER (Dynamic Pages) */}
          {activeTab === 'content' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-purple-950 font-display">
                    Dynamic Page Content Manager
                  </h2>
                  <p className="text-xs text-gray-600">
                    Update titles, rich descriptions, hero background image, and focus pillars across the site (Persisted to Firestore: <code className="bg-purple-100 text-purple-900 px-1 py-0.5 rounded">content/homepage</code>)
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await updateHero(siteContent.hero);
                      await updateWhoWeAre(siteContent.whoWeAre);
                      await updateFocusAreas(siteContent.focusAreas);
                      await updateCta(siteContent.cta);
                      alert('Page content successfully saved and synced to Firestore (content/homepage)!');
                    } catch (err: any) {
                      alert('Failed to save content: ' + (err?.message || 'Check connection'));
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 flex-shrink-0"
                >
                  <Save className="w-4 h-4 text-purple-300" />
                  <span>Save Content to Firestore</span>
                </button>
              </div>

              {/* Form Section 1: Hero Banner */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-extrabold text-purple-950 uppercase tracking-wider font-display flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Homepage Hero Banner Settings</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Hero Badge Pill Text
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero.badge}
                      onChange={(e) => updateHero({ badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero.primaryBtnText}
                      onChange={(e) => updateHero({ primaryBtnText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Headline Part 1
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero.headline}
                      onChange={(e) => updateHero({ headline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Headline Part 2 (Gradient Text)
                    </label>
                    <input
                      type="text"
                      value={siteContent.hero.headlineHighlight}
                      onChange={(e) => updateHero({ headlineHighlight: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Subheadline Paragraph Text
                  </label>
                  <textarea
                    rows={3}
                    value={siteContent.hero.subheadline}
                    onChange={(e) => updateHero({ subheadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <ImageUploadField
                  label="Hero Background Image (Full Width)"
                  value={siteContent.hero.bgImage}
                  onChange={(base64) => updateHero({ bgImage: base64 })}
                  helpText="Upload a high-resolution banner image from device (PNG, JPG, WEBP)"
                />
              </div>

              {/* Form Section 2: Who We Are Section */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-extrabold text-purple-950 uppercase tracking-wider font-display flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>"Who We Are" Section Content</span>
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={siteContent.whoWeAre.title}
                    onChange={(e) => updateWhoWeAre({ title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Full Narrative Description
                  </label>
                  <textarea
                    rows={4}
                    value={siteContent.whoWeAre.description}
                    onChange={(e) => updateWhoWeAre({ description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Bullet Tag 1
                    </label>
                    <input
                      type="text"
                      value={siteContent.whoWeAre.bullet1}
                      onChange={(e) => updateWhoWeAre({ bullet1: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Bullet Tag 2
                    </label>
                    <input
                      type="text"
                      value={siteContent.whoWeAre.bullet2}
                      onChange={(e) => updateWhoWeAre({ bullet2: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Bullet Tag 3
                    </label>
                    <input
                      type="text"
                      value={siteContent.whoWeAre.bullet3}
                      onChange={(e) => updateWhoWeAre({ bullet3: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Who We Are Section Photograph"
                  value={siteContent.whoWeAre.image}
                  onChange={(base64) => updateWhoWeAre({ image: base64 })}
                  helpText="Upload section photograph from device (PNG, JPG, WEBP)"
                />
              </div>
            </div>
          )}

          {/* MODULE 3: IMPACT STATS CONTROLLER */}
          {activeTab === 'impact' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-purple-950 font-display">
                    Impact Statistics Controller
                  </h2>
                  <p className="text-xs text-gray-600">
                    Live editable metrics displayed in animated counter cards on the home page (Persisted to Firestore: <code className="bg-purple-100 text-purple-900 px-1 py-0.5 rounded">stats/impact</code>)
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await updateStats(siteContent.stats);
                      alert('Impact statistics successfully saved and synced to Firestore (stats/impact)!');
                    } catch (err: any) {
                      alert('Failed to save impact stats: ' + (err?.message || 'Check connection'));
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 flex-shrink-0"
                >
                  <Save className="w-4 h-4 text-purple-300" />
                  <span>Save Impact Stats to Firestore</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {siteContent.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-3xl border border-purple-200 shadow-xs space-y-4 relative"
                  >
                    <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                      <span className="text-xs font-extrabold uppercase text-purple-900 bg-purple-100 px-3 py-1 rounded-lg">
                        Statistic Counter #{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                          Numeric Value (e.g. 132+, 86+)
                        </label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const next = [...siteContent.stats];
                            next[idx].value = e.target.value;
                            updateStats(next);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-lg font-black text-purple-950 focus:ring-2 focus:ring-purple-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                          Stat Label / Title
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const next = [...siteContent.stats];
                            next[idx].label = e.target.value;
                            updateStats(next);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                          Short Context Description
                        </label>
                        <textarea
                          rows={2}
                          value={stat.description}
                          onChange={(e) => {
                            const next = [...siteContent.stats];
                            next[idx].description = e.target.value;
                            updateStats(next);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-700 focus:ring-2 focus:ring-purple-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 3B: IMPACT STORIES MANAGER */}
          {activeTab === 'impact-stories' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-purple-950 font-display">
                    Impact Stories & Field Narratives
                  </h2>
                  <p className="text-xs text-gray-600">
                    Manage real case studies, school campaign highlights, and outreach narratives for the website
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingStory(null);
                    setStoryForm({
                      title: '',
                      category: 'SCHOOL CAMPAIGN',
                      location: '',
                      summary: '',
                      fullStory: '',
                      image: '',
                    });
                    setShowAddStoryModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Story</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-3xl border border-purple-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-purple-100 bg-purple-50/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                    All Stories ({impactStories.length})
                  </span>
                </div>

                {impactStories.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <BookOpen className="w-12 h-12 text-purple-300 mx-auto" />
                    <p className="text-sm font-bold text-gray-700">No impact stories found.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStory(null);
                        setStoryForm({
                          title: '',
                          category: 'SCHOOL CAMPAIGN',
                          location: '',
                          summary: '',
                          fullStory: '',
                          image: '',
                        });
                        setShowAddStoryModal(true);
                      }}
                      className="px-4 py-2 bg-purple-900 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Impact Story</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-purple-100/60 text-purple-950 uppercase text-[10px] font-extrabold tracking-wider border-b border-purple-200">
                        <tr>
                          <th className="p-4">Thumbnail</th>
                          <th className="p-4">Title & Description</th>
                          <th className="p-4">Category Tag</th>
                          <th className="p-4">Location</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100">
                        {impactStories.map((story) => (
                          <tr key={story.id} className="hover:bg-purple-50/40 transition-colors">
                            <td className="p-4">
                              {story.image ? (
                                <img
                                  src={story.image || undefined}
                                  alt={story.title}
                                  className="w-14 h-14 rounded-xl object-cover border border-purple-200 bg-purple-100"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-400">
                                  <BookOpen className="w-6 h-6" />
                                </div>
                              )}
                            </td>
                            <td className="p-4 max-w-xs">
                              <div className="font-bold text-purple-950 text-sm">{story.title}</div>
                              <div className="text-gray-500 text-xs line-clamp-2 mt-0.5">{story.summary}</div>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 font-extrabold text-[10px] border border-purple-200 uppercase">
                                {story.category}
                              </span>
                            </td>
                            <td className="p-4 text-gray-700 font-medium">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                                <span>{story.location}</span>
                              </div>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingStory(story);
                                  setStoryForm({
                                    title: story.title,
                                    category: story.category,
                                    location: story.location,
                                    summary: story.summary,
                                    fullStory: story.fullStory,
                                    image: story.image,
                                  });
                                  setShowAddStoryModal(true);
                                }}
                                className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition-colors cursor-pointer border border-purple-200"
                                title="Edit story"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete "${story.title}"?`)) {
                                    deleteImpactStory(story.id);
                                  }
                                }}
                                className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-800 transition-colors cursor-pointer border border-rose-200"
                                title="Delete story"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODULE 4: EVENT & PROGRAM MANAGER (CRUD) */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-purple-950 font-display">
                    Events & Programs Manager (CRUD)
                  </h2>
                  <p className="text-xs text-gray-600">
                    Create, edit, toggle active featured events, and manage educational programs
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingEvent(null);
                      setEventForm({
                        title: '',
                        date: '',
                        location: '',
                        targetAudience: '',
                        shortDescription: '',
                        fullDescription: '',
                        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
                        status: 'upcoming',
                        isFeatured: false,
                        whatsappGroupLink: '',
                        highlights: ['Keynote', 'Legal Advice'],
                      });
                      setShowAddEventModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Event</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingProgram(null);
                      setProgramForm({
                        number: programs.length + 1,
                        title: '',
                        shortDescription: '',
                        fullDescription: '',
                        image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
                        keyObjectives: ['School engagement', 'Peer advocacy'],
                        targetAudience: 'Youth & Students',
                        category: 'Education',
                      });
                      setShowAddProgramModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-purple-700" />
                    <span>Create Program</span>
                  </button>
                </div>
              </div>

              {/* Events Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-purple-50/50">
                  <h3 className="text-sm font-extrabold text-purple-950 font-display uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-700" />
                    <span>Flagship Events Registry ({events.length})</span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Event Title</th>
                        <th className="p-4">Date & Location</th>
                        <th className="p-4">Audience</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Featured Flag</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {events.map((ev) => (
                        <tr key={ev.id} className="hover:bg-purple-50/30 transition-colors">
                          <td className="p-4 font-bold text-gray-900 max-w-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={ev.image || undefined}
                                alt={ev.title}
                                className="w-10 h-10 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                              />
                              <div>
                                <div className="text-xs font-bold text-purple-950">{ev.title}</div>
                                <div className="text-[10px] text-gray-500 truncate max-w-[200px]">
                                  {ev.shortDescription}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-700">
                            <div className="font-semibold">{ev.date}</div>
                            <div className="text-[11px] text-gray-500">{ev.location}</div>
                          </td>
                          <td className="p-4 text-gray-600">{ev.targetAudience}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                ev.status === 'upcoming'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                  : 'bg-gray-100 text-gray-700 border border-gray-300'
                              }`}
                            >
                              {ev.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {ev.isFeatured ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 w-fit">
                                <Sparkles className="w-3 h-3" />
                                <span>Homepage Flagship</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => toggleFeaturedEvent(ev.id)}
                                className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                              >
                                Set as Featured
                              </button>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setViewAttendeesEvent(ev);
                                  setAttendeeSearch('');
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-purple-200"
                                title="View Attendees & Export CSV"
                              >
                                <Users className="w-3.5 h-3.5 text-purple-700" />
                                <span>Attendees</span>
                                <span className="px-1.5 py-0.2 rounded-full bg-purple-800 text-white text-[10px] font-black">
                                  {getAttendeesForEvent(ev.id).length}
                                </span>
                              </button>
                              <button
                                onClick={() => {
                                  setEditingEvent(ev);
                                  setEventForm(ev);
                                  setShowAddEventModal(true);
                                }}
                                className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 cursor-pointer"
                                title="Edit Event"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteEvent(ev.id)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: INBOX & APPLICATIONS MANAGER */}
          {activeTab === 'inbox' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-purple-950 font-display">
                      Inbox & Form Submissions
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase border border-purple-300 flex items-center gap-1">
                      <Inbox className="w-3 h-3 text-purple-700" />
                      <span>{inboxItems.length} Total Submissions</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Manage incoming contact inquiries, volunteer applications, sponsor proposals, and campus session requests
                  </p>
                </div>

                {/* Top Quick Stats */}
                <div className="flex items-center gap-2">
                  <div className="bg-purple-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{newInboxCount} New / Unread</span>
                  </div>
                </div>
              </div>

              {/* 4 CATEGORY TABS SYSTEM */}
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                {(
                  [
                    { id: 'General Messages', label: 'General Messages', icon: <MessageSquare className="w-4 h-4" /> },
                    { id: 'Volunteer Applications', label: 'Volunteer Applications', icon: <Heart className="w-4 h-4" /> },
                    { id: 'Partnership & Sponsorships', label: 'Partnership & Sponsorships', icon: <Building className="w-4 h-4" /> },
                    { id: 'School Collaborations', label: 'School Collaborations', icon: <School className="w-4 h-4" /> },
                  ] as const
                ).map((tab) => {
                  const count = inboxItems.filter((i) => i.category === tab.id).length;
                  const unreadCount = inboxItems.filter((i) => i.category === tab.id && i.status === 'New').length;
                  const isActive = inboxCategoryTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setInboxCategoryTab(tab.id as InboxCategory)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-800 text-white shadow-md border border-purple-600'
                          : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-900 border border-gray-200'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          isActive
                            ? 'bg-purple-950 text-purple-200'
                            : unreadCount > 0
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* FILTER & SEARCH BAR */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by name, email, role, message..."
                    value={inboxSearch}
                    onChange={(e) => setInboxSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Status:</span>
                  </span>
                  <select
                    value={inboxStatusFilter}
                    onChange={(e) => setInboxStatusFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-purple-600 outline-none bg-white cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Replied">Replied</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* DATA TABLE */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-purple-950 text-white text-[11px] font-extrabold uppercase tracking-wider">
                        <th className="p-4">Date</th>
                        <th className="p-4">Name & Org/School</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Subject / Type</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {filteredInboxItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <Inbox className="w-8 h-8 text-purple-300" />
                              <p className="font-bold text-purple-950">No submissions found</p>
                              <p className="text-xs text-gray-400">
                                No records match the selected category tab or search criteria.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredInboxItems.map((item) => (
                          <tr
                            key={item.id}
                            className={`hover:bg-purple-50/50 transition-colors ${
                              item.status === 'New' ? 'bg-purple-50/30 font-medium' : ''
                            }`}
                          >
                            <td className="p-4 text-gray-600 font-semibold whitespace-nowrap">
                              {item.dateSubmitted}
                            </td>
                            <td className="p-4">
                              <div className="font-extrabold text-purple-950">{item.name}</div>
                              {item.organizationOrSchool && (
                                <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1 mt-0.5">
                                  <Building2 className="w-3 h-3 text-purple-500" />
                                  <span>{item.organizationOrSchool}</span>
                                </div>
                              )}
                              {item.districtOrLocation && (
                                <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span>{item.districtOrLocation}</span>
                                </div>
                              )}
                            </td>
                            <td className="p-4 font-mono text-xs text-gray-700">
                              <a
                                href={`mailto:${item.email}`}
                                className="hover:text-purple-700 underline"
                              >
                                {item.email}
                              </a>
                              {item.phone && (
                                <div className="text-[10px] font-sans text-gray-500 mt-0.5">
                                  {item.phone}
                                </div>
                              )}
                            </td>
                            <td className="p-4 font-semibold text-gray-900 max-w-xs truncate">
                              {item.subjectOrRole || 'General Submission'}
                            </td>
                            <td className="p-4">
                              <select
                                value={item.status}
                                onChange={(e) =>
                                  updateInboxStatus(item.id, e.target.value as InboxItem['status'])
                                }
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer outline-none ${
                                  item.status === 'New'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : item.status === 'In Review'
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : item.status === 'Replied'
                                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                                    : 'bg-gray-100 text-gray-700 border-gray-300'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="In Review">In Review</option>
                                <option value="Replied">Replied</option>
                                <option value="Archived">Archived</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedInboxItem(item);
                                    setInboxNotesInput(item.adminNotes || '');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-purple-700" />
                                  <span>View</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteInboxItem(item.id)}
                                  className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 5: SECURE COMPLAINT BOX MANAGER */}
          {activeTab === 'complaints' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-purple-950 font-display">
                      Confidential Complaint Box Manager
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase border border-emerald-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Encrypted Protocol</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Trauma-informed inbox for managing reports from students, survivors, and institutional partners
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48 min-w-[160px]">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search case, location..."
                      value={complaintSearch}
                      onChange={(e) => setComplaintSearch(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                    />
                  </div>

                  {/* Division Filter */}
                  <select
                    value={complaintDivisionFilter}
                    onChange={(e) => {
                      setComplaintDivisionFilter(e.target.value);
                      setComplaintDistrictFilter('All');
                    }}
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 bg-white focus:ring-2 focus:ring-purple-600 outline-none cursor-pointer"
                  >
                    <option value="All">All Divisions</option>
                    {BANGLADESH_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div} Division
                      </option>
                    ))}
                  </select>

                  {/* District Filter */}
                  <select
                    value={complaintDistrictFilter}
                    onChange={(e) => setComplaintDistrictFilter(e.target.value)}
                    disabled={complaintDivisionFilter === 'All'}
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 bg-white focus:ring-2 focus:ring-purple-600 outline-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="All">All Districts</option>
                    {complaintDivisionFilter !== 'All' &&
                      BANGLADESH_DISTRICTS[complaintDivisionFilter]?.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={complaintFilter}
                    onChange={(e) => setComplaintFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 bg-white focus:ring-2 focus:ring-purple-600 outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Complaint Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Case ID & Date</th>
                        <th className="p-4">Category & Institution</th>
                        <th className="p-4">Location (Div & Dist)</th>
                        <th className="p-4">Subject Headline</th>
                        <th className="p-4">Urgency</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredComplaints.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">
                            No complaints matching your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredComplaints.map((comp) => (
                          <tr key={comp.id} className="hover:bg-purple-50/40 transition-colors">
                            <td className="p-4 font-bold text-purple-950">
                              <div className="text-xs">{comp.id}</div>
                              <div className="text-[10px] text-gray-500 font-normal">
                                {comp.dateSubmitted}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-gray-900">{comp.category}</div>
                              <div className="text-[11px] text-gray-500">
                                {comp.institution || 'Individual Student'}
                              </div>
                            </td>
                            <td className="p-4">
                              {comp.division ? (
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-[11px] font-semibold">
                                  <MapPin className="w-3 h-3 text-purple-600 flex-shrink-0" />
                                  <span>{comp.district ? `${comp.district}, ` : ''}{comp.division}</span>
                                </div>
                              ) : (
                                <span className="text-[11px] text-gray-400 italic">Not provided</span>
                              )}
                            </td>
                            <td className="p-4 font-semibold text-gray-800 max-w-xs truncate">
                              {comp.subject}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                  comp.urgencyLevel === 'Critical'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : comp.urgencyLevel === 'Urgent'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                                }`}
                              >
                                {comp.urgencyLevel || 'Standard'}
                              </span>
                            </td>
                            <td className="p-4">
                              <select
                                value={comp.status}
                                onChange={(e) =>
                                  updateComplaintStatus(comp.id, e.target.value as any)
                                }
                                className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold uppercase border outline-none cursor-pointer ${
                                  comp.status === 'Pending'
                                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                                    : comp.status === 'In Review'
                                    ? 'bg-blue-50 text-blue-900 border-blue-300'
                                    : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Review">In Review</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedComplaint(comp)}
                                  className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Review</span>
                                </button>
                                <button
                                  onClick={() => deleteComplaint(comp.id)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 6: TEAM & PARTNER MANAGER */}
          {activeTab === 'team-partners' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-black text-purple-950 font-display">
                  Team Members & Partner Logos Manager
                </h2>
                <p className="text-xs text-gray-600">
                  Manage leadership team profiles, advisors, volunteers, and sponsor logos
                </p>
              </div>

              {/* Team Members Grid Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-purple-950 font-display uppercase tracking-wider">
                      Active Team Profiles ({teamMembers.length})
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium">Manage executive profiles, roles, and biographies</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingTeamMember(null);
                      setTeamForm({
                        name: '',
                        role: '',
                        category: 'Core Team',
                        bio: '',
                        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                        email: '',
                        linkedin: '',
                      });
                      setShowAddTeamModal(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Team Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between gap-4 hover:border-purple-300 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={member.photo || undefined}
                          alt={member.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-purple-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-purple-950 truncate">
                            {member.name}
                          </div>
                          <div className="text-[11px] text-purple-700 font-semibold truncate">
                            {member.role}
                          </div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">
                            {member.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTeamMember(member);
                            setTeamForm(member);
                            setShowAddTeamModal(true);
                          }}
                          title="Edit Team Member"
                          className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTeamMember(member.id)}
                          title="Delete Team Member"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partner Logos Gallery Section */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-purple-950 font-display uppercase tracking-wider">
                      Partner & Institutional Sponsors ({partners.length})
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium">Manage sponsor organizations and institutional affiliations</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingPartner(null);
                      setPartnerForm({ name: '', category: 'Youth & Development', logoText: '' });
                      setShowAddPartnerModal(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Partner</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {partners.map((p, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-2 hover:border-purple-300 transition-all"
                    >
                      <div className="min-w-0 flex items-center gap-2.5">
                        {p.logoText && p.logoText.startsWith('http') ? (
                          <img src={p.logoText || undefined} alt={p.name} className="w-8 h-8 rounded-lg object-contain border border-purple-200 p-0.5 flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 text-xs font-black flex items-center justify-center flex-shrink-0">
                            {(p.name || 'P').charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-purple-950 truncate">{p.name}</div>
                          <div className="text-[10px] text-gray-500 truncate">{p.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPartner(p);
                            setPartnerForm({ name: p.name, category: p.category, logoText: p.logoText || p.name });
                            setShowAddPartnerModal(true);
                          }}
                          title="Edit Partner"
                          className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePartner(p.name)}
                          title="Delete Partner"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-purple-950 font-display">
                    System Settings & Contact Information
                  </h2>
                  <p className="text-xs text-gray-600">
                    Update site configuration (Site Name, Maintenance Mode), helpline, contact email, office locations, and social media links (Persisted to Firestore: <code className="bg-purple-100 text-purple-900 px-1 py-0.5 rounded">settings/general</code>)
                  </p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-purple-300" />
                  <span>{isSaving ? 'Saving...' : 'Save Settings to Firestore'}</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
                <h3 className="text-sm font-extrabold text-purple-950 uppercase tracking-wider font-display">
                  Core NGO Identity & System State
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Organization / Site Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.siteName}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, siteName: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      System Maintenance Mode
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!settingsForm.maintenanceMode}
                          onChange={(e) => setSettingsForm((prev) => ({ ...prev, maintenanceMode: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-700"></div>
                      </label>
                      <span className="text-xs font-extrabold text-purple-950">
                        {settingsForm.maintenanceMode ? (
                          <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            Maintenance Mode ACTIVE
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            Live System Online
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-extrabold text-purple-950 uppercase tracking-wider font-display pt-2 border-t border-gray-100">
                  Official NGO Contact Parameters
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Helpline Phone Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Divisional Office Locations
                  </label>
                  <input
                    type="text"
                    value={settingsForm.officeLocations}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, officeLocations: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Footer Mission Statement Text
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.footerAbout}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, footerAbout: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <h3 className="text-sm font-extrabold text-purple-950 uppercase tracking-wider font-display">
                    Social Media Channels
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Facebook URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.facebook}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, facebook: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Instagram URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.instagram}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, instagram: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.linkedin}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        YouTube URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.youtube}
                        onChange={(e) => setSettingsForm((prev) => ({ ...prev, youtube: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={resetToDefaults}
                    className="px-4 py-2 rounded-xl border border-rose-300 text-rose-800 hover:bg-rose-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset CMS to Factory Defaults</span>
                  </button>

                  <div className="text-xs text-gray-500 font-semibold">
                    All changes sync to Firestore settings/general
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: STAFF & ACCESS CONTROL (RBAC) */}
          {activeTab === 'staff' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-purple-900 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-200">
                      Approved Admin Access Control
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {users.length} Registered Accounts
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-purple-950 font-display mt-1">
                    Firestore Approved Admins & Access Control
                  </h2>
                  <p className="text-xs text-gray-600">
                    The Admin Panel is hidden for all normal users. Only <code className="text-purple-900 font-bold">mdanontosunny1068@mail.com</code> (Super Admin) and emails explicitly added to the approved admin list in Firestore can access this panel.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNewUserEmail('');
                    setShowAddUserModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Provision User Account</span>
                </button>
              </div>

              {/* APPROVED ADMINS FIRESTORE MANAGER BOX */}
              <div className="bg-gradient-to-br from-purple-950 to-indigo-900 text-white p-6 rounded-3xl shadow-lg border border-purple-800/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-800/60 text-purple-200 flex items-center justify-center border border-purple-700/50">
                      <ShieldCheck className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white font-display">Approved Admin List (Firestore)</h3>
                      <p className="text-xs text-purple-200 font-medium">
                        Stored in <code className="text-amber-300 bg-purple-900/80 px-1.5 py-0.5 rounded border border-purple-700">settings/approved_admins</code> in Firestore
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grant Admin Form */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newAdminEmailInput.trim()) return;
                    const targetEmail = newAdminEmailInput.trim().toLowerCase();
                    await addApprovedAdminEmail(targetEmail);
                    setAdminActionMsg(`Successfully added "${targetEmail}" to approved admins list in Firestore!`);
                    setNewAdminEmailInput('');
                    setTimeout(() => setAdminActionMsg(''), 4000);
                  }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-purple-200 block">Add New Approved Admin Email:</label>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="email"
                      placeholder="e.g. admin.partner@organization.org"
                      value={newAdminEmailInput}
                      onChange={(e) => setNewAdminEmailInput(e.target.value)}
                      className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-purple-900/90 border border-purple-700 text-xs font-bold text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer shrink-0"
                    >
                      + Grant Admin Access
                    </button>
                  </div>
                </form>

                {adminActionMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold">
                    {adminActionMsg}
                  </div>
                )}

                {/* Currently Approved Admin Badges */}
                <div className="pt-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300 mb-2.5">
                    Currently Granted Admin Access:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Super Admin Tag */}
                    <div className="px-3.5 py-1.5 rounded-xl bg-purple-900/90 border border-amber-400/60 text-white text-xs font-bold flex items-center gap-2 shadow-xs">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>mdanontosunny1068@mail.com</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-purple-950 text-[9px] font-black uppercase">Super Admin</span>
                    </div>

                    {/* Additional Approved Admins */}
                    {approvedAdminEmails
                      .filter((e) => e.toLowerCase() !== 'mdanontosunny1068@mail.com' && e.toLowerCase() !== 'mdanontosunny1068@gmail.com')
                      .map((email) => (
                        <div
                          key={email}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-900/80 border border-purple-600 text-white text-xs font-bold flex items-center gap-2.5"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-purple-300" />
                          <span>{email}</span>
                          <button
                            type="button"
                            onClick={async () => {
                              await removeApprovedAdminEmail(email);
                              setAdminActionMsg(`Revoked admin access for ${email}`);
                              setTimeout(() => setAdminActionMsg(''), 3000);
                            }}
                            className="text-rose-300 hover:text-rose-100 font-black text-[10px] uppercase bg-rose-900/60 hover:bg-rose-900 px-2 py-0.5 rounded border border-rose-700 transition-colors cursor-pointer ml-1"
                            title="Revoke Admin Access"
                          >
                            Revoke
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Total User Accounts</div>
                    <div className="text-2xl font-black text-purple-950 mt-1">{users.length}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">Approved Admin Access</div>
                    <div className="text-2xl font-black text-purple-900 mt-1">
                      {1 + approvedAdminEmails.filter((e) => e.toLowerCase() !== 'mdanontosunny1068@mail.com' && e.toLowerCase() !== 'mdanontosunny1068@gmail.com').length}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center border border-purple-200">
                    <ShieldCheck className="w-5 h-5 text-purple-700" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Standard Accounts (No Admin)</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      {users.filter(u => u.email.toLowerCase() !== 'mdanontosunny1068@mail.com' && !approvedAdminEmails.includes(u.email.toLowerCase())).length}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search account by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div className="text-xs text-gray-500 font-semibold">
                  Showing {users.filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).length} Accounts
                </div>
              </div>

              {/* Accounts Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-purple-950 text-purple-100 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">User Profile</th>
                        <th className="p-4">Registered Date</th>
                        <th className="p-4">Access Level</th>
                        <th className="p-4">Admin Access Control</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users
                        .filter((u) => {
                          const q = userSearch.toLowerCase();
                          return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                        })
                        .map((u) => {
                          const isSelf = u.id === currentUser?.id;
                          const userCleanEmail = u.email.trim().toLowerCase();
                          const isSuper = userCleanEmail === 'mdanontosunny1068@mail.com' || userCleanEmail === 'mdanontosunny1068@gmail.com';
                          const isApproved = approvedAdminEmails.includes(userCleanEmail);

                          return (
                            <tr key={u.id} className="hover:bg-purple-50/50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-900 font-black flex items-center justify-center text-sm border border-purple-200 shrink-0">
                                    {u.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-extrabold text-purple-950 text-sm flex items-center gap-2">
                                      <span>{u.name}</span>
                                      {isSelf && (
                                        <span className="px-2 py-0.5 rounded-full bg-purple-900 text-white text-[9px] font-black uppercase tracking-wider">
                                          You (Active)
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium">{u.email}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="p-4 text-gray-600 font-medium">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Initial Setup'}
                              </td>

                              <td className="p-4">
                                {isSuper ? (
                                  <span className="px-3 py-1 rounded-full bg-amber-100 text-purple-950 font-black text-[11px] uppercase tracking-wider border border-amber-300 inline-flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Super Admin</span>
                                  </span>
                                ) : isApproved ? (
                                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-950 font-black text-[11px] uppercase tracking-wider border border-purple-300 inline-flex items-center gap-1">
                                    <UserCheck className="w-3.5 h-3.5 text-purple-700" />
                                    <span>Approved Admin</span>
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] uppercase tracking-wider border border-slate-200 inline-flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Standard Account</span>
                                  </span>
                                )}
                              </td>

                              <td className="p-4">
                                {isSuper ? (
                                  <span className="text-amber-800 bg-amber-50 px-3 py-1 rounded-xl text-xs font-bold border border-amber-200">
                                    Permanent Super Admin
                                  </span>
                                ) : isApproved ? (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await removeApprovedAdminEmail(u.email);
                                      setAdminActionMsg(`Revoked admin access for ${u.email}`);
                                      setTimeout(() => setAdminActionMsg(''), 3000);
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200 transition-all cursor-pointer active:scale-95"
                                  >
                                    Revoke Admin Access
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await addApprovedAdminEmail(u.email);
                                      setAdminActionMsg(`Granted admin access to ${u.email}`);
                                      setTimeout(() => setAdminActionMsg(''), 3000);
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold text-xs border border-purple-300 transition-all cursor-pointer active:scale-95"
                                  >
                                    + Grant Admin Access
                                  </button>
                                )}
                              </td>

                              <td className="p-4 text-right">
                                {isSelf || isSuper ? (
                                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 text-[10px] font-bold border border-purple-200">
                                    Protected Account
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(u.email)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200 transition-all cursor-pointer shadow-2xs active:scale-95"
                                    title={`Delete account for ${u.name}`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Delete</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security Policy Information Box */}
              <div className="p-5 rounded-3xl bg-purple-50 border border-purple-100 space-y-2 text-xs text-purple-950">
                <div className="font-black text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Admin Panel Access Policy</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-white p-3.5 rounded-2xl border border-purple-200">
                    <strong className="text-purple-950 block mb-1">1. Super Admin (<code className="text-purple-700">mdanontosunny1068@mail.com</code>):</strong>
                    <p className="text-gray-600 leading-relaxed">
                      Permanent administrative authority. Can grant and revoke admin access for other user accounts directly in Firestore.
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-purple-200">
                    <strong className="text-purple-950 block mb-1">2. Approved Admins (<code className="text-purple-700">settings/approved_admins</code>):</strong>
                    <p className="text-gray-600 leading-relaxed">
                      Emails explicitly authorized in Firestore. The Admin Panel button and dashboard routes remain strictly hidden and inaccessible to all other users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* COMPLAINT REVIEW MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-purple-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-purple-900 bg-purple-100 px-3 py-1 rounded-lg">
                  {selectedComplaint.id}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  {selectedComplaint.dateSubmitted}
                </span>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold uppercase text-gray-500">Subject</div>
                <h3 className="text-lg font-extrabold text-purple-950 font-display">
                  {selectedComplaint.subject}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                <div>
                  <span className="font-bold text-gray-500 block">Complainant / Institution:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedComplaint.fullName || 'Anonymous'}
                  </span>
                  {selectedComplaint.institution && (
                    <div className="text-purple-700 font-medium">
                      {selectedComplaint.institution}
                    </div>
                  )}
                  {selectedComplaint.emailOrPhone && (
                    <div className="text-gray-600 text-[11px] mt-0.5">
                      Contact: {selectedComplaint.emailOrPhone}
                    </div>
                  )}
                </div>

                <div>
                  <span className="font-bold text-gray-500 block">Location Tracking:</span>
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-purple-200 rounded-lg font-bold text-purple-950">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span>
                      {selectedComplaint.division
                        ? `${selectedComplaint.district ? `${selectedComplaint.district}, ` : ''}${selectedComplaint.division} Division`
                        : 'Location Unspecified'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-gray-500 block">Category & Urgency:</span>
                  <span className="font-semibold text-gray-900">{selectedComplaint.category}</span>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                      {selectedComplaint.urgencyLevel || 'Standard'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase text-gray-500 mb-1">
                  Full Statement / Description
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                  {selectedComplaint.description}
                </div>
              </div>

              {selectedComplaint.attachmentName && (() => {
                const fileImgUrl =
                  selectedComplaint.attachmentUrl ||
                  (selectedComplaint.attachmentName.toLowerCase().includes('png') ||
                   selectedComplaint.attachmentName.toLowerCase().includes('jpg') ||
                   selectedComplaint.attachmentName.toLowerCase().includes('jpeg') ||
                   selectedComplaint.attachmentName.toLowerCase().includes('screenshot')
                    ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000'
                    : 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1000');

                const handleDownload = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const a = document.createElement('a');
                  a.href = fileImgUrl;
                  a.download = selectedComplaint.attachmentName || 'attachment';
                  a.target = '_blank';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                };

                return (
                  <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/70 space-y-3">
                    {/* Attachment Header & Confidential Warning */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                        <Lock className="w-3.5 h-3.5 text-purple-700" />
                        <span>Attached Case Evidence</span>
                      </div>
                      <span className="text-[10px] bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded font-extrabold flex items-center gap-1 border border-purple-300">
                        <ShieldAlert className="w-3 h-3 text-purple-800" />
                        Confidential Attachment
                      </span>
                    </div>

                    {/* Main Attachment Preview Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-purple-200/90 shadow-xs">
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          onClick={() =>
                            setLightboxImage({
                              url: fileImgUrl,
                              title: selectedComplaint.subject,
                              filename: selectedComplaint.attachmentName!,
                            })
                          }
                          className="relative group w-12 h-12 rounded-lg overflow-hidden border border-purple-200 bg-gray-100 flex-shrink-0 cursor-pointer shadow-xs hover:ring-2 hover:ring-purple-600 transition-all"
                          title="Click thumbnail to preview attachment"
                        >
                          <img
                            src={fileImgUrl || undefined}
                            alt={selectedComplaint.attachmentName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />
                            <span className="truncate">{selectedComplaint.attachmentName}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Click thumbnail or button to expand full file evidence
                          </div>
                        </div>
                      </div>

                      {/* Right: Action Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0 pt-1 sm:pt-0">
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxImage({
                              url: fileImgUrl,
                              title: selectedComplaint.subject,
                              filename: selectedComplaint.attachmentName!,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                          title="View full attachment image"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Image</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownload}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                          title="Download confidential attachment"
                        >
                          <Download className="w-3.5 h-3.5 text-purple-700" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Administrator Case Notes & Directives
                </label>
                <textarea
                  rows={3}
                  value={selectedComplaint.adminNotes || ''}
                  onChange={(e) => updateComplaintNotes(selectedComplaint.id, e.target.value)}
                  placeholder="Enter internal investigation notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600">Set Case Status:</span>
                  <select
                    value={selectedComplaint.status}
                    onChange={(e) => {
                      const nextStatus = e.target.value as any;
                      updateComplaintStatus(selectedComplaint.id, nextStatus);
                      setSelectedComplaint((prev) => (prev ? { ...prev, status: nextStatus } : null));
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase border border-purple-300 bg-white cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-5 py-2 rounded-xl bg-purple-800 text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INBOX ITEM VIEW MODAL */}
      {selectedInboxItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-purple-200 shadow-2xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-purple-900 bg-purple-100 px-3 py-1 rounded-lg">
                  {selectedInboxItem.id}
                </span>
                <span className="text-xs font-extrabold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  {selectedInboxItem.category}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  {selectedInboxItem.dateSubmitted}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInboxItem(null)}
                className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Applicant Header Info */}
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold uppercase text-purple-700">Subject / Application Role</div>
                <h3 className="text-lg font-extrabold text-purple-950 font-display">
                  {selectedInboxItem.subjectOrRole || selectedInboxItem.category}
                </h3>
              </div>

              {/* Quick Details Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
                <div>
                  <span className="font-bold text-gray-500 block">Applicant / Contact Name:</span>
                  <span className="font-extrabold text-purple-950 text-sm">
                    {selectedInboxItem.name}
                  </span>
                  {selectedInboxItem.organizationOrSchool && (
                    <div className="text-purple-800 font-bold mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>{selectedInboxItem.organizationOrSchool}</span>
                    </div>
                  )}
                  {selectedInboxItem.districtOrLocation && (
                    <div className="text-gray-600 font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-500" />
                      <span>{selectedInboxItem.districtOrLocation}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-500 block">Contact Channels:</span>
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-700" />
                    <a href={`mailto:${selectedInboxItem.email}`} className="hover:underline text-purple-900">
                      {selectedInboxItem.email}
                    </a>
                  </div>
                  {selectedInboxItem.phone && (
                    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-purple-700" />
                      <a href={`tel:${selectedInboxItem.phone}`} className="hover:underline">
                        {selectedInboxItem.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase text-gray-700">Message / Proposal Content</div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs leading-relaxed text-gray-800 whitespace-pre-wrap font-sans">
                  {selectedInboxItem.message}
                </div>
              </div>

              {/* Status Update & Internal Admin Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Update Processing Status
                  </label>
                  <select
                    value={selectedInboxItem.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as InboxItem['status'];
                      updateInboxStatus(selectedInboxItem.id, newStatus);
                      setSelectedInboxItem({ ...selectedInboxItem, status: newStatus });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold text-purple-950 focus:ring-2 focus:ring-purple-600 outline-none bg-white cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Replied">Replied</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Direct Email Contact
                  </label>
                  <a
                    href={`mailto:${selectedInboxItem.email}?subject=Re: ${encodeURIComponent(selectedInboxItem.subjectOrRole || 'Survivor’s Path Youth Response')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Email Reply</span>
                  </a>
                </div>
              </div>

              {/* Admin Internal Notes Textarea */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase text-purple-950">
                  Admin Internal Follow-up Notes
                </label>
                <textarea
                  rows={2}
                  value={inboxNotesInput}
                  onChange={(e) => setInboxNotesInput(e.target.value)}
                  placeholder="Record internal team notes, review comments, or follow-up dates..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateInboxNotes(selectedInboxItem.id, inboxNotesInput);
                    setSelectedInboxItem({ ...selectedInboxItem, adminNotes: inboxNotesInput });
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Internal Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EVENT MODAL (Create/Edit) */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handleSaveEvent}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 border border-purple-200 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-extrabold text-purple-950 font-display">
                {editingEvent ? 'Edit Event Details' : 'Create New Event'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddEventModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                required
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 21 August 2026"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Jessore, Bangladesh"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Youth, Students & Educators"
                value={eventForm.targetAudience}
                onChange={(e) => setEventForm({ ...eventForm, targetAudience: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Event Description
              </label>
              <textarea
                rows={3}
                required
                value={eventForm.shortDescription}
                onChange={(e) => setEventForm({ ...eventForm, shortDescription: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center justify-between">
                <span>WhatsApp Group Invite Link (Optional)</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  Post-Registration Redirect
                </span>
              </label>
              <input
                type="url"
                placeholder="https://chat.whatsapp.com/..."
                value={eventForm.whatsappGroupLink || ''}
                onChange={(e) => setEventForm({ ...eventForm, whatsappGroupLink: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-600 outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                When provided, registered attendees will see a button to join this WhatsApp group immediately upon registering.
              </p>
            </div>

            <ImageUploadField
              label="Event Cover Image"
              value={eventForm.image}
              onChange={(base64) => setEventForm({ ...eventForm, image: base64 })}
              helpText="Upload event poster or promotional banner (PNG, JPG, WEBP)"
              required
            />

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventForm.isFeatured || false}
                  onChange={(e) => setEventForm({ ...eventForm, isFeatured: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>Set as Flagship Featured Event on Homepage</span>
              </label>
            </div>

            {/* REGISTRATION FORM SETTINGS SECTION */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-950 font-display flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-purple-700" />
                  <span>Registration Form Settings</span>
                </h4>
                <p className="text-[11px] text-gray-500 font-medium">
                  Toggle switches to choose which fields to collect for this specific event. (Full Name is required by default).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100">
                <label className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer hover:border-purple-300 transition-colors">
                  <span className="text-xs font-bold text-gray-800">Phone Number</span>
                  <input
                    type="checkbox"
                    checked={eventForm.registrationFields?.collectPhone ?? true}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        registrationFields: {
                          ...(eventForm.registrationFields || {
                            collectPhone: true,
                            collectEmail: true,
                            collectSchool: true,
                            collectTShirtSize: false,
                            collectEmergencyContact: false,
                            collectCustomQuestion: false,
                            customQuestionPrompt: '',
                          }),
                          collectPhone: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer hover:border-purple-300 transition-colors">
                  <span className="text-xs font-bold text-gray-800">Email Address</span>
                  <input
                    type="checkbox"
                    checked={eventForm.registrationFields?.collectEmail ?? true}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        registrationFields: {
                          ...(eventForm.registrationFields || {
                            collectPhone: true,
                            collectEmail: true,
                            collectSchool: true,
                            collectTShirtSize: false,
                            collectEmergencyContact: false,
                            collectCustomQuestion: false,
                            customQuestionPrompt: '',
                          }),
                          collectEmail: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer hover:border-purple-300 transition-colors">
                  <span className="text-xs font-bold text-gray-800">School / Institution</span>
                  <input
                    type="checkbox"
                    checked={eventForm.registrationFields?.collectSchool ?? true}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        registrationFields: {
                          ...(eventForm.registrationFields || {
                            collectPhone: true,
                            collectEmail: true,
                            collectSchool: true,
                            collectTShirtSize: false,
                            collectEmergencyContact: false,
                            collectCustomQuestion: false,
                            customQuestionPrompt: '',
                          }),
                          collectSchool: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer hover:border-purple-300 transition-colors">
                  <span className="text-xs font-bold text-gray-800">T-Shirt Size</span>
                  <input
                    type="checkbox"
                    checked={eventForm.registrationFields?.collectTShirtSize ?? false}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        registrationFields: {
                          ...(eventForm.registrationFields || {
                            collectPhone: true,
                            collectEmail: true,
                            collectSchool: true,
                            collectTShirtSize: false,
                            collectEmergencyContact: false,
                            collectCustomQuestion: false,
                            customQuestionPrompt: '',
                          }),
                          collectTShirtSize: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer hover:border-purple-300 transition-colors sm:col-span-2">
                  <span className="text-xs font-bold text-gray-800">Emergency Contact</span>
                  <input
                    type="checkbox"
                    checked={eventForm.registrationFields?.collectEmergencyContact ?? false}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        registrationFields: {
                          ...(eventForm.registrationFields || {
                            collectPhone: true,
                            collectEmail: true,
                            collectSchool: true,
                            collectTShirtSize: false,
                            collectEmergencyContact: false,
                            collectCustomQuestion: false,
                            customQuestionPrompt: '',
                          }),
                          collectEmergencyContact: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </label>

                <div className="sm:col-span-2 space-y-2 p-3 bg-white rounded-xl border border-purple-100">
                  <label className="flex items-center justify-between gap-2 cursor-pointer">
                    <span className="text-xs font-bold text-purple-950">Custom Question</span>
                    <input
                      type="checkbox"
                      checked={eventForm.registrationFields?.collectCustomQuestion ?? false}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          registrationFields: {
                            ...(eventForm.registrationFields || {
                              collectPhone: true,
                              collectEmail: true,
                              collectSchool: true,
                              collectTShirtSize: false,
                              collectEmergencyContact: false,
                              collectCustomQuestion: false,
                              customQuestionPrompt: '',
                            }),
                            collectCustomQuestion: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </label>

                  {eventForm.registrationFields?.collectCustomQuestion && (
                    <div className="pt-1.5">
                      <label className="block text-[11px] font-bold uppercase text-gray-700 mb-1">
                        Write Custom Question Prompt
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Why do you want to attend this event or what session interests you?"
                        value={eventForm.registrationFields?.customQuestionPrompt || ''}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            registrationFields: {
                              ...(eventForm.registrationFields || {
                                collectPhone: true,
                                collectEmail: true,
                                collectSchool: true,
                                collectTShirtSize: false,
                                collectEmergencyContact: false,
                                collectCustomQuestion: true,
                                customQuestionPrompt: '',
                              }),
                              customQuestionPrompt: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddEventModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PROGRAM MODAL */}
      {showAddProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handleSaveProgram}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 border border-purple-200 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-extrabold text-purple-950 font-display">
                {editingProgram ? 'Edit Program Details' : 'Create New Program'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProgramModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Program Title
              </label>
              <input
                type="text"
                required
                value={programForm.title}
                onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                required
                value={programForm.shortDescription}
                onChange={(e) => setProgramForm({ ...programForm, shortDescription: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Full Description Narrative
              </label>
              <textarea
                rows={3}
                required
                value={programForm.fullDescription}
                onChange={(e) => setProgramForm({ ...programForm, fullDescription: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  required
                  value={programForm.category}
                  onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  required
                  value={programForm.targetAudience}
                  onChange={(e) => setProgramForm({ ...programForm, targetAudience: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
            </div>

            <ImageUploadField
              label="Program Initiative Cover Image"
              value={programForm.image}
              onChange={(base64) => setProgramForm({ ...programForm, image: base64 })}
              helpText="Upload initiative banner or feature photo (PNG, JPG, WEBP)"
              required
            />

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddProgramModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
              >
                Save Program
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TEAM MEMBER MODAL */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handleSaveTeam}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 border border-purple-200 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-purple-950 font-display">
                  {editingTeamMember ? 'Edit Team Member Profile' : 'Add New Team Member'}
                </h3>
                <p className="text-xs text-gray-500">Provide leadership details and profile picture</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Sabrina Ahmed"
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Designated Role / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Director"
                  value={teamForm.role}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Category Tag
                </label>
                <select
                  value={teamForm.category}
                  onChange={(e) => setTeamForm({ ...teamForm, category: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none bg-white cursor-pointer"
                >
                  <option value="Founder">Founder</option>
                  <option value="Chief Advisor">Chief Advisor</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Core Team">Core Team</option>
                  <option value="Program Team">Program Team</option>
                  <option value="PR & Sponsorship Team">PR & Sponsorship Team</option>
                  <option value="Volunteers">Volunteers</option>
                </select>
              </div>
            </div>

            <ImageUploadField
              label="Team Member Profile Photo"
              value={teamForm.photo}
              onChange={(base64) => setTeamForm((prev) => ({ ...prev, photo: base64 }))}
              helpText="Upload executive portrait or profile headshot (PNG, JPG, WEBP)"
              required
            />

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Short Biography
              </label>
              <textarea
                rows={2}
                placeholder="Brief introduction or background..."
                value={teamForm.bio}
                onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="sabrina@survivorspathyouth.org"
                  value={teamForm.email || ''}
                  onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  LinkedIn URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/username"
                  value={teamForm.linkedin || ''}
                  onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-purple-200" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PARTNER LOGO MODAL */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handleSavePartner}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-purple-200 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-purple-950 font-display">
                  {editingPartner ? 'Edit Partner / Sponsor' : 'Add New Partner'}
                </h3>
                <p className="text-xs text-gray-500">Configure institutional partner or sponsor details</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPartnerModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. UN Women Youth Chapter"
                value={partnerForm.name}
                onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Youth & Development, Institutional Ally"
                value={partnerForm.category}
                onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <ImageUploadField
              label="Partner / Sponsor Logo Upload"
              value={partnerForm.logoText}
              onChange={(base64) => setPartnerForm((prev) => ({ ...prev, logoText: base64 }))}
              helpText="Upload partner logo image from device (PNG, SVG, WEBP)"
              required
            />

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddPartnerModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-purple-200" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FLOATING GLOBAL SAVE ALL CHANGES BUTTON */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {saveToast && (
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-900 text-white border border-emerald-500/50 shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>All CMS & Admin Changes Saved Successfully!</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGlobalSaveAll}
          disabled={isSaving}
          className="px-5 py-3.5 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white border border-purple-400/40 font-bold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
          title="Save all CMS content, team, partner, and site parameters to persistent database"
        >
          <Save className="w-4 h-4 text-purple-300" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* LIGHTBOX ATTACHMENT PREVIEW MODAL */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in">
          {/* Lightbox Header */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white border-b border-white/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-900/80 border border-purple-400/30">
                <FileText className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{lightboxImage.filename}</span>
                  <span className="text-[10px] bg-purple-600/80 text-purple-100 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                    Confidential Evidence
                  </span>
                </div>
                <div className="text-xs text-purple-200/80 truncate max-w-md mt-0.5">
                  Case: {lightboxImage.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={lightboxImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                title="Open image in new browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in New Tab</span>
              </a>
              <a
                href={lightboxImage.url}
                download={lightboxImage.filename}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all ml-2"
                title="Close Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image Area */}
          <div className="flex-1 w-full max-w-4xl flex items-center justify-center p-2 sm:p-4 my-2 overflow-hidden">
            <div className="relative max-h-[75vh] max-w-full rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-2xl flex items-center justify-center">
              <img
                src={lightboxImage.url || undefined}
                alt={lightboxImage.filename}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl select-none"
              />
            </div>
          </div>

          {/* Lightbox Footer */}
          <div className="w-full max-w-md flex items-center justify-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Close Image Viewer
            </button>
          </div>
        </div>
      )}

      {/* ATTENDEES MANAGEMENT & CSV EXPORT MODAL */}
      {viewAttendeesEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-purple-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-800 text-purple-200 text-[10px] font-bold uppercase tracking-wider border border-purple-600">
                    EVENT ATTENDEE MANAGEMENT
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-500/40">
                    {getAttendeesForEvent(viewAttendeesEvent.id).length} Registered
                  </span>
                </div>
                <h3 className="text-xl font-extrabold font-display leading-tight mt-1 text-white">
                  {viewAttendeesEvent.title}
                </h3>
                <p className="text-xs text-purple-200/90 mt-0.5 flex items-center gap-3">
                  <span>📅 {viewAttendeesEvent.date}</span>
                  <span>📍 {viewAttendeesEvent.location}</span>
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() =>
                    exportAttendeesToCsv(
                      viewAttendeesEvent,
                      getAttendeesForEvent(viewAttendeesEvent.id)
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-emerald-500"
                >
                  <Download className="w-4 h-4" />
                  <span>📥 Export to CSV / Google Sheets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewAttendeesEvent(null)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search & Filter Subbar */}
            <div className="p-4 bg-purple-50/60 border-b border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search attendee by name, phone, email, institution..."
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                />
              </div>

              <div className="text-xs font-semibold text-purple-900">
                Showing{' '}
                {
                  getAttendeesForEvent(viewAttendeesEvent.id).filter((a) => {
                    const q = attendeeSearch.toLowerCase();
                    return (
                      !q ||
                      a.fullName.toLowerCase().includes(q) ||
                      (a.phone && a.phone.toLowerCase().includes(q)) ||
                      (a.email && a.email.toLowerCase().includes(q)) ||
                      (a.schoolOrInstitution && a.schoolOrInstitution.toLowerCase().includes(q)) ||
                      (a.customQuestionAnswer && a.customQuestionAnswer.toLowerCase().includes(q))
                    );
                  }).length
                }{' '}
                of {getAttendeesForEvent(viewAttendeesEvent.id).length} Attendees
              </div>
            </div>

            {/* Attendees Table Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              {getAttendeesForEvent(viewAttendeesEvent.id).length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto" />
                  <h4 className="text-base font-bold text-gray-800">No Attendees Registered Yet</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    When visitors register for this event on the live website, their details will automatically populate here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-purple-950 text-purple-100 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Attendee Name</th>
                        <th className="p-3">Contact Details</th>
                        <th className="p-3">School / Institution</th>
                        <th className="p-3">T-Shirt</th>
                        <th className="p-3">Emergency Contact</th>
                        <th className="p-3">Custom Answer</th>
                        <th className="p-3">Reg. Date</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {getAttendeesForEvent(viewAttendeesEvent.id)
                        .filter((a) => {
                          const q = attendeeSearch.toLowerCase();
                          return (
                            !q ||
                            a.fullName.toLowerCase().includes(q) ||
                            (a.phone && a.phone.toLowerCase().includes(q)) ||
                            (a.email && a.email.toLowerCase().includes(q)) ||
                            (a.schoolOrInstitution && a.schoolOrInstitution.toLowerCase().includes(q)) ||
                            (a.customQuestionAnswer && a.customQuestionAnswer.toLowerCase().includes(q))
                          );
                        })
                        .map((att) => (
                          <tr key={att.id} className="hover:bg-purple-50/40 transition-colors">
                            <td className="p-3 font-bold text-purple-950">
                              <div>{att.fullName}</div>
                            </td>
                            <td className="p-3 text-gray-700">
                              {att.phone && <div className="font-semibold">{att.phone}</div>}
                              {att.email && <div className="text-[11px] text-gray-500">{att.email}</div>}
                              {!att.phone && !att.email && <span className="text-gray-400 italic">Not collected</span>}
                            </td>
                            <td className="p-3 text-gray-800">
                              {att.schoolOrInstitution || <span className="text-gray-400 italic">Not collected</span>}
                            </td>
                            <td className="p-3">
                              {att.tShirtSize ? (
                                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-extrabold text-[10px] border border-purple-200">
                                  {att.tShirtSize}
                                </span>
                              ) : (
                                <span className="text-gray-400 italic">N/A</span>
                              )}
                            </td>
                            <td className="p-3 text-gray-700">
                              {att.emergencyContact || <span className="text-gray-400 italic">N/A</span>}
                            </td>
                            <td className="p-3 text-gray-700 max-w-xs truncate">
                              {att.customQuestionAnswer || <span className="text-gray-400 italic">N/A</span>}
                            </td>
                            <td className="p-3 text-gray-500 font-medium">
                              {att.registrationDate}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => deleteEventAttendee(att.id)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer transition-colors"
                                title="Remove attendee"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-gray-500 font-medium">
                CSV Export is formatted for Microsoft Excel, Apple Numbers, and Google Sheets.
              </span>
              <button
                type="button"
                onClick={() => setViewAttendeesEvent(null)}
                className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT IMPACT STORY MODAL */}
      {showAddStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-purple-950 font-display">
                    {editingStory ? 'Edit Impact Story' : 'Add New Impact Story'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Publish case studies and field updates on the public website
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddStoryModal(false);
                  setEditingStory(null);
                }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!storyForm.title.trim() || !storyForm.summary.trim() || !storyForm.fullStory.trim()) {
                  alert('Please fill in Title, Short Description, and Full Story.');
                  return;
                }
                if (editingStory) {
                  updateImpactStory(editingStory.id, storyForm);
                } else {
                  addImpactStory(storyForm);
                }
                setShowAddStoryModal(false);
                setEditingStory(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Story Title <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessore School Anti-Harassment Campaign Success"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Category Tag <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SCHOOL CAMPAIGN, CASE RESOLUTION"
                    value={storyForm.category}
                    onChange={(e) => setStoryForm({ ...storyForm, category: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['SCHOOL CAMPAIGN', 'CASE RESOLUTION', 'COMMUNITY OUTREACH', 'LEGAL ADVOCACY'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setStoryForm({ ...storyForm, category: cat })}
                        className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-100 px-2 py-0.5 rounded-md font-bold cursor-pointer"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Location <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessore, Bangladesh"
                    value={storyForm.location}
                    onChange={(e) => setStoryForm({ ...storyForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Short Description (Card Snippet) <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief summary displayed on the card preview..."
                  value={storyForm.summary}
                  onChange={(e) => setStoryForm({ ...storyForm, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Full Story Content / Read More Narrative <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Detailed narrative describing the initiative, actions taken, and impact achieved..."
                  value={storyForm.fullStory}
                  onChange={(e) => setStoryForm({ ...storyForm, fullStory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <ImageUploadField
                label="Featured Image (Upload from device)"
                value={storyForm.image}
                onChange={(base64) => setStoryForm({ ...storyForm, image: base64 })}
                helpText="Upload a high-resolution photograph (PNG, JPG, WEBP) converted to local Base64 storage"
              />

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStoryModal(false);
                    setEditingStory(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs uppercase cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingStory ? 'Save Changes' : 'Publish Story'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROVISION NEW USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newUserEmail.trim()) {
                alert('Please enter a valid Gmail / Email address.');
                return;
              }
              const cleanEmail = newUserEmail.trim().toLowerCase();
              const prefix = cleanEmail.split('@')[0] || 'Staff';
              const derivedName = prefix
                .split(/[._-]+/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              const fullName = derivedName || 'Staff Member';

              const res = registerUser(fullName, cleanEmail, 'staff123', 'staff');
              if (res.success) {
                setShowAddUserModal(false);
                setNewUserEmail('');
              } else {
                alert(res.message || 'Error creating account.');
              }
            }}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-purple-200 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-purple-950 font-display">
                  Provision New Account
                </h3>
                <p className="text-xs text-gray-500">Provide a Gmail address to grant staff access</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                EMAIL ADDRESS <span className="text-rose-600">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. admin@gmail.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1 font-medium">
                The account will automatically be granted Staff privileges for instant login access.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
