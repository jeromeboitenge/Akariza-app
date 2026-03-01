import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, Searchbar, Chip, ActivityIndicator, Avatar, Divider, Button } from 'react-native-paper';
import { organizationsApi } from '../api';
import { Organization } from '../types';
import { safeFormatDate } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';

export default function OrganizationsScreen({ navigation }: any) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'SYSTEM_ADMIN' || user?.role === 'BOSS';

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

  const getStatusColor = (isActive: boolean) => isActive ? '#4CAF50' : '#F44336';

  const renderOrganization = ({ item }: { item: Organization }) => (
    <TouchableOpacity onPress={() => navigation.navigate('OrganizationDetail', { id: item.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Avatar.Icon 
              size={64} 
              icon="domain" 
              style={[styles.avatar, { backgroundColor: getStatusColor(item.isActive) }]} 
            />
            <View style={styles.headerContent}>
              <Title style={styles.orgName}>{item.name}</Title>
              <Paragraph style={styles.email}>{item.email}</Paragraph>
              <View style={styles.statusRow}>
                <Chip 
                  icon={item.isActive ? 'check-circle' : 'close-circle'} 
                  style={[styles.statusChip, { backgroundColor: `${getStatusColor(item.isActive)}20` }]} 
                  textStyle={{ color: getStatusColor(item.isActive), fontWeight: 'bold' }}
                >
                  {item.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Chip>
                {item.subscriptionPlan && (
                  <Chip icon="crown" style={styles.planChip}>
                    {item.subscriptionPlan}
                  </Chip>
                )}
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Avatar.Icon size={32} icon="store" style={styles.statIcon} />
              <Paragraph style={styles.statLabel}>Branches</Paragraph>
              <Title style={styles.statValue}>{item._count?.branches || 0}</Title>
            </View>
            <View style={styles.statItem}>
              <Avatar.Icon size={32} icon="account-group" style={styles.statIcon} />
              <Paragraph style={styles.statLabel}>Employees</Paragraph>
              <Title style={styles.statValue}>{item._count?.employees || 0}</Title>
            </View>
            <View style={styles.statItem}>
              <Avatar.Icon size={32} icon="package-variant" style={styles.statIcon} />
              <Paragraph style={styles.statLabel}>Products</Paragraph>
              <Title style={styles.statValue}>{item._count?.products || 0}</Title>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoContainer}>
            {item.phone && (
              <View style={styles.infoRow}>
                <Avatar.Icon size={20} icon="phone" style={styles.infoIcon} />
                <Paragraph style={styles.infoText}>{item.phone}</Paragraph>
              </View>
            )}
            {item.address && (
              <View style={styles.infoRow}>
                <Avatar.Icon size={20} icon="map-marker" style={styles.infoIcon} />
                <Paragraph style={styles.infoText}>{item.address}</Paragraph>
              </View>
            )}
            <View style={styles.infoRow}>
              <Avatar.Icon size={20} icon="calendar" style={styles.infoIcon} />
              <Paragraph style={styles.infoText}>
                Joined: {safeFormatDate(item.createdAt, 'MMM dd, yyyy')}
              </Paragraph>
            </View>
          </View>

          {isAdmin && (
            <View style={styles.actions}>
              <Button 
                mode="outlined" 
                icon="store-plus" 
                onPress={() => navigation.navigate('OrganizationBranches', { orgId: item.id })}
                style={styles.actionButton}
              >
                Branches
              </Button>
              <Button 
                mode="outlined" 
                icon="pencil" 
                onPress={() => navigation.navigate('EditOrganization', { id: item.id })}
                style={styles.actionButton}
              >
                Edit
              </Button>
            </View>
          )}
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
          placeholder="Search organizations..."
          onChangeText={setSearch}
          value={search}
          style={styles.search}
          iconColor="#1976D2"
        />
        <View style={styles.statsRow}>
          <Chip icon="domain" style={styles.statChip}>
            {filteredOrgs.length} Organizations
          </Chip>
          <Chip icon="check-circle" style={[styles.statChip, { backgroundColor: '#E8F5E9' }]}>
            {filteredOrgs.filter(o => o.isActive).length} Active
          </Chip>
        </View>
      </View>

      <FlatList
        data={filteredOrgs}
        renderItem={renderOrganization}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOrganizations(); }} colors={['#1976D2']} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={80} icon="domain" style={styles.emptyIcon} />
            <Title>No organizations found</Title>
          </View>
        }
      />

      {isAdmin && (
        <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('NewOrganization')} color="#FFFFFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FFFFFF', padding: 16, elevation: 2 },
  search: { marginBottom: 12, backgroundColor: '#F5F7FA' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: { backgroundColor: '#E3F2FD' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 4, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { marginRight: 16 },
  headerContent: { flex: 1 },
  orgName: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
  email: { fontSize: 13, color: '#757575', marginBottom: 8 },
  statusRow: { flexDirection: 'row', gap: 8 },
  statusChip: {},
  planChip: { backgroundColor: '#FFF3E0' },
  divider: { marginVertical: 12 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 },
  statItem: { alignItems: 'center' },
  statIcon: { backgroundColor: '#1976D2', width: 32, height: 32, marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#757575', marginBottom: 2 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1976D2' },
  infoContainer: { backgroundColor: '#F5F7FA', padding: 12, borderRadius: 8, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoIcon: { backgroundColor: '#1976D2', width: 20, height: 20, marginRight: 8 },
  infoText: { fontSize: 13, color: '#212121', flex: 1 },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#1976D2' },
  empty: { alignItems: 'center', padding: 32 },
  emptyIcon: { backgroundColor: '#E3F2FD', marginBottom: 16 },
});
