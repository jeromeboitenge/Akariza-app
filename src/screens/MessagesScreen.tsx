import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, FAB, ActivityIndicator, Badge } from 'react-native-paper';
import { messagesApi } from '../api';
import { Message } from '../types';
import { safeFormatDate } from '../utils/formatters';

export default function MessagesScreen({ navigation }: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMessages = async () => {
    try {
      const data = await messagesApi.getOrgChat();
      setMessages(data);
    } catch (error) {
      console.error('Load messages error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const renderMessage = ({ item }: { item: Message }) => (
    <Card 
      style={styles.card}
      onPress={() => navigation.navigate('Chat', { userId: item.senderId, userName: item.sender?.fullName })}
    >
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Title style={styles.sender}>{item.sender?.fullName || 'Unknown'}</Title>
            <Paragraph>{item.message}</Paragraph>
            <Paragraph style={styles.time}>
              {safeFormatDate(item.createdAt, 'MMM dd, yyyy HH:mm')}
            </Paragraph>
          </View>
          {!item.isRead && <Badge style={styles.badge}>New</Badge>}
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadMessages(); }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Paragraph>No messages</Paragraph>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  flex: { flex: 1 },
  sender: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  time: { fontSize: 12, color: '#666', marginTop: 4 },
  badge: { backgroundColor: '#6200ee' },
  fab: { position: 'absolute', right: 16, bottom: 16 },
  empty: { padding: 32, alignItems: 'center' },
});
