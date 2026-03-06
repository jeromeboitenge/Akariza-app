import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  FAB, 
  Chip, 
  Searchbar,
  Button,
  Portal,
  Dialog,
  Snackbar,
  Divider,
  ActivityIndicator
} from 'react-native-paper';
import { purchaseOrdersApi, suppliersApi, productsApi } from '../api';
import { PurchaseOrder } from '../api/otherApi';
import { Supplier, Product } from '../types';

export default function PurchaseOrdersScreen() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONVERTED'>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, selectedStatus, orders]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, suppliersData, productsData] = await Promise.all([
        purchaseOrdersApi.getAll(),
        suppliersApi.getAll(),
        productsApi.getAll()
      ]);
      setOrders(ordersData);
      setSuppliers(suppliersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showSnackbar('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterOrders = () => {
    let filtered = orders;

    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleApprove = async (id: string) => {
    try {
      await purchaseOrdersApi.approve(id);
      showSnackbar('Purchase order approved');
      loadData();
      setShowDetailsDialog(false);
    } catch (error) {
      console.error('Error approving order:', error);
      showSnackbar('Failed to approve purchase order');
    }
  };

  const handleReject = async (id: string) => {
    Alert.alert(
      'Reject Purchase Order',
      'Are you sure you want to reject this purchase order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await purchaseOrdersApi.reject(id);
              showSnackbar('Purchase order rejected');
              loadData();
              setShowDetailsDialog(false);
            } catch (error) {
              console.error('Error rejecting order:', error);
              showSnackbar('Failed to reject purchase order');
            }
          }
        }
      ]
    );
  };

  const handleConvert = async (id: string) => {
    Alert.alert(
      'Convert to Purchase',
      'This will create a purchase from this order. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Convert',
          onPress: async () => {
            try {
              await purchaseOrdersApi.convert(id);
              showSnackbar('Converted to purchase successfully');
              loadData();
              setShowDetailsDialog(false);
            } catch (error) {
              console.error('Error converting order:', error);
              showSnackbar('Failed to convert purchase order');
            }
          }
        }
      ]
    );
  };

  const showSnackbar = (message: string) => {
    setSnackbar({ visible: true, message });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#FF9800';
      case 'APPROVED': return '#4CAF50';
      case 'REJECTED': return '#F44336';
      case 'CONVERTED': return '#2196F3';
      default: return '#757575';
    }
  };

  const renderOrder = ({ item }: { item: PurchaseOrder }) => (
    <Card style={styles.card} onPress={() => {
      setSelectedOrder(item);
      setShowDetailsDialog(true);
    }}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.orderNumber}>{item.orderNumber}</Title>
          <Chip 
            mode="flat" 
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.statusText}
          >
            {item.status}
          </Chip>
        </View>
        
        <Paragraph style={styles.supplier}>
          Supplier: {item.supplier?.name || 'Unknown'}
        </Paragraph>
        
        <View style={styles.orderInfo}>
          <Paragraph style={styles.amount}>
            Total: ${item.totalAmount?.toFixed(2) || '0.00'}
          </Paragraph>
          <Paragraph style={styles.items}>
            {item.items?.length || 0} items
          </Paragraph>
        </View>

        {item.requestedByUser && (
          <Paragraph style={styles.requestedBy}>
            Requested by: {item.requestedByUser.fullName}
          </Paragraph>
        )}

        <Paragraph style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search orders..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.filters}>
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CONVERTED'] as const).map(status => (
          <Chip
            key={status}
            selected={selectedStatus === status}
            onPress={() => setSelectedStatus(status)}
            style={styles.filterChip}
          >
            {status}
          </Chip>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Paragraph>No purchase orders found</Paragraph>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => showSnackbar('Create purchase order feature coming soon')}
      />

      {/* Details Dialog */}
      <Portal>
        <Dialog visible={showDetailsDialog} onDismiss={() => setShowDetailsDialog(false)}>
          <Dialog.Title>{selectedOrder?.orderNumber}</Dialog.Title>
          <Dialog.ScrollArea>
            <View style={styles.dialogContent}>
              <Paragraph>Supplier: {selectedOrder?.supplier?.name}</Paragraph>
              <Paragraph>Status: {selectedOrder?.status}</Paragraph>
              <Paragraph>Total: ${selectedOrder?.totalAmount?.toFixed(2)}</Paragraph>
              
              <Divider style={styles.divider} />
              
              <Title style={styles.itemsTitle}>Items:</Title>
              {selectedOrder?.items?.map((item, index) => (
                <View key={index} style={styles.item}>
                  <Paragraph>{item.product?.name || 'Unknown Product'}</Paragraph>
                  <Paragraph>Qty: {item.quantity} × ${item.estimatedCost}</Paragraph>
                </View>
              ))}

              {selectedOrder?.notes && (
                <>
                  <Divider style={styles.divider} />
                  <Paragraph>Notes: {selectedOrder.notes}</Paragraph>
                </>
              )}
            </View>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            {selectedOrder?.status === 'PENDING' && (
              <>
                <Button onPress={() => handleReject(selectedOrder.id)}>Reject</Button>
                <Button onPress={() => handleApprove(selectedOrder.id)}>Approve</Button>
              </>
            )}
            {selectedOrder?.status === 'APPROVED' && (
              <Button onPress={() => handleConvert(selectedOrder.id)}>Convert to Purchase</Button>
            )}
            <Button onPress={() => setShowDetailsDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchbar: { margin: 16 },
  filters: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, flexWrap: 'wrap' },
  filterChip: { marginRight: 8, marginBottom: 8 },
  list: { padding: 16 },
  card: { marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderNumber: { fontSize: 18, fontWeight: 'bold' },
  statusChip: { },
  statusText: { color: '#fff', fontSize: 12 },
  supplier: { fontSize: 14, color: '#666', marginBottom: 8 },
  orderInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  amount: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
  items: { fontSize: 14, color: '#666' },
  requestedBy: { fontSize: 12, color: '#999', marginBottom: 4 },
  date: { fontSize: 12, color: '#999' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
  dialogContent: { padding: 16 },
  divider: { marginVertical: 16 },
  itemsTitle: { fontSize: 16, marginBottom: 8 },
  item: { marginBottom: 8, paddingLeft: 8 },
});
