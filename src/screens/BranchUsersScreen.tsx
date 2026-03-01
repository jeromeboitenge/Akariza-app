import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Avatar, Chip, Divider, Text } from 'react-native-paper';
import { employeesApi } from '../api';
import { Employee } from '../types';
import { colors } from '../theme/colors';

export default function BranchUsersScreen({ route, navigation }: any) {
  const { branchId, branchName } = route.params;
  const [users, setUsers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async () => {
    try {
      const allUsers = await employeesApi.getAll();
      const branchUsers = allUsers.filter((u: Employee) => u.branch?.id === branchId);
      setUsers(branchUsers);
    } catch (error) {
      console.error('Load branch users error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [branchId]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'BOSS': return colors.error;
      case 'MANAGER': return colors.primary;
      case 'CASHIER': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const renderUser = ({ item }: { item: Employee }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Avatar.Text 
            size={56} 
            label={item.name?.substring(0, 2).toUpperCase() || 'U'} 
            style={[styles.avatar, { backgroundColor: getRoleColor(item.role) }]}
          />
          <View style={styles.headerInfo}>
            <Title style={styles.name}>{item.name}</Title>
            <Chip 
              icon="shield-account" 
              style={[styles.roleChip, { backgroundColor: `${getRoleColor(item.role)}20` }]}
              textStyle={[styles.roleText, { color: getRoleColor(item.role) }]}
            >
              {item.role}
            </Chip>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.detailRow}>
          <Avatar.Icon size={32} icon="email" style={styles.detailIcon} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{item.email}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Avatar.Icon size={32} icon="phone" style={styles.detailIcon} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{item.phone}</Text>
          </View>
        </View>

        {item.employeeCode && (
          <View style={styles.detailRow}>
            <Avatar.Icon size={32} icon="badge-account" style={styles.detailIcon} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Employee Code</Text>
              <Text style={styles.detailValue}>{item.employeeCode}</Text>
            </View>
          </View>
        )}

        {item.department && (
          <View style={styles.detailRow}>
            <Avatar.Icon size={32} icon="office-building" style={styles.detailIcon} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Department</Text>
              <Text style={styles.detailValue}>{item.department}</Text>
            </View>
          </View>
        )}

        {item.position && (
          <View style={styles.detailRow}>
            <Avatar.Icon size={32} icon="briefcase" style={styles.detailIcon} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Position</Text>
              <Text style={styles.detailValue}>{item.position}</Text>
            </View>
          </View>
        )}

        {item.salary && (
          <View style={styles.detailRow}>
            <Avatar.Icon size={32} icon="cash" style={styles.detailIcon} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Salary</Text>
              <Text style={styles.detailValue}>${item.salary.toFixed(2)}/month</Text>
            </View>
          </View>
        )}

        <View style={styles.statusRow}>
          <Chip 
            icon={item.isActive ? 'check-circle' : 'close-circle'}
            style={[styles.statusChip, { backgroundColor: item.isActive ? colors.success + '20' : colors.error + '20' }]}
            textStyle={{ color: item.isActive ? colors.success : colors.error }}
          >
            {item.isActive ? 'Active' : 'Inactive'}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.summaryTitle}>{branchName}</Title>
          <Paragraph style={styles.summaryText}>{users.length} employee{users.length !== 1 ? 's' : ''}</Paragraph>
        </Card.Content>
      </Card>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { setRefreshing(true); loadUsers(); }}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={64} icon="account-off" style={styles.emptyIcon} />
            <Title style={styles.emptyTitle}>No employees</Title>
            <Paragraph style={styles.emptyText}>This branch has no employees yet</Paragraph>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  summaryCard: { margin: 16, marginBottom: 8, elevation: 3, borderRadius: 16, backgroundColor: colors.primary },
  summaryTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  summaryText: { fontSize: 14, color: '#E3F2FD', marginTop: 4 },
  
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 3, borderRadius: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { marginRight: 16 },
  headerInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  roleChip: { alignSelf: 'flex-start' },
  roleText: { fontSize: 12, fontWeight: 'bold' },
  
  divider: { marginVertical: 12 },
  
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailIcon: { backgroundColor: colors.background, marginRight: 12 },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  detailValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  
  statusRow: { marginTop: 8 },
  statusChip: { alignSelf: 'flex-start' },
  
  empty: { alignItems: 'center', padding: 48 },
  emptyIcon: { backgroundColor: colors.background, marginBottom: 16 },
  emptyTitle: { fontSize: 18, color: colors.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: colors.textSecondary },
});
