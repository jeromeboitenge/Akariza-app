import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Switch } from 'react-native-paper';
import { organizationsApi } from '../api';

export default function NewOrganizationScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  // Boss data
  const [bossEmail, setBossEmail] = useState('');
  const [bossPassword, setBossPassword] = useState('');
  const [bossFullName, setBossFullName] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !address || !businessType || !bossEmail || !bossPassword || !bossFullName) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await organizationsApi.create({
        name,
        email,
        phone,
        address,
        businessType,
        bossData: {
          email: bossEmail,
          password: bossPassword,
          fullName: bossFullName,
        },
        subscriptionPlan: subscriptionPlan || undefined,
        isActive,
      });
      Alert.alert('Success', 'Organization created successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Create Organization</Title>

          <TextInput
            label="Organization Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Business Type *"
            value={businessType}
            onChangeText={setBusinessType}
            mode="outlined"
            placeholder="e.g., Retail, Wholesale, Restaurant"
            style={styles.input}
          />

          <TextInput
            label="Email *"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Phone *"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            placeholder="+250788123456"
            style={styles.input}
          />

          <TextInput
            label="Address *"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Title style={styles.sectionTitle}>Boss Account Details</Title>

          <TextInput
            label="Boss Full Name *"
            value={bossFullName}
            onChangeText={setBossFullName}
            mode="outlined"
            placeholder="John Doe"
            style={styles.input}
          />

          <TextInput
            label="Boss Email *"
            value={bossEmail}
            onChangeText={setBossEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="boss@company.com"
            style={styles.input}
          />

          <TextInput
            label="Boss Password *"
            value={bossPassword}
            onChangeText={setBossPassword}
            mode="outlined"
            secureTextEntry
            placeholder="Minimum 6 characters"
            style={styles.input}
          />

          <TextInput
            label="Subscription Plan"
            value={subscriptionPlan}
            onChangeText={setSubscriptionPlan}
            mode="outlined"
            placeholder="e.g., BASIC, PRO, ENTERPRISE"
            style={styles.input}
          />

          <View style={styles.switchRow}>
            <Title style={styles.switchLabel}>Active</Title>
            <Switch value={isActive} onValueChange={setIsActive} />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Organization
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  card: { margin: 16, elevation: 4, borderRadius: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#9C27B0' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#1976D2' },
  input: { marginBottom: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  switchLabel: { fontSize: 16 },
  button: { marginTop: 16, backgroundColor: '#9C27B0' },
});
