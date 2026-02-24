import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { useSyncStore } from '../store/syncStore';
import { SyncService } from '../services/syncService';

export default function DashboardScreen({ navigation }: any) {
  const user = useAuthStore(state => state.user);
  const { isSyncing, lastSyncTime, pendingSalesCount } = useSyncStore();
  const [stats, setStats] = useState({ totalProducts: 0, lowStock: 0 });

  useEffect(() => {
    SyncService.getInstance().startAutoSync();
  }, []);

  const handleSync = async () => {
    await SyncService.getInstance().syncAll();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Welcome, {user?.fullName}</Title>
        <Text>Role: {user?.role}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Sync Status</Title>
          <Paragraph>
            {isSyncing ? 'Syncing...' : 'Ready'}
          </Paragraph>
          <Paragraph>
            Pending Sales: {pendingSalesCount}
          </Paragraph>
          {lastSyncTime && (
            <Paragraph>
              Last Sync: {new Date(lastSyncTime).toLocaleString()}
            </Paragraph>
          )}
          <Button mode="outlined" onPress={handleSync} disabled={isSyncing}>
            Sync Now
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.grid}>
        {(user?.role === 'BOSS' || user?.role === 'MANAGER' || user?.role === 'CASHIER') && (
          <Card style={styles.gridCard} onPress={() => navigation.navigate('Sales')}>
            <Card.Content>
              <Title>Sales</Title>
              <Paragraph>Record new sale</Paragraph>
            </Card.Content>
          </Card>
        )}

        {(user?.role === 'BOSS' || user?.role === 'MANAGER') && (
          <Card style={styles.gridCard} onPress={() => navigation.navigate('Products')}>
            <Card.Content>
              <Title>Products</Title>
              <Paragraph>Manage inventory</Paragraph>
            </Card.Content>
          </Card>
        )}

        {(user?.role === 'BOSS' || user?.role === 'MANAGER') && (
          <Card style={styles.gridCard} onPress={() => navigation.navigate('Purchases')}>
            <Card.Content>
              <Title>Purchases</Title>
              <Paragraph>Record purchases</Paragraph>
            </Card.Content>
          </Card>
        )}

        {user?.role === 'BOSS' && (
          <Card style={styles.gridCard} onPress={() => navigation.navigate('Reports')}>
            <Card.Content>
              <Title>Reports</Title>
              <Paragraph>View analytics</Paragraph>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 20,
    backgroundColor: '#fff'
  },
  card: {
    margin: 15
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10
  },
  gridCard: {
    width: '47%',
    margin: '1.5%'
  }
});
