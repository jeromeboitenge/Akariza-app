import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, FAB, Chip, ActivityIndicator, Avatar } from 'react-native-paper';
import { branchesApi } from '../api';
import { Branch } from '../types';
import { useAuthStore } from '../store/authStore';

export default function BranchesScreen({ navigation }: any) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const canManage = user?.role === 'BOSS';

  const loadBranches = async () => {
    try {
      const data = await branchesApi.getAll();
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
  }, []);

  const renderBranch = ({ item }: { item: Branch }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Avatar.Icon size={56} icon="store" style={[styles.avatar, { backgroundColor: item.isMainBranch ? '#4CAF50' : '#2196F3' }]} />
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

        <View style={styles.infoContainer}>
          <Paragraph style={styles.infoText}>📍 {item.address}</Paragraph>
          <Paragraph style={styles.infoText}>📞 {item.phone}</Paragraph>
          {item.email && <Paragraph style={styles.infoText}>✉️ {item.email}</Paragraph>}
        </View>
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
      />

      {canManage && (
        <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('NewBranch')} color="#FFFFFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 4, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { marginRight: 16 },
  headerContent: { flex: 1 },
  branchName: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
  code: { fontSize: 13, color: '#757575', marginBottom: 8 },
  mainChip: { backgroundColor: '#4CAF50', alignSelf: 'flex-start' },
  mainText: { color: '#FFFFFF', fontWeight: 'bold' },
  infoContainer: { backgroundColor: '#F5F7FA', padding: 12, borderRadius: 8 },
  infoText: { fontSize: 14, color: '#212121', marginBottom: 4 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#1976D2' },
});
