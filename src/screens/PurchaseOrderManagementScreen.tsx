import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Card, Text, ActivityIndicator, Chip, FAB, Button, TextInput, Portal, Modal, Surface } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { purchaseOrdersApi, suppliersApi, productsApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { hasPermission } from '../utils/permissions';
import { colors } from '../theme/colors';

export default function PurchaseOrderManagementScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [poForm, setPOForm] = useState({
    supplierId: '',
    expectedDate: '',
    notes: '',
    items: [] as any[],
  });
  const user = useAuthStore((state) => state.user);

  const canViewPO = hasPermission(user, 'VIEW_PURCHASE_ORDERS');
  const canCreatePO = hasPermission(user, 'CREATE_PURCHASE_ORDERS');
  const canEditPO = hasPermission(user, 'EDIT_PURCHASE_ORDERS');
  const canApprovePO = hasPermission(user, 'APPROVE_PURCHASE_ORDERS');

  useEffect(() => {
    if (canViewPO) {
      loadData();
    }
  }, [canViewPO]);

  useEffect(() => {
    filterOrders();
  }, [purchaseOrders, searchQuery, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [poData, supplierData, productData] = await Promise.all([
        purchaseOrdersApi.getAll(),
        suppliersApi.getAll(),
        productsApi.getAll(),
      ]);
      
      setPurchaseOrders(poData);
      setSuppliers(supplierData);
      setProducts(productData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterOrders = () => {
    let filtered = purchaseOrders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(po =>
        po.poNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(po => po.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return colors.warning;
      case 'APPROVED': return colors.info;
      case 'ORDERED': return colors.primary;
      case 'RECEIVED': return colors.success;
      case 'COMPLETED': return colors.success;
      case 'CANCELLED': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return 'clock-outline';
      case 'APPROVED': return 'check-circle-outline';
      case 'ORDERED': return 'cart-outline';
      case 'RECEIVED': return 'package-variant';
      case 'COMPLETED': return 'check-all';
      case 'CANCELLED': return 'close-circle-outline';
      default: return 'alert-circle-outline';
    }
  };

  const addItemToPO = () => {
    setPOForm({
      ...poForm,
      items: [...poForm.items, { productId: '', quantity: '', unitPrice: '' }]
    });
  };

  const removeItemFromPO = (index: number) => {
    setPOForm({
      ...poForm,
      items: poForm.items.filter((_, i) => i !== index)
    });
  };

  const updatePOItem = (index: number, field: string, value: string) => {
    const updatedItems = [...poForm.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setPOForm({ ...poForm, items: updatedItems });
  };

  const calculateTotal = () => {
    return poForm.items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + (quantity * price);
    }, 0);
  };

  const handleCreatePO = async () => {
    if (!poForm.supplierId || poForm.items.length === 0) {
      Alert.alert('Error', 'Please select a supplier and add at least one item');
      return;
    }

    try {
      const poData = {
        ...poForm,
        items: poForm.items.map(item => ({
          productId: item.productId,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })),
      };

      await purchaseOrdersApi.create(poData);
      Alert.alert('Success', 'Purchase order created successfully');
      setCreateModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Create PO failed:', error);
      Alert.alert('Error', 'Failed to create purchase order');
    }
  };

  const handleUpdateStatus = async (poId: string, newStatus: string) => {
    try {
      await purchaseOrdersApi.updateStatus(poId, newStatus);
      Alert.alert('Success', 'Status updated successfully');
      loadData();
    } catch (error) {
      console.error('Update status failed:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const resetForm = () => {
    setPOForm({
      supplierId: '',
      expectedDate: '',
      notes: '',
      items: [],
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (!canViewPO) {
    return (
      <View style={styles.center}>
        <Text variant="headlineSmall">Access Denied</Text>
        <Text variant="bodyMedium">You don't have permission to view purchase orders</Text>
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

  const totalPOs = purchaseOrders.length;
  const pendingPOs = purchaseOrders.filter(po => po.status === 'PENDING').length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + (po.totalAmount || 0), 0);
  const overdueCount = purchaseOrders.filter(po => {
    if (!po.expectedDate) return false;
    return new Date(po.expectedDate) < new Date() && !['COMPLETED', 'CANCELLED'].includes(po.status);
  }).length;

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Purchase Orders</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Manage supplier orders and deliveries</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.summaryValue}>{totalPOs}</Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>Total Orders</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, { borderLeftWidth: 4, borderLeftColor: colors.warning }]}>
            <Card.Content>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: colors.warning }]}>
                {pendingPOs}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>Pending</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.summaryValue}>
                {totalValue.toLocaleString()} RWF
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>Total Value</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, { borderLeftWidth: 4, borderLeftColor: colors.error }]}>
            <Card.Content>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: colors.error }]}>
                {overdueCount}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>Overdue</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Filters */}
        <Card style={styles.filtersCard}>
          <Card.Content>
            <TextInput
              label="Search orders..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              mode="outlined"
              style={styles.searchInput}
              left={<TextInput.Icon icon="magnify" />}
            />
            
            <View style={styles.filterRow}>
              <Text variant="bodyMedium" style={styles.filterLabel}>Filter by status:</Text>
              <View style={styles.filterChips}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'PENDING', label: 'Pending' },
                  { key: 'APPROVED', label: 'Approved' },
                  { key: 'ORDERED', label: 'Ordered' },
                  { key: 'RECEIVED', label: 'Received' },
                  { key: 'COMPLETED', label: 'Completed' },
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

        {/* Purchase Orders List */}
        <View style={styles.ordersList}>
          {filteredOrders.map((po) => (
            <Card key={po.id} style={styles.orderCard}>
              <Card.Content>
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <Text variant="titleMedium" style={styles.orderNumber}>{po.poNumber}</Text>
                    <Text variant="bodySmall" style={styles.supplierName}>
                      {po.supplier?.name || 'Unknown Supplier'}
                    </Text>
                    <Text variant="bodySmall" style={styles.orderDate}>
                      Created: {new Date(po.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Chip 
                    icon={getStatusIcon(po.status)}
                    style={[styles.statusChip, { backgroundColor: getStatusColor(po.status) + '20' }]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(po.status) }]}>
                      {po.status}
                    </Text>
                  </Chip>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.detailItem}>
                    <Text variant="bodySmall" style={styles.detailLabel}>Total Amount</Text>
                    <Text variant="titleSmall" style={styles.detailValue}>
                      {(po.totalAmount || 0).toLocaleString()} RWF
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text variant="bodySmall" style={styles.detailLabel}>Expected Date</Text>
                    <Text variant="titleSmall" style={styles.detailValue}>
                      {po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : 'Not set'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text variant="bodySmall" style={styles.detailLabel}>Items</Text>
                    <Text variant="titleSmall" style={styles.detailValue}>
                      {po.items?.length || 0} items
                    </Text>
                  </View>
                </View>

                <View style={styles.orderActions}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setSelectedPO(po);
                      setViewModal(true);
                    }}
                    style={styles.actionButton}
                  >
                    View Details
                  </Button>
                  
                  {po.status === 'PENDING' && canApprovePO && (
                    <Button
                      mode="contained"
                      onPress={() => handleUpdateStatus(po.id, 'APPROVED')}
                      style={styles.actionButton}
                    >
                      Approve
                    </Button>
                  )}
                  
                  {po.status === 'APPROVED' && canEditPO && (
                    <Button
                      mode="contained"
                      onPress={() => handleUpdateStatus(po.id, 'ORDERED')}
                      style={styles.actionButton}
                    >
                      Send Order
                    </Button>
                  )}
                  
                  {po.status === 'ORDERED' && canEditPO && (
                    <Button
                      mode="contained"
                      onPress={() => handleUpdateStatus(po.id, 'RECEIVED')}
                      style={styles.actionButton}
                    >
                      Mark Received
                    </Button>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {filteredOrders.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.emptyTitle}>No Purchase Orders Found</Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No purchase orders available'
                }
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canCreatePO && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setCreateModal(true)}
        />
      )}

      {/* Create Purchase Order Modal */}
      <Portal>
        <Modal
          visible={createModal}
          onDismiss={() => setCreateModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={styles.modalSurface}>
            <Text variant="headlineSmall" style={styles.modalTitle}>Create Purchase Order</Text>

            <ScrollView style={styles.modalContent}>
              <View style={styles.pickerContainer}>
                <Text variant="bodyMedium" style={styles.pickerLabel}>Supplier *</Text>
                <Picker
                  selectedValue={poForm.supplierId}
                  onValueChange={(value: any) => setPOForm({...poForm, supplierId: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="Select supplier..." value="" />
                  {suppliers.map(supplier => (
                    <Picker.Item 
                      key={supplier.id} 
                      label={`${supplier.name} - ${supplier.contactPerson}`} 
                      value={supplier.id} 
                    />
                  ))}
                </Picker>
              </View>

              <TextInput
                label="Expected Delivery Date"
                value={poForm.expectedDate}
                onChangeText={(text) => setPOForm({...poForm, expectedDate: text})}
                mode="outlined"
                placeholder="YYYY-MM-DD"
                style={styles.modalInput}
              />

              <TextInput
                label="Notes"
                value={poForm.notes}
                onChangeText={(text) => setPOForm({...poForm, notes: text})}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.modalInput}
              />

              <View style={styles.itemsSection}>
                <View style={styles.itemsHeader}>
                  <Text variant="titleMedium" style={styles.itemsTitle}>Items *</Text>
                  <Button mode="outlined" onPress={addItemToPO}>
                    Add Item
                  </Button>
                </View>

                {poForm.items.map((item, index) => (
                  <Card key={index} style={styles.itemCard}>
                    <Card.Content>
                      <View style={styles.pickerContainer}>
                        <Text variant="bodySmall" style={styles.pickerLabel}>Product</Text>
                        <Picker
                          selectedValue={item.productId}
                          onValueChange={(value: any) => updatePOItem(index, 'productId', value)}
                          style={styles.picker}
                        >
                          <Picker.Item label="Select product..." value="" />
                          {products.map(product => (
                            <Picker.Item 
                              key={product.id} 
                              label={`${product.name} - ${product.sku}`} 
                              value={product.id} 
                            />
                          ))}
                        </Picker>
                      </View>

                      <View style={styles.itemRow}>
                        <TextInput
                          label="Quantity"
                          value={item.quantity}
                          onChangeText={(text) => updatePOItem(index, 'quantity', text)}
                          mode="outlined"
                          keyboardType="numeric"
                          style={[styles.modalInput, { flex: 1, marginRight: 8 }]}
                        />
                        <TextInput
                          label="Unit Price"
                          value={item.unitPrice}
                          onChangeText={(text) => updatePOItem(index, 'unitPrice', text)}
                          mode="outlined"
                          keyboardType="numeric"
                          style={[styles.modalInput, { flex: 1, marginLeft: 8 }]}
                        />
                      </View>

                      <View style={styles.itemFooter}>
                        <Text variant="bodyMedium" style={styles.itemTotal}>
                          Total: {((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toLocaleString()} RWF
                        </Text>
                        <Button
                          mode="outlined"
                          onPress={() => removeItemFromPO(index)}
                          style={styles.removeButton}
                        >
                          Remove
                        </Button>
                      </View>
                    </Card.Content>
                  </Card>
                ))}

                {poForm.items.length > 0 && (
                  <Card style={styles.totalCard}>
                    <Card.Content>
                      <Text variant="titleMedium" style={styles.grandTotal}>
                        Grand Total: {calculateTotal().toLocaleString()} RWF
                      </Text>
                    </Card.Content>
                  </Card>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => {
                  setCreateModal(false);
                  resetForm();
                }}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleCreatePO}
                disabled={!poForm.supplierId || poForm.items.length === 0}
                style={styles.modalButton}
              >
                Create Order
              </Button>
            </View>
          </Surface>
        </Modal>
      </Portal>

      {/* View Purchase Order Modal */}
      <Portal>
        <Modal
          visible={viewModal}
          onDismiss={() => setViewModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={styles.modalSurface}>
            <Text variant="headlineSmall" style={styles.modalTitle}>Purchase Order Details</Text>
            {selectedPO && (
              <ScrollView style={styles.modalContent}>
                <Text variant="titleMedium" style={styles.poNumber}>
                  PO Number: {selectedPO.poNumber}
                </Text>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailRow}>
                    <Text variant="bodySmall" style={styles.detailLabel}>Supplier:</Text>
                    <Text variant="bodyMedium" style={styles.detailValue}>
                      {selectedPO.supplier?.name || 'Unknown'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="bodySmall" style={styles.detailLabel}>Status:</Text>
                    <Chip 
                      style={[styles.statusChip, { backgroundColor: getStatusColor(selectedPO.status) + '20' }]}
                    >
                      <Text style={[styles.statusText, { color: getStatusColor(selectedPO.status) }]}>
                        {selectedPO.status}
                      </Text>
                    </Chip>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="bodySmall" style={styles.detailLabel}>Expected Date:</Text>
                    <Text variant="bodyMedium" style={styles.detailValue}>
                      {selectedPO.expectedDate ? new Date(selectedPO.expectedDate).toLocaleDateString() : 'Not set'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="bodySmall" style={styles.detailLabel}>Total Amount:</Text>
                    <Text variant="titleMedium" style={[styles.detailValue, { color: colors.primary }]}>
                      {(selectedPO.totalAmount || 0).toLocaleString()} RWF
                    </Text>
                  </View>
                </View>

                {selectedPO.notes && (
                  <View style={styles.notesSection}>
                    <Text variant="titleSmall" style={styles.sectionTitle}>Notes:</Text>
                    <Text variant="bodyMedium">{selectedPO.notes}</Text>
                  </View>
                )}

                <View style={styles.itemsSection}>
                  <Text variant="titleSmall" style={styles.sectionTitle}>Items:</Text>
                  {(selectedPO.items || []).map((item: any, index: number) => (
                    <Card key={index} style={styles.itemCard}>
                      <Card.Content>
                        <Text variant="titleSmall">{item.product?.name || 'Unknown Product'}</Text>
                        <Text variant="bodySmall" style={styles.itemDetails}>
                          {item.quantity} × {item.unitPrice.toLocaleString()} RWF = {item.total.toLocaleString()} RWF
                        </Text>
                      </Card.Content>
                    </Card>
                  ))}
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setViewModal(false)}
                style={styles.modalButton}
              >
                Close
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
  
  ordersList: { paddingHorizontal: 16, paddingBottom: 80 },
  orderCard: { marginBottom: 12, elevation: 2, borderRadius: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderInfo: { flex: 1 },
  orderNumber: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  supplierName: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  orderDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statusChip: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '500' },
  
  orderDetails: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12, 
    paddingVertical: 8, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 8 
  },
  detailItem: { flex: 1, alignItems: 'center' },
  detailLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
  detailValue: { fontSize: 14, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginTop: 2 },
  
  orderActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actionButton: { flex: 1 },
  
  emptyCard: { marginHorizontal: 16, elevation: 2, borderRadius: 12 },
  emptyTitle: { textAlign: 'center', color: colors.textSecondary },
  emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 8 },
  
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: colors.primary },
  
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  modalSurface: { backgroundColor: 'white', borderRadius: 16, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 20 },
  modalContent: { maxHeight: 500 },
  modalInput: { marginBottom: 16 },
  pickerContainer: { marginBottom: 16 },
  pickerLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  picker: { backgroundColor: '#F8F9FA', borderRadius: 8 },
  
  itemsSection: { marginTop: 16 },
  itemsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemsTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  itemCard: { marginBottom: 12, elevation: 1, borderRadius: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  itemTotal: { fontWeight: 'bold', color: colors.primary },
  removeButton: { marginLeft: 8 },
  totalCard: { marginTop: 12, backgroundColor: colors.primary + '10', borderRadius: 8 },
  grandTotal: { fontSize: 18, fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
  
  poNumber: { fontSize: 18, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 16 },
  detailsGrid: { marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  notesSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 8 },
  itemDetails: { color: colors.textSecondary, marginTop: 4 },
  
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 16 },
  modalButton: { flex: 1 },
});