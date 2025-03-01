import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { User } from 'lucide-react-native';
import Colors from '../constants/Colors';

interface GenderSelectionProps {
  selectedGender: string;
  onSelect: (gender: string) => void;
}

const GenderSelection: React.FC<GenderSelectionProps> = ({ selectedGender, onSelect }) => {
  // Animation values
  const maleAnimation = React.useRef(new Animated.Value(selectedGender === 'male' ? 1 : 0)).current;
  const femaleAnimation = React.useRef(new Animated.Value(selectedGender === 'female' ? 1 : 0)).current;
  
  const handleSelectMale = () => {
    onSelect('male');
    Animated.timing(maleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web', // Can't use native driver for background color on web
    }).start();
    Animated.timing(femaleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };
  
  const handleSelectFemale = () => {
    onSelect('female');
    Animated.timing(maleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    Animated.timing(femaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };
  
  // Interpolate colors for animations
  const maleBackgroundColor = maleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 1)', 'rgba(157, 132, 183, 0.2)']
  });
  
  const maleBorderColor = maleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.lightGray, Colors.primary]
  });
  
  const maleScale = maleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05]
  });
  
  const femaleBackgroundColor = femaleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 1)', 'rgba(157, 132, 183, 0.2)']
  });
  
  const femaleBorderColor = femaleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.lightGray, Colors.primary]
  });
  
  const femaleScale = femaleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05]
  });
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.genderCard, 
          { 
            backgroundColor: maleBackgroundColor,
            borderColor: maleBorderColor,
            transform: Platform.OS !== 'web' ? [{ scale: maleScale }] : undefined
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.genderButton}
          onPress={handleSelectMale}
          activeOpacity={0.7}
        >
          <User 
            size={70} 
            color={selectedGender === 'male' ? Colors.primary : Colors.gray} 
            strokeWidth={1.5}
          />
          <Text style={[
            styles.genderText,
            selectedGender === 'male' && styles.selectedGenderText
          ]}>
            Male
          </Text>
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.genderCard, 
          { 
            backgroundColor: femaleBackgroundColor,
            borderColor: femaleBorderColor,
            transform: Platform.OS !== 'web' ? [{ scale: femaleScale }] : undefined
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.genderButton}
          onPress={handleSelectFemale}
          activeOpacity={0.7}
        >
          <User 
            size={70} 
            color={selectedGender === 'female' ? Colors.primary : Colors.gray} 
            strokeWidth={1.5}
          />
          <Text style={[
            styles.genderText,
            selectedGender === 'female' && styles.selectedGenderText
          ]}>
            Female
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  genderCard: {
    width: '48%',
    aspectRatio: 0.8,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    })
  },
  genderButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  genderText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  selectedGenderText: {
    color: Colors.primary,
  },
});

export default GenderSelection;