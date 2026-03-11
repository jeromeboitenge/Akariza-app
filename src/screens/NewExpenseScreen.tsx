import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Chip } from 'react-native-paper';
import { expensesApi } from '../api';

export default function NewExpenseScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [loading, setLoading] = useState(false);

  const categories = ['RENT', 'UTILITIES', 'SALARIES', 'SUPPLIES', 'MARKETING', 'OTHER'];
  const paymentMethods = ['CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_MONEY'];

  const handleSubmit = async () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    setLoading(true);
    try {
      // Don't send customCategory field - backend doesn't support it
      await expensesApi.create({
        amount: parseFloat(amount),
        description,
        category,
        paymentMethod,
        date: new Date().toISOString(),
      });
      Alert.alert('Success', 'Expense recorded successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.userMessage || error.message || 'Failed to record expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Record Expense</Title>

          <TextInput
            label="Amount *"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
            left={<TextInput.Icon icon="currency-usd" />}
          />

          <TextInput
            label="Description *"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Title style={styles.sectionTitle}>Category</Title>
          <View style={styles.chipContainer}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                selected={category === cat}
                onPress={() => setCategory(cat)}
                style={styles.chip}
              >
                {cat}
              </Chip>
            ))}
          </View>

          <Title style={styles.sectionTitle}>Payment Method</Title>
          <View style={styles.chipContainer}>
            {paymentMethods.map((method) => (
              <Chip
                key={method}
                selected={paymentMethod === method}
                onPress={() => setPaymentMethod(method)}
                style={styles.chip}
              >
                {method.replace('_', ' ')}
              </Chip>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Record Expense
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  card: { margin: 16, elevation: 4, borderRadius: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#F44336' },
  sectionTitle: { fontSize: 16, marginTop: 8, marginBottom: 8 },
  input: { marginBottom: 12 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { marginRight: 8, marginBottom: 8 },
  button: { marginTop: 16, backgroundColor: '#F44336' },
});
