import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'placeholder-api-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'placeholder.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'placeholder-project',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'placeholder.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID              || '1:000000000000:web:placeholder',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || 'G-PLACEHOLDER',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth    = getAuth(app);
export const storage = getStorage(app);
export default app;
