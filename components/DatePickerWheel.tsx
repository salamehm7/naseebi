import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/Colors';
import Button from './Button';

interface DatePickerWheelProps {
  date: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DatePickerWheel: React.FC<DatePickerWheelProps> = ({
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      onDateChange(selectedDate);
    }
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        // iOS always shows the wheel picker
        <View style={styles.iosPickerContainer}>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            textColor={Colors.text}
            style={styles.iOSPicker}
          />
          <Text style={styles.ageDisplay}>
            You are {calculateAge(date)} years old
          </Text>
        </View>
      ) : (
        // Android shows a button that opens the picker
        <View style={styles.androidPickerContainer}>
          <Button
            title={formatDate(date)}
            onPress={showDatepicker}
            variant="outline"
            style={styles.dateButton}
          />
          <Text style={styles.ageDisplay}>
            You are {calculateAge(date)} years old
          </Text>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  iosPickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  iOSPicker: {
    width: '100%',
    height: 180,
  },
  androidPickerContainer: {
    alignItems: 'center',
  },
  dateButton: {
    width: '100%',
    marginBottom: 10,
  },
  ageDisplay: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default DatePickerWheel;