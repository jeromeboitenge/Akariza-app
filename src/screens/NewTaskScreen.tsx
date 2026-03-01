import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Chip, Menu } from 'react-native-paper';
import { tasksApi, employeesApi } from '../api';
import { Employee } from '../types';

export default function NewTaskScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const priorities = ['LOW', 'MEDIUM', 'HIGH'];

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeesApi.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Load employees error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    setLoading(true);
    try {
      await tasksApi.create({
        title,
        description,
        priority,
        dueDate: dueDate || undefined,
        assignedToId: assignedToId || undefined,
        status: 'PENDING',
      });
      Alert.alert('Success', 'Task created successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const selectedEmployee = employees.find(e => e.id === assignedToId);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Create Task</Title>

          <TextInput
            label="Task Title *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Description *"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <Title style={styles.sectionTitle}>Priority</Title>
          <View style={styles.chipContainer}>
            {priorities.map((p) => (
              <Chip
                key={p}
                selected={priority === p}
                onPress={() => setPriority(p)}
                style={styles.chip}
              >
                {p}
              </Chip>
            ))}
          </View>

          <TextInput
            label="Due Date (YYYY-MM-DD)"
            value={dueDate}
            onChangeText={setDueDate}
            mode="outlined"
            placeholder="2024-12-31"
            style={styles.input}
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.input}
              >
                {selectedEmployee ? selectedEmployee.name : 'Assign to Employee'}
              </Button>
            }
          >
            {employees.map((emp) => (
              <Menu.Item
                key={emp.id}
                onPress={() => {
                  setAssignedToId(emp.id);
                  setMenuVisible(false);
                }}
                title={emp.name}
              />
            ))}
          </Menu>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Task
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
  sectionTitle: { fontSize: 16, marginTop: 8, marginBottom: 8 },
  input: { marginBottom: 12 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { marginRight: 8, marginBottom: 8 },
  button: { marginTop: 16, backgroundColor: '#5C6BF2' },
});
