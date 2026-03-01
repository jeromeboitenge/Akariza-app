import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';

export default function CustomerDetailScreen({ route, navigation }: any) {
  const { customer } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{customer.name}</Title>
          <Chip style={styles.typeChip}>{customer.customerType}</Chip>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Contact Information</Title>
          <View style={styles.row}>
            <Paragraph>Phone:</Paragraph>
            <Paragraph style={styles.bold}>{customer.phone}</Paragraph>
          </View>
          {customer.email && (
            <View style={styles.row}>
              <Paragraph>Email:</Paragraph>
              <Paragraph style={styles.bold}>{customer.email}</Paragraph>
            </View>
          )}
          {customer.address && (
            <View style={styles.row}>
              <Paragraph>Address:</Paragraph>
              <Paragraph style={styles.bold}>{customer.address}</Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Account Information</Title>
          <View style={styles.row}>
            <Paragraph>Loyalty Points:</Paragraph>
            <Paragraph style={styles.points}>{customer.loyaltyPoints} pts</Paragraph>
          </View>
          <View style={styles.row}>
            <Paragraph>Credit Limit:</Paragraph>
            <Paragraph>${customer.creditLimit.toFixed(2)}</Paragraph>
          </View>
          <View style={styles.row}>
            <Paragraph>Current Debt:</Paragraph>
            <Paragraph style={customer.currentDebt > 0 ? styles.debt : {}}>
              ${customer.currentDebt.toFixed(2)}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      {customer.notes && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Notes</Title>
            <Paragraph>{customer.notes}</Paragraph>
          </Card.Content>
        </Card>
      )}

      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
        Back to Customers
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { marginBottom: 16, elevation: 2 },
  typeChip: { marginTop: 8, alignSelf: 'flex-start' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  bold: { fontWeight: 'bold' },
  points: { color: '#5C6BF2', fontWeight: 'bold', fontSize: 16 },
  debt: { color: '#f44336', fontWeight: 'bold' },
  button: { marginVertical: 24, paddingVertical: 6 },
});
