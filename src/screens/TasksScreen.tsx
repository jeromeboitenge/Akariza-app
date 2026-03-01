import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, Chip, ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import { tasksApi } from '../api';
import { Task } from '../types';
import { safeFormatDate } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';

export default function TasksScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);

  const loadTasks = async () => {
    try {
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Load tasks error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: any = {
      'PENDING': '#FF9800',
      'IN_PROGRESS': '#2196F3',
      'COMPLETED': '#4CAF50',
      'CANCELLED': '#F44336',
    };
    return colors[status] || '#757575';
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      'LOW': '#4CAF50',
      'MEDIUM': '#FF9800',
      'HIGH': '#F44336',
    };
    return colors[priority] || '#757575';
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Avatar.Icon 
              size={48} 
              icon={item.status === 'COMPLETED' ? 'check-circle' : 'clipboard-text'} 
              style={[styles.avatar, { backgroundColor: getStatusColor(item.status) }]} 
            />
            <View style={styles.headerContent}>
              <Title style={styles.taskTitle}>{item.title}</Title>
              <Paragraph style={styles.description} numberOfLines={2}>{item.description}</Paragraph>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.chipsRow}>
            <Chip 
              icon="flag" 
              style={[styles.chip, { backgroundColor: `${getPriorityColor(item.priority)}20` }]} 
              textStyle={{ color: getPriorityColor(item.priority), fontWeight: 'bold' }}
            >
              {item.priority}
            </Chip>
            <Chip 
              icon="progress-check" 
              style={[styles.chip, { backgroundColor: `${getStatusColor(item.status)}20` }]} 
              textStyle={{ color: getStatusColor(item.status), fontWeight: 'bold' }}
            >
              {item.status}
            </Chip>
          </View>

          {item.dueDate && (
            <View style={styles.dateRow}>
              <Avatar.Icon size={20} icon="calendar" style={styles.dateIcon} />
              <Paragraph style={styles.dateText}>
                Due: {safeFormatDate(item.dueDate, 'MMM dd, yyyy')}
              </Paragraph>
            </View>
          )}

          {item.assignedTo && typeof item.assignedTo === 'object' && (
            <View style={styles.assignedRow}>
              <Avatar.Icon size={20} icon="account" style={styles.assignedIcon} />
              <Paragraph style={styles.assignedText}>
                Assigned to: {item.assignedTo.name}
              </Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <Chip icon="clock-outline" style={[styles.statChip, { backgroundColor: '#FFF3E0' }]}>
            {pendingTasks} Pending
          </Chip>
          <Chip icon="progress-clock" style={[styles.statChip, { backgroundColor: '#E3F2FD' }]}>
            {inProgressTasks} In Progress
          </Chip>
          <Chip icon="check-circle" style={[styles.statChip, { backgroundColor: '#E8F5E9' }]}>
            {completedTasks} Done
          </Chip>
        </View>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadTasks(); }} colors={['#1976D2']} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={80} icon="clipboard-text" style={styles.emptyIcon} />
            <Title>No tasks found</Title>
          </View>
        }
      />

      <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('NewTask')} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FFFFFF', padding: 16, elevation: 2 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statChip: {},
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 4, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  avatar: { marginRight: 12 },
  headerContent: { flex: 1 },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 6 },
  description: { fontSize: 14, color: '#757575' },
  divider: { marginVertical: 12 },
  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: {},
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dateIcon: { backgroundColor: '#1976D2', width: 20, height: 20, marginRight: 8 },
  dateText: { fontSize: 13, color: '#212121' },
  assignedRow: { flexDirection: 'row', alignItems: 'center' },
  assignedIcon: { backgroundColor: '#4CAF50', width: 20, height: 20, marginRight: 8 },
  assignedText: { fontSize: 13, color: '#212121' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#1976D2' },
  empty: { alignItems: 'center', padding: 32 },
  emptyIcon: { backgroundColor: '#E3F2FD', marginBottom: 16 },
});
