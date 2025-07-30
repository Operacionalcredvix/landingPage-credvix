import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://czgyhiwermtezvbktozv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Z3loaXdlcm10ZXp2Ymt0b3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTM1MDgsImV4cCI6MjA2OTM4OTUwOH0.vb7LlQVxNrLzNTwXJoejfuABWTpkro4cPOzVwyTAloE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});