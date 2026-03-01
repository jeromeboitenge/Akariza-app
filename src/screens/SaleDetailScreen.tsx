import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { safeFormatDate } from '../utils/formatters';

export default function SaleDetailScreen({ route }: any) {
  const { sale } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{sale.saleNumber}</Title>
          <Paragraph>{safeFormatDate(sale.createdAt, 'MMM dd, yyyy HH:mm')}</Paragraph>
          {sale.customerName && <Paragraph>Customer: {sale.customerName}</Paragraph>}
          <View style={styles.row}>
            <Chip>{sale.paymentMethod}</Chip>
            <Chip style={styles.chip}>{sale.paymentStatus}</Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Items</Title>
          {sale.items?.map((item: any) => (
            <View key={item.id} style={styles.item}>
              <Paragraph style={styles.flex}>{item.product?.name || 'Product'}</Paragraph>
              <Paragraph>{item.quantity} x ${item.sellingPrice.toFixed(2)}</Paragraph>
              <Paragraph style={styles.bold}>${item.total.toFixed(2)}</Paragraph>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Paragraph>Subtotal:</Paragraph>
            <Paragraph>${sale.totalAmount.toFixed(2)}</Paragraph>
          </View>
          {sale.discount > 0 && (
            <View style={styles.row}>
              <Paragraph>Discount:</Paragraph>
              <Paragraph>-${sale.discount.toFixed(2)}</Paragraph>
            </View>
          )}
          {sale.tax > 0 && (
            <View style={styles.row}>
              <Paragraph>Tax:</Paragraph>
              <Paragraph>${sale.tax.toFixed(2)}</Paragraph>
            </View>
          )}
          <View style={[styles.row, styles.total]}>
            <Title>Total:</Title>
            <Title>${sale.finalAmount.toFixed(2)}</Title>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { marginBottom: 16, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  chip: { marginLeft: 8 },
  item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  flex: { flex: 1 },
  bold: { fontWeight: 'bold' },
  total: { marginTop: 16, paddingTop: 16, borderTopWidth: 2, borderTopColor: '#6200ee' },
});
