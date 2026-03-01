import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, FAB, ActivityIndicator, Chip } from 'react-native-paper';
import { purchasesApi } from '../api';
import { Purchase } from '../types';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { safeFormatDate } from '../utils/formatters';

export default function PurchasesScreen({ navigation }: any) {
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

  const renderPurchase = ({ item }: { item: Purchase }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Title>{item.purchaseNumber}</Title>
            <Paragraph>{safeFormatDate(item.createdAt, 'MMM dd, yyyy')}</Paragraph>
            <Paragraph>Supplier: {item.supplier?.name || 'N/A'}</Paragraph>
          </View>
          <View style={styles.right}>
            <Title style={styles.amount}>${item.finalAmount.toFixed(2)}</Title>
            <Chip style={getStatusStyle(item.paymentStatus)}>{item.paymentStatus}</Chip>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID': return { backgroundColor: '#c8e6c9' };
      case 'PARTIAL': return { backgroundColor: '#fff9c4' };
      default: return { backgroundColor: '#ffcdd2' };
    }
  };

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
        data={purchases}
        renderItem={renderPurchase}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadPurchases(); }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Paragraph>No purchases found</Paragraph>
          </View>
        }
      />

      {canCreate && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('NewPurchase')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  flex: { flex: 1 },
  right: { alignItems: 'flex-end' },
  amount: { color: '#f44336', fontSize: 20 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
  empty: { padding: 32, alignItems: 'center' },
});
