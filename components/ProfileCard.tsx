import React from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { User } from '../types';
import InterestTags from './InterestTags';

interface ProfileCardProps {
  user: User;
  interests?: Record<string, string>;
  onPress?: () => void;
  style?: Object;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  interests,
  onPress,
  style
}) => {
  // Create sample interests if not provided
  const cardInterests = interests || {
    weekend: 'outdoors',
    communication: 'deepTalks'
  };
  
  return (
    <TouchableOpacity 
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      disabled={!onPress}
    >
      <Image 
        source={{ uri: user.photos[0] }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.age}>{user.age}</Text>
        </View>
        
        {user.occupation && (
          <Text style={styles.occupation}>{user.occupation}</Text>
        )}
        
        <InterestTags interests={cardInterests} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  image: {
    width: '100%',
    height: 180,
  },
  infoContainer: {
    padding: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 6,
  },
  age: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  occupation: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  }
});

export default ProfileCard;