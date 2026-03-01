import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Paragraph, TextInput, IconButton, Avatar } from 'react-native-paper';
import { messagesApi } from '../api';
import { Message } from '../types';
import { safeFormatDate } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';

export default function ChatScreen({ route }: any) {
  const { userId, userName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [userId]);

  const loadMessages = async () => {
    try {
      const data = await messagesApi.getConversation(userId);
      setMessages(data.reverse());
      // Mark as read
      data.filter((m: Message) => m.receiverId === user?.id && !m.isRead).forEach((m: Message) => {
        messagesApi.markAsRead(m.id);
      });
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await messagesApi.send({
        receiverId: userId,
        message: newMessage.trim(),
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isFromMe = item.senderId === user?.id;

    return (
      <View style={[styles.messageContainer, isFromMe ? styles.myMessage : styles.theirMessage]}>
        {!isFromMe && (
          <Avatar.Text size={32} label={userName?.charAt(0) || '?'} style={styles.avatar} />
        )}
        <Card style={[styles.messageCard, isFromMe ? styles.myMessageCard : styles.theirMessageCard]}>
          <Card.Content style={styles.messageContent}>
            <Paragraph style={[styles.messageText, isFromMe && styles.myMessageText]}>
              {item.message || item.content}
            </Paragraph>
            <Paragraph style={[styles.messageTime, isFromMe && styles.myMessageTime]}>
              {safeFormatDate(item.createdAt, 'HH:mm')}
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          mode="outlined"
          style={styles.input}
          multiline
          maxLength={500}
        />
        <IconButton
          icon="send"
          size={28}
          iconColor="#1976D2"
          onPress={handleSend}
          disabled={loading || !newMessage.trim()}
          style={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  messagesList: { padding: 16 },
  messageContainer: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  myMessage: { justifyContent: 'flex-end' },
  theirMessage: { justifyContent: 'flex-start' },
  avatar: { backgroundColor: '#1976D2', marginRight: 8 },
  messageCard: { maxWidth: '75%', elevation: 2, borderRadius: 16 },
  myMessageCard: { backgroundColor: '#1976D2', borderBottomRightRadius: 4 },
  theirMessageCard: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4 },
  messageContent: { padding: 8 },
  messageText: { fontSize: 15, color: '#212121' },
  myMessageText: { color: '#FFFFFF' },
  messageTime: { fontSize: 11, color: '#757575', marginTop: 4, textAlign: 'right' },
  myMessageTime: { color: '#E3F2FD' },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', alignItems: 'center', elevation: 8 },
  input: { flex: 1, marginRight: 8, maxHeight: 100 },
  sendButton: { margin: 0 },
});
