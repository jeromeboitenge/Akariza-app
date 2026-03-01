import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, Searchbar, Chip, ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import { usersApi } from '../api';
import { useAuthStore } from '../store/authStore';

export default function EmployeesScreen({ navigation }: any) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const canManage = user?.role === 'BOSS';

  const loadEmployees = async () => {
    try {
      const data = await usersApi.getAll();
      console.log('👥 Loaded users:', data.length);
      setEmployees(data);
    } catch (error) {
      console.error('❌ Load employees error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((e) =>
    (e.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    const colors: any = {
      'BOSS': '#F44336',
      'MANAGER': '#FF9800',
      'CASHIER': '#4CAF50',
    };
    return colors[role] || '#1976D2';
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderEmployee = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EditUser', { userId: item.id, userData: item })}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Avatar.Text size={56} label={getInitials(item.fullName || item.email || 'U')} style={[styles.avatar, { backgroundColor: getRoleColor(item.role) }]} />
            <View style={styles.headerContent}>
              <Title style={styles.employeeName}>{item.fullName || 'No Name'}</Title>
              <Paragraph style={styles.email}>{item.email || 'No Email'}</Paragraph>
              <Chip 
                icon="shield-account" 
                style={[styles.roleChip, { backgroundColor: `${getRoleColor(item.role)}20` }]} 
                textStyle={{ color: getRoleColor(item.role), fontWeight: 'bold' }}
              >
                {item.role}
              </Chip>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Avatar.Icon size={24} icon="check-circle" style={styles.infoIcon} />
              <Paragraph style={styles.infoText}>{item.isActive ? 'Active' : 'Inactive'}</Paragraph>
            </View>
            
            {item.createdAt && (
              <View style={styles.infoRow}>
                <Avatar.Icon size={24} icon="calendar" style={styles.infoIcon} />
                <Paragraph style={styles.infoText}>
                  Joined {new Date(item.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Paragraph>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

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
        <Searchbar
          placeholder="Search employees..."
          onChangeText={setSearch}
          value={search}
          style={styles.search}
          iconColor="#1976D2"
        />
        <View style={styles.statsRow}>
          <Chip icon="account-group" style={styles.statChip}>
            {filteredEmployees.length} Employees
          </Chip>
          <Chip icon="shield-account" style={styles.statChip}>
            {filteredEmployees.filter(e => e.role === 'BOSS').length} Boss
          </Chip>
          <Chip icon="account-tie" style={styles.statChip}>
            {filteredEmployees.filter(e => e.role === 'MANAGER').length} Managers
          </Chip>
        </View>
      </View>

      <FlatList
        data={filteredEmployees}
        renderItem={renderEmployee}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadEmployees(); }} colors={['#1976D2']} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={80} icon="account-group" style={styles.emptyIcon} />
            <Title>No employees found</Title>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('NewEmployee')}
        color="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FFFFFF', padding: 16, elevation: 2 },
  search: { marginBottom: 12, backgroundColor: '#F5F7FA' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statChip: { backgroundColor: '#E3F2FD' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 4, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { marginRight: 16 },
  headerContent: { flex: 1 },
  employeeName: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
  email: { fontSize: 13, color: '#757575', marginBottom: 8 },
  roleChip: { alignSelf: 'flex-start' },
  divider: { marginVertical: 12 },
  infoContainer: { backgroundColor: '#F5F7FA', padding: 12, borderRadius: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoIcon: { backgroundColor: '#1976D2', width: 24, height: 24, marginRight: 12 },
  infoText: { fontSize: 14, color: '#212121', flex: 1 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#1976D2' },
  empty: { alignItems: 'center', padding: 32 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#1976D2' },
  emptyIcon: { backgroundColor: '#E3F2FD', marginBottom: 16 },
});
