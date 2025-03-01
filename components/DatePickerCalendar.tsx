import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  FlatList,
  Platform 
} from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import Colors from '../constants/Colors';

interface DatePickerCalendarProps {
  date: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
  date,
  onDateChange,
  minimumDate = new Date(1940, 0, 1),
  maximumDate = new Date(2006, 11, 31),
}) => {
  // State for current view date (might be different from selected date)
  const [currentViewDate, setCurrentViewDate] = useState(new Date(date));
  const [yearPickerVisible, setYearPickerVisible] = useState(false);
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  
  // Calculate min/max years for picker
  const minYear = minimumDate.getFullYear();
  const maxYear = maximumDate.getFullYear();
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  
  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Short weekday names
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Calculate age from date
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get all days to display in current month (including days from prev/next month)
  const getDaysArray = () => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Previous month's days that appear in the calendar
    const daysFromPrevMonth = firstDayOfMonth;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    let days = [];
    
    // Add previous month's days
    for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
      days.push({
        day: i,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true
      });
    }
    
    // Calculate how many days from next month to add
    const totalCells = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7;
    const daysFromNextMonth = totalCells - days.length;
    
    // Add next month's days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false
      });
    }
    
    return days;
  };
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    const newDate = new Date(currentViewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    if (newDate.getFullYear() >= minYear) {
      setCurrentViewDate(newDate);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentViewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    if (newDate.getFullYear() <= maxYear) {
      setCurrentViewDate(newDate);
    }
  };
  
  // Handle selecting a date
  const handleDateSelect = (day: number, month: number, year: number) => {
    // Make sure date is within bounds
    const newDate = new Date(year, month, day);
    
    if (newDate >= minimumDate && newDate <= maximumDate) {
      onDateChange(newDate);
    }
  };
  
  // Handle year selection
  const handleYearSelect = (year: number) => {
    setYearPickerVisible(false);
    const newDate = new Date(currentViewDate);
    newDate.setFullYear(year);
    setCurrentViewDate(newDate);
  };
  
  // Handle month selection
  const handleMonthSelect = (month: number) => {
    setMonthPickerVisible(false);
    const newDate = new Date(currentViewDate);
    newDate.setMonth(month);
    setCurrentViewDate(newDate);
  };
  
  // Check if a date is the selected date
  const isSelectedDate = (day: number, month: number, year: number): boolean => {
    return (
      date.getDate() === day && 
      date.getMonth() === month && 
      date.getFullYear() === year
    );
  };
  
  // Check if a date is before minimum date or after maximum date
  const isOutOfBounds = (day: number, month: number, year: number): boolean => {
    const checkDate = new Date(year, month, day);
    return checkDate < minimumDate || checkDate > maximumDate;
  };
  
  return (
    <View style={styles.container}>
      {/* Age display */}
      <View style={styles.ageContainer}>
        <Text style={styles.ageText}>
          {calculateAge(date)} years old
        </Text>
        <Text style={styles.selectedDateText}>
          {date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </Text>
      </View>
      
      {/* Month and Year header with navigation */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={goToPrevMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <TouchableOpacity 
            style={styles.monthYearButton}
            onPress={() => setMonthPickerVisible(true)}
          >
            <Text style={styles.monthText}>
              {monthNames[currentViewDate.getMonth()]}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.monthYearButton}
            onPress={() => setYearPickerVisible(true)}
          >
            <Text style={styles.yearText}>
              {currentViewDate.getFullYear()}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={goToNextMonth}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronRight size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Weekday headers */}
      <View style={styles.weekdayHeader}>
        {weekdays.map((weekday, index) => (
          <View key={index} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{weekday}</Text>
          </View>
        ))}
      </View>
      
      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {getDaysArray().map((dayInfo, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              !dayInfo.isCurrentMonth && styles.otherMonthDay,
              isSelectedDate(dayInfo.day, dayInfo.month, dayInfo.year) && styles.selectedDay,
              isOutOfBounds(dayInfo.day, dayInfo.month, dayInfo.year) && styles.disabledDay
            ]}
            onPress={() => handleDateSelect(dayInfo.day, dayInfo.month, dayInfo.year)}
            disabled={isOutOfBounds(dayInfo.day, dayInfo.month, dayInfo.year)}
          >
            <Text style={[
              styles.dayText,
              !dayInfo.isCurrentMonth && styles.otherMonthDayText,
              isSelectedDate(dayInfo.day, dayInfo.month, dayInfo.year) && styles.selectedDayText,
              isOutOfBounds(dayInfo.day, dayInfo.month, dayInfo.year) && styles.disabledDayText
            ]}>
              {dayInfo.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Year Picker Modal */}
      <Modal
        visible={yearPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setYearPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setYearPickerVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Year</Text>
            <FlatList
              data={years}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.yearItem,
                    item === date.getFullYear() && styles.selectedYearItem
                  ]}
                  onPress={() => handleYearSelect(item)}
                >
                  <Text style={[
                    styles.yearItemText,
                    item === date.getFullYear() && styles.selectedYearItemText
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.toString()}
              numColumns={4}
              initialScrollIndex={years.indexOf(date.getFullYear())}
              getItemLayout={(data, index) => ({
                length: 60,
                offset: 60 * Math.floor(index / 4),
                index,
              })}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Month Picker Modal */}
      <Modal
        visible={monthPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMonthPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthPickerVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <View style={styles.monthsGrid}>
              {monthNames.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.monthItem,
                    index === date.getMonth() && styles.selectedMonthItem
                  ]}
                  onPress={() => handleMonthSelect(index)}
                >
                  <Text style={[
                    styles.monthItemText,
                    index === date.getMonth() && styles.selectedMonthItemText
                  ]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
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
  ageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  ageText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: Colors.primaryLight + '30',
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthYearButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  yearText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: Colors.text,
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  otherMonthDayText: {
    color: Colors.textSecondary,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
  },
  selectedDayText: {
    color: Colors.white,
    fontWeight: '600',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      }
    })
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  yearItem: {
    width: '25%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedYearItem: {
    backgroundColor: Colors.primaryLight,
  },
  yearItemText: {
    fontSize: 18,
    color: Colors.text,
  },
  selectedYearItemText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  monthItem: {
    width: '33%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedMonthItem: {
    backgroundColor: Colors.primaryLight,
  },
  monthItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedMonthItemText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default DatePickerCalendar;