import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Card, Title, Paragraph, FAB, Searchbar, Chip, ActivityIndicator, IconButton, Menu, DataTable } from 'react-native-paper';
import { employeesApi } from '../api';
import { Employee } from '../types';
import { adminTheme } from '../theme/adminTheme';
import { safeFormatDate } from '../utils/formatters';

export default function AdminUsersScreen({ navigation }: any) {
  const [users, setUsers] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const data = await employeesApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Load users error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    (u.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.role?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'BOSS': return adminTheme.colors.error;
      case 'MANAGER': return adminTheme.colors.primary;
      case 'CASHIER': return adminTheme.colors.success;
      default: return adminTheme.colors.secondary;
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await employeesApi.delete(id);
              Alert.alert('Success', 'User deleted');
              loadUsers();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const renderUser = ({ item }: { item: Employee }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.content}>
            <Title style={styles.userName}>{item.name}</Title>
            <Paragraph style={styles.email}>{item.email}</Paragraph>
            <View style={styles.chipsRow}>
              <Chip 
                icon="shield-account" 
                style={[styles.roleChip, { backgroundColor: `${getRoleColor(item.role)}20` }]}
                textStyle={[styles.chipText, { color: getRoleColor(item.role) }]}
              >
                {item.role}
              </Chip>
              {item.branch && (
                <Chip icon="store" style={styles.branchChip} textStyle={styles.chipText}>
                  {item.branch.name}
                </Chip>
              )}
            </View>
          </View>
          
          <Menu
            visible={menuVisible === item.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={() => setMenuVisible(item.id)}
              />
            }
          >
            <Menu.Item onPress={() => { setMenuVisible(null); /* Edit user */ }} title="Edit" leadingIcon="pencil" />
            <Menu.Item onPress={() => { setMenuVisible(null); /* Reset password */ }} title="Reset Password" leadingIcon="lock-reset" />
            <Menu.Item onPress={() => { setMenuVisible(null); handleDelete(item.id); }} title="Delete" leadingIcon="delete" />
          </Menu>
        </View>

        <View style={styles.infoRow}>
          <Paragraph style={styles.infoLabel}>Phone:</Paragraph>
          <Paragraph style={styles.infoValue}>{item.phone}</Paragraph>
        </View>
        
        {item.salary && (
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Salary:</Paragraph>
            <Paragraph style={styles.infoValue}>${item.salary.toFixed(2)}/month</Paragraph>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={adminTheme.colors.primary} />
      </View>
    );
  }

  const bossCount = filteredUsers.filter(u => u.role === 'BOSS').length;
  const managerCount = filteredUsers.filter(u => u.role === 'MANAGER').length;
  const cashierCount = filteredUsers.filter(u => u.role === 'CASHIER').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerStats}>
          <View style={styles.headerStatItem}>
            <Title style={styles.headerStatValue}>{filteredUsers.length}</Title>
            <Paragraph style={styles.headerStatLabel}>Total Users</Paragraph>
          </View>
          <View style={styles.headerStatItem}>
            <Title style={styles.headerStatValue}>{bossCount}</Title>
            <Paragraph style={styles.headerStatLabel}>Admins</Paragraph>
          </View>
          <View style={styles.headerStatItem}>
            <Title style={styles.headerStatValue}>{managerCount}</Title>
            <Paragraph style={styles.headerStatLabel}>Managers</Paragraph>
          </View>
          <View style={styles.headerStatItem}>
            <Title style={styles.headerStatValue}>{cashierCount}</Title>
            <Paragraph style={styles.headerStatLabel}>Cashiers</Paragraph>
          </View>
        </View>
        
        <Searchbar
          placeholder="Search users..."
          onChangeText={setSearch}
          value={search}
          style={styles.search}
          iconColor={adminTheme.colors.primary}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadUsers(); }} colors={[adminTheme.colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Title style={styles.emptyTitle}>No users found</Title>
            <Paragraph style={styles.emptyText}>Add users to get started</Paragraph>
          </View>
        }
      />

      <FAB icon="plus" style={styles.fab} onPress={() => {/* Navigate to add user */}} color={adminTheme.colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: adminTheme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    backgroundColor: adminTheme.colors.white, 
    padding: adminTheme.spacing.md, 
    elevation: adminTheme.elevation,
  },
  headerStats: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: adminTheme.spacing.md,
  },
  headerStatItem: { alignItems: 'center' },
  headerStatValue: { fontSize: 24, fontWeight: 'bold', color: adminTheme.colors.primary },
  headerStatLabel: { fontSize: 11, color: adminTheme.colors.secondaryLight },
  search: { backgroundColor: adminTheme.colors.background },
  card: { 
    marginHorizontal: adminTheme.spacing.md, 
    marginVertical: adminTheme.spacing.sm, 
    elevation: adminTheme.elevation,
    borderRadius: adminTheme.borderRadius,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  content: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold', color: adminTheme.colors.secondary },
  email: { fontSize: 13, color: adminTheme.colors.secondaryLight, marginTop: 4 },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  roleChip: {},
  branchChip: { backgroundColor: adminTheme.colors.primaryLight },
  chipText: { fontSize: 11, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', marginTop: 4 },
  infoLabel: { fontSize: 13, color: adminTheme.colors.secondaryLight, marginRight: 8 },
  infoValue: { fontSize: 13, color: adminTheme.colors.secondary, fontWeight: '500' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: adminTheme.colors.primary },
  empty: { alignItems: 'center', padding: 48 },
  emptyTitle: { fontSize: 18, color: adminTheme.colors.secondary, marginBottom: 8 },
  emptyText: { fontSize: 14, color: adminTheme.colors.secondaryLight },
});
