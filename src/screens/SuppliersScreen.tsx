import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, Searchbar, Chip, ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import { suppliersApi } from '../api';
import { Supplier } from '../types';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';

export default function SuppliersScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { suppliers, setSuppliers } = useDataStore();
  const user = useAuthStore((state) => state.user);
  const canManage = user?.role === 'BOSS' || user?.role === 'MANAGER';

  const loadSuppliers = async () => {
    try {
      const data = await suppliersApi.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Load suppliers error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  );

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#4CAF50';
    if (rating >= 3) return '#FF9800';
    return '#F44336';
  };

  const renderSupplier = ({ item }: { item: Supplier }) => (
    <TouchableOpacity>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Avatar.Icon size={56} icon="truck" style={styles.avatar} />
            <View style={styles.headerContent}>
              <Title style={styles.supplierName}>{item.name}</Title>
              <Paragraph style={styles.contactPerson}>Contact: {item.contactPerson}</Paragraph>
              <Chip icon="phone" style={styles.phoneChip} textStyle={styles.chipText}>
                {item.phone}
              </Chip>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Paragraph style={styles.infoLabel}>Rating</Paragraph>
              <View style={styles.ratingContainer}>
                <Avatar.Icon size={32} icon="star" style={[styles.ratingIcon, { backgroundColor: getRatingColor(item.rating) }]} />
                <Title style={[styles.ratingValue, { color: getRatingColor(item.rating) }]}>{item.rating.toFixed(1)}</Title>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Paragraph style={styles.infoLabel}>Credit Limit</Paragraph>
              <Title style={styles.creditValue}>${item.creditLimit.toFixed(2)}</Title>
            </View>
          </View>

          {item.paymentTerms && (
            <Chip icon="calendar" style={styles.termsChip}>
              {item.paymentTerms}
            </Chip>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C6BF2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search suppliers..."
          onChangeText={setSearch}
          value={search}
          style={styles.search}
          iconColor="#5C6BF2"
        />
        <Chip icon="truck" style={styles.statChip}>
          {filteredSuppliers.length} Suppliers
        </Chip>
      </View>

      <FlatList
        data={filteredSuppliers}
        renderItem={renderSupplier}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadSuppliers(); }} colors={['#5C6BF2']} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Avatar.Icon size={80} icon="truck" style={styles.emptyIcon} />
            <Title>No suppliers found</Title>
          </View>
        }
      />

      {canManage && (
        <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('NewSupplier')} color="#FFFFFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FFFFFF', padding: 16, elevation: 2 },
  search: { marginBottom: 8, backgroundColor: '#F5F7FA' },
  statChip: { backgroundColor: '#E3F2FD', alignSelf: 'flex-start' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 4, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { backgroundColor: '#FF9800', marginRight: 16 },
  headerContent: { flex: 1 },
  supplierName: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
  contactPerson: { fontSize: 13, color: '#757575', marginBottom: 6 },
  phoneChip: { backgroundColor: '#E3F2FD', alignSelf: 'flex-start' },
  chipText: { fontSize: 12 },
  divider: { marginVertical: 12 },
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  infoItem: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#757575', marginBottom: 6 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingIcon: { width: 32, height: 32, marginRight: 8 },
  ratingValue: { fontSize: 20, fontWeight: 'bold' },
  creditValue: { fontSize: 20, fontWeight: 'bold', color: '#5C6BF2' },
  termsChip: { backgroundColor: '#E8F5E9', alignSelf: 'flex-start' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#5C6BF2' },
  empty: { alignItems: 'center', padding: 32 },
  emptyIcon: { backgroundColor: '#E3F2FD', marginBottom: 16 },
});
