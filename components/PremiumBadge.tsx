import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Crown } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { SubscriptionTier } from '../types';
import { useSubscription } from '../context/SubscriptionContext';
import { router } from 'expo-router';

interface PremiumBadgeProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: Object;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  showLabel = true,
  size = 'medium',
  onPress,
  style
}) => {
  const { subscribedTier } = useSubscription();
  
  // Determine if user has any premium tier
  const isPremium = subscribedTier !== SubscriptionTier.FREE;
  
  // Determine which premium tier the user has
  const tierName = subscribedTier === SubscriptionTier.SAPPHIRE 
    ? 'Sapphire' 
    : subscribedTier === SubscriptionTier.PLUS 
      ? 'Plus' 
      : '';
  
  // Determine badge color based on subscription
  const badgeColor = subscribedTier === SubscriptionTier.SAPPHIRE 
    ? Colors.premium.sapphire 
    : Colors.premium.plus;
  
  // Determine icon and text sizes based on size prop
  const getIconSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 18;
      default: return 14;
    }
  };
  
  // If user doesn't have premium, render "Get Premium" badge
  if (!isPremium) {
    const handlePress = () => {
      if (onPress) {
        onPress();
      } else {
        router.push('/premium');
      }
    };
    
    return (
      <TouchableOpacity
        style={[styles.container, styles.getPremiumContainer, style]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Crown size={getIconSize()} color={Colors.white} />
        {showLabel && <Text style={styles.getPremiumText}>Get Premium</Text>}
      </TouchableOpacity>
    );
  }
  
  // Render premium badge for existing subscribers
  return (
    <View style={[
      styles.container, 
      { backgroundColor: badgeColor + '20' }, // 20% opacity 
      style
    ]}>
      <Crown size={getIconSize()} color={badgeColor} />
      {showLabel && tierName && (
        <Text style={[styles.tierText, { color: badgeColor }]}>
          {tierName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginTop: -8, // Further reduced top margin to move it up
    position: 'relative', // Ensure it stays in position
  },
  getPremiumContainer: {
    backgroundColor: Colors.premium.sapphire,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, // Increased shadow opacity
        shadowRadius: 5, // Increased shadow radius
      },
      android: {
        elevation: 4, // Increased elevation
      },
      web: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
    }),
  },
  getPremiumText: {
    fontSize: 14,
    fontWeight: '800', // Made even more bold
    color: Colors.white,
    marginLeft: 6,
  },
  tierText: {
    fontSize: 14,
    fontWeight: '800', // Made even more bold
    marginLeft: 6,
  }
});

export default PremiumBadge;