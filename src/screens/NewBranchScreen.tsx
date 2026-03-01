import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Switch } from 'react-native-paper';
import { branchesApi } from '../api';

export default function NewBranchScreen({ route, navigation }: any) {
  const { orgId } = route.params || {};
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isMainBranch, setIsMainBranch] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !code || !address || !phone) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        code,
        address,
        phone,
        email: email || undefined,
        isMainBranch,
        isActive: true,
      };
      
      console.log('Creating branch with:', payload);
      
      await branchesApi.create(payload);
      Alert.alert('Success', 'Branch created successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('Branch creation error:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create branch';
      Alert.alert('Error', Array.isArray(errorMsg) ? errorMsg.join('\n') : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Create Branch</Title>

          <TextInput
            label="Branch Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Branch Code *"
            value={code}
            onChangeText={setCode}
            mode="outlined"
            autoCapitalize="characters"
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

          <View style={styles.switchRow}>
            <Title style={styles.switchLabel}>Main Branch</Title>
            <Switch value={isMainBranch} onValueChange={setIsMainBranch} />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Branch
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  card: { margin: 16, elevation: 4, borderRadius: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#4CAF50' },
  input: { marginBottom: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  switchLabel: { fontSize: 16 },
  button: { marginTop: 16, backgroundColor: '#4CAF50' },
});
