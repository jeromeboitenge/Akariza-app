import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { employeesApi, branchesApi } from '../api';
import { Branch } from '../types';
import { handleApiError, logApiRequest } from '../utils/apiHelpers';
import { colors } from '../theme/colors';

export default function NewEmployeeScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('CASHIER');
  const [branchId, setBranchId] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const data = await branchesApi.getAll();
      setBranches(data);
      if (data.length > 0) {
        setBranchId(data[0].id);
      }
    } catch (error) {
      console.error('Load branches error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !password || !phone || !branchId) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName,
        email,
        password,
        phone,
        role,
        branchId,
        employeeCode: employeeCode || undefined,
        department: department || undefined,
        position: position || undefined,
        salary: salary ? parseFloat(salary) : undefined,
      };
      
      logApiRequest('employees/create', payload);
      await employeesApi.create(payload);
      Alert.alert('Success', 'Employee created successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', handleApiError(error, 'Employee creation'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Add New Employee</Title>

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

          <TextInput
            label="Password *"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            placeholder="Minimum 6 characters"
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

          <View style={styles.pickerContainer}>
            <Title style={styles.pickerLabel}>Role *</Title>
            <Picker
              selectedValue={role}
              onValueChange={setRole}
              style={styles.picker}
            >
              <Picker.Item label="Cashier" value="CASHIER" />
              <Picker.Item label="Manager" value="MANAGER" />
              <Picker.Item label="Boss" value="BOSS" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Title style={styles.pickerLabel}>Branch *</Title>
            <Picker
              selectedValue={branchId}
              onValueChange={setBranchId}
              style={styles.picker}
            >
              {branches.map((branch) => (
                <Picker.Item key={branch.id} label={branch.name} value={branch.id} />
              ))}
            </Picker>
          </View>

          <TextInput
            label="Employee Code"
            value={employeeCode}
            onChangeText={setEmployeeCode}
            mode="outlined"
            placeholder="EMP-001"
            style={styles.input}
          />

          <TextInput
            label="Department"
            value={department}
            onChangeText={setDepartment}
            mode="outlined"
            placeholder="Sales, Operations, etc."
            style={styles.input}
          />

          <TextInput
            label="Position"
            value={position}
            onChangeText={setPosition}
            mode="outlined"
            placeholder="Sales Associate, Store Manager, etc."
            style={styles.input}
          />

          <TextInput
            label="Salary"
            value={salary}
            onChangeText={setSalary}
            mode="outlined"
            keyboardType="numeric"
            placeholder="Monthly salary"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Employee
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
  button: { marginTop: 16, backgroundColor: colors.primary },
});
