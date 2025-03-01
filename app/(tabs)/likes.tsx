import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Platform } from 'react-native';
import { router } from 'expo-router';
import { Heart, Crown } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { mockUsers, mockLikes } from '../../data/mockUsers';
import { User, SubscriptionTier } from '../../types';
import { useSubscription } from '../../context/SubscriptionContext';
import PremiumFeatureGate from '../../components/PremiumFeatureGate';

export default function LikesScreen() {
  const { subscribedTier } = useSubscription();
  const hasSapphire = subscribedTier === SubscriptionTier.SAPPHIRE;
  
  // Get users who have liked the current user
  const likedUsers = mockLikes.map(like => {
    const user = mockUsers.find(user => user.id === like.userId);
    return user;
  }).filter(Boolean) as User[];
  
  const navigateToPremium = () => {
    router.push('/premium');
  };
  
  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <Image
        source={{ uri: item.photos[0] }}
        style={styles.userImage}
      />
      {!hasSapphire && <View style={styles.blurOverlay} />}
      <View style={styles.userInfo}>
        {hasSapphire ? (
          <>
            <Text style={styles.userName}>{item.name}, {item.age}</Text>
            <Text style={styles.userLocation}>{item.location}</Text>
          </>
        ) : (
          <>
            <View style={styles.blurredText} />
            <View style={styles.blurredText} />
          </>
        )}
      </View>
      {!hasSapphire && (
        <View style={styles.lockOverlay}>
          <Heart size={24} color={Colors.white} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>People who liked you</Text>
        <Text style={styles.count}>{likedUsers.length}</Text>
      </View>
      
      {likedUsers.length > 0 ? (
        <>
          <FlatList
            data={likedUsers}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.userGrid}
            columnWrapperStyle={styles.column}
          />
          
          {!hasSapphire && (
            <View style={styles.upgradeContainer}>
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={navigateToPremium}
                activeOpacity={0.8}
              >
                <Crown size={20} color={Colors.white} style={styles.upgradeIcon} />
                <Text style={styles.upgradeText}>
                  Upgrade to Sapphire to See Who Likes You
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Heart size={64} color={Colors.primaryLight} />
          <Text style={styles.emptyTitle}>No likes yet</Text>
          <Text style={styles.emptyText}>
            Continue swiping to get more likes from other users
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  count: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  userGrid: {
    paddingBottom: 100,
  },
  column: {
    justifyContent: 'space-between',
  },
  userCard: {
    width: '48%',
    aspectRatio: 0.8,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  userImage: {
    width: '100%',
    height: '70%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
  },
  lockOverlay: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    padding: 12,
    height: '30%',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  blurredText: {
    height: 12,
    width: '70%',
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    marginBottom: 6,
  },
  upgradeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  upgradeButton: {
    backgroundColor: Colors.premium.sapphire,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeIcon: {
    marginRight: 10,
  },
  upgradeText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  }
});