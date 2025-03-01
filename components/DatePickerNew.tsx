import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';
import { ChevronUp, ChevronDown } from 'lucide-react-native';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const HALF_VISIBLE = Math.floor(VISIBLE_ITEMS / 2);

interface DatePickerNewProps {
  date: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DatePickerNew: React.FC<DatePickerNewProps> = ({
  date,
  onDateChange,
  minimumDate = new Date(1940, 0, 1),
  maximumDate = new Date(2006, 11, 31),
}) => {
  // Get initial values from the date prop
  const initialDay = date.getDate();
  const initialMonth = date.getMonth();
  const initialYear = date.getFullYear();
  
  // State for the selected values
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  
  // State to track days in month
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(initialYear, initialMonth));
  
  // ScrollView refs
  const dayScrollViewRef = useRef<ScrollView>(null);
  const monthScrollViewRef = useRef<ScrollView>(null);
  const yearScrollViewRef = useRef<ScrollView>(null);

  // Prepare arrays of available values
  const minYear = minimumDate.getFullYear();
  const maxYear = maximumDate.getFullYear();
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Helper function to get days in month
  function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  // Update days when month/year changes
  useEffect(() => {
    const newDaysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    setDaysInMonth(newDaysInMonth);
    
    // Adjust day if current selection exceeds new month length
    if (selectedDay > newDaysInMonth) {
      setSelectedDay(newDaysInMonth);
    }
  }, [selectedMonth, selectedYear]);

  // Notify parent component when date changes
  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    onDateChange(newDate);
  }, [selectedDay, selectedMonth, selectedYear, onDateChange]);

  // Scroll to initial positions on mount
  useEffect(() => {
    const dayIndex = initialDay - 1;
    const monthIndex = initialMonth;
    const yearIndex = years.indexOf(initialYear);
    
    setTimeout(() => {
      if (dayScrollViewRef.current) {
        dayScrollViewRef.current.scrollTo({ y: dayIndex * ITEM_HEIGHT, animated: false });
      }
      if (monthScrollViewRef.current) {
        monthScrollViewRef.current.scrollTo({ y: monthIndex * ITEM_HEIGHT, animated: false });
      }
      if (yearScrollViewRef.current) {
        yearScrollViewRef.current.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: false });
      }
    }, 100);
  }, []);

  // Handle scroll events
  const handleScroll = (scrollView: React.RefObject<ScrollView>, items: number[], setter: (value: number) => void) => {
    if (!scrollView.current) return;
    
    scrollView.current.scrollTo({
      y: Math.round(scrollView.current.scrollY / ITEM_HEIGHT) * ITEM_HEIGHT,
      animated: true
    });
    
    const currentIndex = Math.round(scrollView.current.scrollY / ITEM_HEIGHT);
    if (currentIndex >= 0 && currentIndex < items.length) {
      setter(items[currentIndex]);
    }
  };

  // Handle arrow button presses
  const handleArrowPress = (
    scrollView: React.RefObject<ScrollView>, 
    direction: 'up' | 'down', 
    currentValue: number, 
    items: number[], 
    setter: (value: number) => void
  ) => {
    const currentIndex = items.indexOf(currentValue);
    
    if (direction === 'up' && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setter(items[newIndex]);
      scrollView.current?.scrollTo({ y: newIndex * ITEM_HEIGHT, animated: true });
    } else if (direction === 'down' && currentIndex < items.length - 1) {
      const newIndex = currentIndex + 1;
      setter(items[newIndex]);
      scrollView.current?.scrollTo({ y: newIndex * ITEM_HEIGHT, animated: true });
    }
  };

  // Component to display values with scroll and arrow controls
  const RollerPicker = ({ 
    title, 
    items, 
    selectedValue, 
    scrollViewRef, 
    formatLabel, 
    onValueChange 
  }: {
    title: string;
    items: number[];
    selectedValue: number;
    scrollViewRef: React.RefObject<ScrollView>;
    formatLabel: (value: number) => string;
    onValueChange: (value: number) => void;
  }) => {
    return (
      <View style={styles.rollerContainer}>
        <Text style={styles.rollerTitle}>{title}</Text>
        
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={() => handleArrowPress(scrollViewRef, 'up', selectedValue, items, onValueChange)}
          activeOpacity={0.7}
        >
          <ChevronUp size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.rollerViewport}>
          <View style={styles.selectionHighlight} />
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={() => handleScroll(scrollViewRef, items, onValueChange)}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.rollerItem, selectedValue === item && styles.selectedRollerItem]}
                onPress={() => {
                  onValueChange(item);
                  const index = items.indexOf(item);
                  scrollViewRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
                }}
              >
                <Text style={[styles.rollerText, selectedValue === item && styles.selectedRollerText]}>
                  {formatLabel(item)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={() => handleArrowPress(scrollViewRef, 'down', selectedValue, items, onValueChange)}
          activeOpacity={0.7}
        >
          <ChevronDown size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerRow}>
        <RollerPicker
          title="Day"
          items={days}
          selectedValue={selectedDay}
          scrollViewRef={dayScrollViewRef}
          formatLabel={(day) => day.toString()}
          onValueChange={setSelectedDay}
        />
        
        <RollerPicker
          title="Month"
          items={months}
          selectedValue={selectedMonth}
          scrollViewRef={monthScrollViewRef}
          formatLabel={(month) => monthNames[month]}
          onValueChange={setSelectedMonth}
        />
        
        <RollerPicker
          title="Year"
          items={years}
          selectedValue={selectedYear}
          scrollViewRef={yearScrollViewRef}
          formatLabel={(year) => year.toString()}
          onValueChange={setSelectedYear}
        />
      </View>
      
      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateText}>
          {monthNames[selectedMonth]} {selectedDay}, {selectedYear}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
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
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rollerContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  rollerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  rollerViewport: {
    height: ITEM_HEIGHT * 3, // Show 3 items at a time
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  selectionHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.primaryLight + '30',
    borderRadius: 8,
    zIndex: -1,
  },
  scrollContent: {
    paddingVertical: ITEM_HEIGHT, // Add top and bottom padding to allow scrolling to first/last item
  },
  rollerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  selectedRollerItem: {
    // Additional styling for selected item if needed
  },
  rollerText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  selectedRollerText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  arrowButton: {
    height: 32,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.primaryLight + '20',
    marginVertical: 4,
  },
  selectedDateContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});

export default DatePickerNew;