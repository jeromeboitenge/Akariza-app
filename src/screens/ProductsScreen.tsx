import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, FAB, Searchbar, Chip } from 'react-native-paper';
import { productsDb } from '../database/productsDb';
import { Product } from '../types';

export default function ProductsScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredProducts(
        products.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      const data = await productsDb.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>SKU: {item.sku}</Paragraph>
        <Paragraph>Price: ${item.sellingPrice}</Paragraph>
        <View style={styles.stockRow}>
          <Chip
            mode="outlined"
            style={item.currentStock <= item.minStockLevel ? styles.lowStock : styles.inStock}
          >
            Stock: {item.currentStock} {item.unit}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search products"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  searchbar: {
    margin: 10
  },
  list: {
    padding: 10
  },
  card: {
    marginBottom: 10
  },
  stockRow: {
    marginTop: 10
  },
  lowStock: {
    backgroundColor: '#ffebee'
  },
  inStock: {
    backgroundColor: '#e8f5e9'
  }
});
