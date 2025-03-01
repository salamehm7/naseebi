import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import Colors from '../constants/Colors';

interface IslamicTraditionSelectorProps {
  selectedTradition: string;
  onSelect: (tradition: string) => void;
}

const IslamicTraditionSelector: React.FC<IslamicTraditionSelectorProps> = ({ 
  selectedTradition, 
  onSelect 
}) => {
  const traditions = [
    'Sunni',
    'Shia',
    'Salafi',
    'Sufi',
    'Hanafi',
    'Maliki',
    'Shafi',
    'Hanbali',
    'Non-denominational',
    'Other'
  ];
  
  const renderTraditionItem = (tradition: string) => {
    const isSelected = tradition === selectedTradition;
    
    return (
      <TouchableOpacity
        key={tradition}
        style={[
          styles.traditionItem,
          isSelected && styles.selectedTraditionItem
        ]}
        onPress={() => onSelect(tradition)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.traditionText,
          isSelected && styles.selectedTraditionText
        ]}>
          {tradition}
        </Text>
        
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
      {traditions.map(renderTraditionItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  traditionItem: {
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
  selectedTraditionItem: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20', // 20% opacity
  },
  traditionText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedTraditionText: {
    fontWeight: '600',
    color: Colors.primary,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IslamicTraditionSelector;