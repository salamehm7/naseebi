import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EyeOff, Users, Star, Crown, MessageSquare, Calendar, Bell, Shield } from 'lucide-react-native';
import Colors from '../constants/Colors';

export const getPremiumFeatureIcon = (featureId: string, color: string) => {
  const iconSize = 24;
  switch (featureId) {
    case 'basic-match':
      return <Users size={iconSize} color={color} />;
    case 'basic-messages':
      return <MessageSquare size={iconSize} color={color} />;
    case 'plus-likes':
      return <Star size={iconSize} color={color} />;
    case 'plus-shadow':
      return <EyeOff size={iconSize} color={color} />;
    case 'plus-notifications':
      return <Bell size={iconSize} color={color} />;
    case 'sapphire-badge':
      return <Crown size={iconSize} color={color} />;
    case 'sapphire-filters':
      return <Calendar size={iconSize} color={color} />;
    case 'sapphire-boost':
      return <Shield size={iconSize} color={color} />;
    default:
      return <Star size={iconSize} color={color} />;
  }
};

export const premiumFeaturesData = {
  basic: [
    {
      id: 'basic-match',
      title: "Match with Other Singles",
      description: "Connect with compatible Muslims in your area"
    },
    {
      id: 'basic-messages',
      title: "Limited Messages",
      description: "Send up to 10 messages per day"
    }
  ],
  plus: [
    {
      id: 'plus-likes',
      title: "Unlimited Likes",
      description: "Send as many likes as you want to potential matches"
    },
    {
      id: 'plus-shadow',
      title: "Shadow Mode",
      description: "Browse profiles without them knowing you visited. Stay in the shadows while you explore."
    },
    {
      id: 'plus-notifications',
      title: "Priority Notifications",
      description: "Get notified immediately when someone likes your profile"
    }
  ],
  sapphire: [
    {
      id: 'sapphire-badge',
      title: "Premium Badge",
      description: "Stand out with a special badge on your profile"
    },
    {
      id: 'sapphire-filters',
      title: "Advanced Filters",
      description: "Filter matches by more specific criteria to find exactly what you're looking for"
    },
    {
      id: 'sapphire-boost',
      title: "Profile Boosting",
      description: "Get up to 10x more profile views with regular boosts"
    }
  ]
};

export const PremiumFeatureItem = ({ feature, color = Colors.white }) => {
  return (
    <View style={styles.featureItem}>
      <View style={styles.iconContainer}>
        {getPremiumFeatureIcon(feature.id, color)}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
}); 