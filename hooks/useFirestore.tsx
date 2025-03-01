import { useState } from 'react';
import { db } from '../utils/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user profile data
  const getUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        };
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error getting user profile:', err);
      setError('Failed to load profile data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userId: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create new user profile
  const createUserProfile = async (userId: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      await setDoc(doc(db, 'users', userId), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (err) {
      console.error('Error creating user profile:', err);
      setError('Failed to create profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getUserProfile,
    updateUserProfile,
    createUserProfile
  };
}; 