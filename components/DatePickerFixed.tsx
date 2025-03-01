import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/Colors';

interface DatePickerFixedProps {
  date: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DatePickerFixed: React.FC<DatePickerFixedProps> = ({
  date,
  onDateChange,
  minimumDate,
  maximumDate
}) => {
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  // Format date for display
  const formatDate = (date: Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
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

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.editButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.ageDisplay}>
          You are {calculateAge(date)} years old
        </Text>
        
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={(event: any, selectedDate: Date | undefined) => {
              setShowPicker(Platform.OS === 'ios');
              if (selectedDate) onDateChange(selectedDate);
            }}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )}
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
  dateDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  ageDisplay: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default DatePickerFixed;