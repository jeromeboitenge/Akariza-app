import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Chip, ActivityIndicator, Searchbar, Avatar, Surface, Text } from 'react-native-paper';
import { salesApi } from '../api';
import { Sale } from '../types';
import { useDataStore } from '../store/dataStore';
import { safeFormatDate } from '../utils/formatters';
import { LinearGradient } from 'expo-linear-gradient';

export default function SalesScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { sales, setSales } = useDataStore();

  const loadSales = async () => {
    try {
      const data = await salesApi.getAll();
      setSales(data);
    } catch (error) {
      console.error('Load sales error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const filteredSales = sales.filter((s) =>
    (s.saleNumber?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (s.customerName?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const todaySales = sales.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.createdAt).toDateString() === today;
  });

  const todayRevenue = todaySales.reduce((sum, s) => sum + s.finalAmount, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.finalAmount, 0);

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID': return '#4CAF50';
      case 'PENDING': return '#FF9800';
      case 'PARTIAL': return '#7B88F5';
      default: return '#757575';
    }
  };

  const renderSale = ({ item }: { item: Sale }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('SaleDetail', { sale: item })}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={styles.saleNumberRow}>
              <Avatar.Icon size={40} icon="receipt" style={styles.icon} />
              <View style={styles.saleInfo}>
                <Title style={styles.saleNumber}>{item.saleNumber}</Title>
                <Paragraph style={styles.date}>
                  {safeFormatDate(item.createdAt, 'MMM dd, yyyy • HH:mm')}
                </Paragraph>
              </View>
            </View>
            {item.customerName && (
              <View style={styles.customerRow}>
                <Avatar.Icon size={24} icon="account" style={styles.customerIcon} />
                <Paragraph style={styles.customer}>{item.customerName}</Paragraph>
              </View>
            )}
          </View>
          <View style={styles.cardRight}>
            <Title style={styles.amount}>${item.finalAmount.toFixed(2)}</Title>
            <Chip 
              icon="credit-card" 
              style={styles.paymentChip}
              textStyle={styles.chipText}
            >
              {item.paymentMethod}
            </Chip>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Chip 
            style={[styles.statusChip, { backgroundColor: `${getPaymentStatusColor(item.paymentStatus)}15` }]}
            textStyle={[styles.statusText, { color: getPaymentStatusColor(item.paymentStatus) }]}
          >
            {item.paymentStatus}
          </Chip>
          <Paragraph style={styles.itemCount}>
            {item.items?.length || 0} item{item.items?.length !== 1 ? 's' : ''}
          </Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C6BF2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#5C6BF2', '#4A5AD6']} style={styles.header}>
        <View style={styles.statsRow}>
          <Surface style={styles.statCard}>
            <Text style={styles.statValue}>${todayRevenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </Surface>
          <Surface style={styles.statCard}>
            <Text style={styles.statValue}>{todaySales.length}</Text>
            <Text style={styles.statLabel}>Sales</Text>
          </Surface>
          <Surface style={styles.statCard}>
            <Text style={styles.statValue}>${totalRevenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </Surface>
        </View>
      </LinearGradient>

      <Searchbar
        placeholder="Search by sale # or customer..."
        onChangeText={setSearch}
        value={search}
        style={styles.search}
        iconColor="#5C6BF2"
      />

      <FlatList
        data={filteredSales}
        renderItem={renderSale}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { setRefreshing(true); loadSales(); }}
            colors={['#5C6BF2']}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={64} icon="receipt-text-outline" style={styles.emptyIcon} />
            <Title style={styles.emptyTitle}>No sales found</Title>
            <Paragraph style={styles.emptyText}>Sales will appear here</Paragraph>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingVertical: 20, paddingHorizontal: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { flex: 1, padding: 12, marginHorizontal: 4, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#5C6BF2' },
  statLabel: { fontSize: 11, color: '#757575', marginTop: 4 },
  search: { margin: 16, elevation: 2 },
  card: { marginHorizontal: 16, marginVertical: 6, elevation: 3, borderRadius: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end' },
  saleNumberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { backgroundColor: '#E3F2FD', marginRight: 12 },
  saleInfo: { flex: 1 },
  saleNumber: { fontSize: 16, fontWeight: 'bold', color: '#5C6BF2' },
  date: { fontSize: 12, color: '#757575', marginTop: 2 },
  customerRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 52 },
  customerIcon: { backgroundColor: '#F5F5F5', marginRight: 8 },
  customer: { fontSize: 13, color: '#424242' },
  amount: { fontSize: 22, fontWeight: 'bold', color: '#4CAF50', marginBottom: 8 },
  paymentChip: { backgroundColor: '#E8F5E9' },
  chipText: { fontSize: 11, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  statusChip: { paddingHorizontal: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  itemCount: { fontSize: 12, color: '#757575' },
  empty: { alignItems: 'center', padding: 48 },
  emptyIcon: { backgroundColor: '#E3F2FD', marginBottom: 16 },
  emptyTitle: { fontSize: 18, color: '#424242', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#757575' },
});
