import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, RadioButton, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { messagesApi, branchesApi, employeesApi } from '../api';
import { Branch, Employee } from '../types';
import { useAuthStore } from '../store/authStore';
import { handleApiError, logApiRequest } from '../utils/apiHelpers';
import { colors } from '../theme/colors';

export default function ComposeMessageScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const [messageType, setMessageType] = useState('user'); // user, branch, organization
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [branchData, employeeData] = await Promise.all([
        branchesApi.getAll(),
        employeesApi.getAll(),
      ]);
      setBranches(branchData);
      setEmployees(employeeData.filter((e: Employee) => e.id !== user?.id));
      if (branchData.length > 0) setSelectedBranchId(branchData[0].id);
      if (employeeData.length > 0) setSelectedUserId(employeeData[0].id);
    } catch (error) {
      console.error('Load data error:', error);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setLoading(true);
    try {
      const payload: any = { message: messageText };
      
      if (messageType === 'user') {
        payload.receiverId = selectedUserId;
      } else if (messageType === 'branch') {
        payload.branchId = selectedBranchId;
      } else if (messageType === 'organization') {
        payload.toOrganization = true;
      }
      
      logApiRequest('messages/send', payload);
      await messagesApi.send(payload);
      Alert.alert('Success', 'Message sent successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', handleApiError(error, 'Send message'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Compose Message</Title>

          <Text style={styles.label}>Send To:</Text>
          <RadioButton.Group onValueChange={setMessageType} value={messageType}>
            <View style={styles.radioItem}>
              <RadioButton value="user" color={colors.primary} />
              <Text>Individual User</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="branch" color={colors.primary} />
              <Text>Entire Branch</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="organization" color={colors.primary} />
              <Text>Whole Organization</Text>
            </View>
          </RadioButton.Group>

          {messageType === 'user' && (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select User</Text>
              <Picker
                selectedValue={selectedUserId}
                onValueChange={setSelectedUserId}
                style={styles.picker}
              >
                {employees.map((emp) => (
                  <Picker.Item key={emp.id} label={`${emp.name || emp.email} (${emp.role})`} value={emp.id} />
                ))}
              </Picker>
            </View>
          )}

          {messageType === 'branch' && (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Branch</Text>
              <Picker
                selectedValue={selectedBranchId}
                onValueChange={setSelectedBranchId}
                style={styles.picker}
              >
                {branches.map((branch) => (
                  <Picker.Item key={branch.id} label={branch.name} value={branch.id} />
                ))}
              </Picker>
            </View>
          )}

          <TextInput
            label="Message"
            value={messageText}
            onChangeText={setMessageText}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.input}
            placeholder="Type your message here..."
          />

          <Button
            mode="contained"
            onPress={handleSend}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="send"
          >
            Send Message
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
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 8, marginBottom: 8 },
  radioItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  pickerContainer: { marginVertical: 12, borderWidth: 1, borderColor: '#CCC', borderRadius: 4, paddingHorizontal: 8 },
  pickerLabel: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
  picker: { height: 50 },
  input: { marginTop: 16 },
  button: { marginTop: 16, backgroundColor: colors.primary },
});
