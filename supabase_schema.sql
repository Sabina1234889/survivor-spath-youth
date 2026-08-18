-- ==============================================================================
-- Survivor's Path Youth - Supabase PostgreSQL Database Setup
-- Project URL: https://yymxwnemlacchshjrmco.supabase.co
-- Run this SQL in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Site Content & General Settings
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  location TEXT,
  "targetAudience" TEXT,
  "shortDescription" TEXT,
  "fullDescription" TEXT,
  "isFeatured" BOOLEAN DEFAULT FALSE,
  image TEXT,
  highlights TEXT[],
  status TEXT DEFAULT 'upcoming',
  "whatsappGroupLink" TEXT,
  "registrationFields" JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Event Attendees Table
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id TEXT PRIMARY KEY,
  "eventId" TEXT,
  "eventTitle" TEXT,
  "registrationDate" TEXT,
  "fullName" TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  "schoolOrInstitution" TEXT,
  "tShirtSize" TEXT,
  "emergencyContact" TEXT,
  "customQuestionAnswer" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Programs Table
CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,
  number INT,
  title TEXT NOT NULL,
  "shortDescription" TEXT,
  "fullDescription" TEXT,
  image TEXT,
  "keyObjectives" TEXT[],
  "targetAudience" TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  category TEXT,
  categories TEXT[],
  image TEXT,
  bio TEXT,
  division TEXT,
  district TEXT,
  institution TEXT,
  email TEXT,
  linkedin TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Partners Table
CREATE TABLE IF NOT EXISTS public.partners (
  name TEXT PRIMARY KEY,
  logo TEXT NOT NULL,
  url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Complaints (Confidential Whistleblower Box)
CREATE TABLE IF NOT EXISTS public.complaints (
  id TEXT PRIMARY KEY,
  "dateSubmitted" TEXT,
  category TEXT,
  subject TEXT,
  description TEXT,
  "fullName" TEXT,
  "emailOrPhone" TEXT,
  institution TEXT,
  division TEXT,
  district TEXT,
  "attachmentName" TEXT,
  "attachmentUrl" TEXT,
  status TEXT DEFAULT 'Pending',
  "urgencyLevel" TEXT DEFAULT 'Standard',
  "adminNotes" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Inbox (Contact & Program Applications)
CREATE TABLE IF NOT EXISTS public.inbox (
  id TEXT PRIMARY KEY,
  "dateSubmitted" TEXT,
  category TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  "subjectOrRole" TEXT,
  "organizationOrSchool" TEXT,
  "districtOrLocation" TEXT,
  message TEXT,
  status TEXT DEFAULT 'New',
  "adminNotes" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Impact Stories
CREATE TABLE IF NOT EXISTS public.impact_stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  location TEXT,
  summary TEXT,
  "fullStory" TEXT,
  image TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Users & RBAC
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. System Settings & Team Categories
CREATE TABLE IF NOT EXISTS public.system_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Enable Row Level Security (RLS) & Allow Read/Write Policies
-- ==============================================================================
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Public read and write policies for anonymous client operations
DO $$ 
BEGIN
  CREATE POLICY "Public Read Access site_content" ON public.site_content FOR SELECT USING (true);
  CREATE POLICY "Public Write Access site_content" ON public.site_content FOR ALL USING (true);
  
  CREATE POLICY "Public Read Access events" ON public.events FOR SELECT USING (true);
  CREATE POLICY "Public Write Access events" ON public.events FOR ALL USING (true);

  CREATE POLICY "Public Read Access event_attendees" ON public.event_attendees FOR SELECT USING (true);
  CREATE POLICY "Public Write Access event_attendees" ON public.event_attendees FOR ALL USING (true);

  CREATE POLICY "Public Read Access programs" ON public.programs FOR SELECT USING (true);
  CREATE POLICY "Public Write Access programs" ON public.programs FOR ALL USING (true);

  CREATE POLICY "Public Read Access team_members" ON public.team_members FOR SELECT USING (true);
  CREATE POLICY "Public Write Access team_members" ON public.team_members FOR ALL USING (true);

  CREATE POLICY "Public Read Access partners" ON public.partners FOR SELECT USING (true);
  CREATE POLICY "Public Write Access partners" ON public.partners FOR ALL USING (true);

  CREATE POLICY "Public Read Access complaints" ON public.complaints FOR SELECT USING (true);
  CREATE POLICY "Public Write Access complaints" ON public.complaints FOR ALL USING (true);

  CREATE POLICY "Public Read Access inbox" ON public.inbox FOR SELECT USING (true);
  CREATE POLICY "Public Write Access inbox" ON public.inbox FOR ALL USING (true);

  CREATE POLICY "Public Read Access impact_stories" ON public.impact_stories FOR SELECT USING (true);
  CREATE POLICY "Public Write Access impact_stories" ON public.impact_stories FOR ALL USING (true);

  CREATE POLICY "Public Read Access users" ON public.users FOR SELECT USING (true);
  CREATE POLICY "Public Write Access users" ON public.users FOR ALL USING (true);

  CREATE POLICY "Public Read Access system_settings" ON public.system_settings FOR SELECT USING (true);
  CREATE POLICY "Public Write Access system_settings" ON public.system_settings FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Enable Realtime publication for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.events, public.complaints, public.inbox;
