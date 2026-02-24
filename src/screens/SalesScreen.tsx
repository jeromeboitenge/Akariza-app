import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Button, Text, Divider, Portal, Modal, TextInput } from 'react-native-paper';
import { productsDb } from '../database/productsDb';
import { salesDb } from '../database/salesDb';
import { Product, Sale, SaleItem } from '../types';
import { useAuthStore } from '../store/authStore';
import uuid from 'react-native-uuid';
import { PAYMENT_METHODS } from '../utils/constants';

export default function SalesScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await productsDb.getAll();
    setProducts(data);
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.sellingPrice }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        quantity: 1,
        sellingPrice: product.sellingPrice,
        costPrice: product.costPrice,
        total: product.sellingPrice
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    try {
      const saleId = uuid.v4() as string;
      const sale: Sale = {
        id: saleId,
        organizationId: user!.organizationId,
        saleNumber: `SALE-${Date.now()}`,
        items: cart,
        totalAmount: getTotalAmount(),
        paymentMethod: paymentMethod as any,
        customerName: customerName || undefined,
        createdAt: Date.now(),
        syncStatus: 'PENDING'
      };

      const items = cart.map(item => ({
        id: uuid.v4() as string,
        saleId,
        ...item
      }));

      await salesDb.create(sale, items);
      
      Alert.alert('Success', 'Sale recorded successfully');
      setCart([]);
      setCustomerName('');
      setShowPayment(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to record sale');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.productsSection}>
        <FlatList
          data={products}
          numColumns={2}
          renderItem={({ item }) => (
            <Card style={styles.productCard} onPress={() => addToCart(item)}>
              <Card.Content>
                <Title numberOfLines={1}>{item.name}</Title>
                <Text>${item.sellingPrice}</Text>
                <Text>Stock: {item.currentStock}</Text>
              </Card.Content>
            </Card>
          )}
          keyExtractor={item => item.id}
        />
      </View>

      <View style={styles.cartSection}>
        <Title>Cart ({cart.length})</Title>
        <Divider />
        <FlatList
          data={cart}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Text>Qty: {item.quantity}</Text>
              <Text>${item.total}</Text>
              <Button onPress={() => removeFromCart(item.productId)}>Remove</Button>
            </View>
          )}
          keyExtractor={item => item.productId}
        />
        <Divider />
        <Title>Total: ${getTotalAmount().toFixed(2)}</Title>
        <Button mode="contained" onPress={() => setShowPayment(true)} disabled={cart.length === 0}>
          Checkout
        </Button>
      </View>

      <Portal>
        <Modal visible={showPayment} onDismiss={() => setShowPayment(false)} contentContainerStyle={styles.modal}>
          <Title>Complete Sale</Title>
          <TextInput
            label="Customer Name (Optional)"
            value={customerName}
            onChangeText={setCustomerName}
            mode="outlined"
            style={styles.input}
          />
          {PAYMENT_METHODS.map(method => (
            <Button
              key={method.value}
              mode={paymentMethod === method.value ? 'contained' : 'outlined'}
              onPress={() => setPaymentMethod(method.value)}
              style={styles.paymentButton}
            >
              {method.label}
            </Button>
          ))}
          <Button mode="contained" onPress={handleCheckout}>
            Confirm Sale
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  productsSection: {
    flex: 2,
    backgroundColor: '#f5f5f5'
  },
  cartSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  productCard: {
    flex: 1,
    margin: 5
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20
  },
  input: {
    marginVertical: 10
  },
  paymentButton: {
    marginVertical: 5
  }
});
