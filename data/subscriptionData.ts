import { SubscriptionPlan, SubscriptionFeature, SubscriptionTier } from '../types';
import Colors from '../constants/Colors';

// Define subscription features
export const subscriptionFeatures: { [key: string]: SubscriptionFeature } = {
  unlimitedSwipes: {
    id: 'unlimitedSwipes',
    name: 'Unlimited Swipes',
    description: 'No daily limit on the number of profiles you can view',
    icon: 'infinity'
  },
  rewind: {
    id: 'rewind',
    name: 'Rewind / Undo',
    description: 'Change your mind? Go back to profiles you swiped left on',
    icon: 'undo-2',
    isPopular: true
  },
  boost: {
    id: 'boost',
    name: 'Daily Boost',
    description: 'Get more profile visibility once per day',
    icon: 'zap',
    isPopular: true
  },
  stealthMode: {
    id: 'stealthMode',
    name: 'Shadow Mode',
    description: 'Browse profiles without them knowing you visited. Stay in the shadows while you explore.',
    icon: 'eye-off'
  },
  seeWhoLikesYou: {
    id: 'seeWhoLikesYou',
    name: 'See Who Likes You',
    description: 'See profiles of people who have already liked you',
    icon: 'heart',
    isPopular: true
  },
  messageBeforeMatch: {
    id: 'messageBeforeMatch',
    name: 'Message Before Matching',
    description: 'Send messages to profiles without matching first',
    icon: 'message-circle',
    isPopular: true
  }
};

// Define subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    tier: SubscriptionTier.FREE,
    name: 'Free',
    price: 0,
    period: 'month',
    features: [],
    color: Colors.gray,
    storeProductIds: {}
  },
  {
    id: 'plus',
    tier: SubscriptionTier.PLUS,
    name: 'Naseebi Plus',
    price: 24.99,
    period: 'month',
    features: [
      subscriptionFeatures.unlimitedSwipes,
      subscriptionFeatures.rewind,
      subscriptionFeatures.boost,
      subscriptionFeatures.stealthMode
    ],
    color: Colors.premium.plus,
    storeProductIds: {
      ios: 'naseebi.plus.monthly',
      android: 'naseebi.plus.monthly'
    }
  },
  {
    id: 'sapphire',
    tier: SubscriptionTier.SAPPHIRE,
    name: 'Naseebi Sapphire',
    price: 34.99,
    period: 'month',
    features: [
      subscriptionFeatures.unlimitedSwipes,
      subscriptionFeatures.rewind,
      subscriptionFeatures.boost,
      subscriptionFeatures.stealthMode,
      subscriptionFeatures.seeWhoLikesYou,
      subscriptionFeatures.messageBeforeMatch
    ],
    color: Colors.premium.sapphire,
    storeProductIds: {
      ios: 'naseebi.sapphire.monthly',
      android: 'naseebi.sapphire.monthly'
    }
  }
];