import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator, Chip, Avatar, Divider, Surface, Text } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { analyticsApi } from '../api';
import { DashboardStats } from '../types';
import { useAuthStore } from '../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';

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

  const renderHeader = () => (
    <LinearGradient colors={['#1976D2', '#1565C0', '#0D47A1']} style={styles.headerGradient}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</Text>
            <Title style={styles.userName}>{user?.fullName}</Title>
            <Chip icon="shield-account" textStyle={styles.roleText} style={styles.roleChip}>{user?.role}</Chip>
          </View>
          <Avatar.Text size={64} label={user?.fullName?.charAt(0) || 'A'} style={styles.avatar} labelStyle={styles.avatarLabel} />
        </View>
      </View>
    </LinearGradient>
  );

  const renderMetricCard = (icon: string, value: string, label: string, color: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.metricCard} onPress={onPress} activeOpacity={0.7}>
      <LinearGradient colors={[color, color + 'DD']} style={styles.metricGradient}>
        <Avatar.Icon size={44} icon={icon} style={styles.metricIcon} color="#FFF" />
        <Title style={styles.metricValue}>{value}</Title>
        <Paragraph style={styles.metricLabel}>{label}</Paragraph>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCashierDashboard = () => (
    <>
      <View style={styles.metricsGrid}>
        {renderMetricCard('cash-register', `$${stats?.todaySales?.toFixed(2) || '0.00'}`, "Today's Sales", '#4CAF50')}
        {renderMetricCard('receipt', `${stats?.todayTransactions || 0}`, 'Transactions', '#FF9800')}
      </View>
      <View style={styles.metricsGrid}>
        {renderMetricCard('account-group', `${stats?.totalCustomers || 0}`, 'Customers', '#2196F3', () => navigation.navigate('Customers'))}
        {renderMetricCard('package-variant', `${stats?.totalProducts || 0}`, 'Products', '#5C6BF2', () => navigation.navigate('Products'))}
      </View>

      <Card style={styles.actionCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Quick Actions</Title>
          <Button mode="contained" icon="cart-plus" onPress={() => navigation.navigate('NewSale')} style={styles.primaryButton}>
            New Sale
          </Button>
          <Button mode="outlined" icon="account-plus" onPress={() => navigation.navigate('NewCustomer')} style={styles.secondaryButton}>
            Add Customer
          </Button>
        </Card.Content>
      </Card>
    </>
  );

  const renderManagerDashboard = () => (
    <>
      <View style={styles.metricsGrid}>
        {renderMetricCard('cash-multiple', `$${stats?.todaySales?.toFixed(2) || '0.00'}`, "Today's Sales", '#4CAF50')}
        {renderMetricCard('trending-up', `$${stats?.todayProfit?.toFixed(2) || '0.00'}`, "Today's Profit", '#2196F3')}
      </View>
      <View style={styles.metricsGrid}>
        {renderMetricCard('receipt', `${stats?.todayTransactions || 0}`, 'Transactions', '#FF9800')}
        {renderMetricCard('alert-circle', `${stats?.lowStockCount || 0}`, 'Low Stock', '#F44336')}
      </View>

      {trends && trends.data && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Sales Trend (7 Days)</Title>
            <LineChart
              data={{
                labels: trends.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: trends.data || [0, 0, 0, 0, 0, 0, 0] }],
              }}
              width={screenWidth - 64}
              height={200}
              chartConfig={{
                backgroundColor: '#1976D2',
                backgroundGradientFrom: '#1976D2',
                backgroundGradientTo: '#42A5F5',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.actionCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Management</Title>
          <View style={styles.buttonRow}>
            <Button mode="contained" icon="package-variant" onPress={() => navigation.navigate('Products')} style={styles.halfButton}>
              Products
            </Button>
            <Button mode="contained" icon="truck" onPress={() => navigation.navigate('Suppliers')} style={styles.halfButton}>
              Suppliers
            </Button>
          </View>
          <View style={styles.buttonRow}>
            <Button mode="outlined" icon="cash-minus" onPress={() => navigation.navigate('Expenses')} style={styles.halfButton}>
              Expenses
            </Button>
            <Button mode="outlined" icon="chart-bar" onPress={() => navigation.navigate('Reports')} style={styles.halfButton}>
              Reports
            </Button>
          </View>
        </Card.Content>
      </Card>
    </>
  );

  const renderBossDashboard = () => (
    <>
      <View style={styles.metricsGrid}>
        {renderMetricCard('cash-multiple', `$${stats?.todaySales?.toFixed(2) || '0.00'}`, "Today's Sales", '#4CAF50')}
        {renderMetricCard('trending-up', `$${stats?.todayProfit?.toFixed(2) || '0.00'}`, "Today's Profit", '#2196F3')}
      </View>
      <View style={styles.metricsGrid}>
        {renderMetricCard('receipt', `${stats?.todayTransactions || 0}`, 'Transactions', '#FF9800')}
        {renderMetricCard('package-variant', `${stats?.totalProducts || 0}`, 'Products', '#5C6BF2')}
      </View>
      <View style={styles.metricsGrid}>
        {renderMetricCard('account-group', `${stats?.totalCustomers || 0}`, 'Customers', '#00BCD4')}
        {renderMetricCard('alert-circle', `${stats?.lowStockCount || 0}`, 'Low Stock', '#F44336')}
      </View>

      {trends && trends.data && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Sales Performance</Title>
            <LineChart
              data={{
                labels: trends.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: trends.data || [0, 0, 0, 0, 0, 0, 0] }],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                backgroundColor: '#1976D2',
                backgroundGradientFrom: '#1976D2',
                backgroundGradientTo: '#42A5F5',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForDots: { r: '5', strokeWidth: '2', stroke: '#fff' },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      {stats && stats.lowStockCount > 0 && (
        <Card style={styles.alertCard}>
          <Card.Content>
            <View style={styles.alertRow}>
              <Avatar.Icon size={48} icon="alert" color="#FF6F00" style={styles.alertIcon} />
              <View style={styles.alertContent}>
                <Title style={styles.alertTitle}>Stock Alert</Title>
                <Paragraph style={styles.alertText}>{stats.lowStockCount} products need reordering</Paragraph>
              </View>
            </View>
            <Button mode="contained" onPress={() => navigation.navigate('Products')} style={styles.alertButton}>
              View Products
            </Button>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.actionCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Business Overview</Title>
          <View style={styles.statsGrid}>
            <Surface style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.pendingTasks || 0}</Text>
              <Text style={styles.statLabel}>Pending Tasks</Text>
            </Surface>
            <Surface style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.unreadMessages || 0}</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </Surface>
          </View>
          <Button mode="contained" icon="chart-line" onPress={() => navigation.navigate('Reports')} style={styles.primaryButton}>
            View Full Reports
          </Button>
        </Card.Content>
      </Card>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <View style={styles.metricsGrid}>
        {renderMetricCard('domain', `${stats?.totalProducts || 0}`, 'Organizations', '#4CAF50')}
        {renderMetricCard('account-multiple', `${stats?.totalCustomers || 0}`, 'Total Users', '#2196F3')}
      </View>
      <View style={styles.metricsGrid}>
        {renderMetricCard('cash-multiple', `$${stats?.todaySales?.toFixed(2) || '0.00'}`, 'Platform Revenue', '#FF9800')}
        {renderMetricCard('chart-line', `${stats?.todayTransactions || 0}`, 'Active Orgs', '#5C6BF2')}
      </View>

      <Card style={styles.actionCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>System Management</Title>
          <Button mode="contained" icon="domain" onPress={() => navigation.navigate('AdminOrganizations')} style={styles.primaryButton}>
            Manage Organizations
          </Button>
          <Button mode="outlined" icon="account-group" onPress={() => navigation.navigate('AdminUsers')} style={styles.secondaryButton}>
            Manage Users
          </Button>
          <Button mode="outlined" icon="chart-box" onPress={() => navigation.navigate('AdminAnalytics')} style={styles.secondaryButton}>
            System Analytics
          </Button>
        </Card.Content>
      </Card>
    </>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1976D2']} />}
    >
      {renderHeader()}

      {renderHeader()}

      <View style={styles.content}>
        {user?.role === 'CASHIER' && renderCashierDashboard()}
        {user?.role === 'MANAGER' && renderManagerDashboard()}
        {user?.role === 'BOSS' && renderBossDashboard()}
        {user?.role === 'SYSTEM_ADMIN' && renderAdminDashboard()}
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
  
  headerGradient: { paddingTop: 48, paddingBottom: 32, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerContent: { marginTop: 8 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 14, color: '#E3F2FD', marginBottom: 4, fontWeight: '500' },
  userName: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  roleChip: { backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'flex-start' },
  roleText: { color: '#FFFFFF', fontWeight: '600' },
  avatar: { backgroundColor: 'rgba(255,255,255,0.2)', elevation: 4 },
  avatarLabel: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  
  content: { paddingTop: 16 },
  
  metricsGrid: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  metricCard: { flex: 1, marginHorizontal: 4, borderRadius: 16, elevation: 4, overflow: 'hidden' },
  metricGradient: { padding: 16, alignItems: 'center' },
  metricIcon: { backgroundColor: 'rgba(255,255,255,0.25)', marginBottom: 12 },
  metricValue: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  metricLabel: { fontSize: 12, color: '#FFFFFF', opacity: 0.95, textAlign: 'center' },
  
  chartCard: { margin: 16, marginBottom: 12, elevation: 4, borderRadius: 16, backgroundColor: '#FFFFFF' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1976D2', marginBottom: 12 },
  chart: { marginVertical: 8, borderRadius: 16 },
  
  alertCard: { margin: 16, marginBottom: 12, elevation: 4, borderRadius: 16, backgroundColor: '#FFF3E0', borderLeftWidth: 4, borderLeftColor: '#FF9800' },
  alertRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  alertIcon: { backgroundColor: '#FFE0B2', marginRight: 16 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', color: '#E65100', marginBottom: 4 },
  alertText: { fontSize: 14, color: '#F57C00' },
  alertButton: { borderRadius: 8, backgroundColor: '#FF9800' },
  
  actionCard: { margin: 16, marginBottom: 12, elevation: 4, borderRadius: 16, backgroundColor: '#FFFFFF' },
  primaryButton: { marginBottom: 12, borderRadius: 8, backgroundColor: '#1976D2' },
  secondaryButton: { marginBottom: 12, borderRadius: 8, borderColor: '#1976D2' },
  buttonRow: { flexDirection: 'row', marginBottom: 12 },
  halfButton: { flex: 1, marginHorizontal: 4, borderRadius: 8 },
  
  statsGrid: { flexDirection: 'row', marginBottom: 16 },
  statItem: { flex: 1, padding: 16, marginHorizontal: 4, borderRadius: 12, backgroundColor: '#E3F2FD', alignItems: 'center', elevation: 2 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#1976D2', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#1565C0', textAlign: 'center' },
  
  footer: { height: 24 },
});
