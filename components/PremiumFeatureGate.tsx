import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Crown, Lock } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { SubscriptionTier } from '../types';
import { useSubscription } from '../context/SubscriptionContext';
import { router } from 'expo-router';

interface PremiumFeatureGateProps {
  children: React.ReactNode;
  requiredTier: SubscriptionTier;
  featureName: string;
  description?: string;
  style?: Object;
}

const PremiumFeatureGate: React.FC<PremiumFeatureGateProps> = ({
  children,
  requiredTier,
  featureName,
  description,
  style
}) => {
  const { subscribedTier } = useSubscription();
  
  // Check if the user has access to this feature
  const hasAccess = (): boolean => {
    if (subscribedTier === SubscriptionTier.SAPPHIRE) {
      return true; // Sapphire has access to everything
    }
    
    if (subscribedTier === SubscriptionTier.PLUS && requiredTier === SubscriptionTier.PLUS) {
      return true; // Plus has access to Plus features
    }
    
    return requiredTier === SubscriptionTier.FREE; // Free tier only has access to free features
  };
  
  const navigateToSubscription = () => {
    router.push('/premium');
  };
  
  // If the user has access, simply render the children
  if (hasAccess()) {
    return <>{children}</>;
  }
  
  // Otherwise show a locked feature UI
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Lock size={24} color={Colors.textSecondary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{featureName}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={navigateToSubscription}
        activeOpacity={0.8}
      >
        <Crown size={16} color={Colors.white} style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  button: {
    backgroundColor: Colors.premium.sapphire,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  }
});

export default PremiumFeatureGate;