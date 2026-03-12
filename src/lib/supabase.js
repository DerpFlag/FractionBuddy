import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kmxkkojjgokbefnhjjoc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtteGtrb2pqZ29rYmVmbmhqam9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzM5MzIsImV4cCI6MjA4ODg0OTkzMn0.FQwAEv2AFQF8Gd6IBeEFxNaAvlPJMxNFndG6g_2v3IE';

export const supabase = createClient(supabaseUrl, supabaseKey);
