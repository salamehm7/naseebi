import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';
import { mockMatches, mockUsers } from '../../data/mockUsers';
import { User } from '../../types';
import Card from '../../components/Card';

export default function MatchesScreen() {
  const getMatchedUser = (matchedUserId: string): User | undefined => {
    return mockUsers.find(user => user.id === matchedUserId);
  };

  const matchedUsers = mockMatches.map(match => 
    getMatchedUser(match.matchedUserId)
  ).filter(user => user !== undefined) as User[];

  const renderMatch = ({ item }: { item: User }) => {
    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => router.push({
          pathname: '/messages',
          params: { userId: item.id }
        })}
      >
        <Card user={item} showActions={false} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Matches</Text>
      
      {matchedUsers.length > 0 ? (
        <FlatList
          data={matchedUsers}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.matchesList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No matches yet</Text>
          <Text style={styles.emptyStateText}>
            Keep swiping to find your perfect match!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  matchesList: {
    paddingBottom: 24,
  },
  matchCard: {
    marginBottom: 16,
    height: 500,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});