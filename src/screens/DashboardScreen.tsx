import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Avatar, Surface, Text, IconButton } from 'react-native-paper';
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const MetricCard = ({ icon, value, label, color, trend, onPress }: any) => (
    <TouchableOpacity style={styles.metricCard} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient colors={[color, color + 'DD']} style={styles.metricGradient}>
        <View style={styles.metricHeader}>
          <Avatar.Icon size={48} icon={icon} style={styles.metricIcon} color="#FFF" />
          {trend && (
            <View style={[styles.trendBadge, { backgroundColor: trend > 0 ? '#4CAF50' : '#F44336' }]}>
              <Text style={styles.trendText}>{trend > 0 ? '+' : ''}{trend}%</Text>
            </View>
          )}
        </View>
        <Title style={styles.metricValue}>{value}</Title>
        <Paragraph style={styles.metricLabel}>{label}</Paragraph>
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <Surface style={[styles.quickActionSurface, { backgroundColor: color + '15' }]}>
        <Avatar.Icon size={40} icon={icon} style={{ backgroundColor: color }} color="#FFF" />
        <Text style={styles.quickActionLabel}>{label}</Text>
      </Surface>
    </TouchableOpacity>
  );

  const renderCashierDashboard = () => (
    <>
      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <MetricCard
          icon="cash-register"
          value={`$${stats?.todaySales?.toFixed(2) || '0.00'}`}
          label="Today's Sales"
          color="#4CAF50"
          trend={12}
        />
        <MetricCard
          icon="receipt"
          value={stats?.todayTransactions || 0}
          label="Transactions"
          color="#2196F3"
          trend={8}
        />
      </View>

      {/* Quick Actions */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
          </View>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard icon="cart-plus" label="New Sale" color="#4CAF50" onPress={() => navigation.navigate('NewSale')} />
            <QuickActionCard icon="account-plus" label="Add Customer" color="#2196F3" onPress={() => navigation.navigate('NewCustomer')} />
            <QuickActionCard icon="package-variant" label="Products" color="#FF9800" onPress={() => navigation.navigate('Products')} />
            <QuickActionCard icon="account-group" label="Customers" color="#9C27B0" onPress={() => navigation.navigate('Customers')} />
          </View>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Recent Activity</Title>
            <IconButton icon="chevron-right" size={24} onPress={() => navigation.navigate('Sales')} />
          </View>
          <View style={styles.activityItem}>
            <Avatar.Icon size={40} icon="receipt" style={styles.activityIcon} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Last sale: $45.00</Text>
              <Text style={styles.activityTime}>5 minutes ago</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </>
  );

  const renderManagerDashboard = () => (
    <>
      {/* Key Metrics Grid */}
      <View style={styles.metricsContainer}>
        <MetricCard
          icon="cash-multiple"
          value={`$${stats?.todaySales?.toFixed(0) || '0'}`}
          label="Today's Sales"
          color="#4CAF50"
          trend={15}
          onPress={() => navigation.navigate('Sales')}
        />
        <MetricCard
          icon="trending-up"
          value={`$${stats?.todayProfit?.toFixed(0) || '0'}`}
          label="Profit"
          color="#2196F3"
          trend={10}
        />
      </View>

      <View style={styles.metricsContainer}>
        <MetricCard
          icon="package-variant"
          value={stats?.totalProducts || 0}
          label="Products"
          color="#FF9800"
          onPress={() => navigation.navigate('Products')}
        />
        <MetricCard
          icon="alert-circle"
          value={stats?.lowStockCount || 0}
          label="Low Stock"
          color="#F44336"
          onPress={() => navigation.navigate('Products')}
        />
      </View>

      {/* Sales Chart */}
      {trends && trends.data && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>Sales Trend</Title>
              <Text style={styles.chartPeriod}>Last 7 Days</Text>
            </View>
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
                backgroundGradientTo: '#1565C0',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForDots: { r: '5', strokeWidth: '2', stroke: '#fff' },
                propsForBackgroundLines: { strokeWidth: 0 },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Management</Title>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard icon="package-variant" label="Products" color="#FF9800" onPress={() => navigation.navigate('Products')} />
            <QuickActionCard icon="truck" label="Suppliers" color="#9C27B0" onPress={() => navigation.navigate('Suppliers')} />
            <QuickActionCard icon="cash-minus" label="Expenses" color="#F44336" onPress={() => navigation.navigate('Expenses')} />
            <QuickActionCard icon="chart-bar" label="Reports" color="#2196F3" onPress={() => navigation.navigate('Reports')} />
          </View>
        </Card.Content>
      </Card>
    </>
  );

  const renderBossDashboard = () => (
    <>
      {/* Executive Summary */}
      <Card style={styles.executiveCard}>
        <LinearGradient colors={['#1976D2', '#1565C0']} style={styles.executiveGradient}>
          <Text style={styles.executiveLabel}>Total Revenue</Text>
          <Title style={styles.executiveValue}>${(stats?.todaySales || 0).toFixed(2)}</Title>
          <View style={styles.executiveRow}>
            <View style={styles.executiveStat}>
              <Text style={styles.executiveStatLabel}>Profit</Text>
              <Text style={styles.executiveStatValue}>${(stats?.todayProfit || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.executiveStat}>
              <Text style={styles.executiveStatLabel}>Margin</Text>
              <Text style={styles.executiveStatValue}>
                {stats?.todaySales ? ((stats.todayProfit / stats.todaySales) * 100).toFixed(1) : 0}%
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Card>

      {/* KPI Grid */}
      <View style={styles.metricsContainer}>
        <MetricCard icon="receipt" value={stats?.todayTransactions || 0} label="Transactions" color="#4CAF50" trend={12} />
        <MetricCard icon="account-group" value={stats?.totalCustomers || 0} label="Customers" color="#2196F3" />
      </View>

      <View style={styles.metricsContainer}>
        <MetricCard icon="package-variant" value={stats?.totalProducts || 0} label="Products" color="#FF9800" />
        <MetricCard icon="alert-circle" value={stats?.lowStockCount || 0} label="Alerts" color="#F44336" />
      </View>

      {/* Performance Chart */}
      {trends && trends.data && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View>
                <Title style={styles.sectionTitle}>Business Performance</Title>
                <Text style={styles.chartSubtitle}>Weekly sales overview</Text>
              </View>
              <IconButton icon="filter-variant" size={24} />
            </View>
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
                backgroundGradientTo: '#1565C0',
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

      {/* Alerts & Insights */}
      {stats && stats.lowStockCount > 0 && (
        <Card style={styles.alertCard}>
          <Card.Content>
            <View style={styles.alertContent}>
              <Avatar.Icon size={48} icon="alert-circle" style={styles.alertIcon} color="#FF6F00" />
              <View style={styles.alertText}>
                <Title style={styles.alertTitle}>Stock Alert</Title>
                <Paragraph style={styles.alertDescription}>
                  {stats.lowStockCount} products need reordering
                </Paragraph>
              </View>
              <IconButton icon="chevron-right" size={24} onPress={() => navigation.navigate('Products')} />
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Quick Insights */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Insights</Title>
          <View style={styles.insightRow}>
            <Avatar.Icon size={40} icon="trending-up" style={{ backgroundColor: '#4CAF50' }} />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Sales up 15%</Text>
              <Text style={styles.insightSubtitle}>Compared to last week</Text>
            </View>
          </View>
          <View style={styles.insightRow}>
            <Avatar.Icon size={40} icon="account-multiple" style={{ backgroundColor: '#2196F3' }} />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>5 new customers</Text>
              <Text style={styles.insightSubtitle}>This week</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <View style={styles.metricsContainer}>
        <MetricCard icon="domain" value={stats?.totalProducts || 0} label="Organizations" color="#9C27B0" />
        <MetricCard icon="account-multiple" value={stats?.totalCustomers || 0} label="Users" color="#2196F3" />
      </View>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>System Management</Title>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard icon="domain" label="Organizations" color="#9C27B0" onPress={() => navigation.navigate('AdminOrganizations')} />
            <QuickActionCard icon="account-group" label="Users" color="#2196F3" onPress={() => navigation.navigate('AdminUsers')} />
            <QuickActionCard icon="chart-box" label="Analytics" color="#FF9800" onPress={() => navigation.navigate('AdminAnalytics')} />
            <QuickActionCard icon="cog" label="Settings" color="#757575" onPress={() => navigation.navigate('AdminSettings')} />
          </View>
        </Card.Content>
      </Card>
    </>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1976D2']} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient colors={['#1976D2', '#1565C0', '#0D47A1']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Title style={styles.userName}>{user?.fullName}</Title>
            <Surface style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role}</Text>
            </Surface>
          </View>
          <Avatar.Text 
            size={56} 
            label={user?.fullName?.charAt(0) || 'A'} 
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
        </View>
      </LinearGradient>

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
  
  header: { paddingTop: 48, paddingBottom: 24, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 14, color: '#E3F2FD', marginBottom: 4, fontWeight: '500' },
  userName: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)' },
  roleText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  avatar: { backgroundColor: 'rgba(255,255,255,0.25)', elevation: 4 },
  avatarLabel: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  
  content: { paddingTop: 16 },
  
  metricsContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  metricCard: { flex: 1, marginHorizontal: 4, borderRadius: 16, elevation: 4, overflow: 'hidden' },
  metricGradient: { padding: 16 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  metricIcon: { backgroundColor: 'rgba(255,255,255,0.25)' },
  trendBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  trendText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  metricValue: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  metricLabel: { fontSize: 12, color: '#FFFFFF', opacity: 0.95 },
  
  sectionCard: { marginHorizontal: 16, marginBottom: 12, elevation: 3, borderRadius: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1976D2' },
  
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  quickAction: { width: '50%', padding: 6 },
  quickActionSurface: { padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  quickActionLabel: { marginTop: 8, fontSize: 13, fontWeight: '600', color: '#424242', textAlign: 'center' },
  
  chartCard: { marginHorizontal: 16, marginBottom: 12, elevation: 3, borderRadius: 16 },
  chartPeriod: { fontSize: 12, color: '#757575' },
  chartSubtitle: { fontSize: 12, color: '#757575', marginTop: 2 },
  chart: { marginVertical: 8, borderRadius: 16 },
  
  executiveCard: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, elevation: 4, overflow: 'hidden' },
  executiveGradient: { padding: 24 },
  executiveLabel: { fontSize: 14, color: '#E3F2FD', marginBottom: 8 },
  executiveValue: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
  executiveRow: { flexDirection: 'row', justifyContent: 'space-around' },
  executiveStat: { alignItems: 'center' },
  executiveStatLabel: { fontSize: 12, color: '#E3F2FD', marginBottom: 4 },
  executiveStatValue: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  
  alertCard: { marginHorizontal: 16, marginBottom: 12, elevation: 3, borderRadius: 16, backgroundColor: '#FFF3E0' },
  alertContent: { flexDirection: 'row', alignItems: 'center' },
  alertIcon: { backgroundColor: '#FFE0B2', marginRight: 12 },
  alertText: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', color: '#E65100', marginBottom: 4 },
  alertDescription: { fontSize: 14, color: '#F57C00' },
  
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  activityIcon: { backgroundColor: '#E3F2FD', marginRight: 12 },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: '600', color: '#424242', marginBottom: 2 },
  activityTime: { fontSize: 12, color: '#757575' },
  
  insightRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  insightContent: { flex: 1, marginLeft: 12 },
  insightTitle: { fontSize: 15, fontWeight: '600', color: '#424242', marginBottom: 2 },
  insightSubtitle: { fontSize: 13, color: '#757575' },
  
  footer: { height: 24 },
});
