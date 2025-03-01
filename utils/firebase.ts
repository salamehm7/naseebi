import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { useState, useEffect } from 'react';
import * as Analytics from 'expo-firebase-analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzIdC6RaaDARCTtXMTLnykOv7gjeluE3A",
  authDomain: "naseebi-41738.firebaseapp.com",
  projectId: "naseebi-41738",
  storageBucket: "naseebi-41738.appspot.com",
  messagingSenderId: "900581753341",
  appId: "1:900581753341:web:98e000e539de38bd749994",
  measurementId: "G-Y2YVKVP0ML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export real Firebase services
export { app, auth, db, storage, Analytics };

// Real useAuth hook implementation
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}

// Re-export Firebase functions for direct usage
export {
  doc,
  collection,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore'; 