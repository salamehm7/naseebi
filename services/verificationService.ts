import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../utils/firebase';

// This is a placeholder for your actual selfie verification API
// Replace with your chosen API implementation
const analyzeSelfie = async (selfieUri: string, profilePhotos: string[]) => {
  try {
    // Simulate API call to a face recognition service
    // In a real implementation, you would:
    // 1. Send the selfie to your face recognition API
    // 2. Compare it with the user's profile photos
    // 3. Get a confidence score or match result
    
    // For now, we'll simulate a 70% success rate
    const isMatch = Math.random() > 0.3;
    
    return {
      success: true,
      isMatch,
      confidence: isMatch ? Math.random() * 30 + 70 : Math.random() * 60,
      // Additional metadata from the API would go here
    };
  } catch (error) {
    console.error('Error analyzing selfie:', error);
    return { success: false, error };
  }
};

export const verifySelfie = async (userId: string, selfieUri: string, profilePhotos: string[]) => {
  try {
    // Upload selfie to Firebase Storage
    const response = await fetch(selfieUri);
    const blob = await response.blob();
    
    const filename = `verification_${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `verifications/${userId}/${filename}`);
    
    await uploadBytes(storageRef, blob);
    const selfieUrl = await getDownloadURL(storageRef);
    
    // Analyze the selfie
    const analysisResult = await analyzeSelfie(selfieUrl, profilePhotos);
    
    // Update user verification status
    if (analysisResult.success) {
      let verificationStatus;
      let verificationMethod;
      
      if (analysisResult.isMatch && analysisResult.confidence > 85) {
        // High confidence match - auto verify
        verificationStatus = 'verified';
        verificationMethod = 'selfie';
      } else if (analysisResult.isMatch && analysisResult.confidence > 70) {
        // Medium confidence - pending admin review but likely to pass
        verificationStatus = 'pending_review';
        verificationMethod = 'admin';
      } else {
        // Low confidence or no match - needs admin review
        verificationStatus = 'pending_review';
        verificationMethod = 'admin';
      }
      
      await updateDoc(doc(db, 'users', userId), {
        verificationStatus,
        verificationMethod,
        verificationSelfie: selfieUrl,
        verificationTimestamp: serverTimestamp(),
        verificationData: {
          confidence: analysisResult.confidence,
          automated: verificationMethod === 'selfie'
        },
        updatedAt: serverTimestamp()
      });
      
      return {
        success: true,
        verificationStatus,
        automated: verificationMethod === 'selfie',
        needsAdminReview: verificationMethod === 'admin'
      };
    } else {
      return { success: false, error: analysisResult.error };
    }
  } catch (error) {
    console.error('Error verifying selfie:', error);
    return { success: false, error };
  }
};

// For admin to review verification
export const adminReviewVerification = async (userId: string, isApproved: boolean, adminId: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      verificationStatus: isApproved ? 'verified' : 'rejected',
      verificationMethod: 'admin',
      isVerified: isApproved,
      adminReview: {
        adminId,
        timestamp: serverTimestamp(),
        decision: isApproved ? 'approved' : 'rejected'
      },
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error with admin review:', error);
    return { success: false, error };
  }
}; 