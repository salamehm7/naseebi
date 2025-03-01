import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import Colors from '../constants/Colors';
import { User } from '../types';
import { Heart, X } from 'lucide-react-native';
import InterestTags from './InterestTags';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface CardProps {
  user: User;
  showActions?: boolean;
  interests?: Record<string, string>;
}

const Card: React.FC<CardProps> = ({ user, showActions = false, interests }) => {
  // Sample interests for demo purposes - in a real app this would come from the user's data
  const cardInterests = interests || {
    weekend: 'outdoors',
    communication: 'deepTalks',
    partnerQualities: 'kindness'
  };
  
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: user.photos[0] }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      <View style={styles.infoContainer}>
        <View style={styles.nameAgeContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.age}>{user.age}</Text>
        </View>
        <Text style={styles.location}>{user.location}</Text>
        
        <View style={styles.attributesContainer}>
          {user.religiousCommitment && (
            <View style={styles.attributeBadge}>
              <Text style={styles.attributeText}>{user.religiousCommitment}</Text>
            </View>
          )}
          {user.educationLevel && (
            <View style={styles.attributeBadge}>
              <Text style={styles.attributeText}>{user.educationLevel}</Text>
            </View>
          )}
          {user.occupation && (
            <View style={styles.attributeBadge}>
              <Text style={styles.attributeText}>{user.occupation}</Text>
            </View>
          )}
        </View>
        
        {/* Display interest tags */}
        <InterestTags interests={cardInterests} style={styles.interestTags} />
        
        <Text numberOfLines={3} style={styles.bio}>
          {user.bio}
        </Text>
      </View>
      
      {showActions && (
        <View style={styles.actionsContainer}>
          <View style={[styles.actionButton, styles.nopeButton]}>
            <X size={24} color={Colors.error} />
          </View>
          <View style={[styles.actionButton, styles.likeButton]}>
            <Heart size={24} color={Colors.success} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
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
  image: {
    width: '100%',
    height: '55%', // Reduced from 70% to make room for interest tags
  },
  infoContainer: {
    padding: 16,
    flex: 1,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginRight: 8,
  },
  age: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  location: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  attributeBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  attributeText: {
    color: Colors.primaryDark,
    fontSize: 12,
    fontWeight: '500',
  },
  interestTags: {
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  nopeButton: {
    backgroundColor: Colors.white,
  },
  likeButton: {
    backgroundColor: Colors.white,
  },
});

export default Card;