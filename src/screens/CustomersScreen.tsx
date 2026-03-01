import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, Searchbar, Chip, ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import { customersApi } from '../api';
import { Customer } from '../types';
import { useDataStore } from '../store/dataStore';

export default function CustomersScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { customers, setCustomers } = useDataStore();

  const loadCustomers = async () => {
    try {
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Load customers error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) =>
    (c.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.phone || '').includes(search) ||
    (c.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'VIP': return '#5C6BF2';
      case 'WHOLESALE': return '#FF9800';
      default: return '#7B88F5';
    }
  };

  const renderCustomer = ({ item }: { item: Customer }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CustomerDetail', { customer: item })}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Avatar.Text 
              size={56} 
              label={item.name.substring(0, 2).toUpperCase()} 
              style={[styles.avatar, { backgroundColor: getCustomerTypeColor(item.customerType) }]} 
            />
            <View style={styles.headerContent}>
              <Title style={styles.customerName}>{item.name}</Title>
              <View style={styles.contactRow}>
                <Chip icon="phone" style={styles.contactChip} textStyle={styles.contactText}>
                  {item.phone}
                </Chip>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Paragraph style={styles.infoLabel}>Type</Paragraph>
              <Chip 
                style={[styles.typeChip, { backgroundColor: `${getCustomerTypeColor(item.customerType)}20` }]}
                textStyle={{ color: getCustomerTypeColor(item.customerType), fontWeight: 'bold' }}
              >
                {item.customerType}
              </Chip>
            </View>
            <View style={styles.infoItem}>
              <Paragraph style={styles.infoLabel}>Loyalty Points</Paragraph>
              <View style={styles.pointsContainer}>
                <Avatar.Icon size={32} icon="star" style={styles.pointsIcon} />
                <Title style={styles.pointsValue}>{item.loyaltyPoints}</Title>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Paragraph style={styles.statLabel}>Credit Limit</Paragraph>
              <Paragraph style={styles.statValue}>${item.creditLimit.toFixed(2)}</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statLabel}>Current Debt</Paragraph>
              <Paragraph style={[styles.statValue, item.currentDebt > 0 && styles.debtValue]}>
                ${item.currentDebt.toFixed(2)}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C6BF2" />
        <Paragraph style={styles.loadingText}>Loading customers...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search by name, phone, or email..."
          onChangeText={setSearch}
          value={search}
          style={styles.search}
          iconColor="#5C6BF2"
        />
        <View style={styles.statsRow}>
          <Chip icon="account-group" style={styles.statChip}>
            {filteredCustomers.length} Customers
          </Chip>
          <Chip icon="star" style={styles.statChip}>
            {filteredCustomers.filter(c => c.customerType === 'VIP').length} VIP
          </Chip>
        </View>
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { setRefreshing(true); loadCustomers(); }}
            colors={['#5C6BF2']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Avatar.Icon size={80} icon="account-group" style={styles.emptyIcon} />
            <Title style={styles.emptyTitle}>No customers found</Title>
            <Paragraph style={styles.emptyText}>
              {search ? 'Try adjusting your search' : 'Add your first customer to get started'}
            </Paragraph>
          </View>
        }
        contentContainerStyle={filteredCustomers.length === 0 ? styles.emptyContainer : undefined}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('NewCustomer')}
        color="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: '#757575' },
  header: { backgroundColor: '#FFFFFF', paddingBottom: 8, elevation: 2 },
  search: { margin: 16, marginBottom: 8, elevation: 0, backgroundColor: '#F5F7FA' },
  statsChipsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8 },
  statChip: { marginRight: 8, backgroundColor: '#E3F2FD' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 4, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { marginRight: 16 },
  headerContent: { flex: 1 },
  customerName: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 6 },
  contactRow: { flexDirection: 'row' },
  contactChip: { backgroundColor: '#E3F2FD' },
  contactText: { fontSize: 12 },
  divider: { marginVertical: 12 },
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  infoItem: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#757575', marginBottom: 6 },
  typeChip: { alignSelf: 'flex-start' },
  pointsContainer: { flexDirection: 'row', alignItems: 'center' },
  pointsIcon: { backgroundColor: '#FFD700', width: 32, height: 32, marginRight: 8 },
  pointsValue: { fontSize: 20, fontWeight: 'bold', color: '#FF9800' },
  statsRow: { flexDirection: 'row', backgroundColor: '#F5F7FA', padding: 12, borderRadius: 8 },
  statItem: { flex: 1 },
  statLabel: { fontSize: 11, color: '#757575', marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#212121' },
  debtValue: { color: '#F44336' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#5C6BF2' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { backgroundColor: '#E3F2FD', marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#757575', textAlign: 'center' },
});
