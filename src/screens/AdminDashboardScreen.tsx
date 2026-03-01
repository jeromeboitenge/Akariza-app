import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, DataTable, ActivityIndicator } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { analyticsApi, organizationsApi, salesApi, productsApi } from '../api';
import { adminTheme } from '../theme/adminTheme';
import { safeFormatDate } from '../utils/formatters';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesTrend, setSalesTrend] = useState<any>({ labels: [], data: [] });

  const loadData = async () => {
    try {
      const [statsData, orgsData, salesData, productsData] = await Promise.all([
        analyticsApi.getDashboard(),
        organizationsApi.getAll(),
        salesApi.getAll(),
        productsApi.getAll(),
      ]);

      setStats(statsData || {});
      setOrganizations(orgsData || []);
      setRecentSales((salesData || []).slice(0, 10));
      
      // Calculate top products
      const productSales = (salesData || []).reduce((acc: any, sale: any) => {
        sale.items?.forEach((item: any) => {
          if (!acc[item.productId]) {
            acc[item.productId] = { name: item.product?.name || 'Unknown', quantity: 0, revenue: 0 };
          }
          acc[item.productId].quantity += item.quantity;
          acc[item.productId].revenue += item.quantity * item.price;
        });
        return acc;
      }, {});
      
      const topProds = Object.values(productSales)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5);
      setTopProducts(topProds);

      // Calculate sales trend (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
      });

      const trendData = last7Days.map(date => {
        const dayStr = safeFormatDate(date, 'yyyy-MM-dd');
        const daySales = (salesData || []).filter((s: any) => {
          try {
            if (!s.createdAt) return false;
            return safeFormatDate(s.createdAt, 'yyyy-MM-dd') === dayStr;
          } catch {
            return false;
          }
        });
        return daySales.reduce((sum: number, s: any) => sum + (s.totalAmount || 0), 0);
      });

      setSalesTrend({
        labels: last7Days.map(d => safeFormatDate(d, 'EEE')),
        data: trendData.length > 0 ? trendData : [0, 0, 0, 0, 0, 0, 0],
      });

    } catch (error) {
      console.error('Load admin data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={adminTheme.colors.primary} />
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: adminTheme.colors.white,
    backgroundGradientFrom: adminTheme.colors.white,
    backgroundGradientTo: adminTheme.colors.white,
    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 0,
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Admin Dashboard</Title>
        <Paragraph style={styles.headerSubtitle}>System Overview</Paragraph>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <Card style={[styles.metricCard, { backgroundColor: adminTheme.colors.primary }]}>
          <Card.Content>
            <Paragraph style={styles.metricLabel}>Total Organizations</Paragraph>
            <Title style={styles.metricValue}>{organizations.length}</Title>
            <Paragraph style={styles.metricSubtext}>
              {organizations.filter(o => o.isActive).length} Active
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, { backgroundColor: adminTheme.colors.success }]}>
          <Card.Content>
            <Paragraph style={styles.metricLabel}>Total Revenue</Paragraph>
            <Title style={styles.metricValue}>
              ${(stats.totalRevenue || 0).toLocaleString()}
            </Title>
            <Paragraph style={styles.metricSubtext}>All time</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, { backgroundColor: adminTheme.colors.secondary }]}>
          <Card.Content>
            <Paragraph style={styles.metricLabel}>Total Sales</Paragraph>
            <Title style={styles.metricValue}>{recentSales.length}</Title>
            <Paragraph style={styles.metricSubtext}>Transactions</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, { backgroundColor: adminTheme.colors.primary }]}>
          <Card.Content>
            <Paragraph style={styles.metricLabel}>Active Users</Paragraph>
            <Title style={styles.metricValue}>
              {organizations.reduce((sum, o) => sum + (o._count?.employees || 0), 0)}
            </Title>
            <Paragraph style={styles.metricSubtext}>Employees</Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Sales Trend Chart */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Sales Trend (7 Days)</Title>
          {salesTrend.data.length > 0 && (
            <LineChart
              data={{
                labels: salesTrend.labels,
                datasets: [{ data: salesTrend.data }],
              }}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </Card.Content>
      </Card>

      {/* Organizations Overview */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Organizations Overview</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title numeric>Branches</DataTable.Title>
              <DataTable.Title numeric>Employees</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>

            {organizations.slice(0, 5).map((org) => (
              <DataTable.Row key={org.id}>
                <DataTable.Cell>{org.name}</DataTable.Cell>
                <DataTable.Cell numeric>{org._count?.branches || 0}</DataTable.Cell>
                <DataTable.Cell numeric>{org._count?.employees || 0}</DataTable.Cell>
                <DataTable.Cell>
                  <View style={[styles.statusBadge, org.isActive ? styles.statusActive : styles.statusInactive]}>
                    <Paragraph style={styles.statusText}>
                      {org.isActive ? 'Active' : 'Inactive'}
                    </Paragraph>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Top Products */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Top Products by Revenue</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Product</DataTable.Title>
              <DataTable.Title numeric>Quantity</DataTable.Title>
              <DataTable.Title numeric>Revenue</DataTable.Title>
            </DataTable.Header>

            {topProducts.map((product: any, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{product.name}</DataTable.Cell>
                <DataTable.Cell numeric>{product.quantity}</DataTable.Cell>
                <DataTable.Cell numeric>${product.revenue.toFixed(2)}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Recent Sales */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Recent Sales</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Customer</DataTable.Title>
              <DataTable.Title numeric>Amount</DataTable.Title>
            </DataTable.Header>

            {recentSales.slice(0, 5).map((sale) => (
              <DataTable.Row key={sale.id}>
                <DataTable.Cell>
                  {safeFormatDate(sale.createdAt, 'MMM dd')}
                </DataTable.Cell>
                <DataTable.Cell>{sale.customer?.name || 'Walk-in'}</DataTable.Cell>
                <DataTable.Cell numeric>${sale.totalAmount?.toFixed(2)}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      {/* System Health */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>System Health</Title>
          <View style={styles.healthContainer}>
            <View style={styles.healthItem}>
              <Paragraph style={styles.healthLabel}>Database</Paragraph>
              <View style={[styles.healthIndicator, styles.healthGood]} />
              <Paragraph style={styles.healthStatus}>Operational</Paragraph>
            </View>
            <View style={styles.healthItem}>
              <Paragraph style={styles.healthLabel}>API</Paragraph>
              <View style={[styles.healthIndicator, styles.healthGood]} />
              <Paragraph style={styles.healthStatus}>Operational</Paragraph>
            </View>
            <View style={styles.healthItem}>
              <Paragraph style={styles.healthLabel}>Storage</Paragraph>
              <View style={[styles.healthIndicator, styles.healthGood]} />
              <Paragraph style={styles.healthStatus}>Operational</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: adminTheme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    backgroundColor: adminTheme.colors.primary, 
    padding: adminTheme.spacing.lg,
    elevation: adminTheme.elevation,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: adminTheme.colors.white },
  headerSubtitle: { fontSize: 14, color: adminTheme.colors.primaryLight, marginTop: 4 },
  metricsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    padding: adminTheme.spacing.md,
    gap: adminTheme.spacing.md,
  },
  metricCard: { 
    flex: 1, 
    minWidth: '45%',
    elevation: adminTheme.elevation,
    borderRadius: adminTheme.borderRadius,
  },
  metricLabel: { fontSize: 12, color: adminTheme.colors.white, opacity: 0.9 },
  metricValue: { fontSize: 32, fontWeight: 'bold', color: adminTheme.colors.white, marginVertical: 4 },
  metricSubtext: { fontSize: 11, color: adminTheme.colors.white, opacity: 0.8 },
  card: { 
    margin: adminTheme.spacing.md, 
    elevation: adminTheme.elevation,
    borderRadius: adminTheme.borderRadius,
    backgroundColor: adminTheme.colors.white,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: adminTheme.colors.secondary, marginBottom: 12 },
  chart: { marginVertical: 8, borderRadius: adminTheme.borderRadius },
  statusBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusActive: { backgroundColor: adminTheme.colors.successLight },
  statusInactive: { backgroundColor: adminTheme.colors.background },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  healthContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  healthItem: { alignItems: 'center' },
  healthLabel: { fontSize: 12, color: adminTheme.colors.secondaryLight, marginBottom: 8 },
  healthIndicator: { width: 12, height: 12, borderRadius: 6, marginBottom: 4 },
  healthGood: { backgroundColor: adminTheme.colors.success },
  healthStatus: { fontSize: 11, color: adminTheme.colors.secondary },
});
