import { User, SubscriptionTier } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Aisha',
    age: 26,
    bio: 'Med student with a passion for helping others. I love reading, traveling, and trying new foods. Looking for someone who shares my values and ambitions.',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    location: 'London, UK',
    gender: 'female',
    educationLevel: 'Medical School',
    occupation: 'Medical Student',
    religiousCommitment: 'Practicing',
    islamicTradition: 'Sunni',
    prayerFrequency: 'five_daily',
    interests: ['Reading', 'Travel', 'Cooking'],
    onboardingCompleted: true,
    preferences: {
      ageRange: {
        min: 25,
        max: 35,
      },
      distance: 25,
      religiousCommitment: ['Practicing', 'Very Practicing'],
    },
  },
  {
    id: '2',
    name: 'Yusuf',
    age: 28,
    bio: 'Software engineer by day, amateur chef by night. I enjoy hiking, reading, and deep conversations about life and faith.',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Birmingham, UK',
    gender: 'male',
    educationLevel: 'Masters',
    occupation: 'Software Engineer',
    religiousCommitment: 'Practicing',
    islamicTradition: 'Sunni',
    prayerFrequency: 'most_daily',
    interests: ['Hiking', 'Cooking', 'Technology'],
    onboardingCompleted: true,
    preferences: {
      ageRange: {
        min: 23,
        max: 30,
      },
      distance: 50,
      religiousCommitment: ['Moderately Practicing', 'Practicing'],
    },
  },
  {
    id: '3',
    name: 'Fatima',
    age: 25,
    bio: 'Elementary school teacher who loves children, art, and the outdoors. Looking for someone kind, respectful, and family-oriented.',
    photos: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Manchester, UK',
    gender: 'female',
    educationLevel: 'Bachelors',
    occupation: 'Teacher',
    religiousCommitment: 'Moderately Practicing',
    islamicTradition: 'Sufi',
    prayerFrequency: 'friday',
    interests: ['Art', 'Outdoors', 'Teaching'],
    onboardingCompleted: true,
    preferences: {
      ageRange: {
        min: 25,
        max: 33,
      },
      distance: 30,
      religiousCommitment: ['Moderately Practicing', 'Practicing'],
    },
  },
  {
    id: '4',
    name: 'Ahmed',
    age: 30,
    bio: 'Doctor working in public health. I enjoy playing basketball, volunteering, and exploring new places. Looking for someone with similar values.',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Leeds, UK',
    gender: 'male',
    educationLevel: 'Medical Degree',
    occupation: 'Doctor',
    religiousCommitment: 'Very Practicing',
    islamicTradition: 'Hanafi',
    prayerFrequency: 'five_daily',
    interests: ['Basketball', 'Volunteering', 'Travel'],
    onboardingCompleted: true,
    preferences: {
      ageRange: {
        min: 25,
        max: 32,
      },
      distance: 40,
      religiousCommitment: ['Practicing', 'Very Practicing'],
    },
  },
  {
    id: '5',
    name: 'Layla',
    age: 27,
    bio: 'Architect with a love for design, photography, and coffee. I enjoy quiet evenings reading and exploring art galleries on weekends.',
    photos: [
      'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Edinburgh, UK',
    gender: 'female',
    educationLevel: 'Masters',
    occupation: 'Architect',
    religiousCommitment: 'Moderately Practicing',
    islamicTradition: 'Non-denominational',
    prayerFrequency: 'some_daily',
    interests: ['Design', 'Photography', 'Art'],
    onboardingCompleted: true,
    preferences: {
      ageRange: {
        min: 27,
        max: 37,
      },
      distance: 50,
      religiousCommitment: ['Moderately Practicing', 'Practicing'],
    },
  },
];

export const mockMatches = [
  {
    id: 'm1',
    userId: 'current_user',
    matchedUserId: '1',
    timestamp: Date.now() - 3600000 * 24 * 2, // 2 days ago
  },
  {
    id: 'm2',
    userId: 'current_user',
    matchedUserId: '3',
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
  },
  {
    id: 'm3',
    userId: 'current_user',
    matchedUserId: '5',
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
  },
];

export const mockMessages = [
  {
    id: 'msg1',
    matchId: 'm1',
    senderId: '1',
    content: 'Hi there! I saw that you like hiking too. What are some of your favorite trails?',
    timestamp: Date.now() - 3600000 * 24 * 2, // 2 days ago
    read: true,
  },
  {
    id: 'msg2',
    matchId: 'm1',
    senderId: 'current_user',
    content: 'Hello! I love hiking in the Peak District. Have you been there?',
    timestamp: Date.now() - 3600000 * 24 * 2 + 900000, // 15 mins after
    read: true,
  },
  {
    id: 'msg3',
    matchId: 'm1',
    senderId: '1',
    content: 'Yes, I have! It\'s beautiful there. We should go sometime if we get along well :)',
    timestamp: Date.now() - 3600000 * 24 * 2 + 1800000, // 30 mins after
    read: true,
  },
  {
    id: 'msg4',
    matchId: 'm2',
    senderId: '3',
    content: 'Salaam! How are you doing today?',
    timestamp: Date.now() - 3600000 * 12, // 12 hours ago
    read: true,
  },
  {
    id: 'msg5',
    matchId: 'm3',
    senderId: '5',
    content: 'Hi! I noticed you like coffee too. What\'s your favorite coffee shop in the city?',
    timestamp: Date.now() - 3600000, // 1 hour ago
    read: false,
  },
];

export const currentUser: User = {
  id: 'current_user',
  name: 'Omar',
  age: 29,
  bio: 'Software developer who loves hiking, reading, and photography. Looking for someone who shares my faith and values.',
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ],
  location: 'London, UK',
  gender: 'male',
  educationLevel: 'Masters',
  occupation: 'Software Developer',
  religiousCommitment: 'Practicing',
  islamicTradition: 'Sunni',
  prayerFrequency: 'most_daily',
  interests: ['Hiking', 'Photography', 'Technology'],
  preferences: {
    ageRange: {
      min: 24,
      max: 32,
    },
    distance: 50,
    religiousCommitment: ['Moderately Practicing', 'Practicing', 'Very Practicing'],
  },
  onboardingCompleted: true,
  subscriptionTier: SubscriptionTier.FREE,
};

// Users who liked the current user but haven't matched yet (for Sapphire tier)
export const mockLikes = [
  {
    id: 'like1',
    userId: '2',  // Yusuf
    targetUserId: 'current_user',
    timestamp: Date.now() - 3600000 * 24 * 1, // 1 day ago
  },
  {
    id: 'like2',
    userId: '4',  // Ahmed
    targetUserId: 'current_user',
    timestamp: Date.now() - 3600000 * 12, // 12 hours ago
  }
];