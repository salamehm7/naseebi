import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Modal,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react-native';
import Colors from '../constants/Colors';
import Button from '../components/Button';

const EditEssentials = () => {
  const router = useRouter();
  
  // Mock initial data
  const [height, setHeight] = useState("5'11\"");
  const [ethnicity, setEthnicity] = useState("Pakistani");
  const [education, setEducation] = useState("Master's in Computer Science");
  const [occupation, setOccupation] = useState("Software Engineer");
  
  // State for custom picker modals
  const [modalVisible, setModalVisible] = useState(false);
  const [activePickerType, setActivePickerType] = useState(null);
  
  const heightOptions = [
    "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", 
    "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\""
  ];
  
  const ethnicityOptions = [
    "Arab", "Asian", "Bangladeshi", "Black/African", "Hispanic/Latino", 
    "Indian", "Mixed", "Pakistani", "Turkish", "White/Caucasian", "Other"
  ];
  
  const openPicker = (type) => {
    setActivePickerType(type);
    setModalVisible(true);
  };
  
  const handleOptionSelect = (option) => {
    if (activePickerType === 'height') {
      setHeight(option);
    } else if (activePickerType === 'ethnicity') {
      setEthnicity(option);
    }
    setModalVisible(false);
  };
  
  const handleSave = () => {
    // Save logic would go here
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Essentials</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Check size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Height</Text>
          <TouchableOpacity 
            style={styles.pickerContainer}
            onPress={() => openPicker('height')}
          >
            <Text style={styles.pickerValue}>{height}</Text>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputSection}>
          <Text style={styles.label}>Ethnicity</Text>
          <TouchableOpacity 
            style={styles.pickerContainer}
            onPress={() => openPicker('ethnicity')}
          >
            <Text style={styles.pickerValue}>{ethnicity}</Text>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputSection}>
          <Text style={styles.label}>Education</Text>
          <TextInput
            style={styles.textInput}
            value={education}
            onChangeText={setEducation}
            placeholder="Your highest level of education"
          />
        </View>
        
        <View style={styles.inputSection}>
          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.textInput}
            value={occupation}
            onChangeText={setOccupation}
            placeholder="Your current job"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
          />
        </View>
      </ScrollView>
      
      {/* Custom Picker Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>
                Select {activePickerType === 'height' ? 'Height' : 'Ethnicity'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={activePickerType === 'height' ? heightOptions : ethnicityOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    (activePickerType === 'height' && item === height) || 
                    (activePickerType === 'ethnicity' && item === ethnicity) 
                      ? styles.selectedOption 
                      : null
                  ]}
                  onPress={() => handleOptionSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {((activePickerType === 'height' && item === height) || 
                    (activePickerType === 'ethnicity' && item === ethnicity)) && (
                    <Check size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  saveButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: '#FFF',
  },
  pickerContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  pickerValue: {
    fontSize: 16,
    color: Colors.text,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  modalCloseText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  optionsList: {
    paddingBottom: 30,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: Colors.primaryLight,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
});

export default EditEssentials; 