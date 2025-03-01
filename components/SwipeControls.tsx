import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { X, Heart, Undo2, Zap, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

interface SwipeControlsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onRewind?: () => void;
  onBoost?: () => void;
  onCrush?: () => void;
  isPremium?: boolean;
  remainingCrushes?: number;
  showExtendedControls?: boolean;
}

const SwipeControls: React.FC<SwipeControlsProps> = ({ 
  onSwipeLeft, 
  onSwipeRight,
  onRewind,
  onBoost,
  onCrush,
  isPremium = false,
  remainingCrushes = 0,
  showExtendedControls = true
}) => {
  const navigateToPremium = () => {
    router.push('/premium');
  };
  
  const handleCrush = () => {
    // If not premium, redirect to premium page
    if (!isPremium) {
      router.push('/premium');
      return;
    }
    
    // If premium but no crushes left
    if (remainingCrushes <= 0) {
      alert('You\'ve used all your crushes for today. Come back tomorrow for more!');
      return;
    }
    
    // If premium and has crushes remaining
    if (onCrush) {
      onCrush();
    } else {
      // Default behavior if no handler provided
      alert('You sent a crush! They will be notified if they also have a crush on you.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Rewind button */}
      <TouchableOpacity
        style={[styles.button, styles.rewindButton]}
        onPress={onRewind || navigateToPremium}
      >
        <Undo2 size={24} color={Colors.premium.plus} style={styles.buttonIcon} />
      </TouchableOpacity>
      
      {/* Nope button */}
      <TouchableOpacity
        style={[styles.button, styles.nopeButton]}
        onPress={onSwipeLeft}
      >
        <X size={32} color="white" style={styles.buttonIcon} />
      </TouchableOpacity>
      
      {/* Crush button - premium feature */}
      <TouchableOpacity
        style={[styles.button, styles.crushButton]}
        onPress={handleCrush}
      >
        <Star size={28} color="white" style={styles.buttonIcon} />
        <Text style={styles.crushText}>
          {isPremium ? `Crush (${remainingCrushes})` : 'Crush'}
        </Text>
      </TouchableOpacity>
      
      {/* Like button */}
      <TouchableOpacity
        style={[styles.button, styles.likeButton]}
        onPress={onSwipeRight}
      >
        <Heart size={32} color="white" style={styles.buttonIcon} />
      </TouchableOpacity>
      
      {/* Boost button */}
      <TouchableOpacity
        style={[styles.button, styles.boostButton]}
        onPress={onBoost || navigateToPremium}
      >
        <Zap size={24} color={Colors.premium.sapphire} style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    // For subtle icon animation/effects if needed
  },
  rewindButton: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.premium.plus,
  },
  nopeButton: {
    width: 64,
    height: 64,
    backgroundColor: Colors.error,
    borderWidth: 0,
  },
  crushButton: {
    width: 56,
    height: 56,
    backgroundColor: '#FFD700', // Gold color for crush
    borderWidth: 0,
    alignItems: 'center',
  },
  crushText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  likeButton: {
    width: 64,
    height: 64,
    backgroundColor: Colors.success,
    borderWidth: 0,
  },
  boostButton: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.premium.sapphire,
  }
});

export default SwipeControls;