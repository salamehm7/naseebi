import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, Analytics } from '../utils/firebase';

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
  age?: number;
  gender?: string;
}

export async function signUp(data: SignUpData) {
  try {
    console.log('Starting signup process', data);
    
    // Use real Firebase auth
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    console.log('User created in Auth:', userCredential.user.uid);
    
    // Set display name if provided
    if (data.name) {
      await updateProfile(userCredential.user, {
        displayName: data.name
      });
    }
    
    // Create user document in Firestore
    // Add required fields with default values to avoid undefined
    const userData = {
      uid: userCredential.user.uid,
      email: data.email,
      name: data.name || data.email.split('@')[0],
      createdAt: serverTimestamp(),
      onboardingCompleted: false,
      // Add these default fields to prevent errors later
      interests: [],
      photos: [],
      preferences: {
        ageMin: 18,
        ageMax: 50,
        distance: 50,
        genders: ['female', 'male']
      },
      isVerified: false,
      verificationStatus: 'pending'
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    console.log('User document created in Firestore');
    
    // Track signup with analytics - wrap in try/catch to prevent errors
    try {
      await Analytics.logEvent('sign_up', {
        method: 'email'
      });
    } catch (analyticsError) {
      console.warn('Analytics error (non-critical):', analyticsError);
      // Continue since analytics errors shouldn't block signup
    }
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error };
  }
}

export async function loginWithEmail(email: string, password: string) {
  try {
    console.log('Attempting login with email:', email);
    
    // Use real Firebase auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful for user:', userCredential.user.uid);
    
    // Track login with analytics - wrap in try/catch to prevent errors
    try {
      await Analytics.logEvent('login', {
        method: 'email'
      });
    } catch (analyticsError) {
      console.warn('Analytics error during login (non-critical):', analyticsError);
      // Continue since analytics errors shouldn't block login
    }
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error };
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error };
  }
} 