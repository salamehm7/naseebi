import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import Colors from '../constants/Colors';

interface HeartLogoProps {
  size?: number;
  color?: string;
  textColor?: string;
  fontSize?: number;
  showText?: boolean;
}

const HeartLogo: React.FC<HeartLogoProps> = ({ 
  size = 40, 
  color = Colors.primary, 
  textColor = Colors.white,
  fontSize = 42,
  showText = true
}) => {
  // Create an array of individual letters
  const letters = ['N', 'a', 's', 'e', 'e', 'b', 'i'];
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {showText && (
        <View style={styles.textContainer}>
          {letters.map((letter, index) => (
            <Text 
              key={index} 
              style={[
                styles.logoLetter,
                index === 0 && styles.capitalLetter, // Special styling for capital letter
                letter === 'e' && styles.specialLetter, // Special styling for 'e'
                {
                  color: textColor,
                  fontSize: letter === 'N' ? fontSize : fontSize * 0.85,
                  transform: [
                    { rotate: index % 2 === 0 ? '0deg' : '1deg' }, // Slightly rotate alternate letters
                    { translateY: letter === 'a' || letter === 'e' ? 1 : 0 } // Adjust baseline for some letters
                  ],
                }
              ]}
            >
              {letter}
            </Text>
          ))}
        </View>
      )}
      
      {/* Heart icon */}
      <View style={styles.heartContainer}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={color}
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoLetter: {
    // Use a mix of fonts for a custom look
    fontFamily: Platform.select({
      ios: 'Futura',
      android: 'sans-serif-condensed',
      web: "'Raleway', sans-serif"
    }),
    fontWeight: '800',
    marginHorizontal: -0.5, // Tighten letter spacing slightly
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 3,
  },
  capitalLetter: {
    fontWeight: '900',
    marginRight: 0, // Add space after capital letter
  },
  specialLetter: {
    fontStyle: 'italic', // Make the 'e' letters italic for a custom look
  },
  heartContainer: {
    marginLeft: 8,
    transform: [{ rotate: '8deg' }], // Slightly tilt the heart
  },
});

export default HeartLogo;