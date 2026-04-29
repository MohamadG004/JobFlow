import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@/types';
import { authService } from '@/services/authService';
import { supabase } from '@/services/supabase';

interface AuthContextValue {
  user: User | null;
  guestMode: boolean;
  loading: boolean;
  avatarUrl: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  enterGuestMode: () => void;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAccount: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const GUEST_USER: User = { id: 'guest', email: 'Guest', username: 'Guest' };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedGuest = sessionStorage.getItem('jobflow-guest') === 'true';
    if (savedGuest) {
      setUser(GUEST_USER);
      setGuestMode(true);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          username: session.user.user_metadata?.username,
        });
        setAvatarUrl(session.user.user_metadata?.avatar_url ?? null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          username: session.user.user_metadata?.username,
        });
        setAvatarUrl(session.user.user_metadata?.avatar_url ?? null);
        setGuestMode(false);
        sessionStorage.removeItem('jobflow-guest');
      } else {
        setUser(null);
        setAvatarUrl(null);
        setGuestMode(false);
        sessionStorage.removeItem('jobflow-guest');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setGuestMode(false);
    sessionStorage.removeItem('jobflow-guest');
    const data = await authService.signIn(email, password);

    if (data.session?.user) {
      setUser({
        id: data.session.user.id,
        email: data.session.user.email ?? '',
        username: data.session.user.user_metadata?.username,
      });
      setAvatarUrl(data.session.user.user_metadata?.avatar_url ?? null);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    setGuestMode(false);
    sessionStorage.removeItem('jobflow-guest');
    await authService.signUp(email, password, username);
  }, []);

  const signOut = useCallback(async () => {
    if (guestMode) {
      setUser(null);
      setAvatarUrl(null);
      setGuestMode(false);
      sessionStorage.removeItem('jobflow-guest');
      return;
    }
    await authService.signOut();
    setUser(null);
    setAvatarUrl(null);
    setGuestMode(false);
    sessionStorage.removeItem('jobflow-guest');
  }, [guestMode]);

  const resetPassword = useCallback(async (email: string) => {
    await authService.resetPassword(email);
  }, []);

  const enterGuestMode = useCallback(() => {
    setUser(GUEST_USER);
    setGuestMode(true);
    sessionStorage.setItem('jobflow-guest', 'true');
    setLoading(false);
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!user || guestMode) throw new Error('Must be signed in to upload an avatar');
    const url = await authService.uploadAvatar(file, user.id);
    setAvatarUrl(url);
  }, [user, guestMode]);

  const deleteAccount = useCallback(async () => {
    if (!user || guestMode) throw new Error('Must be signed in to delete account');
    await authService.deleteAccount(user.id);
    setUser(null);
    setAvatarUrl(null);
    setGuestMode(false);
    sessionStorage.removeItem('jobflow-guest');
  }, [user, guestMode]);

    const updatePassword = useCallback(async (newPassword: string) => {
    await authService.updatePassword(newPassword);
  }, []);

  const updateUsername = useCallback(async (username: string) => {
    await authService.updateUsername(username);
    setUser((prev) => prev ? { ...prev, username } : prev);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setGuestMode(false);
    sessionStorage.removeItem('jobflow-guest');
    await authService.signInWithGoogle();
  }, []);

  return (
    <AuthContext.Provider value={{
      user, guestMode, loading, avatarUrl,
      signIn, signUp, signOut, resetPassword, updatePassword, updateUsername,
      enterGuestMode, uploadAvatar, deleteAccount, signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};