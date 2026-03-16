import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Card, ActivityIndicator, Chip, Divider, Surface, Text } from 'react-native-paper';
import { productsApi } from '../api';
import { safeFormatDate } from '../utils/formatters';

interface CostHistoryProps {
  route: {
    params: {
      productId: string;
      productName: string;
    };
  };
}

export default function ProductCostHistoryScreen({ route }: CostHistoryProps) {
  const { productId, productName } = route.params;
  const [history, setHistory] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [historyData, statsData] = await Promise.all([
        productsApi.getCostHistory(productId).catch(() => []),
        productsApi.getCostStatistics(productId).catch(() => null),
      ]);
      
      setHistory(Array.isArray(historyData) ? historyData : []);
      setStatistics(statsData);
    } catch (error) {
      console.error('Load cost data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C6BF2" />
        <Text style={styles.loadingText}>Loading cost data...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5C6BF2']} />}
    >
      <Text style={styles.title}>Cost Management</Text>
      <Text style={styles.subtitle}>{productName}</Text>

      {/* Cost Statistics */}
      {statistics ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Cost Analysis</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Current Cost (Average)</Text>
              <Text style={styles.statValue}>{statistics.currentAverageCost?.toLocaleString()} RWF</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Min Purchase Cost</Text>
              <Text style={[styles.statValue, styles.greenText]}>{statistics.minCost?.toLocaleString()} RWF</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Max Purchase Cost</Text>
              <Text style={[styles.statValue, styles.redText]}>{statistics.maxCost?.toLocaleString()} RWF</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Cost Variation</Text>
              <Chip 
                style={[styles.variationChip, statistics.costVariation > 100 && styles.highVariation]}
                textStyle={styles.chipText}
              >
                {statistics.costVariation?.toLocaleString()} RWF
              </Chip>
            </View>

            <Surface style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 The current cost is automatically calculated using weighted average of all purchases
              </Text>
            </Surface>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Content style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Cost Data</Text>
            <Text style={styles.emptyText}>
              No purchase data available for cost analysis. Cost statistics will appear after purchases are made.
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Purchase Statistics */}
      {statistics && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Purchase Data</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Recent Purchases</Text>
              <Text style={styles.statValue}>{statistics.recentPurchases}</Text>
            </View>
            
            {statistics.lastPurchase && (
              <>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Last Purchase</Text>
                  <Text style={styles.statValue}>
                    {safeFormatDate(statistics.lastPurchase.purchase.createdAt, 'MMM dd, yyyy')}
                  </Text>
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Last Cost</Text>
                  <Text style={styles.statValue}>{statistics.lastPurchase.costPrice?.toLocaleString()} RWF</Text>
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Supplier</Text>
                  <Text style={styles.statValue}>{statistics.lastPurchase.purchase.supplier?.name}</Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Cost History */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Cost Change History</Text>
          
          {history.length > 0 ? (
            <View style={styles.historyList}>
              {history.map((entry: any) => {
                const details = entry.details;
                const costChange = details?.costChange;
                const trigger = details?.trigger;
                const isIncrease = costChange?.difference > 0;

                return (
                  <View key={entry.id} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                      <View style={styles.historyLeft}>
                        <Text style={styles.historyTitle}>Cost Updated</Text>
                        <Chip 
                          style={styles.methodChip}
                          textStyle={styles.methodText}
                        >
                          {details?.calculation?.method || 'AUTO'}
                        </Chip>
                      </View>
                      <View style={styles.historyRight}>
                        <Text style={styles.historyDate}>
                          {safeFormatDate(entry.createdAt, 'MMM dd, yyyy')}
                        </Text>
                        <Text style={styles.historyTime}>
                          {safeFormatDate(entry.createdAt, 'HH:mm')}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.costChangeRow}>
                      <Text style={styles.costChangeText}>
                        {costChange?.from?.toLocaleString()} RWF → {costChange?.to?.toLocaleString()} RWF
                      </Text>
                      <Chip 
                        style={[styles.changeChip, isIncrease ? styles.increaseChip : styles.decreaseChip]}
                        textStyle={styles.changeText}
                      >
                        {isIncrease ? '+' : ''}{costChange?.difference?.toFixed(2)} RWF
                        ({costChange?.percentageChange}%)
                      </Chip>
                    </View>

                    {trigger && (
                      <Text style={styles.triggerText}>
                        Triggered by purchase: {trigger.purchaseQuantity} units at {trigger.purchaseCost?.toLocaleString()} RWF each
                      </Text>
                    )}

                    <Text style={styles.userText}>
                      Updated by: {entry.user?.name || 'System'}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Cost Changes</Text>
              <Text style={styles.emptyText}>
                No cost changes recorded yet. Cost changes will appear here when purchases update product costs.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: '#757575', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', margin: 16, marginBottom: 4, color: '#5C6BF2' },
  subtitle: { fontSize: 16, marginHorizontal: 16, marginBottom: 16, color: '#757575' },
  card: { marginHorizontal: 16, marginBottom: 16, elevation: 4, borderRadius: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#212121' },
  
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 14, color: '#757575', flex: 1 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#212121' },
  greenText: { color: '#4CAF50' },
  redText: { color: '#F44336' },
  
  divider: { marginVertical: 8 },
  
  variationChip: { backgroundColor: '#E3F2FD' },
  highVariation: { backgroundColor: '#FFEBEE' },
  chipText: { fontSize: 12, fontWeight: 'bold' },
  
  infoBox: { marginTop: 16, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 },
  infoText: { fontSize: 12, color: '#757575', textAlign: 'center' },
  
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { fontSize: 18, color: '#757575', marginBottom: 8, fontWeight: 'bold' },
  emptyText: { fontSize: 14, color: '#757575', textAlign: 'center', lineHeight: 20 },
  
  historyList: { gap: 16 },
  historyItem: { padding: 16, backgroundColor: '#FAFAFA', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#5C6BF2' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  historyLeft: { flex: 1 },
  historyRight: { alignItems: 'flex-end' },
  historyTitle: { fontSize: 16, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
  historyDate: { fontSize: 12, color: '#757575' },
  historyTime: { fontSize: 12, color: '#757575' },
  
  methodChip: { backgroundColor: '#E8F5E9', alignSelf: 'flex-start' },
  methodText: { fontSize: 10, color: '#4CAF50', fontWeight: 'bold' },
  
  costChangeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  costChangeText: { fontSize: 14, color: '#212121', flex: 1 },
  changeChip: { marginLeft: 8 },
  increaseChip: { backgroundColor: '#FFEBEE' },
  decreaseChip: { backgroundColor: '#E8F5E9' },
  changeText: { fontSize: 11, fontWeight: 'bold' },
  
  triggerText: { fontSize: 12, color: '#757575', marginBottom: 4 },
  userText: { fontSize: 11, color: '#757575', fontStyle: 'italic' },
});