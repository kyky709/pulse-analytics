'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import type { Profile } from '@/types';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

const supabase = createClient();

export function useAuth() {
  const router = useRouter();
  const { user, profile, loading, setUser, setProfile, setLoading, reset } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (data && isMounted) {
          setProfile(data as Profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error) {
          if (error.name !== 'AuthSessionMissingError') {
            console.error('Auth error:', error);
          }
          setLoading(false);
          return;
        }

        if (user) {
          setUser({ id: user.id, email: user.email!, created_at: user.created_at });
          await fetchProfile(user.id);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AuthSessionMissingError') {
          console.error('Error getting user:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
          });
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          reset();
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, setLoading, reset]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    router.push('/dashboard');
  };

  const signup = async (email: string, password: string, fullName: string): Promise<{ confirmEmail: boolean }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        role: 'user',
      });
    }

    // If no session, email confirmation is required
    if (data.user && !data.session) {
      return { confirmEmail: true };
    }

    router.push('/dashboard');
    return { confirmEmail: false };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    reset();
    router.push('/login');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    setProfile({ ...profile!, ...updates });
  };

  return {
    user,
    profile,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };
}
