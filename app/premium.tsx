import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Crown, Heart, Rewind, Zap, CheckCircle, MessageSquare, Eye, Star, Filter, MapPin, MessageCircle, Image as ImageIcon } from 'lucide-react-native';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import { useAuth } from '../utils/firebase';
import { updateUserProfile } from '../services/userService';
import { Analytics } from '../utils/firebase';

const { width } = Dimensions.get('window');

const Premium = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Default to Sapphire if coming from blur photos, otherwise Plus
  const initialTier = params.tier === 'sapphire' ? 'sapphire' : 'plus';
  const [subscriptionTier, setSubscriptionTier] = useState(initialTier);
  const [selectedPlan, setSelectedPlan] = useState(1); // Default to middle plan (3 months)

  const isSapphire = subscriptionTier === 'sapphire';

  const plusPlans = [
    {
      id: 0,
      duration: '12',
      unit: 'months',
      savePercent: '75%',
      price: '$149.99',
      originalPrice: '$599.99',
      monthly: '$12.50/mo',
    },
    {
      id: 1,
      duration: '3',
      unit: 'months',
      savePercent: '67%',
      price: '$49.99',
      originalPrice: '$149.99',
      monthly: '$16.67/mo',
      mostPopular: true,
    },
    {
      id: 2,
      duration: '1',
      unit: 'month',
      savePercent: '50%',
      price: '$24.99',
      originalPrice: '$49.99',
      monthly: '',
    },
  ];

  const sapphirePlans = [
    {
      id: 0,
      duration: '12',
      unit: 'months',
      savePercent: '75%',
      price: '$359.99',
      originalPrice: '$1,439.99',
      monthly: '$30.00/mo',
    },
    {
      id: 1,
      duration: '3',
      unit: 'months',
      savePercent: '67%',
      price: '$119.99',
      originalPrice: '$359.99',
      monthly: '$40.00/mo',
      mostPopular: true,
    },
    {
      id: 2,
      duration: '1',
      unit: 'month',
      savePercent: '50%',
      price: '$59.99',
      originalPrice: '$119.99',
      monthly: '',
    },
  ];

  const plans = isSapphire ? sapphirePlans : plusPlans;

  const plusFeatures = [
    {
      id: 'see_likes',
      title: 'See Who Likes You',
      description: 'View profiles of users who liked you before swiping',
      icon: <Heart size={24} color="#FF6B6B" />
    },
    {
      id: 'unlimited_likes',
      title: 'Unlimited Likes',
      description: 'Send as many likes as you want each day',
      icon: <Heart size={24} color="#FF6B6B" />
    },
    {
      id: 'crush',
      title: 'Free Crush x2/day',
      description: 'Send two "Crush" super likes every day',
      icon: <Star size={24} color="#FF9500" />
    },
    {
      id: 'read_receipts',
      title: 'Read Receipts',
      description: 'See when your messages have been read',
      icon: <CheckCircle size={24} color="#4CD964" />
    },
    {
      id: 'boost',
      title: '1 Boost/Week',
      description: 'Get more visibility for 30 minutes weekly',
      icon: <Zap size={24} color="#5856D6" />
    },
    {
      id: 'unlock',
      title: 'Unlock My Likes',
      description: 'View and match with users who already liked you',
      icon: <Eye size={24} color="#007AFF" />
    },
    {
      id: 'rewind',
      title: 'Unlimited Rewind',
      description: 'Change your mind? Go back to profiles you passed',
      icon: <Rewind size={24} color="#FF9500" />
    },
    {
      id: 'badge',
      title: isSapphire ? 'Naseebi Sapphire Icon' : 'Naseebi Plus Icon',
      description: 'Stand out with a premium badge on your profile',
      icon: <Crown size={24} color={isSapphire ? "#B19CD9" : "#FFD700"} />
    }
  ];

  const sapphireFeatures = [
    {
      id: 'nearby',
      title: 'People Nearby',
      description: 'Discover and connect with people in your area',
      icon: <MapPin size={24} color="#B19CD9" />
    },
    {
      id: 'praise',
      title: '3 Free Praise Per Day',
      description: 'Send a message before matching when you meet someone you like',
      icon: <MessageCircle size={24} color="#B19CD9" />
    },
    {
      id: 'filters',
      title: 'Advanced Filters',
      description: 'Filter and find people who match your preferences',
      icon: <Filter size={24} color="#B19CD9" />
    },
    {
      id: 'blur',
      title: 'Blur Your Photos',
      description: "Control who sees your photos until you're ready",
      icon: <ImageIcon size={24} color="#B19CD9" />
    }
  ];

  // Combine features for Sapphire tier
  const features = isSapphire ? [...sapphireFeatures, ...plusFeatures] : plusFeatures;

  const { user } = useAuth();

  const handleSubscribe = async (tier, plan) => {
    if (!user) return;
    
    try {
      // In a real app, you'd integrate with a payment provider here
      // For now, we'll just update the user profile
      
      // Calculate expiry date based on plan duration
      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setMonth(now.getMonth() + parseInt(plan.duration));
      
      await updateUserProfile(user.uid, {
        subscriptionTier: tier,
        subscriptionExpiry: expiryDate,
        subscriptionPlan: plan.id
      });
      
      // Track subscription with analytics
      await Analytics.logEvent('subscription_purchased', {
        user_id: user.uid,
        tier,
        plan: plan.id,
        duration: plan.duration,
        price: plan.price
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error processing subscription:', error);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, isSapphire && styles.sapphireContainer]}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={isSapphire ? "white" : Colors.text} />
          </TouchableOpacity>
          
          <View style={styles.tierToggleContainer}>
            <TouchableOpacity 
              style={[
                styles.tierButton, 
                !isSapphire && styles.activeTierButton
              ]}
              onPress={() => setSubscriptionTier('plus')}
            >
              <Text style={[
                styles.tierButtonText,
                !isSapphire && styles.activeTierButtonText
              ]}>Plus</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.tierButton, 
                isSapphire && styles.activeSapphireButton
              ]}
              onPress={() => setSubscriptionTier('sapphire')}
            >
              <Text style={[
                styles.tierButtonText,
                isSapphire && styles.activeSapphireTierButtonText
              ]}>Sapphire</Text>
            </TouchableOpacity>
          </View>
          </View>
          
        <View style={styles.titleContainer}>
          <Text style={[styles.premiumText, isSapphire && styles.sapphireText]}>Naseebi</Text>
          <Text style={[styles.plusText, isSapphire && styles.sapphirePlusText]}>
            {isSapphire ? 'Sapphire' : 'Plus'}
            </Text>
          <Text style={[styles.tradeMark, isSapphire && styles.sapphireTradeMark]}>™</Text>
        </View>

        <View style={styles.crownContainer}>
          <Crown size={56} color={isSapphire ? "#B19CD9" : "#FFD700"} />
          </View>

        <Text style={[styles.tagline, isSapphire && styles.sapphireTagline]}>
          {isSapphire 
            ? "Get Naseebi Sapphire to find the best users near you. Send a message without matching!"
            : "See Who Likes You with Naseebi Plus. Get matches and start chatting right away."}
        </Text>

        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
                selectedPlan === plan.id && isSapphire && styles.selectedSapphirePlan,
                plan.mostPopular && styles.popularPlan,
                plan.mostPopular && isSapphire && styles.popularSapphirePlan,
                isSapphire && styles.sapphirePlanCard
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <Text style={[
                styles.saveText, 
                isSapphire && styles.sapphireSaveText
              ]}>SAVE {plan.savePercent}</Text>
              <Text style={[
                styles.durationText,
                isSapphire && styles.sapphireDurationText
              ]}>
                {plan.duration}
                <Text style={[
                  styles.unitText,
                  isSapphire && styles.sapphireUnitText
                ]}> {plan.unit}</Text>
              </Text>
              <Text style={[
                styles.priceText,
                isSapphire && styles.sapphirePriceText
              ]}>{plan.price}</Text>
              <Text style={[
                styles.originalPriceText,
                isSapphire && styles.sapphireOriginalPriceText
              ]}>{plan.originalPrice}</Text>
              {plan.monthly ? (
                <Text style={[
                  styles.monthlyText,
                  isSapphire && styles.sapphireMonthlyText
                ]}>{plan.monthly}</Text>
              ) : (
                <View style={{height: 20}} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.perDayContainer}>
          <View style={[
            styles.perDayBubble,
            isSapphire && styles.sapphirePerDayBubble
          ]}>
            <Text style={styles.perDayText}>
              ${isSapphire 
                ? (selectedPlan === 0 ? '0.99' : selectedPlan === 1 ? '1.32' : '1.99') 
                : (selectedPlan === 0 ? '0.41' : selectedPlan === 1 ? '0.55' : '0.83')}/day
            </Text>
          </View>
        </View>

        <TouchableOpacity style={[
          styles.continueButton,
          isSapphire && styles.sapphireContinueButton
        ]}>
          <Text style={[
            styles.continueText,
            isSapphire && styles.sapphireContinueText
          ]}>CONTINUE</Text>
        </TouchableOpacity>
        
        <Text style={[
          styles.autoRenewalText,
          isSapphire && styles.sapphireAutoRenewalText
        ]}>
          Auto-renewal. Cancel at any time.
        </Text>

        {/* Features */}
        <View style={[
          styles.featuresContainer,
          isSapphire && styles.sapphireFeaturesContainer
        ]}>
          <Text style={[
            styles.featuresTitle,
            isSapphire && styles.sapphireFeaturesTitle
          ]}>
            Naseebi {isSapphire ? 'Sapphire' : 'Plus'} Privileges
          </Text>
          
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={[
                styles.featureIconContainer,
                isSapphire && styles.sapphireFeatureIconContainer
              ]}>
                {feature.icon}
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={[
                  styles.featureTitle,
                  isSapphire && styles.sapphireFeatureTitle
                ]}>{feature.title}</Text>
                <Text style={[
                  styles.featureDescription,
                  isSapphire && styles.sapphireFeatureDescription
                ]}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[
            styles.footerText,
            isSapphire && styles.sapphireFooterText
          ]}>
            By purchasing, you agree to our Terms of Service. The payment for the subscription will be charged to your iTunes account. Your subscription will be automatically renewed unless auto-renewal is turned off at least 24 hours before the end of the current period.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6', // Light cream background for Plus
  },
  sapphireContainer: {
    backgroundColor: '#101010', // Dark background for Sapphire
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 8,
    position: 'absolute',
    left: 16,
    top: 20,
    zIndex: 10,
  },
  tierToggleContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tierButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  tierButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  activeTierButton: {
    backgroundColor: '#FFD700',
  },
  activeSapphireButton: {
    backgroundColor: '#B19CD9',
  },
  activeTierButtonText: {
    color: '#000',
  },
  activeSapphireTierButtonText: {
    color: '#000',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: 20,
  },
  premiumText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for "Naseebi"
  },
  sapphireText: {
    color: '#B19CD9', // Lavender color for Sapphire
  },
  plusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Black for "Plus"
    marginLeft: 4,
  },
  sapphirePlusText: {
    color: '#FFF', // White for "Sapphire" text
  },
  tradeMark: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 2,
  },
  sapphireTradeMark: {
    color: '#FFF',
  },
  crownContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.text,
    paddingHorizontal: 30,
    lineHeight: 26,
    marginBottom: 30,
  },
  sapphireTagline: {
    color: '#FFF',
  },
  plansContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  planCard: {
    width: '31%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sapphirePlanCard: {
    backgroundColor: '#333',
    borderColor: '#444',
  },
  selectedPlan: {
    borderColor: '#FFD700',
    borderWidth: 2,
    backgroundColor: '#FFFAEE',
  },
  selectedSapphirePlan: {
    borderColor: '#B19CD9',
    backgroundColor: '#212121',
  },
  popularPlan: {
    backgroundColor: '#FFFAEE',
  },
  popularSapphirePlan: {
    backgroundColor: '#212121',
  },
  saveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  sapphireSaveText: {
    color: '#B19CD9',
  },
  durationText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sapphireDurationText: {
    color: '#FFF',
  },
  unitText: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  sapphireUnitText: {
    color: '#CCC',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  sapphirePriceText: {
    color: '#FFF',
  },
  originalPriceText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  sapphireOriginalPriceText: {
    color: '#888',
  },
  monthlyText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  sapphireMonthlyText: {
    color: '#B19CD9',
  },
  perDayContainer: {
    alignItems: 'flex-end',
    paddingRight: 20,
    marginTop: 16,
  },
  perDayBubble: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    transform: [{ rotate: '5deg' }],
  },
  sapphirePerDayBubble: {
    backgroundColor: '#B19CD9',
  },
  perDayText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#FFD700',
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sapphireContinueButton: {
    backgroundColor: '#B19CD9',
  },
  continueText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sapphireContinueText: {
    color: '#000',
  },
  autoRenewalText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 30,
  },
  sapphireAutoRenewalText: {
    color: '#888',
  },
  featuresContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 30,
  },
  sapphireFeaturesContainer: {
    backgroundColor: '#222',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  sapphireFeaturesTitle: {
    color: '#FFF',
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sapphireFeatureIconContainer: {
    backgroundColor: '#333',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  sapphireFeatureTitle: {
    color: '#FFF',
  },
  featureDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sapphireFeatureDescription: {
    color: '#AAA',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  sapphireFooterText: {
    color: '#888',
  },
});

export default Premium;