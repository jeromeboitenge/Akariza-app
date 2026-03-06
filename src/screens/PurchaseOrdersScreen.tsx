import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { purchaseOrdersApi } from '../api';
import { LoadingSpinner, EmptyState, SearchBar } from '../components';
import { useAuthStore } from '../store/authStore';

export default function PurchaseOrdersScreen({ navigation }: any) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, orders]);

  const loadOrders = async () => {
    try {
      const data = await purchaseOrdersApi.getAll();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load purchase orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterOrders = () => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order: any) =>
      order.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleApprove = async (orderId: string) => {
    Alert.alert(
      'Approve Order',
      'Are you sure you want to approve this purchase order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await purchaseOrdersApi.approve(orderId);
              Alert.alert('Success', 'Purchase order approved');
              loadOrders();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to approve order');
            }
          },
        },
      ]
    );
  };

  const handleConvert = async (orderId: string) => {
    Alert.alert(
      'Convert to Purchase',
      'Convert this purchase order to an actual purchase?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Convert',
          onPress: async () => {
            try {
              await purchaseOrdersApi.convert(orderId);
              Alert.alert('Success', 'Purchase order converted to purchase');
              loadOrders();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to convert order');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#FFA726';
      case 'APPROVED':
        return '#66BB6A';
      case 'REJECTED':
        return '#EF5350';
      case 'CONVERTED':
        return '#5C6BF2';
      default:
        return '#757575';
    }
  };

  const renderOrder = ({ item }: any) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('PurchaseOrderDetail', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{item.orderNumber || `PO-${item.id.slice(0, 8)}`}</Text>
          <Text style={styles.supplierName}>{item.supplier?.name || 'Unknown Supplier'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cube-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {item.items?.length || 0} items
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            RWF {item.totalAmount?.toLocaleString() || '0'}
          </Text>
        </View>
      </View>

      {item.status === 'PENDING' && (user?.role === 'BOSS' || user?.role === 'MANAGER') && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(item.id)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'APPROVED' && (user?.role === 'BOSS' || user?.role === 'MANAGER') && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.convertButton]}
            onPress={() => handleConvert(item.id)}
          >
            <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Convert to Purchase</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search purchase orders..."
      />

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadOrders();
          }} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="No Purchase Orders"
            message="Purchase orders will appear here"
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewPurchaseOrder')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  supplierName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#66BB6A',
  },
  convertButton: {
    backgroundColor: '#5C6BF2',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5C6BF2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
