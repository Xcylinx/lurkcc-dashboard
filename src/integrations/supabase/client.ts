// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zcjmjgpbnovsrdbmurnt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjam1qZ3Bibm92c3JkYm11cm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODEwNjgsImV4cCI6MjA1ODU1NzA2OH0.Q3ZpFnrpnveZlKclarZ-7Jg3350QOtvziXyYPooaZr8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);