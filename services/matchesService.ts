import { mockMatches, mockMessages, mockProfiles } from '../utils/mockData';
import { Analytics } from '../utils/firebase';

// Get user matches
export const getUserMatches = async (userId: string) => {
  console.log('Getting mock matches for user:', userId);
  
  // Return mock matches with a slight delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, matches: mockMatches });
    }, 300);
  });
};

// Get messages for a match
export const getMessages = async (matchId: string) => {
  console.log('Getting mock messages for match:', matchId);
  
  // Return mock messages with a slight delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        messages: mockMessages[matchId] || [] 
      });
    }, 200);
  });
};

// Send a message
export const sendMessage = async (matchId: string, senderId: string, text: string) => {
  console.log('Sending mock message in match:', matchId);
  console.log('Message:', text);
  
  // Create a new message
  const newMessage = {
    id: `msg-${Date.now()}`,
    text,
    senderId,
    createdAt: new Date().toISOString(),
    read: false
  };
  
  // Add to mock messages
  if (!mockMessages[matchId]) {
    mockMessages[matchId] = [];
  }
  mockMessages[matchId].push(newMessage);
  
  // Track with analytics
  await Analytics.logEvent('message_sent', {
    match_id: matchId,
    user_id: senderId
  });
  
  return { success: true, message: newMessage };
};

// Mark messages as read
export const markMessagesAsRead = async (matchId: string, userId: string) => {
  console.log('Marking mock messages as read in match:', matchId);
  
  if (mockMessages[matchId]) {
    mockMessages[matchId].forEach(msg => {
      if (msg.senderId !== userId) {
        msg.read = true;
      }
    });
  }
  
  return { success: true };
}; 