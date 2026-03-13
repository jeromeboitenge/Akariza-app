import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button, Card, Title, Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { expensesApi } from '../api';
import { safeFormatDate } from '../utils/formatters';
import { DateValidation } from '../utils/dateValidation';

export default function NewExpenseScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['RENT', 'UTILITIES', 'SALARIES', 'SUPPLIES', 'MARKETING', 'OTHER'];
  const paymentMethods = ['CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_MONEY'];

  const handleSubmit = async () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Validate date
    const dateValidation = DateValidation.validateExpenseDate(date);
    if (!dateValidation.isValid) {
      Alert.alert('Error', dateValidation.error || 'Invalid date');
      return;
    }

    setLoading(true);
    try {
      // Ensure date is properly formatted as ISO string
      await expensesApi.create({
        amount: amountNum,
        description: description.trim(),
        category,
        paymentMethod,
        date: DateValidation.formatForAPI(date),
      });
      Alert.alert('Success', 'Expense recorded successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('Create expense error:', error);
      Alert.alert('Error', error.userMessage || error.message || 'Failed to record expense');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
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

          <TextInput
            label="Date"
            value={safeFormatDate(date, 'MMM dd, yyyy')}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
            editable={false}
          />

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

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
