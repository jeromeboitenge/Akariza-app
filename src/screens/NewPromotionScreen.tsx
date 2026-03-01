import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Chip } from 'react-native-paper';
import { promotionsApi } from '../api';

export default function NewPromotionScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !description || !discountValue || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    setLoading(true);
    try {
      await promotionsApi.create({
        name,
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        startDate,
        endDate,
        minPurchaseAmount: minPurchaseAmount ? parseFloat(minPurchaseAmount) : undefined,
        isActive: true,
      });
      Alert.alert('Success', 'Promotion created successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Create Promotion</Title>

          <TextInput
            label="Promotion Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
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

          <Title style={styles.sectionTitle}>Discount Type</Title>
          <View style={styles.chipContainer}>
            <Chip
              selected={discountType === 'PERCENTAGE'}
              onPress={() => setDiscountType('PERCENTAGE')}
              style={styles.chip}
            >
              Percentage (%)
            </Chip>
            <Chip
              selected={discountType === 'FIXED'}
              onPress={() => setDiscountType('FIXED')}
              style={styles.chip}
            >
              Fixed Amount ($)
            </Chip>
          </View>

          <TextInput
            label={`Discount Value * (${discountType === 'PERCENTAGE' ? '%' : '$'})`}
            value={discountValue}
            onChangeText={setDiscountValue}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <TextInput
            label="Start Date * (YYYY-MM-DD)"
            value={startDate}
            onChangeText={setStartDate}
            mode="outlined"
            placeholder="2024-01-01"
            style={styles.input}
          />

          <TextInput
            label="End Date * (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
            mode="outlined"
            placeholder="2024-12-31"
            style={styles.input}
          />

          <TextInput
            label="Minimum Purchase Amount"
            value={minPurchaseAmount}
            onChangeText={setMinPurchaseAmount}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Promotion
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
