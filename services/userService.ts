import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../utils/firebase';
import { Analytics } from '../utils/firebase';

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};

// Listen to real-time profile updates
export const subscribeToUserProfile = (userId: string, callback: (data: any) => void) => {
  const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  }, (error) => {
    console.error('Error listening to profile updates:', error);
  });
  
  return unsubscribe;
};

// Upload profile photo
export const uploadProfilePhoto = async (userId: string, photoUri: string, isMain: boolean = false) => {
  try {
    const response = await fetch(photoUri);
    const blob = await response.blob();
    
    const filename = `${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `profiles/${userId}/${filename}`);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    // Get current user data
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userDoc.data();
    const photos = userData.photos || [];
    
    let updatedPhotos = [...photos, { url: downloadURL, isMain, filename }];
    
    // If this is the main photo and there are other photos, update them
    if (isMain) {
      updatedPhotos = updatedPhotos.map(photo => ({
        ...photo,
        isMain: photo.url === downloadURL
      }));
    } else if (updatedPhotos.length === 1) {
      // If this is the first photo, make it the main one
      updatedPhotos[0].isMain = true;
    }
    
    await updateDoc(doc(db, 'users', userId), {
      photos: updatedPhotos,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, downloadURL, photos: updatedPhotos };
  } catch (error) {
    console.error('Error uploading photo:', error);
    return { success: false, error };
  }
};

// Delete profile photo
export const deleteProfilePhoto = async (userId: string, filename: string) => {
  try {
    // Delete from storage
    const storageRef = ref(storage, `profiles/${userId}/${filename}`);
    await deleteObject(storageRef);
    
    // Update Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userDoc.data();
    let photos = userData.photos || [];
    
    // Find the photo to delete
    const photoToDelete = photos.find(p => p.filename === filename);
    if (!photoToDelete) {
      return { success: false, error: 'Photo not found' };
    }
    
    // Remove the photo
    photos = photos.filter(p => p.filename !== filename);
    
    // If the deleted photo was the main one, set a new main photo
    if (photoToDelete.isMain && photos.length > 0) {
      photos[0].isMain = true;
    }
    
    await updateDoc(doc(db, 'users', userId), {
      photos,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, photos };
  } catch (error) {
    console.error('Error deleting photo:', error);
    return { success: false, error };
  }
};

// Function to update user profile after onboarding
export const completeOnboarding = async (userId: string, profileData: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...profileData,
      onboardingCompleted: true,
      updatedAt: serverTimestamp()
    });
    
    // Track onboarding completion
    await Analytics.logEvent('onboarding_completed', {
      user_id: userId
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return { success: false, error };
  }
}; 