import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput, Chip, Divider, Snackbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { salesApi, customersApi } from '../api';
import { Product, Customer } from '../types';
import { useDataStore } from '../store/dataStore';

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export default function NewSaleScreen({ navigation }: any) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState('1');
  const [customPrice, setCustomPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { products, customers, setCustomers, addSale } = useDataStore();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (err) {
      console.error('Load customers error:', err);
    }
  };

  const addToCart = () => {
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const price = customPrice ? parseFloat(customPrice) : product.sellingPrice;
    const qty = parseFloat(quantity);

    if (qty > product.currentStock) {
      setError('Insufficient stock');
      return;
    }

    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + qty, price }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: qty, price }]);
    }

    setSelectedProduct('');
    setQuantity('1');
    setCustomPrice('');
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const sale = await salesApi.create({
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          sellingPrice: item.price,
        })),
        paymentMethod,
        customerId: selectedCustomer || undefined,
        customerName: customerName || undefined,
      });
      addSale(sale);
      Alert.alert('Success', 'Sale completed successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>New Sale</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Select Product</Paragraph>
          <Picker
            selectedValue={selectedProduct}
            onValueChange={setSelectedProduct}
            style={styles.picker}
          >
            <Picker.Item label="Choose a product..." value="" />
            {products.filter(p => p.isActive && p.currentStock > 0).map((p) => (
              <Picker.Item key={p.id} label={`${p.name} (${p.currentStock} in stock)`} value={p.id} />
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
            label="Custom Price (optional)"
            value={customPrice}
            onChangeText={setCustomPrice}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <Button mode="contained" onPress={addToCart} disabled={!selectedProduct}>
            Add to Cart
          </Button>
        </Card.Content>
      </Card>

      {cart.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Cart</Title>
            {cart.map((item) => (
              <View key={item.product.id} style={styles.cartItem}>
                <View style={styles.flex}>
                  <Paragraph style={styles.bold}>{item.product.name}</Paragraph>
                  <Paragraph>
                    {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                  </Paragraph>
                </View>
                <Button mode="text" onPress={() => removeFromCart(item.product.id)}>
                  Remove
                </Button>
              </View>
            ))}
            <Divider style={styles.divider} />
            <Title>Total: ${calculateTotal().toFixed(2)}</Title>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Payment Method</Paragraph>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={setPaymentMethod}
            style={styles.picker}
          >
            <Picker.Item label="Cash" value="CASH" />
            <Picker.Item label="Card" value="CARD" />
            <Picker.Item label="Mobile Money" value="MOBILE_MONEY" />
            <Picker.Item label="Bank Transfer" value="BANK_TRANSFER" />
          </Picker>

          <Paragraph style={styles.marginTop}>Customer (optional)</Paragraph>
          <Picker
            selectedValue={selectedCustomer}
            onValueChange={setSelectedCustomer}
            style={styles.picker}
          >
            <Picker.Item label="Walk-in Customer" value="" />
            {customers.map((c) => (
              <Picker.Item key={c.id} label={`${c.name} - ${c.phone}`} value={c.id} />
            ))}
          </Picker>

          {!selectedCustomer && (
            <TextInput
              label="Customer Name (optional)"
              value={customerName}
              onChangeText={setCustomerName}
              mode="outlined"
              style={styles.input}
            />
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || cart.length === 0}
        style={styles.button}
      >
        Complete Sale
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
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  flex: { flex: 1 },
  bold: { fontWeight: 'bold' },
  divider: { marginVertical: 12 },
  marginTop: { marginTop: 16 },
  button: { marginVertical: 24, paddingVertical: 6 },
});
