import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/Colors';
import { mockMessages, mockMatches, mockUsers, currentUser } from '../../data/mockUsers';
import { Message, User } from '../../types';
import { Send } from 'lucide-react-native';
import MessageBubble from '../../components/MessageBubble';

export default function MessagesScreen() {
  const params = useLocalSearchParams();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(params.userId as string || null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([...mockMessages]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get all matches
  const matches = mockMatches;

  // Get all users from matches
  const matchedUsers = matches.map(match => {
    const user = mockUsers.find(user => user.id === match.matchedUserId);
    return user;
  }).filter(user => user !== undefined) as User[];

  // Get selected user
  const selectedUser = selectedUserId 
    ? matchedUsers.find(user => user.id === selectedUserId) 
    : null;

  // Get selected match
  const selectedMatch = selectedUserId 
    ? matches.find(match => match.matchedUserId === selectedUserId) 
    : null;

  // Get messages for selected match
  const matchMessages = selectedMatch 
    ? messages.filter(message => message.matchId === selectedMatch.id) 
    : [];

  // Sort messages by timestamp
  const sortedMessages = [...matchMessages].sort((a, b) => a.timestamp - b.timestamp);

  // Send a new message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedMatch) return;

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      matchId: selectedMatch.id,
      senderId: currentUser.id,
      content: messageText.trim(),
      timestamp: Date.now(),
      read: true,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Auto-scroll to bottom on load and when new messages come in
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 200);
  }, [selectedUserId, sortedMessages.length]);

  const renderMessageList = () => {
    if (!selectedUser) {
      return (
        <View style={styles.noConversation}>
          <Text style={styles.noConversationText}>
            Select a conversation to start messaging
          </Text>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.conversationHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedUserId(null)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Image 
            source={{ uri: selectedUser.photos[0] }} 
            style={styles.profileImage} 
          />
          <Text style={styles.userName}>{selectedUser.name}</Text>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
        >
          {sortedMessages.map(message => (
            <MessageBubble
              key={message.id}
              message={message.content}
              isOwnMessage={message.senderId === currentUser.id}
              timestamp={new Date(message.timestamp)}
            />
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textSecondary}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !messageText.trim() && styles.disabledSendButton
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };

  const renderMatchList = () => {
    const getLastMessage = (matchId: string) => {
      const matchMessages = messages
        .filter(message => message.matchId === matchId)
        .sort((a, b) => b.timestamp - a.timestamp);
      
      return matchMessages[0];
    };

    const renderMatchItem = ({ item }: { item: User }) => {
      const match = matches.find(m => m.matchedUserId === item.id);
      const lastMessage = match ? getLastMessage(match.id) : null;
      const hasUnreadMessages = lastMessage && !lastMessage.read && lastMessage.senderId !== currentUser.id;

      return (
        <TouchableOpacity
          style={[
            styles.matchItem,
            selectedUserId === item.id && styles.selectedMatchItem
          ]}
          onPress={() => setSelectedUserId(item.id)}
        >
          <View style={styles.matchItemContainer}>
            <Image source={{ uri: item.photos[0] }} style={styles.matchImage} />
            {hasUnreadMessages && <View style={styles.unreadBadge} />}
            <View style={styles.matchInfo}>
              <Text style={styles.matchName}>{item.name}</Text>
              {lastMessage ? (
                <Text 
                  style={[
                    styles.lastMessage,
                    hasUnreadMessages && styles.unreadMessage
                  ]}
                  numberOfLines={1}
                >
                  {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                  {lastMessage.content}
                </Text>
              ) : (
                <Text style={styles.noMessages}>Start a conversation</Text>
              )}
            </View>
            {lastMessage && (
              <Text style={styles.timestamp}>
                {new Date(lastMessage.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <FlatList
        data={matchedUsers}
        renderItem={renderMatchItem}
        keyExtractor={item => item.id}
        style={styles.matchesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No conversations yet</Text>
            <Text style={styles.emptyStateText}>
              Start matching with people to begin conversations
            </Text>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.webContainer}>
          <View style={styles.sidebar}>
            <Text style={styles.title}>Messages</Text>
            {renderMatchList()}
          </View>
          <View style={styles.messageArea}>
            {renderMessageList()}
          </View>
        </View>
      ) : (
        // On mobile, only show either the matches list or the conversation
        selectedUserId ? renderMessageList() : (
          <>
            <Text style={styles.title}>Messages</Text>
            {renderMatchList()}
          </>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  webContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: Colors.lightGray,
    padding: 16,
  },
  messageArea: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    margin: 16,
  },
  matchesList: {
    flex: 1,
  },
  matchItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  selectedMatchItem: {
    backgroundColor: Colors.primaryLight,
  },
  matchItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  unreadMessage: {
    fontWeight: '600',
    color: Colors.text,
  },
  noMessages: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  unreadBadge: {
    position: 'absolute',
    top: 10,
    left: 45,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  noConversation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noConversationText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  backButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    maxHeight: 100,
    marginRight: 8,
    color: Colors.text,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: Colors.gray,
  },
});