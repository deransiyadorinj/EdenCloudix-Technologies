'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';

export interface AuthUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signInWithGoogle: () => Promise<AuthUserProfile | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirebaseConfigured: false,
  signInWithGoogle: async () => null,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. If Firebase Auth is configured and initialized, listen to its auth state
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser) {
          const profile: AuthUserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          setUser(profile);

          // Sync with server session
          try {
            await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                picture: firebaseUser.photoURL,
              }),
            });
          } catch {
            // ignore
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }

    // 2. Fallback: check server session if Firebase keys are not yet configured in .env
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser({
            uid: 'client-' + data.user.email,
            email: data.user.email,
            displayName: data.user.name,
            photoURL: data.user.picture || null,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const signInWithGoogle = async (): Promise<AuthUserProfile | null> => {
    setLoading(true);

    // If Firebase is configured with API keys in .env, run standard Firebase Google Sign-In popup!
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const profile: AuthUserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
        };
        setUser(profile);

        // Sync with server
        await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: fbUser.email,
            name: fbUser.displayName,
            picture: fbUser.photoURL,
          }),
        });

        return profile;
      } catch (err: any) {
        console.error('Firebase Google Sign-In error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    }

    // Seamless instant fallback if user hasn't added their Firebase API keys yet
    try {
      const demoEmail = 'dorin@gmail.com';
      const demoName = 'Deran S';
      const demoPhoto = 'https://lh3.googleusercontent.com/a/default-user=s96-c';

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: demoEmail,
          name: demoName,
          picture: demoPhoto,
        }),
      });

      const data = await res.json();
      const profile: AuthUserProfile = {
        uid: 'client-' + demoEmail,
        email: demoEmail,
        displayName: demoName,
        photoURL: demoPhoto,
      };
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch {
        // ignore
      }
    }
    await fetch('/api/auth/google', { method: 'DELETE' });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
