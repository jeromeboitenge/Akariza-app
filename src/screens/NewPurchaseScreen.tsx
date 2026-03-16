import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput, Snackbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { purchasesApi, suppliersApi } from '../api';
import { Product, Supplier } from '../types';
import { useDataStore } from '../store/dataStore';

interface PurchaseItem {
  product: Product;
  quantity: number;
  costPrice: number;
}

export default function NewPurchaseScreen({ navigation }: any) {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState('1');
  const [costPrice, setCostPrice] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState('UNPAID');
  const [amountPaid, setAmountPaid] = useState('0');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { products, suppliers, setSuppliers, addPurchase } = useDataStore();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await suppliersApi.getAll();
      setSuppliers(data);
    } catch (err) {
      console.error('Load suppliers error:', err);
    }
  };

  const addItem = () => {
    const product = products.find((p) => p.id === selectedProduct);
    if (!product || !costPrice) return;

    const qty = parseFloat(quantity);
    const price = parseFloat(costPrice);

    const existingItem = items.find((item) => item.product.id === product.id);
    if (existingItem) {
      setItems(items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + qty, costPrice: price }
          : item
      ));
    } else {
      setItems([...items, { product, quantity: qty, costPrice: price }]);
    }

    setSelectedProduct('');
    setQuantity('1');
    setCostPrice('');
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((item) => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.costPrice, 0);
  };

  const handleSubmit = async () => {
    // Enhanced validation with specific error messages
    if (!selectedSupplier) {
      setError('Please select a supplier. Supplier is required for all purchases.');
      return;
    }
    
    if (items.length === 0) {
      setError('Please add at least one item to the purchase.');
      return;
    }

    setLoading(true);
    try {
      const purchase = await purchasesApi.create({
        supplierId: selectedSupplier,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          costPrice: item.costPrice,
        })),
        paymentStatus,
        amountPaid: parseFloat(amountPaid),
        notes: notes || undefined,
      });
      addPurchase(purchase);
      Alert.alert('Success', 'Purchase created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>New Purchase</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.requiredLabel}>Supplier *</Paragraph>
          <Picker
            selectedValue={selectedSupplier}
            onValueChange={setSelectedSupplier}
            style={[styles.picker, !selectedSupplier && styles.requiredField]}
          >
            <Picker.Item label="Select supplier..." value="" />
            {suppliers.filter(s => s.isActive).map((s) => (
              <Picker.Item key={s.id} label={s.name} value={s.id} />
            ))}
          </Picker>
          {!selectedSupplier && (
            <Paragraph style={styles.requiredText}>
              Supplier selection is mandatory for all purchases
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Add Items</Paragraph>
          <Picker
            selectedValue={selectedProduct}
            onValueChange={setSelectedProduct}
            style={styles.picker}
          >
            <Picker.Item label="Choose a product..." value="" />
            {products.filter(p => p.isActive).map((p) => (
              <Picker.Item key={p.id} label={p.name} value={p.id} />
            ))}
          </Picker>

          <TextInput
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <TextInput
            label="Cost Price"
            value={costPrice}
            onChangeText={setCostPrice}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <Button mode="contained" onPress={addItem} disabled={!selectedProduct || !costPrice}>
            Add Item
          </Button>
        </Card.Content>
      </Card>

      {items.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Items</Title>
            {items.map((item) => (
              <View key={item.product.id} style={styles.item}>
                <View style={styles.flex}>
                  <Paragraph style={styles.bold}>{item.product.name}</Paragraph>
                  <Paragraph>
                    {item.quantity} x ${item.costPrice.toFixed(2)} = ${(item.quantity * item.costPrice).toFixed(2)}
                  </Paragraph>
                </View>
                <Button mode="text" onPress={() => removeItem(item.product.id)}>
                  Remove
                </Button>
              </View>
            ))}
            <Title style={styles.total}>Total: ${calculateTotal().toFixed(2)}</Title>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Payment Status</Paragraph>
          <Picker
            selectedValue={paymentStatus}
            onValueChange={setPaymentStatus}
            style={styles.picker}
          >
            <Picker.Item label="Unpaid" value="UNPAID" />
            <Picker.Item label="Partial" value="PARTIAL" />
            <Picker.Item label="Paid" value="PAID" />
          </Picker>

          <TextInput
            label="Amount Paid"
            value={amountPaid}
            onChangeText={setAmountPaid}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || items.length === 0 || !selectedSupplier}
        style={styles.button}
      >
        Create Purchase
      </Button>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { marginBottom: 16 },
  card: { marginBottom: 16, elevation: 2 },
  input: { marginBottom: 12 },
  picker: { marginVertical: 8 },
  requiredField: { borderColor: '#F44336', borderWidth: 1 },
  requiredLabel: { fontWeight: 'bold', color: '#F44336' },
  requiredText: { fontSize: 12, color: '#F44336', marginTop: 4, fontStyle: 'italic' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  flex: { flex: 1 },
  bold: { fontWeight: 'bold' },
  total: { marginTop: 12 },
  button: { marginVertical: 24, paddingVertical: 6 },
});
