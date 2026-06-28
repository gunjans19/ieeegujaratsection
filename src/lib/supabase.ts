import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const dummyHandler: ProxyHandler<any> = {
  get(_target, prop) {
    if (typeof prop === 'string') {
      if (prop === 'auth') {
        return new Proxy({}, dummyHandler);
      }
      if (prop === 'from') {
        return () => new Proxy({}, dummyHandler);
      }
    }
    return () => {
      throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
    };
  }
};

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, dummyHandler) as any;
