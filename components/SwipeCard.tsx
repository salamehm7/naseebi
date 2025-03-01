import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated, PanResponder, ScrollView, TouchableOpacity, ActivityIndicator, Platform, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import { User } from '../types';
import { Heart, X, MapPin, Briefcase, GraduationCap, BookOpen, Coffee, Calendar, MessageCircle, Moon, Users, Zap, Scroll, Star, Music, Globe, Tag, ChevronDown, MessageSquare, Smile, Home, Goal, Image as ImageIcon } from 'lucide-react-native';
import InterestTags from './InterestTags';
import Button from './Button';
import { useAuth } from '../utils/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, Analytics } from '../utils/firebase';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.75;
const SWIPE_THRESHOLD = width * 0.25;
const SWIPE_OUT_DURATION = 250;
const PHOTO_HEIGHT = height * 0.4;

// Define the interface for the ref functions
export interface SwipeCardHandles {
  swipeLeft: () => void;
  swipeRight: () => void;
}

interface SwipeCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    location: string;
    distance: number;
    education?: string;
    educationLevel?: string;
    occupation: string;
    photos: string[];
    bio: string;
    compatibility?: number;
    interestTags?: string[];
    religiousCommitment?: string;
    prayerFrequency?: string;
    islamicTradition?: string;
    dateOfBirth?: Date;
    gender?: string;
    country?: string;
    personalityTraits?: string[];
    leisureActivities?: string[];
    relationshipValues?: string[];
    lifeGoals?: string[];
  };
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  nextCardScale?: Animated.Value;
  interests?: any;
}

// Convert to forwardRef to accept a ref from parent
const SwipeCard = forwardRef<SwipeCardHandles, SwipeCardProps>(({ 
  profile, 
  onSwipeLeft = () => {}, 
  onSwipeRight = () => {},
  nextCardScale,
  interests
}, ref) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const router = useRouter();
  const { user } = useAuth();

  // Animation values for swipe
  const position = useRef(new Animated.ValueXY()).current;
  const swipeDirection = useRef(null);

  // Sample interests for demo purposes - in a real app this would come from the user's data
  const cardInterests = interests || {
    weekend: 'outdoors',
    marriageApproach: 'growth',
    communication: 'deepTalks',
    partnerQualities: 'kindness',
  };

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    swipeLeft: () => {
      swipeLeft();
    },
    swipeRight: () => {
      swipeRight();
    }
  }));

  // Swipe animations
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const rotate = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD * 2, 0, SWIPE_THRESHOLD * 2],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  // Calculate if scroll indicator should be visible
  useEffect(() => {
    const shouldShowIndicator = contentHeight > containerHeight;
    setShowScrollIndicator(shouldShowIndicator);
  }, [contentHeight, containerHeight]);

  // Custom scrollbar indicator position
  const scrollIndicatorPosition = (() => {
    if (contentHeight <= containerHeight) return 0;
    const scrollableHeight = contentHeight - containerHeight;
    const maxIndicatorOffset = containerHeight - (containerHeight * containerHeight / contentHeight) - 24;
    return (scrollPosition / scrollableHeight) * maxIndicatorOffset;
  })();

  const scrollIndicatorHeight = (() => {
    if (contentHeight <= containerHeight) return 0;
    return Math.max((containerHeight / contentHeight) * (containerHeight - 24), 40);
  })();

  // SIMPLER PANRESPONDER - Key changes to fix scrolling issues
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
        
        // Update swipe direction for visual feedback
        if (gesture.dx > 25) {
          swipeDirection.current = 'right';
        } else if (gesture.dx < -25) {
          swipeDirection.current = 'left';
        } else {
          swipeDirection.current = null;
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  // Improved swipe animations with proper callbacks
  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width * 1.5, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true
    }).start(() => {
      // Use a short timeout to finish animation before callback
      onSwipeLeft();
      resetForNextCard();
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width * 1.5, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true
    }).start(() => {
      // Use a short timeout to finish animation before callback
      onSwipeRight();
      resetForNextCard();
    });
  };

  // Reset the card position when animation completes
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      stiffness: 200,
      damping: 20,
      mass: 1,
      useNativeDriver: true
    }).start();
    swipeDirection.current = null;
  };

  // Clean reset for the next card
  const resetForNextCard = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentPhotoIndex(0);
    swipeDirection.current = null;
  };

  // Photo navigation
  const handlePhotoNavigation = (direction) => {
    if (direction === 'next' && currentPhotoIndex < profile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else if (direction === 'prev' && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  // Render photo indicators
  const renderPhotoIndicators = () => (
    <View style={styles.photoIndicators}>
      {profile.photos.map((_, index) => (
        <View
          key={index}
          style={[
            styles.photoIndicator,
            index === currentPhotoIndex && styles.photoIndicatorActive
          ]}
        />
      ))}
    </View>
  );

  // Format trait categories
  const formatTraitCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
  };

  // Helper function to format prayer frequency text
  const formatPrayerFrequency = (id?: string) => {
    if (!id) return '';
    
    switch(id) {
      case 'five_daily': return 'Five times daily';
      case 'most_daily': return 'Most daily prayers';
      case 'some_daily': return 'Some daily prayers';
      case 'friday': return 'Friday prayers';
      case 'occasionally': return 'Occasionally';
      case 'rarely': return 'Rarely';
      default: return id.replace(/_/g, ' ');
    }
  };

  // Format Islamic tradition
  const formatIslamicTradition = (id?: string) => {
    if (!id) return '';
    
    switch(id) {
      case 'sunni': return 'Sunni';
      case 'shia': return 'Shia';
      case 'sufi': return 'Sufi';
      case 'other': return 'Other';
      case 'non_denominational': return 'Non-denominational';
      default: return id.replace(/_/g, ' ');
    }
  };

  const renderInterestTags = () => {
    if (!profile.interestTags || profile.interestTags.length === 0) {
      return null;
    }

    // Group tags by category for organized display
    const tagsByCategory: Record<string, string[]> = {};
    
    profile.interestTags.forEach(tag => {
      const [category] = tag.split(':');
      if (!tagsByCategory[category]) {
        tagsByCategory[category] = [];
      }
      tagsByCategory[category].push(tag);
    });

    return (
      <View style={styles.interestsContainer}>
        <View style={styles.sectionHeaderRow}>
          <Tag size={18} color={Colors.text} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Interests</Text>
        </View>
        <View style={styles.interestTagsContainer}>
          {profile.interestTags.map((tag, index) => {
            // Extract category to use for tag color
            const [category, tagName] = tag.split(':');
            const displayName = tagName?.replace(/_/g, ' ') || tag;
            
            // Use different colors for different categories
            const getTagColor = (category: string) => {
              const colors = {
                religious: '#8E44AD', // Purple
                hobbies: '#16A085', // Green
                sports: '#E67E22', // Orange
                cultural: '#3498DB', // Blue
                creative: '#E74C3C', // Red
                food: '#27AE60', // Emerald
                tech: '#2980B9', // Blue
                health: '#1ABC9C', // Turquoise
                career: '#F39C12', // Yellow
                default: Colors.primary,
              };
              
              return colors[category as keyof typeof colors] || colors.default;
            };
            
            return (
              <View 
                key={index} 
                style={[
                  styles.interestTag, 
                  { backgroundColor: getTagColor(category) }
                ]}
              >
                <Text style={styles.interestTagText}>{displayName}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderTraitSection = (
    title: string, 
    icon: React.ReactNode, 
    traits?: string[]
  ) => {
    if (!traits || traits.length === 0) {
      return null;
    }
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.traitContainer}>
          {traits.map((trait, index) => (
            <View key={index} style={styles.trait}>
              <Text style={styles.traitText}>{trait.replace(/_/g, ' ')}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // First, add a function to render quiz answers as tags
  const renderQuizAnswers = () => {
    if (!cardInterests || Object.keys(cardInterests).length === 0) {
      return null;
    }
    
    const quizLabels = {
      weekend: 'On weekends I prefer',
      marriageApproach: 'My approach to marriage',
      communication: 'Communication style',
      partnerQualities: 'Important qualities in a partner',
      conflict: "When there's a conflict, I",
      spirituality: 'My level of spirituality is',
      family: 'My relationship with family is',
      finances: 'With finances, I am',
      romance: 'My idea of romance is',
      futureGoals: 'My future goals include',
      socialStyle: 'In social situations, I am',
      lifestyle: 'My lifestyle is',
      foodPreferences: 'My food preferences are',
      travelStyle: 'My travel style is',
      decisionMaking: 'When making decisions, I',
    };
    
    const answerLabels = {
      // Weekend preferences
      outdoors: 'Outdoor activities',
      social: 'Social gatherings',
      relaxing: 'Relaxing at home',
      cultural: 'Cultural activities',
      religious: 'Religious activities',
      
      // Marriage approach
      growth: 'Growing together',
      partnership: 'Equal partnership',
      traditional: 'Traditional roles',
      supportive: 'Being supportive',
      respect: 'Mutual respect',
      
      // Communication
      deepTalks: 'Deep conversations',
      listener: 'Being a good listener',
      directness: 'Direct communication',
      thoughtful: 'Thoughtful discussions',
      humor: 'Using humor',
      
      // Partner qualities
      kindness: 'Kindness',
      intelligence: 'Intelligence',
      ambition: 'Ambition',
      humor: 'Sense of humor',
      faith: 'Strong faith',
      
      // Conflict resolution
      discuss: 'Discuss calmly',
      compromise: 'Find compromise',
      reflect: 'Reflect before responding',
      apologize: 'Apologize when wrong',
      space: 'Take some space',
    };
    
    const getAnswerLabel = (questionId, answerId) => {
      if (questionId === 'weekend' && answerId === 'outdoors') return 'Outdoor activities';
      if (questionId === 'marriageApproach' && answerId === 'growth') return 'Growing together';
      if (questionId === 'communication' && answerId === 'deepTalks') return 'Deep conversations';
      if (questionId === 'partnerQualities' && answerId === 'kindness') return 'Kindness';
      
      return answerLabels[answerId] || answerId.replace(/([A-Z])/g, ' $1').toLowerCase();
    };
    
    const getQuizColor = (questionId) => {
      const colors = {
        weekend: '#4A90E2', // Blue
        marriageApproach: '#9B59B6', // Purple
        communication: '#3498DB', // Light Blue
        partnerQualities: '#E74C3C', // Red
        conflict: '#F39C12', // Orange
        spirituality: '#1ABC9C', // Turquoise
        family: '#D35400', // Dark Orange
        finances: '#27AE60', // Green
        romance: '#E91E63', // Pink
        futureGoals: '#8E44AD', // Violet
        socialStyle: '#2980B9', // Blue
        lifestyle: '#16A085', // Green
        foodPreferences: '#C0392B', // Dark Red
        travelStyle: '#F1C40F', // Yellow
        decisionMaking: '#7F8C8D', // Gray
      };
      
      return colors[questionId] || Colors.primary;
    };
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <MessageSquare size={20} color={Colors.text} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Quiz Answers</Text>
        </View>
        
        <View style={styles.quizTagsContainer}>
          {Object.entries(cardInterests).map(([questionId, answerId]) => (
            <View key={questionId} style={styles.quizTagWrapper}>
              <Text style={styles.quizQuestion}>
                {questionId === 'weekend' ? 'On weekends I prefer' :
                 questionId === 'marriageApproach' ? 'My approach to marriage' :
                 questionId === 'communication' ? 'Communication style' :
                 questionId === 'partnerQualities' ? 'Important qualities in a partner' :
                 questionId.replace(/([A-Z])/g, ' $1')}:
              </Text>
              <View 
                style={[
                  styles.quizTag, 
                  { 
                    backgroundColor: 
                      questionId === 'weekend' ? '#4A90E2' : 
                      questionId === 'marriageApproach' ? '#9B59B6' : 
                      questionId === 'communication' ? '#3498DB' : 
                      questionId === 'partnerQualities' ? '#E74C3C' : 
                      Colors.primary
                  }
                ]}
              >
                <Text style={styles.quizTagText}>
                  {getAnswerLabel(questionId, answerId)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Render photo gallery in scrollable content
  const renderPhotoGallery = () => {
    if (!profile.photos || profile.photos.length === 0) {
      return null;
    }
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <ImageIcon size={20} color={Colors.text} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Photo Gallery</Text>
        </View>
        
        <View style={styles.photoGallery}>
          {profile.photos.map((photo, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.galleryThumbnail,
                currentPhotoIndex === index && styles.galleryThumbnailActive
              ]}
              onPress={() => setCurrentPhotoIndex(index)}
            >
              <Image 
                source={{ uri: photo }} 
                style={styles.thumbnailImage} 
                resizeMode="cover"
              />
              {currentPhotoIndex === index && (
                <View style={styles.thumbnailActiveIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // MAIN COMPONENT RENDER - Changed to fix scrolling
  return (
    <View style={styles.container}>
      {/* We move the PanResponder to a wrapper View */}
      <Animated.View 
        style={[styles.cardWrapper, cardStyle]} 
        {...panResponder.panHandlers}
      >
        <View style={styles.card}>
          {/* Photo section */}
          <View style={styles.photoContainer}>
            {profile.photos && profile.photos.length > 0 ? (
              <Image 
                source={{ uri: profile.photos[currentPhotoIndex] }} 
                style={styles.photo}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.photo, { backgroundColor: Colors.lightGray, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: Colors.textSecondary }}>No photo</Text>
              </View>
            )}
            
            {/* Photo navigation */}
            {profile.photos && profile.photos.length > 1 && (
              <>
                <TouchableOpacity 
                  style={[styles.photoNavButton, styles.photoNavButtonLeft]} 
                  onPress={() => handlePhotoNavigation('prev')}
                >
                  <View style={styles.photoNavButtonInner} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.photoNavButton, styles.photoNavButtonRight]} 
                  onPress={() => handlePhotoNavigation('next')}
                >
                  <View style={styles.photoNavButtonInner} />
                </TouchableOpacity>
                
                {renderPhotoIndicators()}
              </>
            )}
            
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.photoGradient}
            >
              <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
              <View style={styles.profileLocationContainer}>
                <MapPin size={14} color={Colors.white} style={{ marginRight: 4 }} />
                <Text style={styles.profileLocation}>
                  {profile.location} • {profile.distance} miles away
                </Text>
              </View>
            </LinearGradient>
          </View>
          
          {/* More prominent scroll indicator */}
          <View style={styles.scrollIndicator}>
            <ChevronDown size={24} color={Colors.textSecondary} />
            <Text style={styles.scrollText}>Scroll for more details</Text>
          </View>
          
          {/* SIMPLIFIED SCROLLVIEW IMPLEMENTATION */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            onScrollBeginDrag={() => setIsScrolling(true)}
            onScrollEndDrag={() => setIsScrolling(false)}
            onMomentumScrollBegin={() => setIsScrolling(true)}
            onMomentumScrollEnd={() => setIsScrolling(false)}
            scrollEventThrottle={16}
            bounces={true}
          >
            {/* Bio */}
            {profile.bio && (
              <View style={styles.section}>
                <Text style={styles.bioText}>{profile.bio}</Text>
              </View>
            )}
            
            {/* Photo Gallery */}
            {renderPhotoGallery()}
            
            {/* Basic info */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Users size={20} color={Colors.text} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Basic Information</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Briefcase size={16} color={Colors.textSecondary} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Occupation:</Text>
                <Text style={styles.infoText}>{profile.occupation || 'Not specified'}</Text>
              </View>
              
              {profile.education && (
                <View style={styles.infoRow}>
                  <GraduationCap size={16} color={Colors.textSecondary} style={styles.infoIcon} />
                  <Text style={styles.infoLabel}>Education:</Text>
                  <Text style={styles.infoText}>{profile.education}</Text>
                </View>
              )}
              
              {/* Add all the other info sections */}
              {/* Religious info */}
              {profile.islamicTradition && (
                <View style={styles.infoRow}>
                  <Moon size={16} color={Colors.textSecondary} style={styles.infoIcon} />
                  <Text style={styles.infoLabel}>Tradition:</Text>
                  <Text style={styles.infoText}>{formatIslamicTradition(profile.islamicTradition)}</Text>
                </View>
              )}
            </View>
            
            {/* Interest Tags */}
            {profile.interestTags && profile.interestTags.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Tag size={20} color={Colors.text} style={styles.sectionIcon} />
                  <Text style={styles.sectionTitle}>Interests</Text>
                </View>
                
                <View style={styles.interestTagsContainer}>
                  {profile.interestTags.map((tag, index) => {
                    const [category, tagName] = tag.split(':');
                    const displayName = tagName?.replace(/_/g, ' ') || tag;
                    
                    // Color logic
                    const getTagColor = (category) => {
                      const colors = {
                        religious: '#8E44AD',
                        hobbies: '#16A085',
                        sports: '#E67E22',
                        cultural: '#3498DB',
                        default: Colors.primary,
                      };
                      
                      return colors[category] || colors.default;
                    };
                    
                    return (
                      <View 
                        key={index} 
                        style={[
                          styles.interestTag, 
                          { backgroundColor: getTagColor(category) }
                        ]}
                      >
                        <Text style={styles.interestTagText}>{displayName}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            
            {/* Quiz Answers as Tags */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <MessageSquare size={20} color={Colors.text} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Quiz Answers</Text>
              </View>
              
              <View style={styles.quizTagsContainer}>
                {Object.entries(cardInterests).map(([questionId, answerId]) => (
                  <View key={questionId} style={styles.quizTagWrapper}>
                    <Text style={styles.quizQuestion}>
                      {questionId === 'weekend' ? 'On weekends I prefer' :
                       questionId === 'marriageApproach' ? 'My approach to marriage' :
                       questionId === 'communication' ? 'Communication style' :
                       questionId === 'partnerQualities' ? 'Important qualities in a partner' :
                       questionId.replace(/([A-Z])/g, ' $1')}:
                    </Text>
                    <View 
                      style={[
                        styles.quizTag, 
                        { 
                          backgroundColor: 
                            questionId === 'weekend' ? '#4A90E2' : 
                            questionId === 'marriageApproach' ? '#9B59B6' : 
                            questionId === 'communication' ? '#3498DB' : 
                            questionId === 'partnerQualities' ? '#E74C3C' : 
                            Colors.primary
                        }
                      ]}
                    >
                      <Text style={styles.quizTagText}>
                        {answerId === 'outdoors' ? 'Outdoor activities' :
                         answerId === 'growth' ? 'Growing together' :
                         answerId === 'deepTalks' ? 'Deep conversations' :
                         answerId === 'kindness' ? 'Kindness' :
                         answerId.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Personality Traits */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Smile size={20} color={Colors.text} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Personality Traits</Text>
              </View>
              <View style={styles.traitContainer}>
                {(profile.personalityTraits || ['Caring', 'Honest', 'Intelligent', 'Patient', 'Adventurous']).map(trait => (
                  <View key={trait} style={styles.trait}>
                    <Text style={styles.traitText}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Leisure Activities */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Coffee size={20} color={Colors.text} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Leisure Activities</Text>
              </View>
              <View style={styles.traitContainer}>
                {(profile.leisureActivities || ['Reading books', 'Traveling', 'Cooking', 'Photography', 'Hiking', 'Learning languages', 'Visiting museums']).map(trait => (
                  <View key={trait} style={styles.trait}>
                    <Text style={styles.traitText}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Relationship Values */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Home size={20} color={Colors.text} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Relationship Values</Text>
              </View>
              <View style={styles.traitContainer}>
                {(profile.relationshipValues || ['Trust', 'Communication', 'Respect', 'Compromise', 'Empathy', 'Patience', 'Loyalty', 'Understanding']).map(trait => (
                  <View key={trait} style={[styles.trait, { backgroundColor: '#FFEDF5' }]}>
                    <Text style={[styles.traitText, { color: '#E83E8C' }]}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Life Goals */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Goal size={20} color={Colors.text} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Life Goals</Text>
              </View>
              <View style={styles.traitContainer}>
                {(profile.lifeGoals || ['Raise a loving family', 'Career growth', 'Further education', 'Travel the world', 'Strengthen faith', 'Build a home', 'Community service']).map(trait => (
                  <View key={trait} style={[styles.trait, { backgroundColor: '#E0F7FA' }]}>
                    <Text style={[styles.traitText, { color: '#00ACC1' }]}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Bottom padding for better scrolling */}
            <View style={{ height: 40 }} />
          </ScrollView>
          
          {/* Like/Nope overlays */}
          <Animated.View 
            style={[
              styles.overlay,
              styles.likeOverlay,
              { opacity: likeOpacity }
            ]}
            pointerEvents="none"
          >
            <View style={styles.overlayContent}>
              <Heart color={Colors.success} size={40} />
              <Text style={styles.overlayText}>LIKE</Text>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.overlay,
              styles.nopeOverlay,
              { opacity: nopeOpacity }
            ]}
            pointerEvents="none"
          >
            <View style={styles.overlayContent}>
              <X color={Colors.error} size={40} />
              <Text style={[styles.overlayText, styles.nopeText]}>NOPE</Text>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  photoContainer: {
    height: PHOTO_HEIGHT,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoIndicators: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  photoIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  photoIndicatorActive: {
    backgroundColor: Colors.white,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  photoNavButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    zIndex: 10,
  },
  photoNavButtonLeft: {
    left: 0,
  },
  photoNavButtonRight: {
    right: 0,
  },
  photoNavButtonInner: {
    width: 40,
    height: 40,
  },
  photoGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  profileLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLocationIcon: {
    marginRight: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: Colors.white,
  },
  scrollIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  scrollText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  section: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  interestsContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  interestTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  interestTagText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  traitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trait: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  traitText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  compatibilityContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  compatibilityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  compatibilityBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  compatibilityFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  compatibilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
    borderRadius: 20,
  },
  likeOverlay: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
  },
  nopeOverlay: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  overlayContent: {
    alignItems: 'center',
    transform: [{ rotate: '15deg' }],
  },
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.success,
    marginTop: 8,
  },
  nopeText: {
    color: Colors.error,
  },
  quizTagsContainer: {
    marginTop: 8,
  },
  quizTagWrapper: {
    marginBottom: 10,
  },
  quizQuestion: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  quizTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  quizTagText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontWeight: '500',
    color: Colors.textSecondary,
    marginRight: 6,
    width: 90,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  photoGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  galleryThumbnail: {
    width: (CARD_WIDTH - 32 - 16) / 3, // Card width minus padding divided by 3 photos per row
    height: (CARD_WIDTH - 32 - 16) / 3,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  galleryThumbnailActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailActiveIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
});

export default SwipeCard;