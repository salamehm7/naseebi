import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';
import { mockUsers } from '../../data/mockUsers';
import { User } from '../../types';
import SwipeCard from '../../components/SwipeCard';
import SwipeControls from '../../components/SwipeControls';
import PremiumBadge from '../../components/PremiumBadge';
import HeartLogo from '../../components/HeartLogo';
import { Sliders } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { SwipeCardHandles } from '../../components/SwipeCard';

// Sample profiles for testing
const sampleProfiles = [
  {
    id: '1',
    name: 'Aisha',
    age: 27,
    location: 'New York',
    distance: 5,
    education: 'Columbia University',
    occupation: 'Software Engineer',
    photos: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ],
    bio: 'I love technology and outdoor activities...',
    compatibility: 92,
    interestTags: ['religious:quran', 'food:halal_cooking', 'tech:coding'] 
  },
  {
    id: '2',
    name: 'Fatima',
    age: 25,
    location: 'Chicago',
    distance: 10,
    education: 'University of Chicago',
    occupation: 'Doctor',
    photos: [
      'https://example.com/photo3.jpg',
      'https://example.com/photo4.jpg',
    ],
    bio: 'Passionate about healthcare and helping others...',
    compatibility: 85,
    interestTags: ['religious:charity', 'health:wellness', 'learning:medicine']
  },
  // Add more sample profiles as needed
];

export default function DiscoverScreen() {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState(sampleProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentlySwipedUsers, setRecentlySwipedUsers] = useState<User[]>([]);
  const nextCardScale = useRef(new Animated.Value(0.9)).current;
  const [activeTab, setActiveTab] = useState('naseebi');
  const { isPremium } = useSubscription();
  const [remainingCrushes, setRemainingCrushes] = useState(isPremium ? 2 : 0);

  // Add a ref to control the SwipeCard
  const swipeCardRef = useRef<SwipeCardHandles>(null);

  // Simulate loading profiles
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Update the handleSwipeLeft and handleSwipeRight functions
  const handleSwipeLeft = () => {
    // This gets called after the animation completes in the SwipeCard
    const swipedUser = profiles[currentIndex];
    setRecentlySwipedUsers(prev => [swipedUser, ...prev].slice(0, 5));
  };

  const handleSwipeRight = () => {
    // This gets called after the animation completes in the SwipeCard
    const swipedUser = profiles[currentIndex];
    setRecentlySwipedUsers(prev => [swipedUser, ...prev].slice(0, 5));
  };

  // Add these new handler functions for buttons
  const handleSwipeLeftButton = () => {
    // Trigger the card animation first
    if (swipeCardRef.current) {
      swipeCardRef.current.swipeLeft();
    }
  };

  const handleSwipeRightButton = () => {
    // Trigger the card animation first
    if (swipeCardRef.current) {
      swipeCardRef.current.swipeRight();
    }
  };

  const handleNextCard = () => {
    // Animate the next card scale
    Animated.spring(nextCardScale, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // Move to the next card
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handleRewind = () => {
    if (recentlySwipedUsers.length > 0) {
      // Get the most recently swiped user
      const lastSwipedUser = recentlySwipedUsers[0];
      
      // Remove from recently swiped list
      setRecentlySwipedUsers(prev => prev.slice(1));
      
      // Add the user back to the stack (at the current position)
      const newProfiles = [...profiles];
      newProfiles.splice(currentIndex, 0, lastSwipedUser);
      setProfiles(newProfiles);
      
      // Animate the next card scale
      nextCardScale.setValue(1);
    }
  };
  
  const handleBoost = () => {
    // In a real app, this would boost the user's profile for increased visibility
    // For demo purposes, we'll just show an alert
    alert('Your profile has been boosted for 30 minutes!');
  };

  // Toggle between tabs
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };
  
  // Navigate to preferences/filters
  const handleOpenPreferences = () => {
    router.push('/preferences');
  };

  // Add a function to handle crush action
  const handleCrush = () => {
    // Decrease remaining crushes when used
    setRemainingCrushes(prev => Math.max(0, prev - 1));
    
    // Handle the crush action (e.g., notify the user they have a crush)
    // ...
    
    // Move to next card
    handleNextCard();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding potential matches...</Text>
        </View>
      );
    }
    
    if (profiles.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No more profiles to show</Text>
          <Text style={styles.emptySubtext}>Check back later for new matches</Text>
        </View>
      );
    }
    
    if (currentIndex >= profiles.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You've seen all profiles</Text>
          <Text style={styles.emptySubtext}>Check back later for new matches</Text>
        </View>
      );
    }
    
    return (
      <SwipeCard 
        ref={swipeCardRef}
        profile={profiles[currentIndex]} 
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom header with tabs */}
      <View style={styles.header}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'naseebi' && styles.activeTab]}
            onPress={() => handleTabPress('naseebi')}
          >
            <Text style={[styles.tabText, activeTab === 'naseebi' && styles.activeTabText]}>
              Naseebi
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
            onPress={() => handleTabPress('likes')}
          >
            <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>
              Likes
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleOpenPreferences}
        >
          <Sliders size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Content based on active tab */}
      <View style={styles.content}>
        {activeTab === 'naseebi' ? (
          <View style={styles.cardsContainer}>
            <View style={styles.cardWrapper}>
              {renderContent()}
            </View>
          </View>
        ) : (
          // Likes UI with blurred profiles for non-premium users
          <View style={styles.likesContainer}>
            {!isPremium ? (
              <View style={styles.premiumOverlay}>
                <Text style={styles.premiumTitle}>
                  Upgrade to Naseebi Plus
                </Text>
                <Text style={styles.premiumSubtitle}>
                  See who likes you and match with them instantly
                </Text>
                <TouchableOpacity 
                  style={styles.upgradeButton}
                  onPress={() => router.push('/premium')}
                >
                  <Text style={styles.upgradeButtonText}>
                    Upgrade Now
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Content for premium users
              <Text style={styles.likesText}>
                See who likes you! This is a premium feature.
              </Text>
            )}
          </View>
        )}
      </View>
      
      {/* Keep SwipeControls as they were */}
      {currentIndex < profiles.length && activeTab === 'naseebi' && (
        <SwipeControls
          onSwipeLeft={handleSwipeLeftButton}
          onSwipeRight={handleSwipeRightButton}
          onCrush={handleCrush}
          isPremium={isPremium}
          remainingCrushes={remainingCrushes}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  headerLeft: {
    flex: 0.25, // Takes up 25% of the space on the left
  },
  centerContainer: {
    flex: 0.5, // Takes up 50% of the space in the center
    alignItems: 'center', // Centers the logo horizontally
    justifyContent: 'center',
  },
  premiumBadgeContainer: {
    flex: 0.25, // Takes up 25% of the space on the right
    alignItems: 'flex-end', // Aligns premium badge to the right
    zIndex: 2, // Ensure premium badge stays above all other elements
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  cardWrapper: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextCard: {
    position: 'absolute',
    width: '90%',
    height: '75%',
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  noMoreCardsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  resetButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: Colors.primaryLight,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  likesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  premiumOverlay: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    maxWidth: 320,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  premiumSubtitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  upgradeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  likesText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
});