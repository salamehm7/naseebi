import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Search, Check } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { countries, getFlagEmoji } from '../data/countries';

interface CountrySelectorProps {
  selectedCountry: string;
  onSelect: (country: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onSelect }) => {
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  
  useEffect(() => {
    if (search) {
      const filtered = countries.filter(country => 
        country.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [search]);
  
  const renderCountryItem = ({ item }: { item: typeof countries[0] }) => {
    const isSelected = item.name === selectedCountry;
    const flagEmoji = getFlagEmoji(item.code);
    
    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
          isSelected && styles.selectedCountryItem
        ]}
        onPress={() => onSelect(item.name)}
        activeOpacity={0.7}
      >
        <View style={styles.flagNameContainer}>
          <Text style={styles.flag}>{flagEmoji}</Text>
          <Text style={[
            styles.countryText,
            isSelected && styles.selectedCountryText
          ]}>
            {item.name}
          </Text>
        </View>
        
        {isSelected && (
          <Check size={20} color={Colors.primary} />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search countries..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={Colors.textSecondary}
          autoComplete="off"
        />
      </View>
      
      <FlatList
        data={filteredCountries}
        renderItem={renderCountryItem}
        keyExtractor={(item) => item.code}
        style={styles.countryList}
        showsVerticalScrollIndicator={true}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No countries found</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    maxHeight: 400,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }
    })
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.text,
  },
  countryList: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
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
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  flagNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 22,
    marginRight: 12,
  },
  selectedCountryItem: {
    backgroundColor: Colors.primaryLight + '30', // 30% opacity
  },
  countryText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedCountryText: {
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyText: {
    padding: 20,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

export default CountrySelector;