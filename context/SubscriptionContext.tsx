import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { SubscriptionTier } from '../types';
import { subscriptionPlans } from '../data/subscriptionData';
import { currentUser } from '../data/mockUsers';

// Only import InAppPurchases on native platforms
let InAppPurchases: any = null;
if (Platform.OS !== 'web') {
  try {
    // Dynamic import to avoid errors on web
    InAppPurchases = require('expo-in-app-purchases');
  } catch (error) {
    console.warn('expo-in-app-purchases not available');
  }
}

interface SubscriptionContextType {
  subscribedTier: SubscriptionTier;
  isSubscriptionLoading: boolean;
  purchaseSubscription: (planId: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
  error: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscribedTier: SubscriptionTier.FREE,
  isSubscriptionLoading: false,
  purchaseSubscription: async () => {},
  restorePurchases: async () => {},
  error: null
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscribedTier, setSubscribedTier] = useState<SubscriptionTier>(currentUser.subscriptionTier || SubscriptionTier.FREE);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize in-app purchases
  useEffect(() => {
    const initializePurchases = async () => {
      if (Platform.OS === 'web' || !InAppPurchases) {
        return; // Skip on web platform
      }
      
      try {
        await InAppPurchases.connectAsync();
        
        // This is a simulation - in a real app, you'd verify purchases on your server
        // and sync the user's subscription status
        
        // Just for simulation, add a listener for purchases
        InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }: any) => {
          if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            results?.forEach((purchase: any) => {
              // Verify the purchase with your server
              // Then unlock the content
              
              // This is simplified for demo - normally you'd verify with your server
              if (purchase.productId.includes('sapphire')) {
                setSubscribedTier(SubscriptionTier.SAPPHIRE);
              } else if (purchase.productId.includes('plus')) {
                setSubscribedTier(SubscriptionTier.PLUS);
              }
              
              // Finish the transaction
              InAppPurchases.finishTransactionAsync(purchase, true);
            });
          }
        });
        
      } catch (err) {
        console.warn('Failed to initialize in-app purchases:', err);
        setError('Failed to initialize purchases');
      }
    };
    
    if (Platform.OS !== 'web' && InAppPurchases) {
      initializePurchases();
    }
    
    return () => {
      // Disconnect when component unmounts
      if (Platform.OS !== 'web' && InAppPurchases) {
        InAppPurchases.disconnectAsync().catch((err: any) => {
          console.warn('Error disconnecting from in-app purchases:', err);
        });
      }
    };
  }, []);

  const purchaseSubscription = async (planId: string) => {
    setIsSubscriptionLoading(true);
    setError(null);
    
    try {
      const plan = subscriptionPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Invalid subscription plan');
      }
      
      // For both web and native, simulate a purchase for the demo
      // In a real app, this would be handled differently for each platform
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request
      
      if (planId === 'sapphire') {
        setSubscribedTier(SubscriptionTier.SAPPHIRE);
      } else if (planId === 'plus') {
        setSubscribedTier(SubscriptionTier.PLUS);
      }
      
      Alert.alert('Success', `You have successfully subscribed to ${plan.name}!`);
      
    } catch (err: any) {
      console.warn('Purchase error:', err);
      setError(err.message || 'Failed to complete purchase');
      Alert.alert('Purchase Failed', 'There was an error processing your purchase. Please try again later.');
    } finally {
      setIsSubscriptionLoading(false);
    }
  };
  
  const restorePurchases = async () => {
    setIsSubscriptionLoading(true);
    setError(null);
    
    try {
      // Simulate restore for all platforms in this demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Purchases Restored', 'Your purchases have been restored successfully.');
      
    } catch (err: any) {
      console.warn('Restore purchases error:', err);
      setError(err.message || 'Failed to restore purchases');
      Alert.alert('Restore Failed', 'There was an error restoring your purchases. Please try again later.');
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider 
      value={{
        subscribedTier,
        isSubscriptionLoading,
        purchaseSubscription,
        restorePurchases,
        error
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};