import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph, Switch, Snackbar } from 'react-native-paper';
import { productsApi } from '../api';
import { useDataStore } from '../store/dataStore';
import { handleApiError, logApiRequest } from '../utils/apiHelpers';

export default function NewProductScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('General');
  const [unit, setUnit] = useState('piece');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [currentStock, setCurrentStock] = useState('0');
  const [minStockLevel, setMinStockLevel] = useState('10');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addProduct } = useDataStore();

  const handleSubmit = async () => {
    if (!name || !sku || !costPrice || !sellingPrice) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        sku,
        category,
        unit,
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
        currentStock: parseFloat(currentStock),
        minStockLevel: parseFloat(minStockLevel),
        hasExpiry,
      };
      
      logApiRequest('products/create', payload);
      const product = await productsApi.create(payload);
      addProduct(product);
      Alert.alert('Success', 'Product created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      setError(handleApiError(err, 'Product creation'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>New Product</Title>

      <TextInput
        label="Product Name *"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="SKU *"
        value={sku}
        onChangeText={setSku}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Category"
        value={category}
        onChangeText={setCategory}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Unit"
        value={unit}
        onChangeText={setUnit}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Cost Price *"
        value={costPrice}
        onChangeText={setCostPrice}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        label="Selling Price *"
        value={sellingPrice}
        onChangeText={setSellingPrice}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        label="Current Stock"
        value={currentStock}
        onChangeText={setCurrentStock}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        label="Minimum Stock Level"
        value={minStockLevel}
        onChangeText={setMinStockLevel}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <View style={styles.switchRow}>
        <Paragraph>Has Expiry Date</Paragraph>
        <Switch value={hasExpiry} onValueChange={setHasExpiry} />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Create Product
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
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { marginBottom: 24 },
  input: { marginBottom: 16 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  button: { marginTop: 16, paddingVertical: 6 },
});
