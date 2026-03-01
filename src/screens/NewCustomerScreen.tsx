import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Snackbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { customersApi } from '../api';
import { useDataStore } from '../store/dataStore';
import { handleApiError, logApiRequest } from '../utils/apiHelpers';

export default function NewCustomerScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [customerType, setCustomerType] = useState('REGULAR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addCustomer } = useDataStore();

  const handleSubmit = async () => {
    if (!name || !phone) {
      setError('Name and phone are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        phone,
        email: email || undefined,
        address: address || undefined,
        customerType,
      };
      
      logApiRequest('customers/create', payload);
      const customer = await customersApi.create(payload);
      addCustomer(customer);
      Alert.alert('Success', 'Customer created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      setError(handleApiError(err, 'Customer creation'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>New Customer</Title>

      <TextInput
        label="Name *"
        value={name}
        onChangeText={setName}
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

      <Title style={styles.subtitle}>Customer Type</Title>
      <Picker
        selectedValue={customerType}
        onValueChange={setCustomerType}
        style={styles.picker}
      >
        <Picker.Item label="Regular" value="REGULAR" />
        <Picker.Item label="VIP" value="VIP" />
        <Picker.Item label="Wholesale" value="WHOLESALE" />
      </Picker>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Create Customer
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
  subtitle: { fontSize: 16, marginTop: 8, marginBottom: 8 },
  input: { marginBottom: 16 },
  picker: { marginBottom: 24 },
  button: { marginTop: 16, paddingVertical: 6 },
});
