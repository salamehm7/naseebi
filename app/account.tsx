import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Platform,
  SafeAreaView,
  Slider
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Edit, 
  Camera, 
  CheckCircle,
  Clock,
  Heart,
  ChevronRight,
  MessageSquare,
  Settings,
  LogOut,
  Shield
} from 'lucide-react-native';
import Colors from '../constants/Colors';
import Button from '../components/Button';

const ProfilePage = () => {
  const router = useRouter();
  const [bio, setBio] = useState("I'm looking for someone who shares my values and is ready for a meaningful relationship. I enjoy cooking, hiking, and reading in my free time.");
  const [marriageTimeline, setMarriageTimeline] = useState(3); // 1-5 scale
  const [editingBio, setEditingBio] = useState(false);
  
  // Mock data - in a real app this would come from a user context or API
  const user = {
    name: "Ahmed Khan",
    age: 28,
    photos: [
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzbGltJTIwbWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fG1hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
    ],
    location: "Toronto, ON",
    isVerified: true,
    education: "Master's in Computer Science",
    occupation: "Software Engineer",
    height: "5'11\"",
    ethnicity: "Pakistani",
    faith: "Muslim",
    prayerFrequency: "Five times daily",
    religiousValues: "Traditional",
    maritalStatus: "Never Married"
  };

  const getMarriageTimelineText = (value) => {
    const labels = [
      "Not looking to marry soon",
      "Within the next few years",
      "Within a year or two",
      "Within the next year",
      "As soon as possible"
    ];
    return labels[Math.floor(value) - 1];
  };

  // Render photo thumbnails directly instead of using map to avoid VirtualizedList warning
  const renderPhotoThumbnails = () => {
    return (
      <>
        {user.photos.length > 1 && (
          <TouchableOpacity 
            style={styles.thumbnailContainer}
            onPress={() => router.push('/edit-photos')}
          >
            <Image
              source={{ uri: user.photos[1] }}
              style={styles.thumbnail}
            />
          </TouchableOpacity>
        )}
        
        {user.photos.length > 2 && (
          <TouchableOpacity 
            style={styles.thumbnailContainer}
            onPress={() => router.push('/edit-photos')}
          >
            <Image
              source={{ uri: user.photos[2] }}
              style={styles.thumbnail}
            />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.addPhotoButton}
          onPress={() => router.push('/edit-photos')}
        >
          <Camera size={24} color={Colors.textSecondary} />
          <Text style={styles.addPhotoText}>Add Photos</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>My Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <TouchableOpacity 
            style={styles.mainPhotoContainer}
            onPress={() => router.push('/edit-photos')}
          >
            <Image
              source={{ uri: user.photos[0] }}
              style={styles.mainPhoto}
            />
            <View style={styles.editPhotoButton}>
              <Camera size={18} color="#FFF" />
            </View>

            {user.isVerified && (
              <View style={styles.verifiedBadge}>
                <CheckCircle size={16} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.userName}>{user.name}, {user.age}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.textSecondary} />
            <Text style={styles.locationText}>{user.location}</Text>
          </View>

          <View style={styles.photoGallery}>
            {renderPhotoThumbnails()}
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <TouchableOpacity onPress={() => setEditingBio(!editingBio)}>
              <Edit size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          {editingBio ? (
            <View style={styles.bioEditContainer}>
              <TextInput
                value={bio}
                onChangeText={setBio}
                style={styles.bioInput}
                multiline
                placeholder="Tell others about yourself..."
                maxLength={300}
              />
              <View style={styles.bioEditButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setEditingBio(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => setEditingBio(false)}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.bioText}>{bio}</Text>
          )}
        </View>

        {/* Marriage Timeline Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Marriage Timeline</Text>
            <Heart size={18} color={Colors.primary} />
          </View>
          
          <View style={styles.timelineContainer}>
            <Text style={styles.timelineText}>
              {getMarriageTimelineText(marriageTimeline)}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={marriageTimeline}
              onValueChange={setMarriageTimeline}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor="#E0E0E0"
            />
            <View style={styles.timelineLabels}>
              <Text style={styles.timelineLabelText}>Not Soon</Text>
              <Text style={styles.timelineLabelText}>ASAP</Text>
            </View>
          </View>
        </View>

        {/* Essentials Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Essentials</Text>
            <TouchableOpacity onPress={() => router.push('/edit-essentials')}>
              <Edit size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.essentialsContainer}>
            <View style={styles.essentialItem}>
              <View style={styles.essentialIconContainer}>
                <User size={16} color={Colors.primary} />
              </View>
              <View style={styles.essentialContent}>
                <Text style={styles.essentialLabel}>Height</Text>
                <Text style={styles.essentialValue}>{user.height}</Text>
              </View>
            </View>
            
            <View style={styles.essentialItem}>
              <View style={styles.essentialIconContainer}>
                <GraduationCap size={16} color={Colors.primary} />
              </View>
              <View style={styles.essentialContent}>
                <Text style={styles.essentialLabel}>Education</Text>
                <Text style={styles.essentialValue}>{user.education}</Text>
              </View>
            </View>
            
            <View style={styles.essentialItem}>
              <View style={styles.essentialIconContainer}>
                <Briefcase size={16} color={Colors.primary} />
              </View>
              <View style={styles.essentialContent}>
                <Text style={styles.essentialLabel}>Occupation</Text>
                <Text style={styles.essentialValue}>{user.occupation}</Text>
              </View>
            </View>
            
            <View style={styles.essentialItem}>
              <View style={styles.essentialIconContainer}>
                <MapPin size={16} color={Colors.primary} />
              </View>
              <View style={styles.essentialContent}>
                <Text style={styles.essentialLabel}>Ethnicity</Text>
                <Text style={styles.essentialValue}>{user.ethnicity}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Faith Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Faith & Values</Text>
            <TouchableOpacity onPress={() => router.push('/edit-faith')}>
              <Edit size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.essentialsContainer}>
            <View style={styles.essentialItem}>
              <View style={styles.essentialIconContainer}>
                <Shield size={16} color={Colors.primary} />
              </View>
              <View style={styles.essentialContent}>
                <Text style={styles.essentialLabel}>Faith</Text>
                <Text style={styles.essentialValue}>{user.faith}</Text>
              </View>
            </View>
            
            <View style={styles.essentialItem}>
              <View style={styles.essentialIconContainer}>
                <Clock size={16} color={Colors.primary} />
              </View>
              <View style={styles.essentialContent}>
                <Text style={styles.essentialLabel}>Prayer Frequency</Text>
                <Text style={styles.essentialValue}>{user.prayerFrequency}</Text>
              </View>
            </View>
            
            <View style={styles.essentialItem}>
              <View style={styles.essentialIconContainer}>
                <Heart size={16} color={Colors.primary} />
              </View>
              <View style={styles.essentialContent}>
                <Text style={styles.essentialLabel}>Religious Values</Text>
                <Text style={styles.essentialValue}>{user.religiousValues}</Text>
              </View>
            </View>
            
            <View style={styles.essentialItem}>
              <View style={styles.essentialIconContainer}>
                <User size={16} color={Colors.primary} />
              </View>
              <View style={styles.essentialContent}>
                <Text style={styles.essentialLabel}>Marital Status</Text>
                <Text style={styles.essentialValue}>{user.maritalStatus}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationSection}>
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => router.push('/edit-photos')}
          >
            <Camera size={20} color={Colors.text} />
            <Text style={styles.navigationButtonText}>Manage Photos</Text>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => router.push('/preferences')}
          >
            <Heart size={20} color={Colors.text} />
            <Text style={styles.navigationButtonText}>Preferences</Text>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => router.push('/verification')}
          >
            <Shield size={20} color={Colors.text} />
            <Text style={styles.navigationButtonText}>Verification</Text>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => router.push('/auth/login')}
          >
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    position: 'relative',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  mainPhotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.success,
    padding: 4,
    borderRadius: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  photoGallery: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  addPhotoButton: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  bioEditContainer: {
    marginBottom: 10,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    lineHeight: 20,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bioEditButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '500',
  },
  timelineContainer: {
    paddingHorizontal: 10,
  },
  timelineText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  timelineLabelText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  essentialsContainer: {
    marginTop: 5,
  },
  essentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  essentialIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  essentialContent: {
    flex: 1,
  },
  essentialLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  essentialValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  navigationSection: {
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  navigationButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  logoutButtonContainer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.error,
    fontWeight: '500',
  }
});

export default ProfilePage; 