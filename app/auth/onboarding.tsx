import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform, 
  KeyboardAvoidingView, 
  Dimensions, 
  ScrollView, 
  SafeAreaView, 
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { ArrowRight, ArrowLeft, ChevronLeft } from 'lucide-react-native';
import HeartLogo from '../../components/HeartLogo';
import WheelDatePicker from '../../components/WheelDatePicker';
import GenderSelection from '../../components/GenderSelection';
import CountrySelector from '../../components/CountrySelector';
import IslamicTraditionSelector from '../../components/IslamicTraditionSelector';
import PrayerFrequencySelector from '../../components/PrayerFrequencySelector';
import PhotoUploader from '../../components/PhotoUploader';
import InterestsQuiz from '../../components/InterestsQuiz';
import InterestTagSelector from '../../components/InterestTagSelector';
import { useAuth } from '../../utils/firebase';
import { updateUserProfile, completeOnboarding } from '../../services/userService';
import { Analytics } from '../../utils/firebase';
import { authState } from '../../utils/firebase';
import { auth, db } from '../../utils/firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

type FormData = {
  name: string;
  dateOfBirth: Date;
  gender: string;
  country: string;
  occupation: string;
  islamicTradition: string;
  prayerFrequency: string;
  interests: Record<string, string>;
  photos: string[];
  personalityTraits: string[];
  leisureActivities: string[];
  relationshipValues: string[];
  lifeGoals: string[];
  blurPhotos: boolean;
  interestTags: string[];
};

const OnboardingScreen = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dateOfBirth: new Date(2000, 0, 1), // Default to Jan 1, 2000
    gender: '',
    country: '',
    occupation: '',
    islamicTradition: '',
    prayerFrequency: '',
    interests: {} as Record<string, string>, // Store quiz answers here
    photos: [] as string[],
    personalityTraits: [],
    leisureActivities: [],
    relationshipValues: [],
    lifeGoals: [],
    blurPhotos: false,
    interestTags: [],
  });
  
  const scrollViewRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);
  const occupationInputRef = useRef<TextInput>(null);
  
  const { user } = useAuth();
  
  // Focus the appropriate input field when the step changes
  const focusAppropriateInput = (currentStep: number) => {
    setTimeout(() => {
      if (currentStep === 0) {
        nameInputRef.current?.focus();
      } else if (currentStep === 3) {
        occupationInputRef.current?.focus();
      }
    }, 500);
  };
  
  // Update form data without triggering issues
  const updateFormData = (field: string, value: any) => {
    console.log(`Updating ${field}:`, value);
    
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };
  
  // Update interests safely
  const updateInterests = (questionId: string, answerId: string) => {
    console.log('Updating interests:', { questionId, answerId });
    
    setFormData(prevState => {
      const updatedInterests = {
        ...prevState.interests,
        [questionId]: answerId
      };
      
      console.log('Updated interests:', updatedInterests, 'Count:', Object.keys(updatedInterests).length);
      
      return {
        ...prevState,
        interests: updatedInterests
      };
    });
  };
  
  // Determine if next button should be disabled
  const isNextDisabled = () => {
    switch(step) {
      case 0:
        return !formData.name || formData.name.trim().length < 2;
      case 1:
        return !formData.gender;
      case 2:
        return !formData.country;
      case 3:
        return !formData.occupation || formData.occupation.trim().length < 2;
      case 4:
        return !formData.islamicTradition;
      case 5:
        return false;
      case 6:
        return formData.photos.length === 0;
      case 7:
        return formData.interestTags.length === 0;
      default:
        return false;
    }
  };
  
  // First, add this debug function to log the actual data structure
  const debugObject = (obj) => {
    return Object.keys(obj).map(key => {
      const value = obj[key];
      let type = typeof value;
      if (value === null) type = 'null';
      else if (Array.isArray(value)) type = 'array';
      return `${key}: ${type}`;
    });
  };
  
  // Then update the handleNext function
  const handleNext = async () => {
    if (isNextDisabled()) {
      return;
    }
    
    // If we're on the last step, complete onboarding
    if (step === 7) {
      setLoading(true);
      
      try {
        console.log('Attempting to complete onboarding with comprehensive approach...');
        
        if (!auth.currentUser) {
          throw new Error('No authenticated user found');
        }
        
        const userId = auth.currentUser.uid;
        const userRef = doc(db, 'users', userId);
        
        // First, get the existing user document
        const userDoc = await getDoc(userRef);
        
        // Prepare the profile data - combine existing data with new data
        const profileData = {
          // If user doc exists, merge with its data
          ...(userDoc.exists() ? userDoc.data() : {}),
          
          // Basic profile information
          name: formData.name || '',
          gender: formData.gender || '',
          dateOfBirth: formData.dateOfBirth || new Date(),
          religiousBackground: formData.religiousBackground || '',
          
          // Critical flag to indicate completion
          completed: true,
          onboardingCompleted: true, // Add another flag as backup
          updatedAt: new Date()
        };
        
        console.log('Setting full user profile data...');
        
        // Use setDoc with merge to ensure a complete document
        await setDoc(userRef, profileData, { merge: true });
        
        console.log('Profile updated successfully!');
        
        // Log an event for analytics
        Analytics.logEvent('onboarding_completed');
        
        // Force logout and re-login to refresh auth state
        // This is an optional step that might help if auth state is cached
        console.log('Refreshing auth state...');
        await auth.currentUser.reload();
        
        // Add a longer delay before navigation
        console.log('Navigating to main app in 1 second...');
        setTimeout(() => {
          // Just navigate to the tabs root, not a specific tab
          router.replace('/(tabs)');
        }, 1000);
        
      } catch (error) {
        console.error('Error in comprehensive profile update:', error);
        alert('Could not complete your profile. Please try again.');
      } finally {
        setLoading(false);
      }
      
      return;
    }
    
    // Otherwise, just go to the next step
    setStep(step + 1);
  };
  
  // Handle back button press
  const handleBack = () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      
      // Reset scroll position
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        focusAppropriateInput(prevStep);
      }, 100);
    } else {
      // If on first step, confirm before exiting onboarding
      Alert.alert(
        "Exit Onboarding?",
        "Your progress will be lost. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => router.back() }
        ]
      );
    }
  };
  
  // Add a simple implementation for the saveUserProfile function
  const saveUserProfile = async (userProfile: any) => {
    // In a real app, this would save to a backend service
    console.log('Saving user profile:', userProfile);
    // Simulate a successful save
    return Promise.resolve();
  };
  
  // Calculate age from date of birth
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch(step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Let's get to know you</Text>
            <Text style={styles.stepDescription}>
              We'll use this information to help you find the perfect match
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>What is your name?</Text>
              
              <View style={styles.nameInputWrapper}>
                <TextInput
                  ref={nameInputRef}
                  style={styles.nameInput}
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  placeholder="Your name"
                  placeholderTextColor={Colors.gray}
                  autoFocus={false}
                  returnKeyType="next"
                  onSubmitEditing={handleNext}
                  blurOnSubmit={false}
                  spellCheck={false}
                  textContentType="oneTimeCode"
                  autoCorrect={false}
                  autoComplete="off"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>When were you born?</Text>
              
              <WheelDatePicker
                date={formData.dateOfBirth}
                onDateChange={(date) => updateFormData('dateOfBirth', date)}
                minimumDate={new Date(1940, 0, 1)}
                maximumDate={new Date(2006, 11, 31)}
              />
            </View>
          </View>
        );
      
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What is your gender?</Text>
            <Text style={styles.stepDescription}>
              We'll use this to help match you with compatible profiles
            </Text>
            
            <GenderSelection
              selectedGender={formData.gender}
              onSelect={(gender) => updateFormData('gender', gender)}
            />
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Where are you from?</Text>
            <Text style={styles.stepDescription}>
              Select your country of origin
            </Text>
            
            <CountrySelector
              selectedCountry={formData.country}
              onSelect={(country) => updateFormData('country', country)}
            />
          </View>
        );
      
      case 3:
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>What do you do?</Text>
              <Text style={styles.stepDescription}>
                Tell us about your occupation
              </Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.occupationInputWrapper}>
                  <TextInput
                    ref={occupationInputRef}
                    value={formData.occupation}
                    onChangeText={(text) => updateFormData('occupation', text)}
                    placeholder="Enter your occupation"
                    placeholderTextColor={Colors.textSecondary}
                    style={styles.occupationInput}
                    autoCapitalize="words"
                    autoComplete="off"
                    autoCorrect={false}
                    blurOnSubmit={false}
                    spellCheck={false}
                    textContentType="none"
                    keyboardType="default"
                    editable={true}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What is your Islamic tradition?</Text>
            <Text style={styles.stepDescription}>
              Select the Islamic sect you follow
            </Text>
            
            <IslamicTraditionSelector
              selectedTradition={formData.islamicTradition}
              onSelect={(tradition) => updateFormData('islamicTradition', tradition)}
            />
          </View>
        );
      
      case 5: // Personality quiz
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your Personality</Text>
            <Text style={styles.stepDescription}>
              Answer these questions to help us find your perfect match
            </Text>
            
            <InterestsQuiz
              onComplete={(quizResults) => {
                console.log('Quiz completed with results:', quizResults);
                
                // Update form data with the quiz results
                setFormData(prev => ({
                  ...prev,
                  interests: quizResults,
                  personalityTraits: quizResults['partnerQualities'] || [],
                  values: quizResults['marriageApproach'] || [],
                  leisureActivities: quizResults['weekend'] || [],
                  lifeGoals: quizResults['communication'] || []
                }));
                
                // Go directly to photo upload (now step 6, not 7)
                setTimeout(() => {
                  setStep(6);
                }, 500);
              }}
            />
          </View>
        );
      
      case 6: // Photo upload
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Add your photos</Text>
            <Text style={styles.stepDescription}>
              Upload photos to complete your profile
            </Text>
            
            <PhotoUploader
              photos={formData.photos}
              onPhotosChange={(photos) => updateFormData('photos', photos)}
              maxPhotos={5}
              blurEnabled={formData.blurPhotos}
              onBlurToggle={(enabled) => updateFormData('blurPhotos', enabled)}
            />
          </View>
        );
      
      case 7: // Interest tags
        return (
          <View style={styles.fullHeightContent}>
            <Text style={styles.stepTitle}>Interests</Text>
            <Text style={styles.stepDescription}>
              Select interests that represent you. This helps us find matches with similar interests.
            </Text>
            
            <InterestTagSelector
              selectedTags={formData.interestTags}
              onTagsChange={(tags) => updateFormData('interestTags', tags)}
              maxTags={10}
            />
          </View>
        );
      
      case 8: // Final step
        return null;
      
      default:
        return null;
    }
  };
  
  const totalSteps = 9; // Total number of steps including the new interest tags step
  
  const renderProgressDots = () => {
    return (
      <View style={styles.progressContainer}>
        {[...Array(8)].map((_, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.progressDot,
              index === step && styles.progressDotActive,
              index < step ? styles.progressDotCompleted : null,
            ]} 
            onPress={() => {
              // Allow going back to previous steps but not forward
              if (index < step) {
                setStep(index);
                scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
                focusAppropriateInput(index);
              }
            }}
            activeOpacity={index < step ? 0.7 : 1}
          />
        ))}
      </View>
    );
  };
  
  const renderButtons = () => {
    return (
      <>
        {step > 0 && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            disabled={loading}
          >
            <ArrowLeft color={Colors.text} size={20} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <Button
          title={step === 7 ? "Complete Profile" : "Next"}
          onPress={handleNext}
          loading={loading}
          disabled={isNextDisabled() || loading}
          style={[
            styles.nextButton,
            isNextDisabled() && styles.nextButtonDisabled
          ]}
          icon={step === 7 ? null : <ArrowRight color={Colors.white} size={20} style={{ marginLeft: 8 }} />}
        />
      </>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <LinearGradient
            colors={[Colors.primaryDark, Colors.primary]}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <HeartLogo size={30} color={Colors.white} textColor={Colors.white} />
            </View>
            
            <View style={styles.progressContainer}>
              {Array(8).fill(0).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index === step && styles.progressDotActive,
                    index < step && styles.progressDotCompleted
                  ]}
                />
              ))}
            </View>
          </LinearGradient>
          
          {/* Add step 8 to the list of steps that need direct view rendering */}
          {step === 6 || step === 7 ? (
            <View style={styles.fullContent}>
              {renderStepContent()}
            </View>
          ) : (
            <ScrollView 
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {renderStepContent()}
            </ScrollView>
          )}
          
          {/* Footer buttons */}
          <View style={styles.buttonsContainer}>
            {renderButtons()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }
    })
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
    paddingTop: 8,
    height: 55,
  },
  topBackButton: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    zIndex: 100,
  },
  topBackButtonText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: 2,
  },
  logoContainer: {
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 6,
  },
  progressDotActive: {
    width: 12,
    height: 12,
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      }
    })
  },
  progressDotCompleted: {
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 120,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  ageText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }
    })
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  nextButton: {
    flex: 2,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  fullWidthButton: {
    flex: 1,
  },
  nameInputWrapper: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  nameInput: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
    width: '100%',
    opacity: 1,
    ...Platform.select({
      web: {
        outlineWidth: 0,
        outlineStyle: 'none',
        outlineColor: 'transparent',
        backgroundColor: 'white',
      },
      ios: {
        backgroundColor: 'white',
      },
      android: {
        backgroundColor: 'white',
      }
    }),
  },
  occupationInputWrapper: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  occupationInput: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
    width: '100%',
    ...Platform.select({
      web: {
        outlineWidth: 0,
        outlineStyle: 'none',
        outlineColor: 'transparent',
        backgroundColor: 'white',
      },
    }),
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    fontSize: 16,
    color: Colors.text,
    opacity: 1, 
  },
  interestsContainer: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fullContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }
    })
  },
  quizContainer: {
    flex: 1,
  },
  fullHeightContent: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
  },
});

export default OnboardingScreen;