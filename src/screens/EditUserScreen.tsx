import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Switch, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { usersApi, branchesApi } from '../api';
import { Branch } from '../types';
import { handleApiError, logApiRequest } from '../utils/apiHelpers';
import { colors } from '../theme/colors';

export default function EditUserScreen({ route, navigation }: any) {
  const { userId, userData } = route.params;
  
  const [fullName, setFullName] = useState(userData.fullName || '');
  const [email, setEmail] = useState(userData.email || '');
  const [role, setRole] = useState(userData.role || 'CASHIER');
  const [branchId, setBranchId] = useState(userData.branchId || '');
  const [isActive, setIsActive] = useState(userData.isActive !== false);
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const data = await branchesApi.getAll();
      setBranches(data);
      if (!branchId && data.length > 0) {
        setBranchId(data[0].id);
      }
    } catch (error) {
      console.error('Load branches error:', error);
    }
  };

  const handleUpdate = async () => {
    if (!fullName || !email || !branchId) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = { fullName, email, role, branchId, isActive };
      
      logApiRequest(`users/${userId}/update`, payload);
      await usersApi.update(userId, payload);
      Alert.alert('✅ Success', 'User updated successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('❌ Update Failed', handleApiError(error, 'User update'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = () => {
    Alert.alert(
      'Deactivate User',
      `Are you sure you want to deactivate ${fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await usersApi.deactivate(userId);
              Alert.alert('✅ Success', 'User deactivated successfully');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('❌ Failed', handleApiError(error, 'User deactivation'));
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Edit User</Title>

          <TextInput
            label="Full Name *"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
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

          <View style={styles.pickerContainer}>
            <Title style={styles.pickerLabel}>Role *</Title>
            <Picker selectedValue={role} onValueChange={setRole} style={styles.picker}>
              <Picker.Item label="Cashier" value="CASHIER" />
              <Picker.Item label="Manager" value="MANAGER" />
              <Picker.Item label="Boss" value="BOSS" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Title style={styles.pickerLabel}>Branch *</Title>
            <Picker selectedValue={branchId} onValueChange={setBranchId} style={styles.picker}>
              {branches.map((branch) => (
                <Picker.Item key={branch.id} label={branch.name} value={branch.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Active Status</Text>
            <Switch value={isActive} onValueChange={setIsActive} color={colors.primary} />
          </View>

          <Button
            mode="contained"
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Update User
          </Button>

          <Button
            mode="outlined"
            onPress={handleDeactivate}
            disabled={loading}
            style={[styles.button, styles.deactivateButton]}
            textColor={colors.error}
          >
            Deactivate User
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: { margin: 16, elevation: 4, borderRadius: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: colors.primary },
  input: { marginBottom: 12 },
  pickerContainer: { marginBottom: 12, borderWidth: 1, borderColor: '#CCC', borderRadius: 4, paddingHorizontal: 8 },
  pickerLabel: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
  picker: { height: 50 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  switchLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
  button: { marginTop: 12, backgroundColor: colors.primary },
  deactivateButton: { borderColor: colors.error },
});
