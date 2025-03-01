import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { currentUser } from '../../data/mockUsers';
import { User } from 'lucide-react-native';
import Button from '../../components/Button';
import InterestTags from '../../components/InterestTags';
import { useAuth } from '../../utils/firebase';
import { useFirestore } from '../../hooks/useFirestore';
import Svg, { Circle, LinearGradient as SvgLinearGradient, Stop, Defs } from 'react-native-svg';
import { Zap, Star, Check, Lock, Heart } from 'lucide-react-native';

// Window dimensions for responsive layouts
const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // Two cards with spacing

// Add mock profile data
const mockUserProfile = {
  name: 'Test User',
  photos: ['https://via.placeholder.com/150'],
  bio: 'This is a test profile',
  verificationStatus: 'pending',
  isVerified: false
};

export default function ProfileScreen() {
  const { user, signOut } = { user: { uid: '1' }, signOut: () => console.log('Sign out clicked') };
  const [profileData, setProfileData] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [myLikes, setMyLikes] = useState(0);
  const [likesMe, setLikesMe] = useState(0);
  const [picks, setPicks] = useState(5);
  const [isPremium, setIsPremium] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isUnderReview, setIsUnderReview] = useState(true); // For demo purposes, showing review banner
  const { getUserProfile } = { getUserProfile: async () => mockUserProfile };
  
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);
  
  const loadUserProfile = async () => {
    try {
      // For now, just use mock data
      setProfileData(mockUserProfile);
      calculateProfileCompletion(mockUserProfile);
      setIsVerified(mockUserProfile.isVerified || false);
      setIsUnderReview(mockUserProfile.verificationStatus === 'pending');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };
  
  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;
    
    // Define required fields for a complete profile
    const requiredFields = [
      'name', 'photos', 'bio', 'dateOfBirth', 'gender', 'location', 
      'occupation', 'education', 'religiousCommitment'
    ];
    
    // Calculate completion percentage
    let completedFields = 0;
    requiredFields.forEach(field => {
      if (profile[field] && 
         (field !== 'photos' || (profile[field] && profile[field].length > 0))) {
        completedFields++;
      }
    });
    
    const percentage = Math.floor((completedFields / requiredFields.length) * 100);
    setProfileCompletion(percentage);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => router.replace('/')
        }
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleActivatePremium = (tier) => {
    router.push(`/premium?tier=${tier}`);
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content}
    </View>
  );

  const renderInfoRow = (label: string, value: string) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderProfileCircle = () => {
    const size = 100;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const alpha = (100 - profileCompletion) / 100;
    const strokeDashoffset = circumference * alpha;
    
    return (
      <View style={styles.profileCircleContainer}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.lightGray}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E373FF"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </Svg>
        
        <TouchableOpacity 
          style={styles.profilePhotoContainer}
          onPress={handleEditProfile}
          activeOpacity={0.8}
        >
          <Image
            source={profileData?.photos?.[0] 
              ? { uri: profileData.photos[0] } 
              : { uri: 'https://via.placeholder.com/100' }}
            style={styles.profilePhoto}
          />
          <View style={styles.editIconContainer}>
            <Feather name="edit-2" size={14} color="white" />
          </View>
        </TouchableOpacity>
        
        <View style={styles.completionTextContainer}>
          <Text style={styles.completionText}>{profileCompletion}%</Text>
        </View>
      </View>
    );
  };

  const renderStats = () => {
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{likesMe}</Text>
          <Text style={styles.statLabel}>Likes Me</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{myLikes}</Text>
          <Text style={styles.statLabel}>My Likes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{picks}</Text>
          <Text style={styles.statLabel}>Picks</Text>
        </View>
      </View>
    );
  };

  const renderVerifyPrompt = () => {
    return (
      <View style={styles.verifyPrompt}>
        <View style={styles.verifyDot} />
        <Text style={styles.verifyText}>Verify Your Profile Photo</Text>
      </View>
    );
  };

  const renderPremiumOptions = () => {
    return (
      <View style={styles.premiumOptionsContainer}>
        {/* Plus Tier */}
        <TouchableOpacity 
          style={styles.premiumCard}
          onPress={() => handleActivatePremium('plus')}
          activeOpacity={0.8}
        >
          <View style={[styles.premiumCardTop, styles.plusGradient]}>
            <Text style={styles.premiumCardTitle}>Naseebi <Text style={{fontWeight: '800'}}>Plus</Text></Text>
          </View>
          <View style={styles.premiumCardBody}>
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#FFF0D4' }]}>
                <Heart size={14} color="#FF6B6B" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>See Who Likes You</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#FFF0D4' }]}>
                <Heart size={14} color="#FF6B6B" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>Unlimited Likes</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#FFF0D4' }]}>
                <Feather name="unlock" size={14} color="#FF9800" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>Unlock My Likes</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#FFF0D4' }]}>
                <FontAwesome name="star" size={14} color="#FFA500" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>Free Crush x2/day</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#FFF0D4' }]}>
                <Feather name="check-circle" size={14} color="#4CAF50" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>Read Receipts</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#FFF0D4' }]}>
                <Feather name="refresh-cw" size={14} color="#009688" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>Unlimited Rewind</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#FFF0D4' }]}>
                <MaterialCommunityIcons name="rocket" size={14} color="#5E66EB" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>1 Boost/Week</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#FFF0D4' }]}>
                <Feather name="award" size={14} color="#FF9800" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>Naseebi Plus Icon</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.upgradeButton, { backgroundColor: '#FFD700' }]}
              onPress={() => handleActivatePremium('plus')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Plus</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        
        {/* Sapphire Tier */}
        <TouchableOpacity 
          style={[styles.premiumCard, styles.sapphireCard]}
          onPress={() => handleActivatePremium('sapphire')}
          activeOpacity={0.8}
        >
          <View style={[styles.premiumCardTop, styles.sapphireGradient]}>
            <Text style={styles.premiumCardTitle}>Naseebi <Text style={{fontWeight: '800'}}>Sapphire</Text></Text>
          </View>
          <View style={styles.premiumCardBody}>
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#E6F2FF' }]}>
                <Check size={14} color="#1E90FF" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>All Plus features</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#E6F2FF' }]}>
                <FontAwesome name="star" size={14} color="#1E90FF" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>5 Crushes per day</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#E6F2FF' }]}>
                <Feather name="zap" size={14} color="#1E90FF" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>Priority matching</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#E6F2FF' }]}>
                <Feather name="sliders" size={14} color="#1E90FF" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>Advanced Filters</Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <View style={[styles.featureIconBg, { backgroundColor: '#E6F2FF' }]}>
                <FontAwesome name="diamond" size={14} color="#1E90FF" style={styles.featureIcon} />
              </View>
              <Text style={styles.featureText}>Naseebi Sapphire Icon</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.upgradeButton, { backgroundColor: '#8A2BE2' }]}
              onPress={() => handleActivatePremium('sapphire')}
            >
              <Text style={styles.upgradeButtonText}>Get Sapphire</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
          <View style={styles.settingsIconContainer}>
            <Ionicons name="settings-outline" size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileSection}>
          {renderProfileCircle()}
        </View>
        
        {renderVerifyPrompt()}
        {renderStats()}
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Premium Plans</Text>
        {renderPremiumOptions()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0, // Eliminate top padding
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#E373FF', // Lavender to match the app theme
    height: 50,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 6,
  },
  settingsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F8F0FF', // Light lavender background
  },
  profileCircleContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoContainer: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E373FF",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  completionTextContainer: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  completionText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.text,
  },
  verifyPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 0, // No top margin
  },
  verifyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'red',
    marginRight: 6,
  },
  verifyText: {
    color: 'red',
    fontSize: 13,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 5,
    paddingHorizontal: 30,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 6,
    backgroundColor: '#f5f5f5',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  
  // Updated premium card styles
  premiumOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  premiumCard: {
    width: cardWidth,
    borderRadius: 16,
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  sapphireCard: {
    // Special styling for sapphire card if needed
  },
  premiumCardTop: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  premiumCardTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  premiumCardBody: {
    padding: 14,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIconBg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureIcon: {
    // Icon styling
  },
  featureText: {
    fontSize: 13,
    color: Colors.text,
    flex: 1,
  },
  upgradeButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    marginTop: 14,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  plusGradient: {
    backgroundColor: '#FFD700',
  },
  
  sapphireGradient: {
    backgroundColor: '#8A2BE2',
  },
});