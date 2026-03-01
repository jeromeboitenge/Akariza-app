import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Chip, ActivityIndicator, Searchbar } from 'react-native-paper';
import { salesApi } from '../api';
import { Sale } from '../types';
import { useDataStore } from '../store/dataStore';
import { safeFormatDate } from '../utils/formatters';

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
    s.saleNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  const renderSale = ({ item }: { item: Sale }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('SaleDetail', { sale: item })}>
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Title>{item.saleNumber}</Title>
            <Paragraph>{safeFormatDate(item.createdAt, 'MMM dd, yyyy HH:mm')}</Paragraph>
            {item.customerName && <Paragraph>Customer: {item.customerName}</Paragraph>}
          </View>
          <View style={styles.right}>
            <Title style={styles.amount}>${item.finalAmount.toFixed(2)}</Title>
            <Chip style={styles.chip}>{item.paymentMethod}</Chip>
            <Chip style={[styles.chip, styles.statusChip]}>{item.paymentStatus}</Chip>
          </View>
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
      <Searchbar
        placeholder="Search sales..."
        onChangeText={setSearch}
        value={search}
        style={styles.search}
      />

      <FlatList
        data={filteredSales}
        renderItem={renderSale}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadSales(); }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Paragraph>No sales found</Paragraph>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  search: { margin: 16 },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  flex: { flex: 1 },
  right: { alignItems: 'flex-end' },
  amount: { color: '#4caf50', fontSize: 20 },
  chip: { marginTop: 4 },
  statusChip: { backgroundColor: '#e8f5e9' },
  empty: { padding: 32, alignItems: 'center' },
});
