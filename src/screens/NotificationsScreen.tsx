import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, ActivityIndicator, Avatar, Badge } from 'react-native-paper';
import { notificationsApi } from '../api';
import { Notification } from '../types';
import { safeFormatDate } from '../utils/formatters';

export default function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Load notifications error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: any = {
      'LOW_STOCK': 'alert',
      'SALE': 'cart',
      'PURCHASE': 'package-variant',
      'TASK': 'clipboard-text',
      'SYSTEM': 'information',
    };
    return icons[type] || 'bell';
  };

  const getTypeColor = (type: string) => {
    const colors: any = {
      'LOW_STOCK': '#F44336',
      'SALE': '#4CAF50',
      'PURCHASE': '#7B88F5',
      'TASK': '#FF9800',
      'SYSTEM': '#5C6BF2',
    };
    return colors[type] || '#5C6BF2';
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => markAsRead(item.id)}>
      <Card style={[styles.card, !item.read && styles.unreadCard]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Avatar.Icon 
              size={48} 
              icon={getTypeIcon(item.type)} 
              style={[styles.avatar, { backgroundColor: getTypeColor(item.type) }]} 
            />
            <View style={styles.headerContent}>
              <View style={styles.titleRow}>
                <Title style={styles.title}>{item.title}</Title>
                {!item.read && <Badge style={styles.badge} />}
              </View>
              <Paragraph style={styles.message}>{item.message}</Paragraph>
              <Paragraph style={styles.time}>
                {safeFormatDate(item.createdAt, 'MMM dd, yyyy HH:mm')}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C6BF2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Paragraph style={styles.unreadText}>
            You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </Paragraph>
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadNotifications(); }} colors={['#5C6BF2']} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={80} icon="bell-outline" style={styles.emptyIcon} />
            <Title>No notifications</Title>
            <Paragraph style={styles.emptyText}>You're all caught up!</Paragraph>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  unreadBanner: { backgroundColor: '#5C6BF2', padding: 12, alignItems: 'center' },
  unreadText: { color: '#FFFFFF', fontWeight: 'bold' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 2, borderRadius: 16 },
  unreadCard: { elevation: 4, borderLeftWidth: 4, borderLeftColor: '#5C6BF2' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { marginRight: 12 },
  headerContent: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#212121', flex: 1 },
  badge: { backgroundColor: '#F44336', marginLeft: 8 },
  message: { fontSize: 14, color: '#424242', marginBottom: 8 },
  time: { fontSize: 12, color: '#757575' },
  empty: { alignItems: 'center', padding: 48 },
  emptyIcon: { backgroundColor: '#E3F2FD', marginBottom: 16 },
  emptyText: { color: '#757575', marginTop: 8 },
});
