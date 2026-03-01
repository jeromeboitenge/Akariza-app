import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, Searchbar, Chip, ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import { productsApi } from '../api';
import { Product } from '../types';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';

export default function ProductsScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { products, setProducts } = useDataStore();
  const user = useAuthStore((state) => state.user);
  const canManage = user?.role === 'BOSS' || user?.role === 'MANAGER';

  const loadProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Load products error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    (p.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (p.sku?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (p.category?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) return { label: 'Out of Stock', color: '#F44336', icon: 'alert-circle' };
    if (product.currentStock <= product.minStockLevel) return { label: 'Low Stock', color: '#FF9800', icon: 'alert' };
    if (product.currentStock >= product.maxStockLevel) return { label: 'Overstocked', color: '#7B88F5', icon: 'information' };
    return { label: 'In Stock', color: '#4CAF50', icon: 'check-circle' };
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const stockStatus = getStockStatus(item);
    const profitMargin = ((item.sellingPrice - item.costPrice) / item.costPrice * 100).toFixed(1);
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={48} icon="package-variant" style={[styles.avatar, { backgroundColor: stockStatus.color }]} />
              <View style={styles.headerContent}>
                <Title style={styles.productName}>{item.name}</Title>
                <Paragraph style={styles.sku}>SKU: {item.sku}</Paragraph>
              </View>
              <Chip icon={stockStatus.icon} style={[styles.statusChip, { backgroundColor: stockStatus.color }]} textStyle={styles.chipText}>
                {item.currentStock}
              </Chip>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Paragraph style={styles.infoLabel}>Category</Paragraph>
                <Chip style={styles.categoryChip}>{item.category}</Chip>
              </View>
              <View style={styles.infoItem}>
                <Paragraph style={styles.infoLabel}>Unit</Paragraph>
                <Paragraph style={styles.infoValue}>{item.unit}</Paragraph>
              </View>
            </View>

            <View style={styles.priceRow}>
              <View style={styles.priceItem}>
                <Paragraph style={styles.priceLabel}>Selling Price</Paragraph>
                <Title style={styles.sellingPrice}>${item.sellingPrice.toFixed(2)}</Title>
              </View>
              <View style={styles.priceItem}>
                <Paragraph style={styles.priceLabel}>Profit Margin</Paragraph>
                <Title style={styles.profitMargin}>+{profitMargin}%</Title>
              </View>
            </View>

            <Chip icon={stockStatus.icon} style={[styles.stockStatusChip, { backgroundColor: `${stockStatus.color}20` }]} textStyle={{ color: stockStatus.color }}>
              {stockStatus.label}
            </Chip>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C6BF2" />
        <Paragraph style={styles.loadingText}>Loading products...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search products by name, SKU, or category..."
          onChangeText={setSearch}
          value={search}
          style={styles.search}
          iconColor="#5C6BF2"
        />
        <View style={styles.statsRow}>
          <Chip icon="package-variant" style={styles.statChip}>
            {filteredProducts.length} Products
          </Chip>
          <Chip icon="alert" style={styles.statChip}>
            {filteredProducts.filter(p => p.currentStock <= p.minStockLevel).length} Low Stock
          </Chip>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { setRefreshing(true); loadProducts(); }}
            colors={['#5C6BF2']}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={80} icon="package-variant-closed" style={styles.emptyIcon} />
            <Title style={styles.emptyTitle}>No products found</Title>
            <Paragraph style={styles.emptyText}>
              {search ? 'Try adjusting your search' : 'Add your first product to get started'}
            </Paragraph>
          </View>
        }
        contentContainerStyle={filteredProducts.length === 0 ? styles.emptyContainer : undefined}
      />

      {canManage && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('NewProduct')}
          color="#FFFFFF"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: '#757575' },
  header: { backgroundColor: '#FFFFFF', paddingBottom: 8, elevation: 2 },
  search: { margin: 16, marginBottom: 8, elevation: 0, backgroundColor: '#F5F7FA' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8 },
  statChip: { marginRight: 8, backgroundColor: '#E3F2FD' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 4, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { marginRight: 12 },
  headerContent: { flex: 1 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 2 },
  sku: { fontSize: 13, color: '#757575' },
  statusChip: { paddingHorizontal: 8 },
  chipText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  divider: { marginVertical: 12 },
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  infoItem: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#757575', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#212121' },
  categoryChip: { alignSelf: 'flex-start', backgroundColor: '#E3F2FD' },
  priceRow: { flexDirection: 'row', marginBottom: 12 },
  priceItem: { flex: 1 },
  priceLabel: { fontSize: 12, color: '#757575', marginBottom: 4 },
  sellingPrice: { fontSize: 24, fontWeight: 'bold', color: '#5C6BF2' },
  profitMargin: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50' },
  stockStatusChip: { alignSelf: 'flex-start' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#5C6BF2' },
  empty: { alignItems: 'center', padding: 32 },
  emptyContainer: { flex: 1, justifyContent: 'center' },
  emptyIcon: { backgroundColor: '#E3F2FD', marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#757575', textAlign: 'center' },
});
