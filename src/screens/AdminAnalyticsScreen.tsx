import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, Paragraph, DataTable, ActivityIndicator, Chip } from 'react-native-paper';
import { salesApi, productsApi, customersApi, analyticsApi } from '../api';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { adminTheme } from '../theme/adminTheme';
import { safeFormatDate } from '../utils/formatters';

const { width } = Dimensions.get('window');

export default function AdminAnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesData, productsData, customersData, analyticsData] = await Promise.all([
        salesApi.getAll(),
        productsApi.getAll(),
        customersApi.getAll(),
        analyticsApi.getDashboard(),
      ]);

      setSales(salesData);
      setProducts(productsData);
      setCustomers(customersData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Load analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={adminTheme.colors.primary} />
      </View>
    );
  }

  // Calculate metrics
  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel).length;

  // Sales by day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });
  const salesByDay = last7Days.map(date => {
    const dayStr = safeFormatDate(date, 'yyyy-MM-dd');
    return sales.filter(s => safeFormatDate(s.createdAt, 'yyyy-MM-dd') === dayStr)
      .reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  });

  // Top selling products
  const productSales = sales.reduce((acc: any, sale) => {
    sale.items?.forEach((item: any) => {
      if (!acc[item.productId]) {
        acc[item.productId] = { name: item.product?.name || 'Unknown', quantity: 0, revenue: 0 };
      }
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].revenue += item.quantity * item.price;
    });
    return acc;
  }, {});

  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5);

  // Customer segments
  const vipCustomers = customers.filter(c => c.type === 'VIP').length;
  const wholesaleCustomers = customers.filter(c => c.type === 'WHOLESALE').length;
  const regularCustomers = customers.filter(c => c.type === 'REGULAR').length;

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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Analytics & Reports</Title>
        <Paragraph style={styles.headerSubtitle}>Business Intelligence</Paragraph>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <Card style={[styles.metricCard, { backgroundColor: adminTheme.colors.primary }]}>
          <Card.Content>
            <Paragraph style={styles.metricLabel}>Total Revenue</Paragraph>
            <Title style={styles.metricValue}>${totalRevenue.toLocaleString()}</Title>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, { backgroundColor: adminTheme.colors.success }]}>
          <Card.Content>
            <Paragraph style={styles.metricLabel}>Total Profit</Paragraph>
            <Title style={styles.metricValue}>${totalProfit.toLocaleString()}</Title>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, { backgroundColor: adminTheme.colors.secondary }]}>
          <Card.Content>
            <Paragraph style={styles.metricLabel}>Avg Order Value</Paragraph>
            <Title style={styles.metricValue}>${avgOrderValue.toFixed(2)}</Title>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, { backgroundColor: adminTheme.colors.primary }]}>
          <Card.Content>
            <Paragraph style={styles.metricLabel}>Low Stock Items</Paragraph>
            <Title style={styles.metricValue}>{lowStockProducts}</Title>
          </Card.Content>
        </Card>
      </View>

      {/* Sales Trend */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Sales Trend (7 Days)</Title>
          <LineChart
            data={{
              labels: last7Days.map(d => format(d, 'EEE')),
              datasets: [{ data: salesByDay.length > 0 ? salesByDay : [0] }],
            }}
            width={width - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Top Products */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Top Selling Products</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Product</DataTable.Title>
              <DataTable.Title numeric>Qty</DataTable.Title>
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

      {/* Customer Segments */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Customer Segments</Title>
          <View style={styles.segmentsContainer}>
            <View style={styles.segmentItem}>
              <Chip icon="crown" style={[styles.segmentChip, { backgroundColor: adminTheme.colors.primaryLight }]}>
                VIP
              </Chip>
              <Title style={styles.segmentValue}>{vipCustomers}</Title>
            </View>
            <View style={styles.segmentItem}>
              <Chip icon="store" style={[styles.segmentChip, { backgroundColor: adminTheme.colors.successLight }]}>
                Wholesale
              </Chip>
              <Title style={styles.segmentValue}>{wholesaleCustomers}</Title>
            </View>
            <View style={styles.segmentItem}>
              <Chip icon="account" style={[styles.segmentChip, { backgroundColor: adminTheme.colors.background }]}>
                Regular
              </Chip>
              <Title style={styles.segmentValue}>{regularCustomers}</Title>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Inventory Status */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Inventory Status</Title>
          <View style={styles.inventoryGrid}>
            <View style={styles.inventoryItem}>
              <Paragraph style={styles.inventoryLabel}>Total Products</Paragraph>
              <Title style={styles.inventoryValue}>{products.length}</Title>
            </View>
            <View style={styles.inventoryItem}>
              <Paragraph style={styles.inventoryLabel}>In Stock</Paragraph>
              <Title style={[styles.inventoryValue, { color: adminTheme.colors.success }]}>
                {products.filter(p => p.currentStock > p.minStockLevel).length}
              </Title>
            </View>
            <View style={styles.inventoryItem}>
              <Paragraph style={styles.inventoryLabel}>Low Stock</Paragraph>
              <Title style={[styles.inventoryValue, { color: adminTheme.colors.error }]}>
                {lowStockProducts}
              </Title>
            </View>
            <View style={styles.inventoryItem}>
              <Paragraph style={styles.inventoryLabel}>Out of Stock</Paragraph>
              <Title style={[styles.inventoryValue, { color: adminTheme.colors.error }]}>
                {products.filter(p => p.currentStock === 0).length}
              </Title>
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
  metricsGrid: { 
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
  metricValue: { fontSize: 28, fontWeight: 'bold', color: adminTheme.colors.white, marginTop: 4 },
  card: { 
    margin: adminTheme.spacing.md, 
    elevation: adminTheme.elevation,
    borderRadius: adminTheme.borderRadius,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: adminTheme.colors.secondary, marginBottom: 12 },
  chart: { marginVertical: 8, borderRadius: adminTheme.borderRadius },
  segmentsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  segmentItem: { alignItems: 'center' },
  segmentChip: { marginBottom: 8 },
  segmentValue: { fontSize: 24, fontWeight: 'bold', color: adminTheme.colors.primary },
  inventoryGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: adminTheme.spacing.md,
    marginTop: 12,
  },
  inventoryItem: { 
    flex: 1, 
    minWidth: '45%',
    backgroundColor: adminTheme.colors.background,
    padding: adminTheme.spacing.md,
    borderRadius: adminTheme.borderRadius,
    alignItems: 'center',
  },
  inventoryLabel: { fontSize: 12, color: adminTheme.colors.secondaryLight, marginBottom: 4 },
  inventoryValue: { fontSize: 24, fontWeight: 'bold', color: adminTheme.colors.primary },
});
