import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';

interface InterestTagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
  subcategories: {
    id: string;
    name: string;
    emoji: string;
  }[];
}

const InterestTagSelector: React.FC<InterestTagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  maxTags = 15
}) => {
  const [activeCategory, setActiveCategory] = useState('lifestyle');
  const animatedValue = useRef(new Animated.Value(1)).current;
  
  // Define categories with emojis
  const categories: Category[] = [
    {
      id: 'religious',
      name: 'Religious Practices',
      emoji: '🕌',
      subcategories: [
        { id: 'prayer', name: 'Prayer', emoji: '🙏' },
        { id: 'meditation', name: 'Meditation', emoji: '🧘' },
        { id: 'scripture', name: 'Scripture Study', emoji: '📖' },
        { id: 'worship', name: 'Worship', emoji: '⛪' },
        { id: 'fasting', name: 'Fasting', emoji: '🍽️' },
        { id: 'charity', name: 'Charity Work', emoji: '🤲' }
      ]
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      emoji: '🏡',
      subcategories: [
        { id: 'fitness', name: 'Fitness', emoji: '💪' },
        { id: 'cooking', name: 'Cooking', emoji: '🍳' },
        { id: 'travel', name: 'Travel', emoji: '✈️' },
        { id: 'music', name: 'Music', emoji: '🎵' },
        { id: 'reading', name: 'Reading', emoji: '📚' },
        { id: 'movies', name: 'Movies', emoji: '🎬' },
        { id: 'art', name: 'Art', emoji: '🎨' },
        { id: 'gaming', name: 'Gaming', emoji: '🎮' }
      ]
    },
    {
      id: 'family',
      name: 'Family',
      emoji: '👨‍👩‍👧‍👦',
      subcategories: [
        { id: 'parenting', name: 'Parenting', emoji: '👶' },
        { id: 'eldercare', name: 'Elder Care', emoji: '👴' },
        { id: 'education', name: 'Education', emoji: '🎓' },
        { id: 'tradition', name: 'Traditions', emoji: '🎎' }
      ]
    },
    {
      id: 'sports',
      name: 'Sports',
      emoji: '⚽',
      subcategories: [
        { id: 'soccer', name: 'Soccer', emoji: '⚽' },
        { id: 'basketball', name: 'Basketball', emoji: '🏀' },
        { id: 'cricket', name: 'Cricket', emoji: '🏏' },
        { id: 'swimming', name: 'Swimming', emoji: '🏊' },
        { id: 'yoga', name: 'Yoga', emoji: '🧘‍♀️' },
        { id: 'cycling', name: 'Cycling', emoji: '🚴' },
        { id: 'running', name: 'Running', emoji: '🏃' },
        { id: 'hiking', name: 'Hiking', emoji: '🥾' }
      ]
    },
    {
      id: 'culture',
      name: 'Culture',
      emoji: '🌍',
      subcategories: [
        { id: 'language', name: 'Languages', emoji: '🗣️' },
        { id: 'history', name: 'History', emoji: '📜' },
        { id: 'cuisine', name: 'Cuisine', emoji: '🍲' },
        { id: 'arts', name: 'Arts', emoji: '🎭' },
        { id: 'literature', name: 'Literature', emoji: '📚' }
      ]
    }
  ];
  
  // Get active category's subcategories
  const getActiveSubcategories = () => {
    const category = categories.find(cat => cat.id === activeCategory);
    return category ? category.subcategories : [];
  };
  
  // Toggle a tag in the selected tags array
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tagId]);
    } else {
      // Animate to indicate max tags reached
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true
        })
      ]).start();
    }
  };
  
  // Render a category button
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        activeCategory === item.id && styles.activeCategoryButton
      ]}
      onPress={() => setActiveCategory(item.id)}
    >
      <Text style={styles.categoryEmoji}>{item.emoji}</Text>
      <Text 
        style={[
          styles.categoryName,
          activeCategory === item.id && styles.activeCategoryName
        ]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  // Render a subcategory tag
  const renderSubcategoryItem = ({ item }: { item: { id: string, name: string, emoji: string } }) => (
    <TouchableOpacity
      style={[
        styles.subcategoryButton,
        selectedTags.includes(item.id) && styles.selectedSubcategoryButton
      ]}
      onPress={() => toggleTag(item.id)}
    >
      <Text style={styles.subcategoryEmoji}>{item.emoji}</Text>
      <Text 
        style={[
          styles.subcategoryName,
          selectedTags.includes(item.id) && styles.selectedSubcategoryName
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  // Render a selected tag (for removal)
  const renderSelectedTag = ({ item }: { item: string }) => {
    // Find the tag details
    let tagName = item;
    let tagEmoji = '🏷️';
    
    for (const category of categories) {
      const subcategory = category.subcategories.find(sub => sub.id === item);
      if (subcategory) {
        tagName = subcategory.name;
        tagEmoji = subcategory.emoji;
        break;
      }
    }
    
    return (
      <View style={styles.selectedTag}>
        <Text style={styles.selectedTagEmoji}>{tagEmoji}</Text>
        <Text style={styles.selectedTagText}>{tagName}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => toggleTag(item)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Selected tags section - moved to top for visibility */}
      <Animated.View 
        style={[
          styles.selectedTagsContainer,
          { transform: [{ scale: animatedValue }] }
        ]}
      >
        <View style={styles.selectedTagsHeader}>
          <Text style={styles.selectedTagsTitle}>Your Selected Interests:</Text>
          <Text style={styles.selectedTagsCount}>
            {selectedTags.length}/{maxTags}
          </Text>
        </View>
        
        {selectedTags.length === 0 ? (
          <Text style={styles.noTagsText}>
            No interests selected yet. Tap on categories below to select your interests.
          </Text>
        ) : (
          <FlatList
            data={selectedTags}
            renderItem={renderSelectedTag}
            keyExtractor={item => item}
            numColumns={2}
            contentContainerStyle={styles.selectedTagsList}
          />
        )}
      </Animated.View>
      
      {/* Categories horizontal list */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Subcategories grid - takes remaining space */}
      <View style={styles.subcategoriesContainer}>
        <FlatList
          data={getActiveSubcategories()}
          renderItem={renderSubcategoryItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.subcategoriesList}
        />
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const CATEGORY_WIDTH = 85;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  selectedTagsContainer: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  selectedTagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedTagsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  selectedTagsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  noTagsText: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  selectedTagsList: {
    paddingBottom: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    maxWidth: (width - 48) / 2,
  },
  selectedTagEmoji: {
    fontSize: 14,
    marginRight: 4,
    color: Colors.white,
  },
  selectedTagText: {
    color: Colors.white,
    fontSize: 14,
    marginRight: 4,
    flex: 1,
  },
  removeButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: Colors.white,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    height: 80,
    marginBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  categoryButton: {
    width: CATEGORY_WIDTH,
    height: 70,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    padding: 8,
  },
  activeCategoryButton: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  activeCategoryName: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  subcategoriesContainer: {
    flex: 1,
  },
  subcategoriesList: {
    paddingHorizontal: 8,
  },
  subcategoryButton: {
    width: (width - 48) / 2,
    height: 60,
    margin: 6,
    borderRadius: 12,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  selectedSubcategoryButton: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  subcategoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  subcategoryName: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  selectedSubcategoryName: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default InterestTagSelector; 