import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Chip, FAB, Button, TextInput, Portal, Modal, Surface } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { productsApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { hasPermission } from '../utils/permissions';
import { colors } from '../theme/colors';

export default function InventoryManagementScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adjustmentModal, setAdjustmentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease' | 'set'>('increase');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const user = useAuthStore((state) => state.user);

  const canManageStock = hasPermission(user, 'MANAGE_STOCK');
  const canViewStock = hasPermission(user, 'VIEW_STOCK');

  useEffect(() => {
    if (canViewStock) {
      loadProducts();
    }
  }, [canViewStock]);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, statusFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => {
        const status = getStockStatus(product);
        return status.status === statusFilter;
      });
    }

    setFilteredProducts(filtered);
  };

  const getStockStatus = (product: any) => {
    if (product.currentStock === 0) {
      return { status: 'out-of-stock', label: 'Out of Stock', color: colors.error };
    }
    if (product.currentStock <= product.minStockLevel) {
      return { status: 'low-stock', label: 'Low Stock', color: colors.warning };
    }
    if (product.currentStock >= product.maxStockLevel) {
      return { status: 'overstocked', label: 'Overstocked', color: colors.info };
    }
    return { status: 'healthy', label: 'Healthy', color: colors.success };
  };

  const handleStockAdjustment = async () => {
    if (!selectedProduct || !adjustmentQuantity) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    try {
      const quantity = parseInt(adjustmentQuantity);
      let newStock = selectedProduct.currentStock;

      switch (adjustmentType) {
        case 'increase':
          newStock += quantity;
          break;
        case 'decrease':
          newStock = Math.max(0, newStock - quantity);
          break;
        case 'set':
          newStock = quantity;
          break;
      }

      await productsApi.adjustStock(selectedProduct.id, {
        newStock,
        adjustmentType,
        quantity,
        reason: adjustmentReason,
      });

      Alert.alert('Success', 'Stock adjusted successfully');
      setAdjustmentModal(false);
      resetAdjustmentForm();
      loadProducts();
    } catch (error) {
      console.error('Stock adjustment failed:', error);
      Alert.alert('Error', 'Failed to adjust stock');
    }
  };

  const resetAdjustmentForm = () => {
    setSelectedProduct(null);
    setAdjustmentQuantity('');
    setAdjustmentReason('');
    setAdjustmentType('increase');
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  if (!canViewStock) {
    return (
      <View style={styles.center}>
        <Title>Access Denied</Title>
        <Paragraph>You don't have permission to view inventory</Paragraph>
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

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.currentStock * product.costPrice), 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minStockLevel).length;
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.title}>Inventory Management</Title>
          <Paragraph style={styles.subtitle}>Monitor and manage stock levels</Paragraph>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title style={styles.summaryValue}>{totalProducts}</Title>
              <Paragraph style={styles.summaryLabel}>Total Products</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title style={styles.summaryValue}>{totalValue.toLocaleString()} RWF</Title>
              <Paragraph style={styles.summaryLabel}>Total Value</Paragraph>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, { borderLeftWidth: 4, borderLeftColor: colors.warning }]}>
            <Card.Content>
              <Title style={[styles.summaryValue, { color: colors.warning }]}>{lowStockCount}</Title>
              <Paragraph style={styles.summaryLabel}>Low Stock</Paragraph>
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, { borderLeftWidth: 4, borderLeftColor: colors.error }]}>
            <Card.Content>
              <Title style={[styles.summaryValue, { color: colors.error }]}>{outOfStockCount}</Title>
              <Paragraph style={styles.summaryLabel}>Out of Stock</Paragraph>
            </Card.Content>
          </Card>
        </View>

        {/* Filters */}
        <Card style={styles.filtersCard}>
          <Card.Content>
            <TextInput
              label="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              mode="outlined"
              style={styles.searchInput}
              left={<TextInput.Icon icon="magnify" />}
            />
            
            <View style={styles.filterRow}>
              <Paragraph style={styles.filterLabel}>Filter by status:</Paragraph>
              <View style={styles.filterChips}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'healthy', label: 'Healthy' },
                  { key: 'low-stock', label: 'Low Stock' },
                  { key: 'out-of-stock', label: 'Out of Stock' },
                  { key: 'overstocked', label: 'Overstocked' },
                ].map((filter) => (
                  <Chip
                    key={filter.key}
                    selected={statusFilter === filter.key}
                    onPress={() => setStatusFilter(filter.key)}
                    style={styles.filterChip}
                  >
                    {filter.label}
                  </Chip>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Product List */}
        <View style={styles.productList}>
          {filteredProducts.map((product) => {
            const status = getStockStatus(product);
            return (
              <Card key={product.id} style={styles.productCard}>
                <Card.Content>
                  <View style={styles.productHeader}>
                    <View style={styles.productInfo}>
                      <Title style={styles.productName}>{product.name}</Title>
                      <Paragraph style={styles.productSku}>{product.sku}</Paragraph>
                      <Paragraph style={styles.productCategory}>{product.category}</Paragraph>
                    </View>
                    <Chip style={[styles.statusChip, { backgroundColor: status.color + '20' }]}>
                      <Paragraph style={[styles.statusText, { color: status.color }]}>
                        {status.label}
                      </Paragraph>
                    </Chip>
                  </View>

                  <View style={styles.stockInfo}>
                    <View style={styles.stockItem}>
                      <Paragraph style={styles.stockLabel}>Current Stock</Paragraph>
                      <Title style={styles.stockValue}>{product.currentStock} {product.unit}</Title>
                    </View>
                    <View style={styles.stockItem}>
                      <Paragraph style={styles.stockLabel}>Min Level</Paragraph>
                      <Paragraph style={styles.stockValue}>{product.minStockLevel}</Paragraph>
                    </View>
                    <View style={styles.stockItem}>
                      <Paragraph style={styles.stockLabel}>Max Level</Paragraph>
                      <Paragraph style={styles.stockValue}>{product.maxStockLevel}</Paragraph>
                    </View>
                  </View>

                  <View style={styles.valueInfo}>
                    <Paragraph style={styles.valueLabel}>Stock Value:</Paragraph>
                    <Title style={styles.valueAmount}>
                      {(product.currentStock * product.costPrice).toLocaleString()} RWF
                    </Title>
                  </View>

                  {canManageStock && (
                    <Button
                      mode="outlined"
                      onPress={() => {
                        setSelectedProduct(product);
                        setAdjustmentModal(true);
                      }}
                      style={styles.adjustButton}
                    >
                      Adjust Stock
                    </Button>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </View>

        {filteredProducts.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title style={styles.emptyTitle}>No Products Found</Title>
              <Paragraph style={styles.emptyText}>
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No products available in inventory'
                }
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Stock Adjustment Modal */}
      <Portal>
        <Modal
          visible={adjustmentModal}
          onDismiss={() => setAdjustmentModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={styles.modalSurface}>
            <Title style={styles.modalTitle}>Adjust Stock</Title>
            {selectedProduct && (
              <Paragraph style={styles.modalSubtitle}>
                {selectedProduct.name} - Current: {selectedProduct.currentStock} {selectedProduct.unit}
              </Paragraph>
            )}

            <View style={styles.modalContent}>
              <View style={styles.pickerContainer}>
                <Paragraph style={styles.pickerLabel}>Adjustment Type</Paragraph>
                <Picker
                  selectedValue={adjustmentType}
                  onValueChange={(value: any) => setAdjustmentType(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Increase Stock" value="increase" />
                  <Picker.Item label="Decrease Stock" value="decrease" />
                  <Picker.Item label="Set Stock Level" value="set" />
                </Picker>
              </View>

              <TextInput
                label="Quantity"
                value={adjustmentQuantity}
                onChangeText={setAdjustmentQuantity}
                mode="outlined"
                keyboardType="numeric"
                style={styles.modalInput}
              />

              <TextInput
                label="Reason (Optional)"
                value={adjustmentReason}
                onChangeText={setAdjustmentReason}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.modalInput}
              />

              {adjustmentQuantity && selectedProduct && (
                <Card style={styles.previewCard}>
                  <Card.Content>
                    <Paragraph style={styles.previewLabel}>Preview:</Paragraph>
                    <Title style={styles.previewValue}>
                      {selectedProduct.currentStock} → {
                        adjustmentType === 'increase' 
                          ? selectedProduct.currentStock + parseInt(adjustmentQuantity || '0')
                          : adjustmentType === 'decrease'
                          ? Math.max(0, selectedProduct.currentStock - parseInt(adjustmentQuantity || '0'))
                          : parseInt(adjustmentQuantity || '0')
                      } {selectedProduct.unit}
                    </Title>
                  </Card.Content>
                </Card>
              )}
            </View>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => {
                  setAdjustmentModal(false);
                  resetAdjustmentForm();
                }}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleStockAdjustment}
                disabled={!adjustmentQuantity}
                style={styles.modalButton}
              >
                Adjust Stock
              </Button>
            </View>
          </Surface>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  
  summaryContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, gap: 8 },
  summaryCard: { flex: 1, elevation: 2, borderRadius: 12 },
  summaryValue: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  summaryLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  
  filtersCard: { marginHorizontal: 16, marginBottom: 16, elevation: 2, borderRadius: 12 },
  searchInput: { marginBottom: 16 },
  filterRow: { marginTop: 8 },
  filterLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { marginRight: 0 },
  
  productList: { paddingHorizontal: 16, paddingBottom: 80 },
  productCard: { marginBottom: 12, elevation: 2, borderRadius: 12 },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  productSku: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  productCategory: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statusChip: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '500' },
  
  stockInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingVertical: 8, backgroundColor: '#F8F9FA', borderRadius: 8 },
  stockItem: { flex: 1, alignItems: 'center' },
  stockLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
  stockValue: { fontSize: 14, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginTop: 2 },
  
  valueInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  valueLabel: { fontSize: 14, color: colors.textSecondary },
  valueAmount: { fontSize: 16, fontWeight: 'bold', color: colors.success },
  
  adjustButton: { marginTop: 8 },
  
  emptyCard: { marginHorizontal: 16, elevation: 2, borderRadius: 12 },
  emptyTitle: { textAlign: 'center', color: colors.textSecondary },
  emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 8 },
  
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  modalSurface: { backgroundColor: 'white', borderRadius: 16, padding: 20, elevation: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 4, marginBottom: 20 },
  modalContent: { marginVertical: 16 },
  pickerContainer: { marginBottom: 16 },
  pickerLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  picker: { backgroundColor: '#F8F9FA', borderRadius: 8 },
  modalInput: { marginBottom: 16 },
  previewCard: { marginTop: 8, backgroundColor: colors.primary + '10', borderRadius: 8 },
  previewLabel: { fontSize: 12, color: colors.textSecondary },
  previewValue: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginTop: 4 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 16 },
  modalButton: { flex: 1 },
});