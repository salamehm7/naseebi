import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import ProfileBubbles from '../components/ProfileBubbles';
import HeartLogo from '../components/HeartLogo';
import { useAuth } from '../utils/firebase';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const { user } = useAuth();
  
  // Check if user is already authenticated
  useEffect(() => {
    // If already logged in, redirect to main app
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleLogin = () => {
    // Navigate directly to the login screen
    router.replace('/auth/login');
  };

  const handleSignup = () => {
    router.replace('/auth/signup');
  };

  return (
    <View style={styles.container}>
      {/* Lavender Gradient Background */}
      <LinearGradient
        colors={[
          Colors.primaryDark, // Deep lavender
          Colors.primary, // Lavender
          Colors.primaryLight, // Light lavender
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Logo and Tagline */}
      <View style={styles.logoContainer}>
        <HeartLogo size={64} color={Colors.white} fontSize={58} />
        <Text style={styles.tagline}>Where Deen Meets Destiny - Continue Your Journey</Text>
      </View>
      
      {/* Animated Profile Bubbles */}
      <View style={styles.bubblesContainer}>
        <ProfileBubbles />
      </View>
      
      {/* Floating Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Find Your Perfect Match</Text>
        <Text style={styles.subtitle}>
          Connect with like-minded individuals who share your values and faith
        </Text>

        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} style={styles.button} variant="primary" />
          <Button 
            title="Create Account" 
            onPress={handleSignup} 
            style={{...styles.button, ...styles.createAccountButton}} 
            variant="outline" 
          />
        </View>

        <Text style={styles.termsText}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  logoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 80 : 60, // Adjusted to move down a bit
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 16,
    zIndex: 10,
  },
  tagline: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    paddingHorizontal: 24,
    marginTop: 12, // Added more space below the logo
  },
  bubblesContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 240 : 220, // Adjusted based on new logo position
    left: 0,
    right: 0,
    height: 220,
  },
  contentContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 32,
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
    }),
  },
  createAccountButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: Colors.white,
    borderWidth: 2,
  },
  termsText: {
    fontSize: 12,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
});