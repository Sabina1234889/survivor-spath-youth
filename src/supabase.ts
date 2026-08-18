/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  'https://yymxwnemlacchshjrmco.supabase.co';

export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bXh3bmVtbGFjY2hzaGpybWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjQ2NTQsImV4cCI6MjEwMjY0MDY1NH0.4BnRVzsEZDxGLqBPhQhWsjoE31ZCgvPHif-YgiBVlX4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
