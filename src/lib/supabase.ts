
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = 'https://wwcxkxsajshvnuezlucj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y3hreHNhanNodm51ZXpsdWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTYxNTQsImV4cCI6MjA1OTk3MjE1NH0.ITcCA8HgzTP7uVFIUxlJyVHmxBgbq3zXebRxKw_tDsU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export default supabase;
