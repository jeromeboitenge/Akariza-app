import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Card, Title, Paragraph, FAB, Searchbar, Chip, ActivityIndicator, IconButton, Menu } from 'react-native-paper';
import { organizationsApi } from '../api';
import { Organization } from '../types';
import { safeFormatDate } from '../utils/formatters';
import { adminTheme } from '../theme/adminTheme';

export default function AdminOrganizationsScreen({ navigation }: any) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const loadOrganizations = async () => {
    try {
      const data = await organizationsApi.getAll();
      setOrganizations(data);
    } catch (error) {
      console.error('Load organizations error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const filteredOrgs = organizations.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (org: Organization) => {
    try {
      await organizationsApi.update(org.id, { isActive: !org.isActive });
      Alert.alert('Success', `Organization ${org.isActive ? 'deactivated' : 'activated'}`);
      loadOrganizations();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update organization');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await organizationsApi.delete(id);
              Alert.alert('Success', 'Organization deleted');
              loadOrganizations();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete');
            }
          },
        },
      ]
    );
  };

  const renderOrganization = ({ item }: { item: Organization }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.content}>
            <Title style={styles.orgName}>{item.name}</Title>
            <Paragraph style={styles.email}>{item.email}</Paragraph>
            <View style={styles.chipsRow}>
              <Chip 
                icon={item.isActive ? 'check-circle' : 'close-circle'} 
                style={[styles.statusChip, item.isActive ? styles.activeChip : styles.inactiveChip]}
                textStyle={styles.chipText}
              >
                {item.isActive ? 'Active' : 'Inactive'}
              </Chip>
              {item.subscriptionPlan && (
                <Chip icon="crown" style={styles.planChip} textStyle={styles.chipText}>
                  {item.subscriptionPlan}
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
            <Menu.Item onPress={() => { setMenuVisible(null); navigation.navigate('OrganizationBranches', { orgId: item.id }); }} title="View Branches" leadingIcon="store" />
            <Menu.Item onPress={() => { setMenuVisible(null); navigation.navigate('EditOrganization', { id: item.id }); }} title="Edit" leadingIcon="pencil" />
            <Menu.Item onPress={() => { setMenuVisible(null); handleToggleStatus(item); }} title={item.isActive ? 'Deactivate' : 'Activate'} leadingIcon={item.isActive ? 'close-circle' : 'check-circle'} />
            <Menu.Item onPress={() => { setMenuVisible(null); handleDelete(item.id); }} title="Delete" leadingIcon="delete" />
          </Menu>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Paragraph style={styles.statValue}>{item._count?.branches || 0}</Paragraph>
            <Paragraph style={styles.statLabel}>Branches</Paragraph>
          </View>
          <View style={styles.statItem}>
            <Paragraph style={styles.statValue}>{item._count?.employees || 0}</Paragraph>
            <Paragraph style={styles.statLabel}>Employees</Paragraph>
          </View>
          <View style={styles.statItem}>
            <Paragraph style={styles.statValue}>{item._count?.products || 0}</Paragraph>
            <Paragraph style={styles.statLabel}>Products</Paragraph>
          </View>
        </View>

        <Paragraph style={styles.date}>
          Joined: {safeFormatDate(item.createdAt, 'MMM dd, yyyy')}
        </Paragraph>
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

  const activeCount = filteredOrgs.filter(o => o.isActive).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerStats}>
          <View style={styles.headerStatItem}>
            <Title style={styles.headerStatValue}>{filteredOrgs.length}</Title>
            <Paragraph style={styles.headerStatLabel}>Total</Paragraph>
          </View>
          <View style={styles.headerStatItem}>
            <Title style={styles.headerStatValue}>{activeCount}</Title>
            <Paragraph style={styles.headerStatLabel}>Active</Paragraph>
          </View>
          <View style={styles.headerStatItem}>
            <Title style={styles.headerStatValue}>{filteredOrgs.length - activeCount}</Title>
            <Paragraph style={styles.headerStatLabel}>Inactive</Paragraph>
          </View>
        </View>
        
        <Searchbar
          placeholder="Search organizations..."
          onChangeText={setSearch}
          value={search}
          style={styles.search}
          iconColor={adminTheme.colors.primary}
        />
      </View>

      <FlatList
        data={filteredOrgs}
        renderItem={renderOrganization}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOrganizations(); }} colors={[adminTheme.colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Title style={styles.emptyTitle}>No organizations found</Title>
            <Paragraph style={styles.emptyText}>Add your first organization</Paragraph>
          </View>
        }
      />

      <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('NewOrganization')} color={adminTheme.colors.white} />
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
  headerStatValue: { fontSize: 28, fontWeight: 'bold', color: adminTheme.colors.primary },
  headerStatLabel: { fontSize: 12, color: adminTheme.colors.secondaryLight },
  search: { backgroundColor: adminTheme.colors.background },
  card: { 
    marginHorizontal: adminTheme.spacing.md, 
    marginVertical: adminTheme.spacing.sm, 
    elevation: adminTheme.elevation,
    borderRadius: adminTheme.borderRadius,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  content: { flex: 1 },
  orgName: { fontSize: 18, fontWeight: 'bold', color: adminTheme.colors.secondary },
  email: { fontSize: 13, color: adminTheme.colors.secondaryLight, marginTop: 4 },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  statusChip: {},
  activeChip: { backgroundColor: adminTheme.colors.successLight },
  inactiveChip: { backgroundColor: adminTheme.colors.background },
  planChip: { backgroundColor: adminTheme.colors.primaryLight },
  chipText: { fontSize: 11, fontWeight: 'bold' },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: adminTheme.spacing.md,
    paddingTop: adminTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: adminTheme.colors.background,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: adminTheme.colors.primary },
  statLabel: { fontSize: 11, color: adminTheme.colors.secondaryLight },
  date: { fontSize: 11, color: adminTheme.colors.secondaryLight, marginTop: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: adminTheme.colors.primary },
  empty: { alignItems: 'center', padding: 48 },
  emptyTitle: { fontSize: 18, color: adminTheme.colors.secondary, marginBottom: 8 },
  emptyText: { fontSize: 14, color: adminTheme.colors.secondaryLight },
});
