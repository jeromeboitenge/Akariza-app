import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stockApi, productsApi } from '../api';
import { LoadingSpinner, EmptyState } from '../components';

export default function StockManagementScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'adjust' | 'valuation'>('transactions');
  const [transactions, setTransactions] = useState([]);
  const [valuation, setValuation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  
  // Adjust stock form
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [adjustType, setAdjustType] = useState<'ADD' | 'REMOVE'>('ADD');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'transactions') {
        const data = await stockApi.getTransactions();
        setTransactions(data);
      } else if (activeTab === 'valuation') {
        const data = await stockApi.getValuation();
        setValuation(data);
      } else if (activeTab === 'adjust') {
        const data = await productsApi.getAll();
        setProducts(data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async () => {
    if (!selectedProduct || !quantity || !reason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await stockApi.adjustStock({
        productId: selectedProduct,
        quantity: parseInt(quantity),
        type: adjustType,
        reason,
      });
      Alert.alert('Success', 'Stock adjusted successfully');
      setAdjustModalVisible(false);
      setSelectedProduct('');
      setQuantity('');
      setReason('');
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to adjust stock');
    }
  };

  const renderTransaction = ({ item }: any) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.productName}>{item.product?.name || 'Unknown Product'}</Text>
        <View style={[
          styles.typeBadge,
          item.type === 'IN' ? styles.typeBadgeIn : styles.typeBadgeOut
        ]}>
          <Text style={styles.typeBadgeText}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.detailText}>Quantity: {item.quantity}</Text>
        <Text style={styles.detailText}>Reason: {item.reason || 'N/A'}</Text>
        <Text style={styles.detailText}>
          Date: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderValuation = () => {
    if (!valuation) return null;

    return (
      <ScrollView style={styles.valuationContainer}>
        <View style={styles.valuationCard}>
          <Text style={styles.valuationTitle}>Total Stock Value</Text>
          <Text style={styles.valuationAmount}>
            RWF {valuation.totalValue?.toLocaleString() || '0'}
          </Text>
        </View>

        <View style={styles.valuationCard}>
          <Text style={styles.valuationTitle}>Total Products</Text>
          <Text style={styles.valuationAmount}>{valuation.totalProducts || 0}</Text>
        </View>

        <View style={styles.valuationCard}>
          <Text style={styles.valuationTitle}>Total Quantity</Text>
          <Text style={styles.valuationAmount}>{valuation.totalQuantity || 0}</Text>
        </View>

        {valuation.products && valuation.products.length > 0 && (
          <View style={styles.productsList}>
            <Text style={styles.productsListTitle}>Products Breakdown</Text>
            {valuation.products.map((product: any, index: number) => (
              <View key={index} style={styles.productItem}>
                <Text style={styles.productItemName}>{product.name}</Text>
                <View style={styles.productItemDetails}>
                  <Text style={styles.productItemText}>Qty: {product.quantity}</Text>
                  <Text style={styles.productItemText}>
                    Value: RWF {product.value?.toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
            Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'adjust' && styles.activeTab]}
          onPress={() => setActiveTab('adjust')}
        >
          <Text style={[styles.tabText, activeTab === 'adjust' && styles.activeTabText]}>
            Adjust Stock
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'valuation' && styles.activeTab]}
          onPress={() => setActiveTab('valuation')}
        >
          <Text style={[styles.tabText, activeTab === 'valuation' && styles.activeTabText]}>
            Valuation
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {activeTab === 'transactions' && (
            <FlatList
              data={transactions}
              renderItem={renderTransaction}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <EmptyState
                  icon="swap-horizontal"
                  title="No Transactions"
                  message="Stock transactions will appear here"
                />
              }
            />
          )}

          {activeTab === 'adjust' && (
            <View style={styles.adjustContainer}>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => setAdjustModalVisible(true)}
              >
                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                <Text style={styles.adjustButtonText}>Adjust Stock</Text>
              </TouchableOpacity>
              <EmptyState
                icon="cube"
                title="Adjust Stock Levels"
                message="Click the button above to add or remove stock"
              />
            </View>
          )}

          {activeTab === 'valuation' && renderValuation()}
        </>
      )}

      {/* Adjust Stock Modal */}
      <Modal
        visible={adjustModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAdjustModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adjust Stock</Text>
              <TouchableOpacity onPress={() => setAdjustModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Product</Text>
              <View style={styles.pickerContainer}>
                {products.map((product: any) => (
                  <TouchableOpacity
                    key={product.id}
                    style={[
                      styles.productOption,
                      selectedProduct === product.id && styles.productOptionSelected
                    ]}
                    onPress={() => setSelectedProduct(product.id)}
                  >
                    <Text style={styles.productOptionText}>{product.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Type</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[styles.typeButton, adjustType === 'ADD' && styles.typeButtonActive]}
                  onPress={() => setAdjustType('ADD')}
                >
                  <Text style={[styles.typeButtonText, adjustType === 'ADD' && styles.typeButtonTextActive]}>
                    Add Stock
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, adjustType === 'REMOVE' && styles.typeButtonActive]}
                  onPress={() => setAdjustType('REMOVE')}
                >
                  <Text style={[styles.typeButtonText, adjustType === 'REMOVE' && styles.typeButtonTextActive]}>
                    Remove Stock
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
              />

              <Text style={styles.label}>Reason</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter reason for adjustment"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleAdjustStock}>
                <Text style={styles.submitButtonText}>Adjust Stock</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#5C6BF2',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#5C6BF2',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeIn: {
    backgroundColor: '#E8F5E9',
  },
  typeBadgeOut: {
    backgroundColor: '#FFEBEE',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  transactionDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  adjustContainer: {
    flex: 1,
    padding: 16,
  },
  adjustButton: {
    backgroundColor: '#5C6BF2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  adjustButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  valuationContainer: {
    flex: 1,
    padding: 16,
  },
  valuationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  valuationTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  valuationAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  productsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  productsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  productItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  productItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productItemText: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    maxHeight: 150,
  },
  productOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 8,
  },
  productOptionSelected: {
    borderColor: '#5C6BF2',
    backgroundColor: '#F0F2FF',
  },
  productOptionText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#5C6BF2',
    backgroundColor: '#5C6BF2',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#5C6BF2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
