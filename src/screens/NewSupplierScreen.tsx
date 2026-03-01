import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Switch, HelperText } from 'react-native-paper';
import { suppliersApi } from '../api';

export default function NewSupplierScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [rating, setRating] = useState('5');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !contactPerson || !phone) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    setLoading(true);
    try {
      await suppliersApi.create({
        name,
        contactPerson,
        phone,
        email: email || undefined,
        address: address || undefined,
        creditLimit: parseFloat(creditLimit) || 0,
        paymentTerms: paymentTerms || undefined,
        rating: parseFloat(rating) || 5,
      });
      Alert.alert('Success', 'Supplier created successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create supplier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Supplier Information</Title>

          <TextInput
            label="Supplier Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Contact Person *"
            value={contactPerson}
            onChangeText={setContactPerson}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Phone *"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <TextInput
            label="Credit Limit"
            value={creditLimit}
            onChangeText={setCreditLimit}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <TextInput
            label="Payment Terms"
            value={paymentTerms}
            onChangeText={setPaymentTerms}
            mode="outlined"
            placeholder="e.g., Net 30"
            style={styles.input}
          />

          <TextInput
            label="Rating (1-5)"
            value={rating}
            onChangeText={setRating}
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
            Create Supplier
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  card: { margin: 16, elevation: 4, borderRadius: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#5C6BF2' },
  input: { marginBottom: 12 },
  button: { marginTop: 16, backgroundColor: '#5C6BF2' },
});
