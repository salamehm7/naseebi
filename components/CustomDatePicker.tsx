import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform, TouchableWithoutFeedback } from 'react-native';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 40;

interface CustomDatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  date,
  onDateChange,
  minimumDate = new Date(1940, 0, 1),
  maximumDate = new Date(2006, 11, 31)
}) => {
  // Default values
  const minYear = minimumDate.getFullYear();
  const maxYear = maximumDate.getFullYear();
  
  // Create arrays for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );
  
  // References to scroll views
  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);
  
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
  
  // Handle scroll end for each wheel
  const handleScrollEnd = (value: number, type: 'day' | 'month' | 'year') => {
    const newDate = new Date(date);
    
    if (type === 'day') {
      newDate.setDate(value);
    } else if (type === 'month') {
      newDate.setMonth(value);
    } else if (type === 'year') {
      newDate.setFullYear(value);
    }
    
    onDateChange(newDate);
  };
  
  // Initial scroll positions
  React.useEffect(() => {
    setTimeout(() => {
      dayScrollRef.current?.scrollTo({
        y: (date.getDate() - 1) * ITEM_HEIGHT,
        animated: false
      });
      
      monthScrollRef.current?.scrollTo({
        y: date.getMonth() * ITEM_HEIGHT,
        animated: false
      });
      
      yearScrollRef.current?.scrollTo({
        y: (date.getFullYear() - minYear) * ITEM_HEIGHT,
        animated: false
      });
    }, 100);
  }, []);
  
  // Prevent parent scrolling when touching the picker
  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };
  
  return (
    <TouchableWithoutFeedback onPress={stopPropagation}>
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <View style={styles.wheelsContainer} onStartShouldSetResponder={() => true}>
            {/* Day wheel */}
            <View style={styles.wheelContainer}>
              <ScrollView
                ref={dayScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
                scrollEventThrottle={16}
                onTouchStart={stopPropagation}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                  if (index >= 0 && index < days.length) {
                    handleScrollEnd(days[index], 'day');
                  }
                }}
                nestedScrollEnabled={true}
              >
                {days.map((day) => (
                  <View key={`day-${day}`} style={styles.item}>
                    <Text style={styles.itemText}>{day}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            
            {/* Month wheel */}
            <View style={styles.wheelContainer}>
              <ScrollView
                ref={monthScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
                scrollEventThrottle={16}
                onTouchStart={stopPropagation}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                  if (index >= 0 && index < months.length) {
                    handleScrollEnd(index, 'month');
                  }
                }}
                nestedScrollEnabled={true}
              >
                {months.map((month, index) => (
                  <View key={`month-${index}`} style={styles.item}>
                    <Text style={styles.itemText}>{month}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            
            {/* Year wheel */}
            <View style={styles.wheelContainer}>
              <ScrollView
                ref={yearScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
                scrollEventThrottle={16}
                onTouchStart={stopPropagation}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                  if (index >= 0 && index < years.length) {
                    handleScrollEnd(years[index], 'year');
                  }
                }}
                nestedScrollEnabled={true}
              >
                {years.map((year) => (
                  <View key={`year-${year}`} style={styles.item}>
                    <Text style={styles.itemText}>{year}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
          
          {/* Selection indicator */}
          <View style={styles.selectionIndicator} />
          
          <Text style={styles.ageDisplay}>
            You are {calculateAge(date)} years old
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1000,
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
  wheelsContainer: {
    flexDirection: 'row',
    height: ITEM_HEIGHT * 3,
    width: '100%',
    marginBottom: 16,
    zIndex: 1001,
  },
  wheelContainer: {
    flex: 1,
    height: ITEM_HEIGHT * 3,
    overflow: 'hidden',
    zIndex: 1002,
  },
  scrollContent: {
    paddingVertical: ITEM_HEIGHT,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: Colors.text,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 16 + ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
    opacity: 0.3,
    zIndex: 999,
  },
  ageDisplay: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 8,
  },
});

export default CustomDatePicker; 