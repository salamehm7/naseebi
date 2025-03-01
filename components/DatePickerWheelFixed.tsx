import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, ScrollView } from 'react-native';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const HALF_VISIBLE = Math.floor(VISIBLE_ITEMS / 2);

interface DatePickerWheelFixedProps {
  date: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DatePickerWheelFixed: React.FC<DatePickerWheelFixedProps> = ({ 
  date, 
  onDateChange,
  minimumDate = new Date(1940, 0, 1),
  maximumDate = new Date(2006, 11, 31),
}) => {
  // Get the ranges for days, months, and years
  const minYear = minimumDate.getFullYear();
  const maxYear = maximumDate.getFullYear();
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get maximum days in current month/year
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Initialize state once from props, avoid re-initializing on re-renders
  const [selectedDay, setSelectedDay] = useState(() => date.getDate());
  const [selectedMonth, setSelectedMonth] = useState(() => date.getMonth());
  const [selectedYear, setSelectedYear] = useState(() => date.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState(() => getDaysInMonth(date.getFullYear(), date.getMonth()));
  const [opacity, setOpacity] = useState(0);
  
  // Use refs to track if we're in the middle of user-initiated updates
  const isUpdatingRef = useRef(false);
  const dateStringRef = useRef(date.toISOString().split('T')[0]);
  
  // Refs for ScrollViews
  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);
  
  // Initialize with animation - only runs once
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToSelectedValues();
      setOpacity(1);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this only runs once
  
  // Update days when month/year changes
  useEffect(() => {
    const newDaysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    setDaysInMonth(newDaysInMonth);
    
    // Adjust the day if it exceeds the new month's days
    if (selectedDay > newDaysInMonth) {
      setSelectedDay(newDaysInMonth);
    }
  }, [selectedMonth, selectedYear]);
  
  // Synchronize with parent component ONLY when internal selections change
  // and prevent infinite update loops by checking if date actually changed
  useEffect(() => {
    if (isUpdatingRef.current) {
      // We're in the middle of a user-initiated update, safe to notify parent
      const newDate = new Date(selectedYear, selectedMonth, selectedDay);
      const newDateString = newDate.toISOString().split('T')[0];
      
      // Only notify parent if the date has actually changed
      if (newDateString !== dateStringRef.current) {
        dateStringRef.current = newDateString;
        onDateChange(newDate);
      }
      
      // Reset the flag after the update
      isUpdatingRef.current = false;
    }
  }, [selectedDay, selectedMonth, selectedYear, onDateChange]);
  
  // Handle prop changes from parent (rare, but possible)
  useEffect(() => {
    const dateString = date.toISOString().split('T')[0];
    
    // Only update internal state if the date from props has changed
    // and we're not in the middle of a user-initiated update
    if (!isUpdatingRef.current && dateString !== dateStringRef.current) {
      dateStringRef.current = dateString;
      
      setSelectedDay(date.getDate());
      setSelectedMonth(date.getMonth());
      setSelectedYear(date.getFullYear());
      
      // Update the days in month for the new date
      setDaysInMonth(getDaysInMonth(date.getFullYear(), date.getMonth()));
      
      // Scroll to the new positions
      setTimeout(scrollToSelectedValues, 50);
    }
  }, [date]);
  
  const scrollToSelectedValues = () => {
    try {
      // Calculate positions
      const dayIndex = selectedDay - 1;
      const monthIndex = selectedMonth;
      const yearIndex = years.indexOf(selectedYear);
      
      // Scroll to positions (safely)
      if (dayScrollRef.current && dayIndex >= 0) {
        dayScrollRef.current.scrollTo({ y: dayIndex * ITEM_HEIGHT, animated: false });
      }
      
      if (monthScrollRef.current && monthIndex >= 0) {
        monthScrollRef.current.scrollTo({ y: monthIndex * ITEM_HEIGHT, animated: false });
      }
      
      if (yearScrollRef.current && yearIndex >= 0) {
        yearScrollRef.current.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: false });
      }
    } catch (error) {
      console.log('Error scrolling to values:', error);
    }
  };
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Memoized handlers to prevent recreating on every render
  const handleDayScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < days.length) {
      isUpdatingRef.current = true; // Flag that we're starting a user update
      setSelectedDay(days[index]);
    }
  }, [days]);
  
  const handleMonthScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < months.length) {
      isUpdatingRef.current = true; // Flag that we're starting a user update
      setSelectedMonth(months[index]);
    }
  }, []);
  
  const handleYearScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < years.length) {
      isUpdatingRef.current = true; // Flag that we're starting a user update
      setSelectedYear(years[index]);
    }
  }, [years]);
  
  const renderDateColumn = (
    items: number[],
    selectedValue: number,
    formatLabel: (value: number) => string,
    onScroll: (event: any) => void,
    scrollRef: React.RefObject<ScrollView>
  ) => {
    return (
      <View style={styles.columnContainer}>
        <View style={styles.selectionHighlight} />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onMomentumScrollEnd={onScroll}
          contentContainerStyle={styles.columnContent}
        >
          {items.map((item) => (
            <View 
              key={item} 
              style={[
                styles.itemContainer,
                item === selectedValue && styles.selectedItem
              ]}
            >
              <Text 
                style={[
                  styles.itemText,
                  item === selectedValue && styles.selectedItemText
                ]}
              >
                {formatLabel(item)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { opacity }]}>
      <View style={styles.pickerContainer}>
        {renderDateColumn(
          days,
          selectedDay,
          (day) => `${day}`,
          handleDayScroll,
          dayScrollRef
        )}
        
        {renderDateColumn(
          months,
          selectedMonth,
          (month) => monthNames[month],
          handleMonthScroll,
          monthScrollRef
        )}
        
        {renderDateColumn(
          years,
          selectedYear,
          (year) => `${year}`,
          handleYearScroll,
          yearScrollRef
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
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
  pickerContainer: {
    flexDirection: 'row',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    borderRadius: 12,
    overflow: 'hidden',
  },
  columnContainer: {
    flex: 1,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: 'relative',
  },
  selectionHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * HALF_VISIBLE,
    left: 4,
    right: 4,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(212, 193, 236, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    zIndex: -1,
  },
  columnContent: {
    paddingVertical: ITEM_HEIGHT * HALF_VISIBLE,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    // No background here as we're using the selectionHighlight
  },
  itemText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  selectedItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default DatePickerWheelFixed;