import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Chip, Button } from 'react-native-paper';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { product } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{product.name}</Title>
          <Paragraph>SKU: {product.sku}</Paragraph>
          <Paragraph>Category: {product.category}</Paragraph>
          <Paragraph>Unit: {product.unit}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Pricing</Title>
          <View style={styles.row}>
            <Paragraph>Cost Price:</Paragraph>
            <Paragraph style={styles.bold}>{formatCurrency(product.costPrice, 'RWF')}</Paragraph>
          </View>
          <View style={styles.row}>
            <Paragraph>Selling Price:</Paragraph>
            <Paragraph style={styles.bold}>{formatCurrency(product.sellingPrice, 'RWF')}</Paragraph>
          </View>
          <View style={styles.row}>
            <Paragraph>Profit Margin:</Paragraph>
            <Paragraph style={styles.profit}>
              {formatCurrency(product.sellingPrice - product.costPrice, 'RWF')}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Stock Information</Title>
          <View style={styles.row}>
            <Paragraph>Current Stock:</Paragraph>
            <Chip style={product.currentStock <= product.minStockLevel ? styles.lowStock : {}}>
              {product.currentStock} {product.unit}
            </Chip>
          </View>
          <View style={styles.row}>
            <Paragraph>Min Level:</Paragraph>
            <Paragraph>{product.minStockLevel}</Paragraph>
          </View>
          <View style={styles.row}>
            <Paragraph>Max Level:</Paragraph>
            <Paragraph>{product.maxStockLevel}</Paragraph>
          </View>
          <View style={styles.row}>
            <Paragraph>Reorder Point:</Paragraph>
            <Paragraph>{product.reorderPoint}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Additional Info</Title>
          <View style={styles.row}>
            <Paragraph>Has Expiry:</Paragraph>
            <Chip>{product.hasExpiry ? 'Yes' : 'No'}</Chip>
          </View>
          <View style={styles.row}>
            <Paragraph>Track Batch:</Paragraph>
            <Chip>{product.trackBatch ? 'Yes' : 'No'}</Chip>
          </View>
          <View style={styles.row}>
            <Paragraph>Track Serial:</Paragraph>
            <Chip>{product.trackSerial ? 'Yes' : 'No'}</Chip>
          </View>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={() => navigation.navigate('ProductCostHistory', { 
        productId: product.id, 
        productName: product.name 
      })} style={styles.button}>
        View Cost History
      </Button>

      <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>
        Back to Products
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { marginBottom: 16, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  bold: { fontWeight: 'bold', fontSize: 16 },
  profit: { color: '#4caf50', fontWeight: 'bold', fontSize: 16 },
  lowStock: { backgroundColor: '#ffebee' },
  button: { marginVertical: 24, paddingVertical: 6 },
});
