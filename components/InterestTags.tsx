import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '../constants/Colors';
import { Coffee, Book, Mountain, Users, Chrome as Home, Heart, MessageSquare, Phone, Moon, Sun, Star, Laugh, Brain, Clock, Leaf, Music } from 'lucide-react-native';

interface InterestTagsProps {
  interests: Record<string, string>;
  onTagPress?: (categoryId: string, optionId: string) => void;
  style?: Object;
}

// Map of interest categories and their options with icons
const interestOptions = {
  weekend: {
    outdoors: { text: 'Outdoor Lover', icon: <Mountain size={16} color={Colors.primary} /> },
    social: { text: 'Social Butterfly', icon: <Users size={16} color={Colors.primary} /> },
    relaxing: { text: 'Homebody', icon: <Home size={16} color={Colors.primary} /> },
    cultural: { text: 'Culture Enthusiast', icon: <Book size={16} color={Colors.primary} /> },
  },
  marriageApproach: {
    partner: { text: 'Equal Partnership', icon: <Heart size={16} color={Colors.primary} /> },
    traditional: { text: 'Traditional Values', icon: <Home size={16} color={Colors.primary} /> },
    growth: { text: 'Growth Minded', icon: <Leaf size={16} color={Colors.primary} /> },
    independent: { text: 'Independent', icon: <Star size={16} color={Colors.primary} /> },
  },
  communication: {
    deepTalks: { text: 'Deep Conversationalist', icon: <MessageSquare size={16} color={Colors.primary} /> },
    practical: { text: 'Direct Communicator', icon: <Phone size={16} color={Colors.primary} /> },
    humor: { text: 'Humor Lover', icon: <Laugh size={16} color={Colors.primary} /> },
    actions: { text: 'Actions Speaker', icon: <Clock size={16} color={Colors.primary} /> },
  },
  partnerQualities: {
    faith: { text: 'Values Faith', icon: <Star size={16} color={Colors.primary} /> },
    intellect: { text: 'Values Intelligence', icon: <Brain size={16} color={Colors.primary} /> },
    kindness: { text: 'Values Kindness', icon: <Heart size={16} color={Colors.primary} /> },
    ambition: { text: 'Values Ambition', icon: <Leaf size={16} color={Colors.primary} /> },
  }
};

const InterestTags: React.FC<InterestTagsProps> = ({ 
  interests, 
  onTagPress,
  style 
}) => {
  // Filter out options that are not selected by the user
  const getSelectedTags = () => {
    const tags: { categoryId: string; optionId: string; }[] = [];
    
    Object.entries(interests).forEach(([categoryId, optionId]) => {
      if (interestOptions[categoryId]?.[optionId]) {
        tags.push({ categoryId, optionId });
      }
    });
    
    return tags;
  };
  
  const selectedTags = getSelectedTags();
  
  if (selectedTags.length === 0) {
    return null;
  }
  
  return (
    <View style={[styles.container, style]}>
      {selectedTags.map(({ categoryId, optionId }) => {
        const option = interestOptions[categoryId][optionId];
        
        return (
          <TouchableOpacity 
            key={`${categoryId}-${optionId}`}
            style={styles.tag}
            onPress={() => onTagPress?.(categoryId, optionId)}
            activeOpacity={onTagPress ? 0.7 : 1}
            disabled={!onTagPress}
          >
            <View style={styles.iconContainer}>
              {option.icon}
            </View>
            <Text style={styles.tagText}>{option.text}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight + '30', // 30% opacity
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }
    })
  },
  iconContainer: {
    marginRight: 6,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  }
});

export default InterestTags;