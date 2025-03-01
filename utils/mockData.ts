// Create mock user profiles for testing
export const mockProfiles = [
  {
    id: 'profile-1',
    name: 'Sarah',
    age: 28,
    gender: 'female',
    bio: 'Software engineer who loves hiking and photography',
    photos: [
      { url: 'https://source.unsplash.com/random/400x600?woman=1', isMain: true, filename: 'photo1.jpg' },
      { url: 'https://source.unsplash.com/random/400x600?woman=2', isMain: false, filename: 'photo2.jpg' }
    ],
    interests: ['hiking', 'photography', 'coding', 'travel'],
    location: { latitude: 40.7128, longitude: -74.006 },
    distance: 5
  },
  {
    id: 'profile-2',
    name: 'Ahmed',
    age: 32,
    gender: 'male',
    bio: 'Doctor who enjoys cooking and playing piano',
    photos: [
      { url: 'https://source.unsplash.com/random/400x600?man=1', isMain: true, filename: 'photo1.jpg' },
      { url: 'https://source.unsplash.com/random/400x600?man=2', isMain: false, filename: 'photo2.jpg' }
    ],
    interests: ['cooking', 'music', 'health', 'reading'],
    location: { latitude: 40.7228, longitude: -74.016 },
    distance: 3
  },
  {
    id: 'profile-3',
    name: 'Fatima',
    age: 26,
    gender: 'female',
    bio: 'Architect with a passion for Islamic art and design',
    photos: [
      { url: 'https://source.unsplash.com/random/400x600?woman=3', isMain: true, filename: 'photo1.jpg' },
      { url: 'https://source.unsplash.com/random/400x600?woman=4', isMain: false, filename: 'photo2.jpg' }
    ],
    interests: ['art', 'design', 'architecture', 'calligraphy'],
    location: { latitude: 40.7328, longitude: -74.026 },
    distance: 7
  }
];

// Create mock matches
export const mockMatches = [
  {
    id: 'match-1',
    users: ['mock-uid-permanent', 'profile-1'],
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    profile: mockProfiles[0]
  },
  {
    id: 'match-2',
    users: ['mock-uid-permanent', 'profile-3'],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    profile: mockProfiles[2]
  }
];

// Create mock messages
export const mockMessages = {
  'match-1': [
    {
      id: 'msg-1',
      text: 'Hello! I noticed you like hiking too!',
      senderId: 'profile-1',
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      read: true
    },
    {
      id: 'msg-2',
      text: 'Yes, I love hiking! What trails do you recommend?',
      senderId: 'mock-uid-permanent',
      createdAt: new Date(Date.now() - 7100000).toISOString(),
      read: true
    },
    {
      id: 'msg-3',
      text: 'I really enjoyed the Eagle Rock trail last weekend',
      senderId: 'profile-1',
      createdAt: new Date(Date.now() - 7000000).toISOString(),
      read: true
    }
  ],
  'match-2': [
    {
      id: 'msg-4',
      text: 'I saw your profile and thought your work in Islamic architecture is fascinating',
      senderId: 'mock-uid-permanent',
      createdAt: new Date(Date.now() - 3700000).toISOString(),
      read: true
    },
    {
      id: 'msg-5',
      text: 'Thank you! I've been working on combining traditional patterns with modern design',
      senderId: 'profile-3',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      read: false
    }
  ]
}; 