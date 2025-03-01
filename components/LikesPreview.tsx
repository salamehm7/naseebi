import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { mockUsers, mockLikes } from '../data/mockUsers';
import { User } from '../types';
import PremiumFeatureGate from './PremiumFeatureGate';
import { SubscriptionTier } from '../types';

const LikesPreview: React.FC = () => {
  // Get users who have liked the current user
  const likedUsers = mockLikes.map(like => {
    const user = mockUsers.find(user => user.id === like.userId);
    return user;
  }).filter(Boolean) as User[];
  
  const navigateToPremium = () => {
    router.push('/premium');
  };
  
  const renderLikeItem = ({ item }: { item: User }) => (
    <View style={styles.likeItem}>
      <Image 
        source={{ uri: item.photos[0] }} 
        style={styles.avatar} 
      />
      <View style={styles.blurOverlay} />
      <Heart size={24} color={Colors.white} style={styles.heartIcon} />
    </View>
  );
  
  if (likedUsers.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Heart size={18} color={Colors.error} style={{ marginRight: 8 }} />
          <Text style={styles.title}>People who liked you</Text>
        </View>
        <Text style={styles.count}>{likedUsers.length}</Text>
      </View>
      
      <PremiumFeatureGate 
        requiredTier={SubscriptionTier.SAPPHIRE} 
        featureName="See who likes you"
        description="Unlock to see and match with people who already like you"
      >
        <FlatList
          data={likedUsers}
          renderItem={renderLikeItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.likesList}
        />
      </PremiumFeatureGate>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  likesList: {
    paddingVertical: 8,
  },
  likeItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  heartIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
  }
});

export default LikesPreview;