import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Card, Text, ActivityIndicator, Chip, FAB, Button, TextInput, Portal, Modal, Surface } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { customersApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { hasPermission } from '../utils/permissions';
import { colors } from '../theme/colors';

export default function CustomerManagementScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    customerType: 'REGULAR',
    creditLimit: '',
    notes: '',
  });
  const user = useAuthStore((state) => state.user);

  const canViewCustomers = hasPermission(user, 'VIEW_CUSTOMERS');
  const canCreateCustomers = hasPermission(user, 'CREATE_CUSTOMERS');
  const canEditCustomers = hasPermission(user, 'EDIT_CUSTOMERS');

  useEffect(() => {
    if (canViewCustomers) {
      loadCustomers();
    }
  }, [canViewCustomers]);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery, typeFilter]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(customer => customer.customerType === typeFilter);
    }

    setFilteredCustomers(filtered);
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'VIP': return colors.primary;
      case 'PREMIUM': return colors.info;
      case 'REGULAR': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'N/A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSaveCustomer = async () => {
    if (!customerForm.name || !customerForm.phone) {
      Alert.alert('Error', 'Please enter customer name and phone number');
      return;
    }

    try {
      const customerData = {
        ...customerForm,
        creditLimit: parseFloat(customerForm.creditLimit) || 0,
      };

      if (selectedCustomer) {
        await customersApi.update(selectedCustomer.id, customerData);
        Alert.alert('Success', 'Customer updated successfully');
      } else {
        await customersApi.create(customerData);
        Alert.alert('Success', 'Customer created successfully');
      }

      setCustomerModal(false);
      resetForm();
      loadCustomers();
    } catch (error) {
      console.error('Save customer failed:', error);
      Alert.alert('Error', 'Failed to save customer');
    }
  };

  const resetForm = () => {
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      customerType: 'REGULAR',
      creditLimit: '',
      notes: '',
    });
    setSelectedCustomer(null);
  };

  const openEditDialog = (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      customerType: customer.customerType || 'REGULAR',
      creditLimit: customer.creditLimit?.toString() || '',
      notes: customer.notes || '',
    });
    setCustomerModal(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCustomers();
  };

  if (!canViewCustomers) {
    return (
      <View style={styles.center}>
        <Text variant="headlineSmall">Access Denied</Text>
        <Text variant="bodyMedium">You don't have permission to view customers</Text>
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

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.customerType === 'VIP').length;
  const totalSpent = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalDebt = customers.reduce((sum, c) => sum + (c.currentDebt || 0), 0);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Customer Management</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Manage your customer relationships</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.summaryValue}>{totalCustomers}</Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>Total Customers</Text>
              <Text variant="bodySmall" style={styles.summarySubtext}>{vipCustomers} VIP</Text>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.summaryValue}>{totalSpent.toLocaleString()} RWF</Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>Total Revenue</Text>
              <Text variant="bodySmall" style={styles.summarySubtext}>All customers</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, { borderLeftWidth: 4, borderLeftColor: colors.error }]}>
            <Card.Content>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: colors.error }]}>
                {totalDebt.toLocaleString()} RWF
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>Outstanding Debt</Text>
              <Text variant="bodySmall" style={styles.summarySubtext}>
                {customers.filter(c => c.currentDebt > 0).length} customers
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.summaryValue}>
                {totalCustomers > 0 ? (totalSpent / totalCustomers).toLocaleString() : 0} RWF
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>Avg Order Value</Text>
              <Text variant="bodySmall" style={styles.summarySubtext}>Per customer</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Filters */}
        <Card style={styles.filtersCard}>
          <Card.Content>
            <TextInput
              label="Search customers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              mode="outlined"
              style={styles.searchInput}
              left={<TextInput.Icon icon="magnify" />}
            />
            
            <View style={styles.filterRow}>
              <Text variant="bodyMedium" style={styles.filterLabel}>Filter by type:</Text>
              <View style={styles.filterChips}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'VIP', label: 'VIP' },
                  { key: 'PREMIUM', label: 'Premium' },
                  { key: 'REGULAR', label: 'Regular' },
                ].map((filter) => (
                  <Chip
                    key={filter.key}
                    selected={typeFilter === filter.key}
                    onPress={() => setTypeFilter(filter.key)}
                    style={styles.filterChip}
                  >
                    {filter.label}
                  </Chip>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Customer List */}
        <View style={styles.customerList}>
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} style={styles.customerCard}>
              <Card.Content>
                <View style={styles.customerHeader}>
                  <View style={styles.customerAvatar}>
                    <Text variant="titleMedium" style={styles.avatarText}>
                      {getInitials(customer.name)}
                    </Text>
                  </View>
                  <View style={styles.customerInfo}>
                    <Text variant="titleMedium" style={styles.customerName}>{customer.name}</Text>
                    <Text variant="bodySmall" style={styles.customerEmail}>{customer.email}</Text>
                    <Text variant="bodySmall" style={styles.customerPhone}>{customer.phone}</Text>
                  </View>
                  <Chip 
                    style={[styles.typeChip, { backgroundColor: getCustomerTypeColor(customer.customerType) + '20' }]}
                  >
                    <Text style={[styles.typeText, { color: getCustomerTypeColor(customer.customerType) }]}>
                      {customer.customerType}
                    </Text>
                  </Chip>
                </View>

                <View style={styles.customerStats}>
                  <View style={styles.statItem}>
                    <Text variant="bodySmall" style={styles.statLabel}>Total Spent</Text>
                    <Text variant="titleSmall" style={styles.statValue}>
                      {(customer.totalSpent || 0).toLocaleString()} RWF
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text variant="bodySmall" style={styles.statLabel}>Current Debt</Text>
                    <Text variant="titleSmall" style={[
                      styles.statValue, 
                      { color: customer.currentDebt > 0 ? colors.error : colors.textSecondary }
                    ]}>
                      {(customer.currentDebt || 0).toLocaleString()} RWF
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text variant="bodySmall" style={styles.statLabel}>Loyalty Points</Text>
                    <Text variant="titleSmall" style={[styles.statValue, { color: colors.warning }]}>
                      {customer.loyaltyPoints || 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.customerMeta}>
                  <Text variant="bodySmall" style={styles.metaText}>
                    Last Purchase: {customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : 'Never'}
                  </Text>
                  <Text variant="bodySmall" style={styles.metaText}>
                    Credit Limit: {(customer.creditLimit || 0).toLocaleString()} RWF
                  </Text>
                </View>

                {canEditCustomers && (
                  <View style={styles.customerActions}>
                    <Button
                      mode="outlined"
                      onPress={() => openEditDialog(customer)}
                      style={styles.actionButton}
                    >
                      Edit Customer
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>

        {filteredCustomers.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.emptyTitle}>No Customers Found</Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {searchQuery || typeFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No customers available'
                }
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canCreateCustomers && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setCustomerModal(true)}
        />
      )}

      {/* Customer Form Modal */}
      <Portal>
        <Modal
          visible={customerModal}
          onDismiss={() => setCustomerModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={styles.modalSurface}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
            </Text>

            <ScrollView style={styles.modalContent}>
              <TextInput
                label="Full Name *"
                value={customerForm.name}
                onChangeText={(text) => setCustomerForm({...customerForm, name: text})}
                mode="outlined"
                style={styles.modalInput}
              />

              <TextInput
                label="Email"
                value={customerForm.email}
                onChangeText={(text) => setCustomerForm({...customerForm, email: text})}
                mode="outlined"
                keyboardType="email-address"
                style={styles.modalInput}
              />

              <TextInput
                label="Phone *"
                value={customerForm.phone}
                onChangeText={(text) => setCustomerForm({...customerForm, phone: text})}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.modalInput}
              />

              <TextInput
                label="Address"
                value={customerForm.address}
                onChangeText={(text) => setCustomerForm({...customerForm, address: text})}
                mode="outlined"
                multiline
                numberOfLines={2}
                style={styles.modalInput}
              />

              <View style={styles.pickerContainer}>
                <Text variant="bodyMedium" style={styles.pickerLabel}>Customer Type</Text>
                <Picker
                  selectedValue={customerForm.customerType}
                  onValueChange={(value: any) => setCustomerForm({...customerForm, customerType: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="Regular" value="REGULAR" />
                  <Picker.Item label="Premium" value="PREMIUM" />
                  <Picker.Item label="VIP" value="VIP" />
                </Picker>
              </View>

              <TextInput
                label="Credit Limit (RWF)"
                value={customerForm.creditLimit}
                onChangeText={(text) => setCustomerForm({...customerForm, creditLimit: text})}
                mode="outlined"
                keyboardType="numeric"
                style={styles.modalInput}
              />

              <TextInput
                label="Notes"
                value={customerForm.notes}
                onChangeText={(text) => setCustomerForm({...customerForm, notes: text})}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.modalInput}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => {
                  setCustomerModal(false);
                  resetForm();
                }}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveCustomer}
                disabled={!customerForm.name || !customerForm.phone}
                style={styles.modalButton}
              >
                {selectedCustomer ? 'Update' : 'Create'}
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
  summarySubtext: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  
  filtersCard: { marginHorizontal: 16, marginBottom: 16, elevation: 2, borderRadius: 12 },
  searchInput: { marginBottom: 16 },
  filterRow: { marginTop: 8 },
  filterLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { marginRight: 0 },
  
  customerList: { paddingHorizontal: 16, paddingBottom: 80 },
  customerCard: { marginBottom: 12, elevation: 2, borderRadius: 12 },
  customerHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  customerAvatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: colors.primary + '20', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: { color: colors.primary, fontWeight: 'bold' },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  customerEmail: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  customerPhone: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  typeChip: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 },
  typeText: { fontSize: 12, fontWeight: '500' },
  
  customerStats: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12, 
    paddingVertical: 8, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 8 
  },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
  statValue: { fontSize: 14, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginTop: 2 },
  
  customerMeta: { marginBottom: 12 },
  metaText: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  
  customerActions: { marginTop: 8 },
  actionButton: { marginTop: 8 },
  
  emptyCard: { marginHorizontal: 16, elevation: 2, borderRadius: 12 },
  emptyTitle: { textAlign: 'center', color: colors.textSecondary },
  emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: 8 },
  
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: colors.primary },
  
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  modalSurface: { backgroundColor: 'white', borderRadius: 16, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 20 },
  modalContent: { maxHeight: 400 },
  modalInput: { marginBottom: 16 },
  pickerContainer: { marginBottom: 16 },
  pickerLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  picker: { backgroundColor: '#F8F9FA', borderRadius: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 16 },
  modalButton: { flex: 1 },
});