import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qxsimkcjhpewyyyhrsbg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_51P0erS9FfyNqt_Jailbuw_QiRkZ7e-";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
