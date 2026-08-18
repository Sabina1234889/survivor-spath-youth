import {
  FaqItem,
} from '../types';

export const OFFICIAL_STATS: { value: string; label: string; description: string }[] = [];

export const FOCUS_AREAS = [
  {
    title: 'Youth Empowerment',
    description: 'Building self-advocacy, confidence, and leadership among high school and university students.',
    iconName: 'Sparkles',
  },
  {
    title: 'Education & Awareness',
    description: 'Conducting rights education, consent awareness, and preventative workshops in academic institutions.',
    iconName: 'GraduationCap',
  },
  {
    title: 'Mental Wellness',
    description: 'Providing trauma-informed psychological counseling, healing circles, and emotional support networks.',
    iconName: 'HeartHandshake',
  },
  {
    title: 'Leadership Development',
    description: 'Training youth ambassadors to organize community campaigns and spearhead anti-violence initiatives.',
    iconName: 'Users',
  },
  {
    title: 'Innovation & Technology',
    description: 'Leveraging digital platforms, safe reporting tech, and social media for widespread positive impact.',
    iconName: 'Lightbulb',
  },
  {
    title: 'Safe & Inclusive Communities',
    description: 'Creating gender-inclusive, supportive spaces where every young voice is respected and believed.',
    iconName: 'ShieldCheck',
  },
];

export const CORE_VALUES = [
  {
    title: 'Empathy & Respect',
    description: 'We listen with deep compassion, honoring individual lived experiences with dignity and zero judgment.',
  },
  {
    title: 'Justice & Accountability',
    description: 'We actively pursue legal reform and institutional accountability to break cycles of impunity.',
  },
  {
    title: 'Inclusivity & Intersectionality',
    description: 'We welcome young people of all gender identities, socio-economic backgrounds, and regions across Bangladesh.',
  },
  {
    title: 'Survivor-Centered Approach',
    description: 'Survivors drive our advocacy; their autonomy, safety, choices, and privacy remain our highest priority.',
  },
  {
    title: 'Transparency & Integrity',
    description: 'We uphold the highest ethical standards, governance, and financial stewardship across all youth initiatives.',
  },
];

export const OBJECTIVES = [
  'To raise awareness about sexual violence through campaigns, workshops, and media.',
  'To provide legal and psychological support to survivors.',
  'To collaborate with institutions and policymakers for systemic change.',
  'To create safe spaces and support networks for survivors.',
  'To conduct research and publish data on gender-based violence.',
];

export const KEY_ACTIVITIES = [
  {
    title: 'Legal Aid & Counseling',
    description: 'Free legal consultation, court support, and trauma-informed therapy tailored for young survivors and families.',
    iconName: 'Scale',
  },
  {
    title: 'Awareness Campaigns',
    description: 'Online and offline campaigns, rallies, art activism, and school awareness initiatives breaking the silence.',
    iconName: 'Megaphone',
  },
  {
    title: 'Educational Programs',
    description: 'School and college-based education, gender training, consent workshops, and safety awareness activities.',
    iconName: 'BookOpen',
  },
  {
    title: 'Community Outreach',
    description: 'Workshops in underserved communities, sub-districts, and rural areas to democratize rights education.',
    iconName: 'MapPin',
  },
  {
    title: 'Policy Advocacy',
    description: 'Engaging lawmakers, law enforcement, and institutional stakeholders for legal and administrative reforms.',
    iconName: 'FileText',
  },
  {
    title: 'Survivor Support Circle',
    description: 'Confidential, moderated peer support groups, creative therapy sessions, and community healing circles.',
    iconName: 'UsersCheck',
  },
];

export const DEFAULT_TEAM_CATEGORIES: string[] = [
  'Founder',
  'Chief Advisor',
  'Human Resources',
  'Core Team',
  'Program Team',
  'PR & Sponsorship Team',
  'Volunteers',
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'GENERAL',
    question: 'What is Survivor’s Path Youth?',
    answer: 'Survivor’s Path Youth is a youth-led initiative of Survivor’s Path dedicated to empowering young people, raising awareness against sexual violence, providing legal and psychological support, and fostering safe, inclusive educational environments across Bangladesh.',
  },
  {
    id: 'faq-2',
    category: 'GENERAL',
    question: 'Who can participate in Survivor’s Path Youth programs?',
    answer: 'Our programs are open to school students, college and university youth, educators, parents, community members, and any individual interested in social advocacy, youth empowerment, and gender safety.',
  },
  {
    id: 'faq-3',
    category: 'GENERAL',
    question: 'What types of programs do you organize?',
    answer: 'We organize school awareness campaigns, youth leadership bootcamps, mental wellness workshops, legal literacy sessions, community outreach meetings, and youth conferences.',
  },
  {
    id: 'faq-4',
    category: 'EVENTS',
    question: 'How can I participate in an upcoming event or workshop?',
    answer: 'You can register online directly through our Events page by clicking the "Register Now" button on any upcoming event card. Registration is free and open to students and young advocates.',
  },
  {
    id: 'faq-5',
    category: 'EVENTS',
    question: 'How can my school or college collaborate for an event?',
    answer: 'School authorities or student clubs can submit a School Collaboration request via our "Get Involved" page or Contact form. Our program team will coordinate with your administration to deliver tailored awareness sessions.',
  },
  {
    id: 'faq-6',
    category: 'EVENTS',
    question: 'Are there registration fees for youth events?',
    answer: 'No, almost all Survivor’s Path Youth workshops, awareness sessions, and festivals are free of cost to ensure open access for all young people.',
  },
  {
    id: 'faq-7',
    category: 'VOLUNTEERING',
    question: 'How can I become a volunteer with Survivor’s Path Youth?',
    answer: 'You can apply through the "Get Involved" page under the Volunteer section. We welcome students and young professionals who are passionate about human rights, event management, content creation, or community outreach.',
  },
  {
    id: 'faq-8',
    category: 'VOLUNTEERING',
    question: 'What volunteer opportunities and roles are available?',
    answer: 'Volunteers can serve as Campus Ambassadors, Event Logistics Crew, Content & Social Media Creators, Peer Facilitators, or Outreach Coordinators.',
  },
  {
    id: 'faq-9',
    category: 'PARTNERSHIP',
    question: 'How can an organization partner with Survivor’s Path Youth?',
    answer: 'We collaborate with local and international NGOs, human rights organizations, legal aid societies, and educational boards. Please reach out through our Contact page or Get Involved -> Partner With Us form.',
  },
  {
    id: 'faq-10',
    category: 'PARTNERSHIP',
    question: 'How can corporate sponsors support an event?',
    answer: 'Corporations can sponsor event zones, provide student gift packs, support educational literature publishing, or sponsor venue facilities for our youth programs and summits. Contact our PR & Sponsorship team for custom partnership decks.',
  },
  {
    id: 'faq-11',
    category: 'COMPLAINT BOX',
    question: 'How does the Complaint Box work?',
    answer: 'The Complaint Box provides a safe, confidential digital form where anyone can submit concerns regarding misconduct, safety issues, harassment, or program feedback. Submissions are reviewed directly by our safeguarding team.',
  },
  {
    id: 'faq-12',
    category: 'COMPLAINT BOX',
    question: 'Is my information completely confidential?',
    answer: 'Yes. Providing your name, phone number, or institution is strictly optional. All submissions are treated with utmost respect, confidentiality, and sensitivity.',
  },
];

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
] as const;

export type DivisionName = typeof BANGLADESH_DIVISIONS[number];

export const BANGLADESH_DISTRICTS: Record<string, string[]> = {
  Dhaka: [
    'Dhaka',
    'Faridpur',
    'Gazipur',
    'Gopalganj',
    'Kishoreganj',
    'Madaripur',
    'Manikganj',
    'Munshiganj',
    'Narayanganj',
    'Narsingdi',
    'Rajbari',
    'Shariatpur',
    'Tangail',
  ],
  Chattogram: [
    'Bandarban',
    'Brahmanbaria',
    'Chandpur',
    'Chattogram',
    'Cox\'s Bazar',
    'Cumilla',
    'Feni',
    'Khagrachhari',
    'Lakshmipur',
    'Noakhali',
    'Rangamati',
  ],
  Rajshahi: [
    'Bogura',
    'Joypurhat',
    'Naogaon',
    'Natore',
    'Chapainawabganj',
    'Pabna',
    'Rajshahi',
    'Sirajganj',
  ],
  Khulna: [
    'Bagerhat',
    'Chuadanga',
    'Jessore',
    'Jhenaidah',
    'Khulna',
    'Kushtia',
    'Magura',
    'Meherpur',
    'Narail',
    'Satkhira',
  ],
  Barishal: [
    'Barguna',
    'Barishal',
    'Bhola',
    'Jhalokathi',
    'Patuakhali',
    'Pirojpur',
  ],
  Sylhet: [
    'Habiganj',
    'Moulvibazar',
    'Sunamganj',
    'Sylhet',
  ],
  Rangpur: [
    'Dinajpur',
    'Gaibandha',
    'Kurigram',
    'Lalmonirhat',
    'Nilphamari',
    'Panchagarh',
    'Rangpur',
    'Thakurgaon',
  ],
  Mymensingh: [
    'Jamalpur',
    'Mymensingh',
    'Netrokona',
    'Sherpur',
  ],
};
