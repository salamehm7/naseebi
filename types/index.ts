// User-related types
export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  location: string;
  gender: 'male' | 'female';
  educationLevel?: string;
  occupation?: string;
  religiousCommitment?: string;
  islamicTradition?: string;
  prayerFrequency?: string;
  interests?: string[];
  preferences?: UserPreferences;
  onboardingCompleted: boolean;
  subscriptionTier?: SubscriptionTier;
}

export interface UserPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  distance: number;
  religiousCommitment?: string[];
  educationLevel?: string[];
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  timestamp: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

// Onboarding questions
export interface OnboardingQuestion {
  id: string;
  question: string;
  options?: string[];
  type: 'text' | 'select' | 'multiselect' | 'slider' | 'photo';
  required: boolean;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Subscription types
export enum SubscriptionTier {
  FREE = 'FREE',
  PLUS = 'PLUS',
  SAPPHIRE = 'SAPPHIRE'
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: SubscriptionFeature[];
  color: string;
  storeProductIds: {
    ios?: string;
    android?: string;
  };
}

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  isPopular?: boolean;
}