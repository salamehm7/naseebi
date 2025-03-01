import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Remote profile images from Unsplash
const PROFILE_IMAGES = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
];

// Define bubble positions for a tree-like structure that fits in the available space
const BUBBLE_POSITIONS = [
  // Trunk - central bubbles (kept higher in the available space)
  { x: 0.5, y: 0.12, size: 65 },   // Top of trunk (moved up slightly)
  { x: 0.5, y: 0.23, size: 70 },   // Middle of trunk (moved up slightly)
  { x: 0.5, y: 0.34, size: 75 },   // Base of trunk (moved up significantly)
  
  // Left branches (adjusted to stay in bounds)
  { x: 0.35, y: 0.15, size: 55 },  // Upper left branch (moved up)
  { x: 0.25, y: 0.24, size: 58 },  // Middle left branch (moved up)
  { x: 0.15, y: 0.32, size: 52 },  // Lower left branch (moved up significantly)
  
  // Right branches (adjusted to stay in bounds)
  { x: 0.65, y: 0.14, size: 56 },  // Upper right branch (moved up)
  { x: 0.78, y: 0.25, size: 60 },  // Middle right branch (moved up)
  { x: 0.85, y: 0.31, size: 50 },  // Lower right branch (moved up significantly)
];

export default function ProfileBubbles() {
  // Create animated value refs for each bubble
  const animatedValues = useRef(
    BUBBLE_POSITIONS.map(() => new Animated.Value(0))
  ).current;
  
  useEffect(() => {
    // Create animations for each bubble with staggered timing and smooth easing
    const animations = animatedValues.map((value, index) => {
      // Reset the value before starting animation
      value.setValue(0);
      
      // Create a sequence that repeats forever with smooth easing
      return Animated.loop(
        Animated.sequence([
          // Delay start based on index for staggered effect
          Animated.delay(index * 300),
          // Float with smooth easing
          Animated.timing(value, {
            toValue: 1,
            duration: 3000 + (index % 3) * 500,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
            useNativeDriver: true,
          }),
          // Float back with smooth easing
          Animated.timing(value, {
            toValue: 0,
            duration: 3000 + (index % 3) * 500,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
            useNativeDriver: true,
          }),
          // Small pause before repeating
          Animated.delay(200),
        ])
      );
    });
    
    // Start all animations
    Animated.parallel(animations).start();
    
    // Clean up animations on unmount
    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);
  
  return (
    <View style={styles.container}>
      {BUBBLE_POSITIONS.map((position, index) => {
        const imageUri = PROFILE_IMAGES[index % PROFILE_IMAGES.length];
        
        // Base position from the tree structure - positioned within the container height
        const baseX = position.x * width;
        const baseY = position.y * height * 0.65; // Reduced from 0.7 to 0.65 to keep bubbles higher
        
        // Smaller amplitude variables for more subtle movement
        const xAmplitude = 6 + (index % 3) * 4;
        const yAmplitude = 10 + (index % 4) * 5;
        
        // Alternate movement directions based on position
        const moveDirection = index % 2 === 0 ? 1 : -1;
        
        // Create transform with interpolated values
        const translateY = animatedValues[index].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, moveDirection * -yAmplitude, 0],
          extrapolate: 'clamp',
        });
        
        const translateX = animatedValues[index].interpolate({
          inputRange: [0, 0.25, 0.75, 1],
          outputRange: [0, xAmplitude, -xAmplitude, 0],
          extrapolate: 'clamp',
        });
        
        return (
          <Animated.View
            key={index}
            style={[
              styles.bubble,
              {
                left: baseX - position.size / 2,
                top: baseY - position.size / 2,
                width: position.size,
                height: position.size,
                transform: [{ translateX }, { translateY }],
                zIndex: 10 - index,
              },
            ]}
          >
            <Image 
              source={{ uri: imageUri }} 
              style={styles.image} 
              fadeDuration={0}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
    // Ensure container doesn't grow beyond its allocated space
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});