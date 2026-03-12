import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Chip, Surface, Button } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { analyticsApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { hasPermission } from '../utils/permissions';
import { colors } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default function AdvancedAnalyticsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState(30);
  const [analytics, setAnalytics] = useState<any>({});
  const user = useAuthStore((state) => state.user);

  const canViewAnalytics = hasPermission(user, 'VIEW_ANALYTICS');

  useEffect(() => {
    if (canViewAnalytics) {
      loadAnalytics();
    }
  }, [period, canViewAnalytics]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [productPerf, salesTrends, customerAnalytics, inventoryAnalytics, profitAnalysis] = await Promise.all([
        analyticsApi.getProductPerformance(period),
        analyticsApi.getSalesTrends('daily', period),
        analyticsApi.getCustomerAnalytics(period),
        analyticsApi.getInventoryAnalytics(),
        analyticsApi.getProfitAnalysis(period),
      ]);

      setAnalytics({
        productPerformance: productPerf,
        salesTrends: salesTrends,
        customerAnalytics: customerAnalytics,
        inventoryAnalytics: inventoryAnalytics,
        profitAnalysis: profitAnalysis,
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  if (!canViewAnalytics) {
    return (
      <View style={styles.center}>
        <Title>Access Denied</Title>
        <Paragraph>You don't have permission to view analytics</Paragraph>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: colors.primary,
    backgroundGradientFrom: colors.primary,
    backgroundGradientTo: colors.secondary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Title style={styles.title}>Advanced Analytics</Title>
        <View style={styles.periodSelector}>
          {[7, 30, 90].map((days) => (
            <Chip
              key={days}
              selected={period === days}
              onPress={() => setPeriod(days)}
              style={styles.periodChip}
            >
              {days}d
            </Chip>
          ))}
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <Card style={styles.metricCard}>
          <Card.Content>
            <Title style={styles.metricValue}>
              {(analytics.profitAnalysis?.totalRevenue || 0).toLocaleString()} RWF
            </Title>
            <Paragraph style={styles.metricLabel}>Total Revenue</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.metricCard}>
          <Card.Content>
            <Title style={styles.metricValue}>
              {(analytics.profitAnalysis?.totalProfit || 0).toLocaleString()} RWF
            </Title>
            <Paragraph style={styles.metricLabel}>Total Profit</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.metricsContainer}>
        <Card style={styles.metricCard}>
          <Card.Content>
            <Title style={styles.metricValue}>
              {(analytics.profitAnalysis?.profitMargin || 0).toFixed(1)}%
            </Title>
            <Paragraph style={styles.metricLabel}>Profit Margin</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.metricCard}>
          <Card.Content>
            <Title style={styles.metricValue}>
              {analytics.inventoryAnalytics?.totalProducts || 0}
            </Title>
            <Paragraph style={styles.metricLabel}>Active Products</Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Sales Trends Chart */}
      {analytics.salesTrends && analytics.salesTrends.length > 0 && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Sales Trends</Title>
            <LineChart
              data={{
                labels: analytics.salesTrends.slice(-7).map((item: any) => 
                  new Date(item.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                ),
                datasets: [
                  {
                    data: analytics.salesTrends.slice(-7).map((item: any) => item.totalRevenue || 0),
                  },
                ],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      {/* Top Products */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Top Performing Products</Title>
          {(analytics.productPerformance || []).slice(0, 5).map((product: any, index: number) => (
            <View key={product.productId} style={styles.productItem}>
              <View style={styles.productRank}>
                <Paragraph style={styles.rankNumber}>{index + 1}</Paragraph>
              </View>
              <View style={styles.productInfo}>
                <Paragraph style={styles.productName}>{product.productName}</Paragraph>
                <Paragraph style={styles.productCategory}>{product.category}</Paragraph>
              </View>
              <View style={styles.productStats}>
                <Paragraph style={styles.productRevenue}>
                  {product.totalRevenue.toLocaleString()} RWF
                </Paragraph>
                <Paragraph style={styles.productQuantity}>
                  {product.quantitySold} sold
                </Paragraph>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Customer Analytics */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Top Customers</Title>
          {(analytics.customerAnalytics || []).slice(0, 5).map((customer: any, index: number) => (
            <View key={customer.customerId} style={styles.customerItem}>
              <View style={styles.customerRank}>
                <Paragraph style={styles.rankNumber}>{index + 1}</Paragraph>
              </View>
              <View style={styles.customerInfo}>
                <Paragraph style={styles.customerName}>{customer.customerName}</Paragraph>
                <Chip style={styles.customerTypeChip}>{customer.customerType}</Chip>
              </View>
              <View style={styles.customerStats}>
                <Paragraph style={styles.customerSpent}>
                  {customer.totalSpent.toLocaleString()} RWF
                </Paragraph>
                <Paragraph style={styles.customerOrders}>
                  {customer.transactionCount} orders
                </Paragraph>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Inventory Status */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Inventory Status</Title>
          <View style={styles.inventoryGrid}>
            <View style={styles.inventoryItem}>
              <Title style={styles.inventoryValue}>
                {analytics.inventoryAnalytics?.totalProducts || 0}
              </Title>
              <Paragraph style={styles.inventoryLabel}>Total Products</Paragraph>
            </View>
            <View style={styles.inventoryItem}>
              <Title style={[styles.inventoryValue, { color: colors.warning }]}>
                {analytics.inventoryAnalytics?.lowStockCount || 0}
              </Title>
              <Paragraph style={styles.inventoryLabel}>Low Stock</Paragraph>
            </View>
            <View style={styles.inventoryItem}>
              <Title style={[styles.inventoryValue, { color: colors.error }]}>
                {analytics.inventoryAnalytics?.outOfStockCount || 0}
              </Title>
              <Paragraph style={styles.inventoryLabel}>Out of Stock</Paragraph>
            </View>
            <View style={styles.inventoryItem}>
              <Title style={styles.inventoryValue}>
                {(analytics.inventoryAnalytics?.totalValue || 0).toLocaleString()} RWF
              </Title>
              <Paragraph style={styles.inventoryLabel}>Total Value</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Profit Analysis */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Profit Analysis</Title>
          <View style={styles.profitGrid}>
            <View style={styles.profitItem}>
              <Paragraph style={styles.profitLabel}>Total Revenue</Paragraph>
              <Title style={styles.profitValue}>
                {(analytics.profitAnalysis?.totalRevenue || 0).toLocaleString()} RWF
              </Title>
            </View>
            <View style={styles.profitItem}>
              <Paragraph style={styles.profitLabel}>Total Cost</Paragraph>
              <Title style={styles.profitValue}>
                {(analytics.profitAnalysis?.totalCost || 0).toLocaleString()} RWF
              </Title>
            </View>
            <View style={styles.profitItem}>
              <Paragraph style={styles.profitLabel}>Total Profit</Paragraph>
              <Title style={[styles.profitValue, { color: colors.success }]}>
                {(analytics.profitAnalysis?.totalProfit || 0).toLocaleString()} RWF
              </Title>
            </View>
            <View style={styles.profitItem}>
              <Paragraph style={styles.profitLabel}>Profit Margin</Paragraph>
              <Title style={styles.profitValue}>
                {(analytics.profitAnalysis?.profitMargin || 0).toFixed(1)}%
              </Title>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  periodSelector: { flexDirection: 'row', gap: 8 },
  periodChip: { minWidth: 50 },
  
  metricsContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
  metricCard: { flex: 1, elevation: 2, borderRadius: 12 },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  metricLabel: { fontSize: 12, color: colors.textSecondary },
  
  chartCard: { marginHorizontal: 16, marginBottom: 16, elevation: 4, borderRadius: 16 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: colors.primary },
  chart: { marginVertical: 8, borderRadius: 16 },
  
  card: { marginHorizontal: 16, marginBottom: 16, elevation: 2, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: colors.primary },
  
  productItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  productRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankNumber: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  productInfo: { flex: 1 },
  productName: { fontWeight: 'bold', fontSize: 14 },
  productCategory: { fontSize: 12, color: colors.textSecondary },
  productStats: { alignItems: 'flex-end' },
  productRevenue: { fontWeight: 'bold', fontSize: 14, color: colors.success },
  productQuantity: { fontSize: 12, color: colors.textSecondary },
  
  customerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  customerRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  customerInfo: { flex: 1 },
  customerName: { fontWeight: 'bold', fontSize: 14 },
  customerTypeChip: { alignSelf: 'flex-start', marginTop: 4 },
  customerStats: { alignItems: 'flex-end' },
  customerSpent: { fontWeight: 'bold', fontSize: 14, color: colors.primary },
  customerOrders: { fontSize: 12, color: colors.textSecondary },
  
  inventoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  inventoryItem: { flex: 1, minWidth: '45%', alignItems: 'center', padding: 16, backgroundColor: '#F8F9FA', borderRadius: 8 },
  inventoryValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  inventoryLabel: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  
  profitGrid: { gap: 12 },
  profitItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  profitLabel: { fontSize: 14, color: colors.textSecondary },
  profitValue: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
});