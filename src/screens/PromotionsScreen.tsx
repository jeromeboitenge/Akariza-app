import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, Chip, ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import { promotionsApi } from '../api';
import { Promotion } from '../types';
import { safeFormatDate } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';

export default function PromotionsScreen({ navigation }: any) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const canManage = user?.role === 'BOSS' || user?.role === 'MANAGER';

  const loadPromotions = async () => {
    try {
      const data = await promotionsApi.getAll();
      setPromotions(data);
    } catch (error) {
      console.error('Load promotions error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const isActive = (promo: Promotion) => {
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);
    return now >= start && now <= end && promo.isActive;
  };

  const renderPromotion = ({ item }: { item: Promotion }) => {
    const active = isActive(item);
    
    return (
      <TouchableOpacity>
        <Card style={[styles.card, active && styles.activeCard]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon 
                size={56} 
                icon="tag-multiple" 
                style={[styles.avatar, { backgroundColor: active ? '#4CAF50' : '#757575' }]} 
              />
              <View style={styles.headerContent}>
                <Title style={styles.promoName}>{item.name}</Title>
                <Paragraph style={styles.description} numberOfLines={2}>{item.description}</Paragraph>
                <Chip 
                  icon={active ? 'check-circle' : 'clock-outline'} 
                  style={[styles.statusChip, { backgroundColor: active ? '#E8F5E9' : '#EEEEEE' }]} 
                  textStyle={{ color: active ? '#4CAF50' : '#757575', fontWeight: 'bold' }}
                >
                  {active ? 'ACTIVE' : 'INACTIVE'}
                </Chip>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Paragraph style={styles.detailLabel}>Discount:</Paragraph>
                <Title style={styles.discountValue}>
                  {item.discountType === 'PERCENTAGE' 
                    ? `${item.discountValue}%` 
                    : `$${item.discountValue.toFixed(2)}`}
                </Title>
              </View>

              <View style={styles.dateContainer}>
                <View style={styles.dateRow}>
                  <Avatar.Icon size={20} icon="calendar-start" style={styles.dateIcon} />
                  <Paragraph style={styles.dateText}>
                    Start: {safeFormatDate(item.startDate, 'MMM dd, yyyy')}
                  </Paragraph>
                </View>
                <View style={styles.dateRow}>
                  <Avatar.Icon size={20} icon="calendar-end" style={styles.dateIcon} />
                  <Paragraph style={styles.dateText}>
                    End: {safeFormatDate(item.endDate, 'MMM dd, yyyy')}
                  </Paragraph>
                </View>
              </View>

              {item.minPurchaseAmount && (
                <Chip icon="cash" style={styles.minPurchaseChip}>
                  Min Purchase: ${item.minPurchaseAmount.toFixed(2)}
                </Chip>
              )}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const activePromotions = promotions.filter(isActive).length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Chip icon="tag-multiple" style={styles.statChip}>
          {activePromotions} Active Promotions
        </Chip>
      </View>

      <FlatList
        data={promotions}
        renderItem={renderPromotion}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadPromotions(); }} colors={['#1976D2']} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={80} icon="tag-multiple" style={styles.emptyIcon} />
            <Title>No promotions found</Title>
          </View>
        }
      />

      {canManage && (
        <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('NewPromotion')} color="#FFFFFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FFFFFF', padding: 16, elevation: 2 },
  statChip: { backgroundColor: '#E8F5E9', alignSelf: 'flex-start' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 4, borderRadius: 16 },
  activeCard: { borderLeftWidth: 4, borderLeftColor: '#4CAF50' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  avatar: { marginRight: 12 },
  headerContent: { flex: 1 },
  promoName: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 6 },
  description: { fontSize: 14, color: '#757575', marginBottom: 8 },
  statusChip: { alignSelf: 'flex-start' },
  divider: { marginVertical: 12 },
  detailsContainer: { backgroundColor: '#F5F7FA', padding: 12, borderRadius: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  detailLabel: { fontSize: 14, color: '#757575' },
  discountValue: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50' },
  dateContainer: { marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dateIcon: { backgroundColor: '#1976D2', width: 20, height: 20, marginRight: 8 },
  dateText: { fontSize: 13, color: '#212121' },
  minPurchaseChip: { backgroundColor: '#FFF3E0', alignSelf: 'flex-start' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#1976D2' },
  empty: { alignItems: 'center', padding: 32 },
  emptyIcon: { backgroundColor: '#E3F2FD', marginBottom: 16 },
});
