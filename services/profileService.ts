import { mockProfiles } from '../utils/mockData';
import { authState, Analytics } from '../utils/firebase';

// Get potential matches
export const getPotentialMatches = async (userId: string, preferences: any) => {
  console.log('Getting mock potential matches for user:', userId);
  console.log('With preferences:', preferences);
  
  // Return mock profiles with a slight delay to simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, profiles: mockProfiles });
    }, 500);
  });
};

// Record a swipe
export const recordSwipe = async (userId: string, targetUserId: string, direction: 'left' | 'right') => {
  console.log(`Recording mock ${direction} swipe from ${userId} on ${targetUserId}`);
  
  // Track with analytics
  await Analytics.logEvent('user_swipe', {
    user_id: userId,
    target_id: targetUserId,
    direction
  });
  
  // Check if it's a match (always match on right swipes for demo purposes)
  if (direction === 'right') {
    const matchId = `match-${Date.now()}`;
    console.log('Created mock match:', matchId);
    
    // Track with analytics
    await Analytics.logEvent('match_created', {
      user_id: userId,
      match_id: matchId
    });
    
    return { success: true, isMatch: true, matchId, profile: mockProfiles.find(p => p.id === targetUserId) };
  }
  
  return { success: true, isMatch: false };
}; 