import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '../constants/Colors';
import { ChevronUp, ChevronDown } from 'lucide-react-native';

interface SimpleDatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({
  date,
  onDateChange,
  minimumDate = new Date(1940, 0, 1),
  maximumDate = new Date(2006, 11, 31)
}) => {
  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Calculate age
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  // Handle value changes
  const changeValue = (type: 'day' | 'month' | 'year', increment: boolean) => {
    const newDate = new Date(date);
    
    const minYear = minimumDate.getFullYear();
    const maxYear = maximumDate.getFullYear();
    
    if (type === 'day') {
      const currentDay = date.getDate();
      const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
      
      if (increment) {
        newDate.setDate(currentDay < daysInMonth ? currentDay + 1 : 1);
      } else {
        newDate.setDate(currentDay > 1 ? currentDay - 1 : daysInMonth);
      }
    } 
    else if (type === 'month') {
      const currentMonth = date.getMonth();
      
      if (increment) {
        newDate.setMonth(currentMonth < 11 ? currentMonth + 1 : 0);
      } else {
        newDate.setMonth(currentMonth > 0 ? currentMonth - 1 : 11);
      }
      
      // Check if day is valid in the new month
      const daysInNewMonth = getDaysInMonth(newDate.getFullYear(), newDate.getMonth());
      if (newDate.getDate() > daysInNewMonth) {
        newDate.setDate(daysInNewMonth);
      }
    } 
    else if (type === 'year') {
      const currentYear = date.getFullYear();
      
      if (increment) {
        newDate.setFullYear(currentYear < maxYear ? currentYear + 1 : maxYear);
      } else {
        newDate.setFullYear(currentYear > minYear ? currentYear - 1 : minYear);
      }
      
      // Check if date is valid in the new year (for Feb 29)
      const daysInNewMonth = getDaysInMonth(newDate.getFullYear(), newDate.getMonth());
      if (newDate.getDate() > daysInNewMonth) {
        newDate.setDate(daysInNewMonth);
      }
    }
    
    // Check limits
    if (newDate < minimumDate) newDate.setTime(minimumDate.getTime());
    if (newDate > maximumDate) newDate.setTime(maximumDate.getTime());
    
    onDateChange(newDate);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <View style={styles.valueSelectors}>
          {/* Day selector */}
          <View style={styles.selectorColumn}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeValue('day', true)}
            >
              <ChevronUp color={Colors.primary} size={24} />
            </TouchableOpacity>
            
            <Text style={styles.valueText}>
              {date.getDate()}
            </Text>
            
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeValue('day', false)}
            >
              <ChevronDown color={Colors.primary} size={24} />
            </TouchableOpacity>
            
            <Text style={styles.labelText}>Day</Text>
          </View>
          
          {/* Month selector */}
          <View style={styles.selectorColumn}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeValue('month', true)}
            >
              <ChevronUp color={Colors.primary} size={24} />
            </TouchableOpacity>
            
            <Text style={styles.valueText}>
              {months[date.getMonth()].substring(0, 3)}
            </Text>
            
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeValue('month', false)}
            >
              <ChevronDown color={Colors.primary} size={24} />
            </TouchableOpacity>
            
            <Text style={styles.labelText}>Month</Text>
          </View>
          
          {/* Year selector */}
          <View style={styles.selectorColumn}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeValue('year', true)}
            >
              <ChevronUp color={Colors.primary} size={24} />
            </TouchableOpacity>
            
            <Text style={styles.valueText}>
              {date.getFullYear()}
            </Text>
            
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeValue('year', false)}
            >
              <ChevronDown color={Colors.primary} size={24} />
            </TouchableOpacity>
            
            <Text style={styles.labelText}>Year</Text>
          </View>
        </View>
        
        <Text style={styles.ageDisplay}>
          You are {calculateAge(date)} years old
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  valueSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  selectorColumn: {
    alignItems: 'center',
    width: 80,
  },
  arrowButton: {
    padding: 8,
  },
  valueText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginVertical: 6,
  },
  labelText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  ageDisplay: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SimpleDatePicker; 