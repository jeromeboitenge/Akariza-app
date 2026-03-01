import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator, Chip, Avatar, Divider } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { analyticsApi } from '../api';
import { DashboardStats } from '../types';
import { useAuthStore } from '../store/authStore';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);

  const loadDashboard = async () => {
    try {
      const [statsData, trendsData] = await Promise.all([
        analyticsApi.getDashboard(),
        analyticsApi.getSalesTrends('daily').catch(() => null),
      ]);
      setStats(statsData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#1976D2',
    backgroundGradientFrom: '#1976D2',
    backgroundGradientTo: '#42A5F5',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '6', strokeWidth: '2', stroke: '#fff' },
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1976D2']} />}
    >
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <View>
              <Title style={styles.welcomeText}>Welcome back,</Title>
              <Title style={styles.userName}>{user?.fullName}</Title>
              <Chip icon="shield-account" style={styles.roleChip}>{user?.role}</Chip>
            </View>
            <Avatar.Text size={60} label={user?.fullName?.charAt(0) || 'A'} style={styles.avatar} />
          </View>
        </Card.Content>
      </Card>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <Card style={[styles.metricCard, styles.salesCard]}>
          <Card.Content>
            <Avatar.Icon size={48} icon="cash-multiple" style={styles.metricIcon} />
            <Title style={styles.metricValue}>${stats?.todaySales?.toFixed(2) || '0.00'}</Title>
            <Paragraph style={styles.metricLabel}>Today's Sales</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, styles.profitCard]}>
          <Card.Content>
            <Avatar.Icon size={48} icon="trending-up" style={styles.metricIcon} />
            <Title style={styles.metricValue}>${stats?.todayProfit?.toFixed(2) || '0.00'}</Title>
            <Paragraph style={styles.metricLabel}>Today's Profit</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.metricsContainer}>
        <Card style={[styles.metricCard, styles.transactionsCard]}>
          <Card.Content>
            <Avatar.Icon size={48} icon="receipt" style={styles.metricIcon} />
            <Title style={styles.metricValue}>{stats?.todayTransactions || 0}</Title>
            <Paragraph style={styles.metricLabel}>Transactions</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, styles.productsCard]}>
          <Card.Content>
            <Avatar.Icon size={48} icon="package-variant" style={styles.metricIcon} />
            <Title style={styles.metricValue}>{stats?.totalProducts || 0}</Title>
            <Paragraph style={styles.metricLabel}>Products</Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Sales Trend Chart */}
      {trends && trends.data && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Sales Trend (Last 7 Days)</Title>
            <LineChart
              data={{
                labels: trends.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: trends.data || [0, 0, 0, 0, 0, 0, 0] }],
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

      {/* Alerts */}
      {stats && stats.lowStockCount > 0 && (
        <Card style={styles.alertCard}>
          <Card.Content>
            <View style={styles.alertRow}>
              <Avatar.Icon size={48} icon="alert" style={styles.alertIcon} />
              <View style={styles.alertContent}>
                <Title style={styles.alertTitle}>Low Stock Alert</Title>
                <Paragraph style={styles.alertText}>
                  {stats.lowStockCount} products need reordering
                </Paragraph>
              </View>
            </View>
            <Button mode="contained" onPress={() => navigation.navigate('Products')} style={styles.alertButton}>
              View Products
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.actionGrid}>
            <Button
              mode="contained"
              icon="cart-plus"
              onPress={() => navigation.navigate('NewSale')}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              New Sale
            </Button>
            
            <Button
              mode="outlined"
              icon="package-variant"
              onPress={() => navigation.navigate('Products')}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Products
            </Button>
          </View>

          <View style={styles.actionGrid}>
            <Button
              mode="outlined"
              icon="account-group"
              onPress={() => navigation.navigate('Customers')}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Customers
            </Button>
            
            <Button
              mode="outlined"
              icon="chart-line"
              onPress={() => navigation.navigate('Sales')}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Sales
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Stats Overview */}
      <Card style={styles.overviewCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Overview</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.overviewRow}>
            <Chip icon="account-group" style={styles.overviewChip}>
              {stats?.totalCustomers || 0} Customers
            </Chip>
            <Chip icon="bell" style={styles.overviewChip}>
              {stats?.unreadMessages || 0} Messages
            </Chip>
          </View>
          
          <View style={styles.overviewRow}>
            <Chip icon="clipboard-list" style={styles.overviewChip}>
              {stats?.pendingTasks || 0} Tasks
            </Chip>
            <Chip icon="alert-circle" style={styles.overviewChip}>
              {stats?.lowStockCount || 0} Low Stock
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  headerCard: { margin: 16, marginBottom: 8, elevation: 4, borderRadius: 16, backgroundColor: '#1976D2' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 16, color: '#E3F2FD', marginBottom: 4 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  roleChip: { backgroundColor: '#42A5F5', alignSelf: 'flex-start' },
  avatar: { backgroundColor: '#42A5F5' },
  
  metricsContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8 },
  metricCard: { flex: 1, marginHorizontal: 4, elevation: 4, borderRadius: 12, padding: 8 },
  salesCard: { backgroundColor: '#4CAF50' },
  profitCard: { backgroundColor: '#2196F3' },
  transactionsCard: { backgroundColor: '#FF9800' },
  productsCard: { backgroundColor: '#9C27B0' },
  metricIcon: { backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 8 },
  metricValue: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  metricLabel: { fontSize: 12, color: '#FFFFFF', opacity: 0.9 },
  
  chartCard: { margin: 16, marginBottom: 8, elevation: 4, borderRadius: 16 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', color: '#1976D2', marginBottom: 16 },
  chart: { marginVertical: 8, borderRadius: 16 },
  
  alertCard: { margin: 16, marginBottom: 8, elevation: 4, borderRadius: 16, backgroundColor: '#FFF3E0', borderLeftWidth: 6, borderLeftColor: '#FF9800' },
  alertRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  alertIcon: { backgroundColor: '#FFE0B2', marginRight: 16 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 18, fontWeight: 'bold', color: '#E65100', marginBottom: 4 },
  alertText: { fontSize: 14, color: '#F57C00' },
  alertButton: { borderRadius: 8, backgroundColor: '#FF9800' },
  
  actionsCard: { margin: 16, marginBottom: 8, elevation: 4, borderRadius: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1976D2', marginBottom: 8 },
  divider: { marginBottom: 16 },
  actionGrid: { flexDirection: 'row', marginBottom: 12 },
  actionButton: { flex: 1, marginHorizontal: 4, borderRadius: 8 },
  actionButtonContent: { paddingVertical: 8 },
  
  overviewCard: { margin: 16, marginBottom: 8, elevation: 4, borderRadius: 16 },
  overviewRow: { flexDirection: 'row', marginBottom: 12 },
  overviewChip: { flex: 1, marginHorizontal: 4, backgroundColor: '#E3F2FD' },
  
  footer: { height: 24 },
});
