import { useEffect, useState } from 'react';
import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import { useAuth } from '../utils/firebase';
import { getUserProfile } from '../services/userService';

// Initialize polyfills and required modules for web platform
if (Platform.OS === 'web') {
  // Empty block needed to ensure imports are processed
  // Required for React Native Web compatibility
}

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Add this to manually move past the initializing state after a timeout
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    
    const inAuthGroup = segments[0] === 'auth';
    const isOnLandingPage = segments.length === 0 || segments[0] === 'index';
    const inOnboarding = segments[1] === 'onboarding';
    
    console.log('Auth state:', { inAuthGroup, inOnboarding, initializing, user, segments });
    
    if (!user) {
      // Not signed in
      // Only redirect if not already on landing page or in auth group
      if (!inAuthGroup && !isOnLandingPage && !initializing) {
        router.replace('/');
      }
    } else {
      // User is signed in
      
      // Get the user profile to check onboarding status
      getUserProfile(user.uid).then(result => {
        if (result.success) {
          const userData = result.data;
          
          if (!userData.onboardingCompleted && !inOnboarding) {
            // Not completed onboarding, redirect to onboarding
            router.replace('/auth/onboarding');
          } else if (inAuthGroup && userData.onboardingCompleted) {
            // Completed onboarding, redirect to main app
            router.replace('/(tabs)');
          }
        }
      });
    }
  }, [user, loading, segments, initializing]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SubscriptionProvider>
        <Stack screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}>
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="auth" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="auth/login" 
            options={{ 
              headerTitle: 'Login',
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="auth/signup" 
            options={{ 
              headerTitle: 'Sign Up',
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="auth/onboarding" 
            options={{ 
              headerTitle: 'Complete Your Profile',
              headerShown: true,
              headerBackVisible: false,
              gestureEnabled: false,
            }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              gestureEnabled: false,
            }} 
          />
          <Stack.Screen 
            name="premium" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="+not-found" 
            options={{ 
              title: 'Not Found',
            }} 
          />
          <Stack.Screen 
            name="debug" 
            options={{ 
              headerTitle: 'Firebase Debug',
            }} 
          />
          <Stack.Screen 
            name="minimal" 
            options={{ 
              title: "Minimal Route",
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </SubscriptionProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  // No need for Firebase auth state listener when using mock
  
  return <RootLayoutNav />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});