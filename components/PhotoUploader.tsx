import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, Modal, Pressable, Switch } from 'react-native';
import { CirclePlus as PlusCircle, X, Upload, Lock, Shield } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface PhotoUploaderProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  blurEnabled?: boolean;
  onBlurToggle?: (enabled: boolean) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 5,
  blurEnabled = false,
  onBlurToggle = () => {}
}) => {
  // Sample images to simulate photo selection
  const sampleImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ];
  
  const [showSampleGallery, setShowSampleGallery] = useState(false);
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  
  const handleAddPhoto = () => {
    setShowSampleGallery(true);
  };
  
  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
  };
  
  const handleSelectSamplePhoto = (url: string) => {
    if (photos.length < maxPhotos) {
      const newPhotos = [...photos, url];
      onPhotosChange(newPhotos);
      setShowSampleGallery(false);
    }
  };
  
  const handleBlurToggle = (value: boolean) => {
    if (value && !blurEnabled) {
      setPremiumModalVisible(true);
    } else {
      onBlurToggle(value);
    }
  };
  
  const goToPremiumPage = () => {
    setPremiumModalVisible(false);
    router.push('/premium');
  };
  
  const renderPhotoPlaceholders = () => {
    const items = [];
    
    // Render existing photos
    for (let i = 0; i < photos.length; i++) {
      items.push(
        <View key={`photo-${i}`} style={styles.photoContainer}>
          <Image source={{ uri: photos[i] }} style={styles.photo} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemovePhoto(i)}
          >
            <X size={16} color={Colors.white} />
          </TouchableOpacity>
          {i === 0 && (
            <View style={styles.mainPhotoLabel}>
              <Text style={styles.mainPhotoText}>Main Photo</Text>
            </View>
          )}
        </View>
      );
    }
    
    // Add placeholder for new photo if limit not reached
    if (photos.length < maxPhotos) {
      items.push(
        <TouchableOpacity 
          key="add-photo" 
          style={styles.addPhotoButton}
          onPress={handleAddPhoto}
        >
          <PlusCircle size={32} color={Colors.primary} />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
      );
    }
    
    // Add empty placeholders to fill the grid
    const remainingPlaceholders = maxPhotos - items.length;
    for (let i = 0; i < remainingPlaceholders; i++) {
      items.push(
        <View key={`placeholder-${i}`} style={styles.emptyPlaceholder}>
          <PlusCircle size={24} color={Colors.lightGray} />
        </View>
      );
    }
    
    return items;
  };
  
  const renderSampleGallery = () => {
    if (!showSampleGallery) return null;
    
    return (
      <View style={styles.sampleGalleryOverlay}>
        <View style={styles.sampleGallery}>
          <View style={styles.sampleGalleryHeader}>
            <Text style={styles.sampleGalleryTitle}>Select a Photo</Text>
            <TouchableOpacity onPress={() => setShowSampleGallery(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.sampleImageGrid}>
            {sampleImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sampleImageContainer}
                onPress={() => handleSelectSamplePhoto(image)}
              >
                <Image source={{ uri: image }} style={styles.sampleImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <Text style={styles.sampleNote}>
            Note: In a real app, you would access your device's camera or gallery here
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Add up to {maxPhotos} photos to your profile
      </Text>
      <Text style={styles.subText}>
        Your first photo will be your main profile picture
      </Text>
      
      <View style={[styles.blurContainer, styles.blurContainerTop]}>
        <Lock size={16} color={Colors.primary} style={styles.blurIcon} />
        <Text style={styles.blurText}>Blur photos in Shadow Mode</Text>
        <Switch
          value={blurEnabled}
          onValueChange={handleBlurToggle}
          trackColor={{ false: Colors.lightGray, true: Colors.primaryLight }}
          thumbColor={blurEnabled ? Colors.primary : Colors.white}
          ios_backgroundColor={Colors.lightGray}
          style={styles.blurSwitch}
        />
      </View>
      
      {blurEnabled && (
        <View style={styles.blurActiveContainer}>
          <Shield size={18} color={Colors.primary} />
          <Text style={styles.blurActiveText}>
            Your photos will be blurred to non-matches for privacy
          </Text>
        </View>
      )}
      
      <View style={styles.photosGrid}>
        {renderPhotoPlaceholders()}
      </View>
      
      <View style={styles.tipContainer}>
        <Upload size={20} color={Colors.primary} />
        <Text style={styles.tipText}>
          Tip: Upload clear photos of yourself for better matches
        </Text>
      </View>
      
      {renderSampleGallery()}
      
      {/* Premium Feature Modal */}
      <Modal
        visible={premiumModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPremiumModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setPremiumModalVisible(false)}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
          >
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primary]}
              style={styles.modalGradient}
            >
              <View style={styles.modalIconContainer}>
                <Shield size={32} color={Colors.white} />
              </View>
              
              <Text style={styles.modalTitle}>Shadow Mode</Text>
              
              <Text style={styles.modalDescription}>
                Shadow Mode is a premium feature that protects your privacy by blurring your photos to non-matches.
              </Text>
              
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={goToPremiumPage}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setPremiumModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Not Now</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 8,
  },
  photoContainer: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 4,
    overflow: 'hidden',
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
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainPhotoLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mainPhotoText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  addPhotoButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(212, 193, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  emptyPlaceholder: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 193, 236, 0.2)',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.text,
  },
  sampleGalleryOverlay: {
    position: 'absolute',
    top: -100,
    left: -24,
    right: -24,
    bottom: -100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  sampleGallery: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }
    })
  },
  sampleGalleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  sampleGalleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sampleImageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sampleImageContainer: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  sampleImage: {
    width: '100%',
    height: '100%',
  },
  sampleNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(157, 132, 183, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
    marginTop: 0,
  },
  blurIcon: {
    marginRight: 4,
  },
  blurText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginRight: 6,
  },
  blurSwitch: {
    transform: [{ scale: 0.8 }],
  },
  blurActiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(157, 132, 183, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  blurActiveText: {
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  upgradeButton: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  cancelButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  blurContainerTop: {
    marginBottom: 16,
    marginTop: 0,
  },
});

export default PhotoUploader;