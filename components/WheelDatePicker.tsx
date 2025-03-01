import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Dimensions
} from 'react-native';
import Colors from '../constants/Colors';
import { Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 50;

interface WheelDatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

const WheelDatePicker: React.FC<WheelDatePickerProps> = ({
  date,
  onDateChange,
  minimumDate = new Date(1940, 0, 1),
  maximumDate = new Date(2006, 11, 31)
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState(date);
  
  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
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
  
  // Format date for display
  const formatDate = (date: Date) => {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  // Generate arrays for days, months, years
  const generateDays = () => {
    const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };
  
  const generateMonths = () => {
    return months.map((name, index) => ({ name: name.substring(0, 3), value: index }));
  };
  
  const generateYears = () => {
    const minYear = minimumDate.getFullYear();
    const maxYear = maximumDate.getFullYear();
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  };
  
  // Handle confirms and cancels
  const handleConfirm = () => {
    onDateChange(tempDate);
    setModalVisible(false);
  };
  
  const handleCancel = () => {
    setTempDate(date); // Reset to original
    setModalVisible(false);
  };
  
  // Render wheel item
  const renderItem = ({ item, index }: any, setValue: (val: any) => void, currentValue: number) => {
    const isSelected = item === currentValue || (typeof item === 'object' && item.value === currentValue);
    const itemValue = typeof item === 'object' ? item.value : item;
    const itemLabel = typeof item === 'object' ? item.name : item.toString();
    
    return (
      <TouchableOpacity
        style={[styles.wheelItem, isSelected && styles.selectedWheelItem]}
        onPress={() => setValue(itemValue)}
      >
        <Text style={[styles.wheelItemText, isSelected && styles.selectedWheelItemText]}>
          {itemLabel}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.dateDisplay} 
        onPress={() => {
          setTempDate(new Date(date));
          setModalVisible(true);
        }}
      >
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        <Calendar color={Colors.primary} size={24} />
      </TouchableOpacity>
      
      <Text style={styles.ageDisplay}>
        You are {calculateAge(date)} years old
      </Text>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handleCancel}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.modalTitle}>Date of Birth</Text>
                  
                  <TouchableOpacity onPress={handleConfirm}>
                    <Text style={[styles.modalButtonText, styles.confirmText]}>Done</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.wheelContainer}>
                  {/* Day wheel */}
                  <View style={styles.wheel}>
                    <FlatList
                      data={generateDays()}
                      renderItem={(info) => renderItem(info, (day) => {
                        const newDate = new Date(tempDate);
                        newDate.setDate(day);
                        setTempDate(newDate);
                      }, tempDate.getDate())}
                      keyExtractor={(item) => `day-${item}`}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.wheelList}
                    />
                    <Text style={styles.wheelLabel}>Day</Text>
                  </View>
                  
                  {/* Month wheel */}
                  <View style={styles.wheel}>
                    <FlatList
                      data={generateMonths()}
                      renderItem={(info) => renderItem(info, (month) => {
                        const newDate = new Date(tempDate);
                        newDate.setMonth(month);
                        // Ensure valid date (e.g., when switching from Jan 31 to Feb)
                        const daysInNewMonth = new Date(newDate.getFullYear(), month + 1, 0).getDate();
                        if (newDate.getDate() > daysInNewMonth) {
                          newDate.setDate(daysInNewMonth);
                        }
                        setTempDate(newDate);
                      }, tempDate.getMonth())}
                      keyExtractor={(item) => `month-${item.value}`}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.wheelList}
                    />
                    <Text style={styles.wheelLabel}>Month</Text>
                  </View>
                  
                  {/* Year wheel */}
                  <View style={styles.wheel}>
                    <FlatList
                      data={generateYears()}
                      renderItem={(info) => renderItem(info, (year) => {
                        const newDate = new Date(tempDate);
                        newDate.setFullYear(year);
                        // Handle Feb 29 in leap years
                        const daysInMonth = new Date(year, newDate.getMonth() + 1, 0).getDate();
                        if (newDate.getDate() > daysInMonth) {
                          newDate.setDate(daysInMonth);
                        }
                        setTempDate(newDate);
                      }, tempDate.getFullYear())}
                      keyExtractor={(item) => `year-${item}`}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.wheelList}
                    />
                    <Text style={styles.wheelLabel}>Year</Text>
                  </View>
                </View>
                
                <Text style={styles.modalAgeDisplay}>
                  You will be {calculateAge(tempDate)} years old
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dateDisplay: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
  },
  ageDisplay: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  modalButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  confirmText: {
    fontWeight: '600',
  },
  wheelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 200,
  },
  wheel: {
    flex: 1,
    marginHorizontal: 5,
  },
  wheelList: {
    paddingVertical: 10,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedWheelItem: {
    backgroundColor: Colors.lightPurple,
  },
  wheelItemText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  selectedWheelItemText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  wheelLabel: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 5,
  },
  modalAgeDisplay: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
});

export default WheelDatePicker; 