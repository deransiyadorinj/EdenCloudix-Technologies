import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

// Explicit direct environment references for Next.js build-time inlining
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Production requires apiKey, authDomain, and projectId
export const isFirebaseConfigured: boolean = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export function initFirebase(): {
  app: FirebaseApp | null;
  auth: Auth | null;
  googleProvider: GoogleAuthProvider | null;
} {
  if (typeof window === 'undefined') {
    return { app: null, auth: null, googleProvider: null };
  }

  if (!isFirebaseConfigured) {
    return { app: null, auth: null, googleProvider: null };
  }

  try {
    if (!app) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    }
    if (!auth && app) {
      auth = getAuth(app);
    }
    if (!googleProvider) {
      googleProvider = new GoogleAuthProvider();
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      googleProvider.setCustomParameters({ prompt: 'select_account' });
    }
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }

  return { app, auth, googleProvider };
}

// Initialize on client load if window is available
if (typeof window !== 'undefined') {
  initFirebase();
  // Safe diagnostic: reports boolean status only, NEVER values or keys
  console.info('[Firebase] Configured:', isFirebaseConfigured);
}

export function getFirebaseAuth(): Auth | null {
  if (!auth && typeof window !== 'undefined' && isFirebaseConfigured) {
    initFirebase();
  }
  return auth;
}

export function getGoogleProvider(): GoogleAuthProvider | null {
  if (!googleProvider && typeof window !== 'undefined' && isFirebaseConfigured) {
    initFirebase();
  }
  return googleProvider;
}

export { app, auth, googleProvider };
