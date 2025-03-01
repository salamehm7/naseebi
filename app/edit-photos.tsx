import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ArrowUpDown, 
  Eye, 
  EyeOff,
  Lock,
  Info
} from 'lucide-react-native';
import Colors from '../constants/Colors';
import Button from '../components/Button';

const EditPhotos = () => {
  const router = useRouter();
  const [photos, setPhotos] = useState([
    {
      id: '1',
      uri: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzbGltJTIwbWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      isMain: true,
      isPrivate: false,
    },
    {
      id: '2',
      uri: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
      isMain: false,
      isPrivate: false,
    },
    {
      id: '3',
      uri: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fG1hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      isMain: false,
      isPrivate: false,
    }
  ]);
  const [blurAll, setBlurAll] = useState(false);

  const maxPhotos = 9;
  
  const handleSetMainPhoto = (id) => {
    setPhotos(photos.map(photo => ({
      ...photo,
      isMain: photo.id === id
    })));
  };
  
  const handleDeletePhoto = (id) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setPhotos(photos.filter(photo => photo.id !== id));
          }
        }
      ]
    );
  };
  
  const handleTogglePrivate = (id) => {
    setPhotos(photos.map(photo => 
      photo.id === id ? { ...photo, isPrivate: !photo.isPrivate } : photo
    ));
  };
  
  const handleBlurAllToggle = () => {
    if (!blurAll) {
      // If turning on blur all, show premium upsell
      router.push({
        pathname: '/premium',
        params: { tier: 'sapphire' }
      });
    } else {
      // If already enabled, just toggle it off
      setBlurAll(false);
      setPhotos(photos.map(photo => ({ ...photo, isPrivate: false })));
    }
  };
  
  const handleAddPhoto = () => {
    // This would integrate with image picker
    Alert.alert("Feature", "Image picker would open here");
  };
  
  // Render photos manually to avoid VirtualizedList warning
  const renderPhotos = () => {
    return photos.map((photo) => (
      <View key={photo.id} style={styles.photoCard}>
        <View style={styles.photoWrapper}>
          <Image 
            source={{ uri: photo.uri }} 
            style={styles.photo} 
          />
          {photo.isPrivate && (
            <View style={styles.blurOverlay}>
              <Lock size={24} color="#FFF" />
              <Text style={styles.blurOverlayText}>Private</Text>
            </View>
          )}
          {photo.isMain && (
            <View style={styles.mainBadge}>
              <Text style={styles.mainBadgeText}>Main</Text>
            </View>
          )}
        </View>
        
        <View style={styles.photoActions}>
          <TouchableOpacity 
            style={styles.photoActionButton}
            onPress={() => handleSetMainPhoto(photo.id)}
            disabled={photo.isMain}
          >
            <ArrowUpDown size={18} color={photo.isMain ? Colors.textSecondary : Colors.primary} />
            <Text style={[
              styles.photoActionText, 
              photo.isMain && styles.photoActionTextDisabled
            ]}>
              {photo.isMain ? 'Main' : 'Set as Main'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.photoActionButton}
            onPress={() => handleTogglePrivate(photo.id)}
          >
            {photo.isPrivate 
              ? <Eye size={18} color={Colors.primary} />
              : <EyeOff size={18} color={Colors.primary} />
            }
            <Text style={styles.photoActionText}>
              {photo.isPrivate ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.photoActionButton}
            onPress={() => handleDeletePhoto(photo.id)}
          >
            <Trash2 size={18} color={Colors.error} />
            <Text style={[styles.photoActionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Photos</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.blurSection}>
          <View style={styles.blurInfoContainer}>
            <Lock size={18} color={Colors.primary} style={styles.blurIcon} />
            <View style={styles.blurTextContainer}>
              <Text style={styles.blurTitle}>Blur All Photos</Text>
              <Text style={styles.blurDescription}>
                Control who sees your photos. Only revealed to those you message with.
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.blurToggle, blurAll && styles.blurToggleActive]}
              onPress={handleBlurAllToggle}
            >
              <View style={[styles.blurToggleCircle, blurAll && styles.blurToggleCircleActive]} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.sapphireInfoButton} onPress={() => router.push('/premium')}>
            <Info size={14} color={Colors.primaryLight} />
            <Text style={styles.sapphireInfoText}>Requires Naseebi Sapphire</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.photosContainer}>
          {renderPhotos()}
          
          {photos.length < maxPhotos && (
            <TouchableOpacity 
              style={styles.addPhotoCard}
              onPress={handleAddPhoto}
            >
              <Plus size={32} color={Colors.primary} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
              <Text style={styles.photoCountText}>
                {photos.length}/{maxPhotos} Photos
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.photoTips}>
          <Text style={styles.photoTipsTitle}>Photo Tips</Text>
          <Text style={styles.photoTipsText}>
            • Use clear, recent photos of yourself{'\n'}
            • Include at least one full-body photo{'\n'}
            • Show your face clearly in your main photo{'\n'}
            • Photos with good lighting get more matches
          </Text>
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
  content: {
    flex: 1,
  },
  blurSection: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 10,
  },
  blurInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blurIcon: {
    marginRight: 12,
  },
  blurTextContainer: {
    flex: 1,
  },
  blurTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  blurDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  blurToggle: {
    width: 50,
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    padding: 2,
  },
  blurToggleActive: {
    backgroundColor: Colors.primary,
  },
  blurToggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF',
  },
  blurToggleCircleActive: {
    transform: [{ translateX: 20 }],
  },
  sapphireInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  sapphireInfoText: {
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 4,
  },
  photosContainer: {
    padding: 16,
  },
  photoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photoWrapper: {
    position: 'relative',
    height: 200,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurOverlayText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  mainBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mainBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  photoActions: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  photoActionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActionText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.text,
  },
  photoActionTextDisabled: {
    color: Colors.textSecondary,
  },
  deleteText: {
    color: Colors.error,
  },
  addPhotoCard: {
    height: 180,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  addPhotoText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 8,
  },
  photoCountText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  photoTips: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 30,
  },
  photoTipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  photoTipsText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});

export default EditPhotos; 