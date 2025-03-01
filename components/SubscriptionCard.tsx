import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown, ArrowRight } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { SubscriptionPlan, SubscriptionFeature, SubscriptionTier } from '../types';
import { getFeatureIcon } from '../utils/subscription';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  currentTier: SubscriptionTier;
  isLoading: boolean;
  onSelect: (planId: string) => void;
  style?: Object;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ 
  plan,
  currentTier,
  isLoading,
  onSelect,
  style
}) => {
  const isCurrentPlan = currentTier === plan.tier;
  const isFree = plan.tier === SubscriptionTier.FREE;
  const isSapphire = plan.tier === SubscriptionTier.SAPPHIRE;
  
  const renderGradientBackground = () => {
    if (plan.tier === SubscriptionTier.PLUS) {
      return (
        <LinearGradient
          colors={[Colors.premium.plusGradientStart, Colors.premium.plusGradientEnd]}
          style={styles.badge}
        >
          <Text style={styles.badgeText}>Popular</Text>
        </LinearGradient>
      );
    } else if (plan.tier === SubscriptionTier.SAPPHIRE) {
      return (
        <LinearGradient
          colors={[Colors.premium.sapphireGradientStart, Colors.premium.sapphireGradientEnd]}
          style={styles.badge}
        >
          <Crown size={12} color={Colors.white} style={styles.badgeIcon} />
          <Text style={styles.badgeText}>Premium</Text>
        </LinearGradient>
      );
    }
    return null;
  };
  
  const renderFeatures = () => {
    if (isFree) {
      // For free plan, show limited features
      return (
        <View style={styles.limitedFeaturesContainer}>
          <Text style={styles.limitedFeaturesText}>
            Limited features: 10 swipes per day, basic matching
          </Text>
        </View>
      );
    }
    
    return plan.features.map((feature, index) => {
      const FeatureIcon = getFeatureIcon(feature.icon);
      
      return (
        <View key={feature.id} style={styles.featureItem}>
          <FeatureIcon size={20} color={plan.color} style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureName}>{feature.name}</Text>
            {feature.isPopular && (
              <View style={[styles.popularBadge, { backgroundColor: plan.color + '30' }]}>
                <Text style={[styles.popularBadgeText, { color: plan.color }]}>Popular</Text>
              </View>
            )}
          </View>
        </View>
      );
    });
  };
  
  const buttonStyle = () => {
    if (isCurrentPlan) {
      return [styles.button, styles.currentButton];
    }
    
    if (plan.tier === SubscriptionTier.PLUS) {
      return [styles.button, styles.plusButton];
    }
    
    if (plan.tier === SubscriptionTier.SAPPHIRE) {
      return [styles.button, styles.sapphireButton];
    }
    
    return [styles.button, styles.freeButton];
  };
  
  const buttonTextStyle = () => {
    if (isCurrentPlan) {
      return styles.currentButtonText;
    }
    
    if (isFree || plan.tier === SubscriptionTier.PLUS || plan.tier === SubscriptionTier.SAPPHIRE) {
      return styles.premiumButtonText;
    }
    
    return styles.buttonText;
  };
  
  const buttonContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={Colors.white} />;
    }
    
    if (isCurrentPlan) {
      return (
        <>
          <Check size={20} color={Colors.success} style={{ marginRight: 8 }} />
          <Text style={buttonTextStyle()}>Current Plan</Text>
        </>
      );
    }
    
    if (isFree) {
      return <Text style={buttonTextStyle()}>Continue with Free</Text>;
    }
    
    return (
      <>
        <Text style={buttonTextStyle()}>
          Subscribe
        </Text>
        <ArrowRight size={16} color={Colors.white} style={{ marginLeft: 8 }} />
      </>
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      {renderGradientBackground()}
      
      <View style={styles.header}>
        <Text style={styles.name}>{plan.name}</Text>
        {plan.price > 0 && (
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>$</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.period}>/ {plan.period}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.featuresContainer}>
        {renderFeatures()}
      </View>
      
      <TouchableOpacity
        style={buttonStyle()}
        onPress={() => onSelect(plan.id)}
        disabled={isCurrentPlan || isLoading}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          {buttonContent()}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: -30,
    paddingHorizontal: 30,
    paddingVertical: 6,
    transform: [{ rotate: '45deg' }],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  badgeIcon: {
    marginRight: 4,
  },
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 4,
  },
  period: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  featureName: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  popularBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  limitedFeaturesContainer: {
    padding: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    marginTop: 8,
  },
  limitedFeaturesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeButton: {
    backgroundColor: Colors.lightGray,
  },
  plusButton: {
    backgroundColor: Colors.premium.plus,
  },
  sapphireButton: {
    backgroundColor: Colors.premium.sapphire,
  },
  currentButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  currentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
  }
});

export default SubscriptionCard;