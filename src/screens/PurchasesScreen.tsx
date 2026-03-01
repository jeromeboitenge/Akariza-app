import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, FAB, Chip, ActivityIndicator, Searchbar, Avatar, Surface, Text } from 'react-native-paper';
import { purchasesApi } from '../api';
import { Purchase } from '../types';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { safeFormatDate } from '../utils/formatters';
import { LinearGradient } from 'expo-linear-gradient';

export default function PurchasesScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { purchases, setPurchases } = useDataStore();
  const user = useAuthStore((state) => state.user);
  const canCreate = user?.role === 'BOSS' || user?.role === 'MANAGER';

  const loadPurchases = async () => {
    try {
      const data = await purchasesApi.getAll();
      setPurchases(data);
    } catch (error) {
      console.error('Load purchases error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const filteredPurchases = purchases.filter((p) =>
    (p.purchaseNumber?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (p.supplier?.name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const totalPurchases = purchases.reduce((sum, p) => sum + p.finalAmount, 0);
  const pendingPayments = purchases.filter(p => p.paymentStatus !== 'PAID').reduce((sum, p) => sum + (p.finalAmount - p.amountPaid), 0);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID': return '#4CAF50';
      case 'PENDING': return '#FF9800';
      case 'PARTIAL': return '#7B88F5';
      default: return '#757575';
    }
  };

  const renderPurchase = ({ item }: { item: Purchase }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={styles.purchaseRow}>
              <Avatar.Icon size={40} icon="cart" style={styles.icon} />
              <View style={styles.purchaseInfo}>
                <Title style={styles.purchaseNumber}>{item.purchaseNumber}</Title>
                <Paragraph style={styles.date}>
                  {safeFormatDate(item.createdAt, 'MMM dd, yyyy')}
                </Paragraph>
              </View>
            </View>
            {item.supplier && (
              <View style={styles.supplierRow}>
                <Avatar.Icon size={24} icon="truck" style={styles.supplierIcon} />
                <Paragraph style={styles.supplier}>{item.supplier.name}</Paragraph>
              </View>
            )}
          </View>
          <View style={styles.cardRight}>
            <Title style={styles.amount}>${item.finalAmount.toFixed(2)}</Title>
            <Chip 
              style={[styles.statusChip, { backgroundColor: `${getStatusColor(item.paymentStatus)}15` }]}
              textStyle={[styles.statusText, { color: getStatusColor(item.paymentStatus) }]}
            >
              {item.paymentStatus}
            </Chip>
          </View>
        </View>

        {item.paymentStatus !== 'PAID' && (
          <View style={styles.paymentInfo}>
            <Paragraph style={styles.paymentLabel}>Paid: ${item.amountPaid.toFixed(2)}</Paragraph>
            <Paragraph style={styles.paymentBalance}>
              Balance: ${(item.finalAmount - item.amountPaid).toFixed(2)}
            </Paragraph>
          </View>
        )}

        <View style={styles.footer}>
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
      <LinearGradient colors={['#FF6F00', '#FF8F00']} style={styles.header}>
        <View style={styles.statsRow}>
          <Surface style={styles.statCard}>
            <Text style={styles.statValue}>${totalPurchases.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </Surface>
          <Surface style={styles.statCard}>
            <Text style={styles.statValue}>{purchases.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </Surface>
          <Surface style={styles.statCard}>
            <Text style={styles.statValue}>${pendingPayments.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Surface>
        </View>
      </LinearGradient>

      <Searchbar
        placeholder="Search by PO # or supplier..."
        onChangeText={setSearch}
        value={search}
        style={styles.search}
        iconColor="#FF6F00"
      />

      <FlatList
        data={filteredPurchases}
        renderItem={renderPurchase}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { setRefreshing(true); loadPurchases(); }}
            colors={['#FF6F00']}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={64} icon="cart-outline" style={styles.emptyIcon} />
            <Title style={styles.emptyTitle}>No purchases found</Title>
            <Paragraph style={styles.emptyText}>Purchase orders will appear here</Paragraph>
          </View>
        }
      />

      {canCreate && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('NewPurchase')}
          color="#FFFFFF"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingVertical: 20, paddingHorizontal: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { flex: 1, padding: 12, marginHorizontal: 4, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#FF6F00' },
  statLabel: { fontSize: 11, color: '#757575', marginTop: 4, textAlign: 'center' },
  search: { margin: 16, elevation: 2 },
  card: { marginHorizontal: 16, marginVertical: 6, elevation: 3, borderRadius: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end' },
  purchaseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { backgroundColor: '#FFF3E0', marginRight: 12 },
  purchaseInfo: { flex: 1 },
  purchaseNumber: { fontSize: 16, fontWeight: 'bold', color: '#FF6F00' },
  date: { fontSize: 12, color: '#757575', marginTop: 2 },
  supplierRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 52 },
  supplierIcon: { backgroundColor: '#F5F5F5', marginRight: 8 },
  supplier: { fontSize: 13, color: '#424242' },
  amount: { fontSize: 22, fontWeight: 'bold', color: '#FF6F00', marginBottom: 8 },
  statusChip: { paddingHorizontal: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  paymentInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  paymentLabel: { fontSize: 12, color: '#757575' },
  paymentBalance: { fontSize: 12, color: '#FF6F00', fontWeight: 'bold' },
  footer: { marginTop: 8 },
  itemCount: { fontSize: 12, color: '#757575' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#FF6F00' },
  empty: { alignItems: 'center', padding: 48 },
  emptyIcon: { backgroundColor: '#FFF3E0', marginBottom: 16 },
  emptyTitle: { fontSize: 18, color: '#424242', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#757575' },
});
