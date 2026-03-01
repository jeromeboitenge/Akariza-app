import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, FAB, Chip, ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import { branchesApi } from '../api';
import { Branch } from '../types';

export default function OrganizationBranchesScreen({ route, navigation }: any) {
  const { orgId } = route.params;
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBranches = async () => {
    try {
      const data = await branchesApi.getByOrganization(orgId);
      setBranches(data);
    } catch (error) {
      console.error('Load branches error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, [orgId]);

  const renderBranch = ({ item }: { item: Branch }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Avatar.Icon 
            size={56} 
            icon="store" 
            style={[styles.avatar, { backgroundColor: item.isMainBranch ? '#4CAF50' : '#2196F3' }]} 
          />
          <View style={styles.headerContent}>
            <Title style={styles.branchName}>{item.name}</Title>
            <Paragraph style={styles.code}>Code: {item.code}</Paragraph>
            {item.isMainBranch && (
              <Chip icon="star" style={styles.mainChip} textStyle={styles.mainText}>
                Main Branch
              </Chip>
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Avatar.Icon size={20} icon="map-marker" style={styles.infoIcon} />
            <Paragraph style={styles.infoText}>{item.address}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Avatar.Icon size={20} icon="phone" style={styles.infoIcon} />
            <Paragraph style={styles.infoText}>{item.phone}</Paragraph>
          </View>
          {item.email && (
            <View style={styles.infoRow}>
              <Avatar.Icon size={20} icon="email" style={styles.infoIcon} />
              <Paragraph style={styles.infoText}>{item.email}</Paragraph>
            </View>
          )}
        </View>

        {item._count && (
          <View style={styles.statsRow}>
            <Chip icon="account-group" style={styles.statChip}>
              {item._count.employees || 0} Employees
            </Chip>
            <Chip icon="package-variant" style={styles.statChip}>
              {item._count.products || 0} Products
            </Chip>
          </View>
        )}
      </Card.Content>
    </Card>
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
      <FlatList
        data={branches}
        renderItem={renderBranch}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadBranches(); }} colors={['#1976D2']} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={80} icon="store" style={styles.emptyIcon} />
            <Title>No branches found</Title>
            <Paragraph style={styles.emptyText}>Add branches to this organization</Paragraph>
          </View>
        }
      />

      <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('NewBranch', { orgId })} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 4, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { marginRight: 16 },
  headerContent: { flex: 1 },
  branchName: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
  code: { fontSize: 13, color: '#757575', marginBottom: 6 },
  mainChip: { backgroundColor: '#4CAF50', alignSelf: 'flex-start' },
  mainText: { color: '#FFFFFF', fontWeight: 'bold' },
  divider: { marginVertical: 12 },
  infoContainer: { backgroundColor: '#F5F7FA', padding: 12, borderRadius: 8, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoIcon: { backgroundColor: '#1976D2', width: 20, height: 20, marginRight: 8 },
  infoText: { fontSize: 13, color: '#212121', flex: 1 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: { backgroundColor: '#E3F2FD' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#1976D2' },
  empty: { alignItems: 'center', padding: 48 },
  emptyIcon: { backgroundColor: '#E3F2FD', marginBottom: 16 },
  emptyText: { color: '#757575', marginTop: 8 },
});
