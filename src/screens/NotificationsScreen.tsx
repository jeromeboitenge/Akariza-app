import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Card, Text, ActivityIndicator, Chip, Button, TextInput, Portal, Modal, Surface, IconButton } from 'react-native-paper';
import { notificationsApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { hasPermission } from '../utils/permissions';
import { colors } from '../theme/colors';

export default function NotificationsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [detailModal, setDetailModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useAuthStore((state) => state.user);

  const canViewNotifications = hasPermission(user, 'VIEW_NOTIFICATIONS');

  useEffect(() => {
    if (canViewNotifications) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [canViewNotifications]);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchQuery, typeFilter, readFilter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsApi.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter);
    }

    // Read status filter
    if (readFilter !== 'all') {
      filtered = filtered.filter(notification => 
        readFilter === 'unread' ? !notification.read : notification.read
      );
    }

    setFilteredNotifications(filtered);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LOW_STOCK': return 'alert-circle-outline';
      case 'EXPIRING_PRODUCT': return 'clock-alert-outline';
      case 'NEW_ORDER': return 'cart-outline';
      case 'SYSTEM': return 'cog-outline';
      case 'PAYMENT': return 'credit-card-outline';
      case 'USER': return 'account-outline';
      default: return 'bell-outline';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'LOW_STOCK': return colors.warning;
      case 'EXPIRING_PRODUCT': return colors.error;
      case 'NEW_ORDER': return colors.success;
      case 'SYSTEM': return colors.info;
      case 'PAYMENT': return colors.primary;
      case 'USER': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  const getPriorityColor = (type: string) => {
    switch (type) {
      case 'LOW_STOCK': return colors.warning;
      case 'EXPIRING_PRODUCT': return colors.error;
      case 'NEW_ORDER': return colors.success;
      default: return colors.info;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      Alert.alert('Success', 'All notifications marked as read');
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationsApi.delete(notificationId);
              loadNotifications();
              loadUnreadCount();
            } catch (error) {
              console.error('Failed to delete notification:', error);
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const openNotificationDetail = (notification: any) => {
    setSelectedNotification(notification);
    setDetailModal(true);
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
    loadUnreadCount();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  if (!canViewNotifications) {
    return (
      <View style={styles.center}>
        <Text variant="headlineSmall">Access Denied</Text>
        <Text variant="bodyMedium">You don't have permission to view notifications</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const notificationTypes = [...new Set(notifications.map(n => n.type))];

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text variant="headlineMedium" style={styles.title}>Notifications</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Stay updated with important alerts
            </Text>
          </View>
          {unreadCount > 0 && (
            <Button mode="outlined" onPress={handleMarkAllAsRead} style={styles.markAllButton}>
              Mark All Read
            </Button>
          )}
        </View>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text variant="headlineSmall" style={styles.summaryValue}>{notifications.length}</Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>Total</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="headlineSmall" style={[styles.summaryValue, { color: colors.warning }]}>
                  {unreadCount}
                </Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>Unread</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="headlineSmall" style={[styles.summaryValue, { color: colors.success }]}>
                  {notifications.filter(n => n.read).length}
                </Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>Read</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Filters */}
        <Card style={styles.filtersCard}>
          <Card.Content>
            <TextInput
              label="Search notifications..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              mode="outlined"
              style={styles.searchInput}
              left={<TextInput.Icon icon="magnify" />}
            />
            
            <View style={styles.filterRow}>
              <Text variant="bodyMedium" style={styles.filterLabel}>Filter by type:</Text>
              <View style={styles.filterChips}>
                <Chip
                  selected={typeFilter === 'all'}
                  onPress={() => setTypeFilter('all')}
                  style={styles.filterChip}
                >
                  All
                </Chip>
                {notificationTypes.map((type) => (
                  <Chip
                    key={type}
                    selected={typeFilter === type}
                    onPress={() => setTypeFilter(type)}
                    style={styles.filterChip}
                  >
                    {type.replace('_', ' ')}
                  </Chip>
                ))}
              </View>
            </View>

            <View style={styles.filterRow}>
              <Text variant="bodyMedium" style={styles.filterLabel}>Filter by status:</Text>
              <View style={styles.filterChips}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'read', label: 'Read' },
                ].map((filter) => (
                  <Chip
                    key={filter.key}
                    selected={readFilter === filter.key}
                    onPress={() => setReadFilter(filter.key)}
                    style={styles.filterChip}
                  >
                    {filter.label}
                  </Chip>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Notifications List */}
        <View style={styles.notificationsList}>
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard
              ]}
            >
              <Card.Content>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationIcon}>
                    <IconButton
                      icon={getNotificationIcon(notification.type)}
                      iconColor={getNotificationColor(notification.type)}
                      size={24}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationTitleRow}>
                      <Text variant="titleMedium" style={styles.notificationTitle}>
                        {notification.title}
                      </Text>
                      {!notification.read && (
                        <View style={styles.unreadDot} />
                      )}
                    </View>
                    <Text variant="bodyMedium" style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <View style={styles.notificationMeta}>
                      <Chip 
                        style={[styles.typeChip, { backgroundColor: getNotificationColor(notification.type) + '20' }]}
                      >
                        <Text style={[styles.typeText, { color: getNotificationColor(notification.type) }]}>
                          {notification.type.replace('_', ' ')}
                        </Text>
                      </Chip>
                      <Text variant="bodySmall" style={styles.timeText}>
                        {formatTimeAgo(notification.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.notificationActions}>
                    <IconButton
                      icon="eye"
                      size={20}
                      onPress={() => openNotificationDetail(notification)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      iconColor={colors.error}
                      onPress={() => handleDeleteNotification(notification.id)}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {filteredNotifications.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.emptyTitle}>No Notifications Found</Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {searchQuery || typeFilter !== 'all' || readFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'You have no notifications at the moment'
                }
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Notification Detail Modal */}
      <Portal>
        <Modal
          visible={detailModal}
          onDismiss={() => setDetailModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={styles.modalSurface}>
            {selectedNotification && (
              <>
                <View style={styles.modalHeader}>
                  <IconButton
                    icon={getNotificationIcon(selectedNotification.type)}
                    iconColor={getNotificationColor(selectedNotification.type)}
                    size={32}
                  />
                  <Text variant="headlineSmall" style={styles.modalTitle}>
                    {selectedNotification.title}
                  </Text>
                </View>

                <ScrollView style={styles.modalContent}>
                  <Text variant="bodyLarge" style={styles.modalMessage}>
                    {selectedNotification.message}
                  </Text>

                  <View style={styles.modalMeta}>
                    <View style={styles.metaRow}>
                      <Text variant="bodySmall" style={styles.metaLabel}>Type:</Text>
                      <Chip 
                        style={[styles.typeChip, { backgroundColor: getNotificationColor(selectedNotification.type) + '20' }]}
                      >
                        <Text style={[styles.typeText, { color: getNotificationColor(selectedNotification.type) }]}>
                          {selectedNotification.type.replace('_', ' ')}
                        </Text>
                      </Chip>
                    </View>
                    <View style={styles.metaRow}>
                      <Text variant="bodySmall" style={styles.metaLabel}>Received:</Text>
                      <Text variant="bodyMedium">
                        {new Date(selectedNotification.createdAt).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text variant="bodySmall" style={styles.metaLabel}>Status:</Text>
                      <Chip style={selectedNotification.read ? styles.readChip : styles.unreadChip}>
                        <Text style={selectedNotification.read ? styles.readText : styles.unreadText}>
                          {selectedNotification.read ? 'Read' : 'Unread'}
                        </Text>
                      </Chip>
                    </View>
                  </View>

                  {selectedNotification.data && Object.keys(selectedNotification.data).length > 0 && (
                    <View style={styles.dataSection}>
                      <Text variant="titleMedium" style={styles.sectionTitle}>Additional Information:</Text>
                      {Object.entries(selectedNotification.data).map(([key, value]) => (
                        <View key={key} style={styles.dataRow}>
                          <Text variant="bodySmall" style={styles.dataLabel}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </Text>
                          <Text variant="bodyMedium" style={styles.dataValue}>
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>

                <View style={styles.modalActions}>
                  <Button
                    mode="outlined"
                    onPress={() => setDetailModal(false)}
                    style={styles.modalButton}
                  >
                    Close
                  </Button>
                  {!selectedNotification.read && (
                    <Button
                      mode="contained"
                      onPress={() => {
                        handleMarkAsRead(selectedNotification.id);
                        setDetailModal(false);
                      }}
                      style={styles.modalButton}
                    >
                      Mark as Read
                    </Button>
                  )}
                </View>
              </>
            )}
          </Surface>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerContent: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  markAllButton: { marginTop: 8 },
  
  summaryCard: { marginHorizontal: 16, marginBottom: 16, elevation: 2, borderRadius: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  summaryLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  
  filtersCard: { marginHorizontal: 16, marginBottom: 16, elevation: 2, borderRadius: 12 },
  searchInput: { marginBottom: 16 },
  filterRow: { marginTop: 8 },
  filterLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { marginRight: 0 },
  
  notificationsList: { paddingHorizontal: 16, paddingBottom: 80 },
  notificationCard: { marginBottom: 12, elevation: 2, borderRadius: 12 },
  unreadCard: { borderLeftWidth: 4, borderLeftColor: colors.primary },
  notificationHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  notificationIcon: { marginRight: 8 },
  notificationContent: { flex: 1 },
  notificationTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  notificationTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary, flex: 1 },
  unreadDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: colors.primary, 
    marginLeft: 8 
  },
  notificationMessage: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  notificationMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeChip: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  typeText: { fontSize: 10, fontWeight: '500' },
  timeText: { fontSize: 12, color: colors.textSecondary },
  notificationActions: { flexDirection: 'row' },
  
  emptyCard: { marginHorizontal: 16, elevation: 2, borderRadius: 12 },
  emptyTitle: { textAlign: 'center', color: colors.textSecondary },
  emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 8 },
  
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  modalSurface: { backgroundColor: 'white', borderRadius: 16, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary, flex: 1, marginLeft: 8 },
  modalContent: { maxHeight: 400 },
  modalMessage: { fontSize: 16, color: colors.text, marginBottom: 16, lineHeight: 24 },
  modalMeta: { marginBottom: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  metaLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  readChip: { backgroundColor: colors.success + '20' },
  unreadChip: { backgroundColor: colors.warning + '20' },
  readText: { fontSize: 12, color: colors.success },
  unreadText: { fontSize: 12, color: colors.warning },
  dataSection: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 8 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  dataLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500', flex: 1 },
  dataValue: { fontSize: 12, color: colors.text, flex: 2, textAlign: 'right' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 16 },
  modalButton: { flex: 1 },
});