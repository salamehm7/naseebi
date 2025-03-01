import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import Colors from '../constants/Colors';

interface PrayerFrequencySelectorProps {
  selectedFrequency: string;
  onSelect: (frequency: string) => void;
}

const PrayerFrequencySelector: React.FC<PrayerFrequencySelectorProps> = ({ 
  selectedFrequency, 
  onSelect 
}) => {
  const frequencies = [
    { id: 'five_daily', label: 'Five times daily', description: 'I pray all five daily prayers' },
    { id: 'most_daily', label: 'Most daily prayers', description: 'I pray most of the five daily prayers' },
    { id: 'some_daily', label: 'Some daily prayers', description: 'I pray some of the five daily prayers' },
    { id: 'friday', label: 'Friday prayers', description: 'I mainly attend Friday prayers' },
    { id: 'occasionally', label: 'Occasionally', description: 'I pray occasionally' },
    { id: 'rarely', label: 'Rarely', description: 'I rarely pray but am working on it' },
  ];
  
  const renderFrequencyItem = (item: { id: string; label: string; description: string }) => {
    const isSelected = item.id === selectedFrequency;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.frequencyItem,
          isSelected && styles.selectedFrequencyItem
        ]}
        onPress={() => onSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.frequencyContent}>
          <Text style={[
            styles.frequencyLabel,
            isSelected && styles.selectedFrequencyLabel
          ]}>
            {item.label}
          </Text>
          <Text style={styles.frequencyDescription}>
            {item.description}
          </Text>
        </View>
        
        {isSelected && (
          <View style={styles.checkContainer}>
            <Check size={16} color={Colors.white} />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      {frequencies.map(renderFrequencyItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  frequencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }
    })
  },
  selectedFrequencyItem: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20', // 20% opacity
  },
  frequencyContent: {
    flex: 1,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  selectedFrequencyLabel: {
    color: Colors.primary,
  },
  frequencyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
});

export default PrayerFrequencySelector;