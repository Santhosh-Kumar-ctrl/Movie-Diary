import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      supabase?: SupabaseClient;
    }
  }
}
