import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const { user, session, isLoading, setAuth, clear } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(session?.user ?? null, session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session?.user ?? null, session);
    });

    return () => subscription.unsubscribe();
  }, [setAuth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    clear();
  };

  return { user, session, isLoading, signOut };
}
