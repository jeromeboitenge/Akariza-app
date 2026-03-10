import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Avatar, Surface, Text, IconButton } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { analyticsApi } from '../api';
import { DashboardStats } from '../types';
import { useAuthStore } from '../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);

  const loadDashboard = async () => {
    try {
      console.log('📊 Loading dashboard data...');
      const [statsData, trendsData] = await Promise.all([
        analyticsApi.getDashboard(),
        analyticsApi.getSalesTrends('daily').catch(() => null),
      ]);
      console.log('✅ Dashboard stats received:', JSON.stringify(statsData, null, 2));
      console.log('📈 Branches:', statsData?.totalBranches);
      console.log('👥 Employees:', statsData?.totalEmployees);
      console.log('👤 Customers:', statsData?.totalCustomers);
      console.log('📦 Products:', statsData?.totalProducts);
      setStats(statsData);
      setTrends(trendsData);
    } catch (error) {
      console.error('❌ Dashboard error:', error);
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
        <ActivityIndicator size="large" color="#5C6BF2" />
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
            <View style={[styles.trendBadge, { backgroundColor: trend > 0 ? colors.success : colors.error }]}>
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
          color={colors.success}
          trend={12}
        />
        <MetricCard
          icon="receipt"
          value={stats?.todayTransactions || 0}
          label="Transactions"
          color={colors.info}
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
            <QuickActionCard icon="cart-plus" label="New Sale" color={colors.success} onPress={() => navigation.navigate('NewSale')} />
            <QuickActionCard icon="account-plus" label="Add Customer" color={colors.info} onPress={() => navigation.navigate('NewCustomer')} />
            <QuickActionCard icon="package-variant" label="Products" color={colors.warning} onPress={() => navigation.navigate('Products')} />
            <QuickActionCard icon="account-group" label="Customers" color={colors.primary} onPress={() => navigation.navigate('Customers')} />
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
          color={colors.success}
          trend={15}
          onPress={() => navigation.navigate('Sales')}
        />
        <MetricCard
          icon="trending-up"
          value={`$${stats?.todayProfit?.toFixed(0) || '0'}`}
          label="Profit"
          color={colors.info}
          trend={10}
        />
      </View>

      <View style={styles.metricsContainer}>
        <MetricCard
          icon="receipt"
          value={stats?.todayTransactions || 0}
          label="Transactions"
          color={colors.success}
          onPress={() => navigation.navigate('Sales')}
        />
        <MetricCard
          icon="clipboard-check"
          value={stats?.pendingTasks || 0}
          label="Pending Tasks"
          color={colors.warning}
          onPress={() => navigation.navigate('Tasks')}
        />
      </View>

      <View style={styles.metricsContainer}>
        <MetricCard
          icon="account-group"
          value={stats?.totalEmployees || 0}
          label="Employees"
          color={colors.primary}
          onPress={() => navigation.navigate('Employees')}
        />
        <MetricCard
          icon="store"
          value={stats?.totalBranches || 1}
          label="My Branches"
          color={colors.info}
        />
      </View>

      <View style={styles.metricsContainer}>
        <MetricCard
          icon="package-variant"
          value={stats?.totalProducts || 0}
          label="Products"
          color={colors.warning}
          onPress={() => navigation.navigate('Products')}
        />
        <MetricCard
          icon="alert-circle"
          value={stats?.lowStockCount || 0}
          label="Low Stock"
          color={colors.error}
          onPress={() => navigation.navigate('Products')}
        />
      </View>

      {/* Top Product Card */}
      {stats?.topProduct && (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Avatar.Icon size={40} icon="star" style={{ backgroundColor: colors.warning }} />
              <Title style={styles.sectionTitle}>Top Selling Product</Title>
            </View>
            <View style={styles.topProductRow}>
              <View style={styles.flex}>
                <Text style={styles.topProductName}>{stats.topProduct.name}</Text>
                <Text style={styles.topProductSales}>{stats.topProduct.soldCount} units sold</Text>
              </View>
              <Text style={styles.topProductRevenue}>${stats.topProduct.revenue?.toFixed(0)}</Text>
            </View>
          </Card.Content>
        </Card>
      )}

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
                backgroundColor: '#5C6BF2',
                backgroundGradientFrom: '#5C6BF2',
                backgroundGradientTo: '#4A5AD6',
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
            <QuickActionCard icon="package-variant" label="Products" color={colors.warning} onPress={() => navigation.navigate('Products')} />
            <QuickActionCard icon="truck" label="Suppliers" color={colors.primary} onPress={() => navigation.navigate('Suppliers')} />
            <QuickActionCard icon="cash-minus" label="Expenses" color={colors.error} onPress={() => navigation.navigate('Expenses')} />
            <QuickActionCard icon="chart-bar" label="Reports" color={colors.info} onPress={() => navigation.navigate('Reports')} />
          </View>
        </Card.Content>
      </Card>
    </>
  );

  const renderBossDashboard = () => (
    <>
      {/* Organization Overview */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Avatar.Icon size={40} icon="domain" style={{ backgroundColor: colors.primary }} />
            <Title style={styles.sectionTitle}>Organization Overview</Title>
          </View>
          
          <View style={styles.metricsGrid}>
            <View style={styles.statBox}>
              <LinearGradient colors={['#4CAF50', '#4CAF50']} style={styles.statGradient}>
                <Avatar.Icon size={48} icon="store" color="#FFF" style={styles.statIcon} />
                <Title style={styles.statValue}>{stats?.totalBranches || 0}</Title>
                <Text style={styles.statLabel}>Branches</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statBox}>
              <LinearGradient colors={['#7B88F5', '#5C6BF2']} style={styles.statGradient}>
                <Avatar.Icon size={48} icon="account-group" color="#FFF" style={styles.statIcon} />
                <Title style={styles.statValue}>{stats?.totalEmployees || 0}</Title>
                <Text style={styles.statLabel}>Employees</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statBox}>
              <LinearGradient colors={['#FF9800', '#F57C00']} style={styles.statGradient}>
                <Avatar.Icon size={48} icon="account-multiple" color="#FFF" style={styles.statIcon} />
                <Title style={styles.statValue}>{stats?.totalCustomers || 0}</Title>
                <Text style={styles.statLabel}>Customers</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statBox}>
              <LinearGradient colors={['#5C6BF2', '#4A5AD6']} style={styles.statGradient}>
                <Avatar.Icon size={48} icon="package-variant" color="#FFF" style={styles.statIcon} />
                <Title style={styles.statValue}>{stats?.totalProducts || 0}</Title>
                <Text style={styles.statLabel}>Products</Text>
              </LinearGradient>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Financial Summary */}
      <Card style={styles.executiveCard}>
        <LinearGradient colors={['#5C6BF2', '#4A5AD6']} style={styles.executiveGradient}>
          <Text style={styles.executiveLabel}>Total Revenue (Today)</Text>
          <Title style={styles.executiveValue}>${(stats?.todaySales || 0).toFixed(2)}</Title>
          <View style={styles.executiveRow}>
            <View style={styles.executiveStat}>
              <Text style={styles.executiveStatLabel}>Profit</Text>
              <Text style={styles.executiveStatValue}>${(stats?.todayProfit || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.executiveStat}>
              <Text style={styles.executiveStatLabel}>Transactions</Text>
              <Text style={styles.executiveStatValue}>{stats?.todayTransactions || 0}</Text>
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

      {/* All-Time Stats */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Avatar.Icon size={40} icon="chart-line" style={{ backgroundColor: colors.success }} />
            <Title style={styles.sectionTitle}>All-Time Performance</Title>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statItemValue}>${(stats?.totalRevenue || 0).toFixed(0)}</Text>
              <Text style={styles.statItemLabel}>Total Revenue</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statItemValue}>{stats?.totalSales || 0}</Text>
              <Text style={styles.statItemLabel}>Total Sales</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statItemValue}>${(stats?.totalPurchases || 0).toFixed(0)}</Text>
              <Text style={styles.statItemLabel}>Purchases</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statItemValue}>${(stats?.totalExpenses || 0).toFixed(0)}</Text>
              <Text style={styles.statItemLabel}>Expenses</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Performance Chart */}
      {trends && trends.data && (
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View>
                <Title style={styles.sectionTitle}>Sales Trend</Title>
                <Text style={styles.chartSubtitle}>Last 7 days performance</Text>
              </View>
            </View>
            <LineChart
              data={{
                labels: trends.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: trends.data || [0, 0, 0, 0, 0, 0, 0] }],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                backgroundColor: '#5C6BF2',
                backgroundGradientFrom: '#5C6BF2',
                backgroundGradientTo: '#4A5AD6',
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

      {/* Alerts */}
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

      {/* Quick Actions */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Avatar.Icon size={40} icon="lightning-bolt" style={{ backgroundColor: colors.error }} />
            <Title style={styles.sectionTitle}>Quick Actions</Title>
          </View>
          
          <View style={styles.quickActionsGrid}>
            <QuickActionCard icon="store" label="Branches" color="#4CAF50" onPress={() => navigation.navigate('Branches')} />
            <QuickActionCard icon="account-group" label="Employees" color="#7B88F5" onPress={() => navigation.navigate('Employees')} />
            <QuickActionCard icon="message" label="Messages" color="#5C6BF2" onPress={() => navigation.navigate('Messages')} />
            <QuickActionCard icon="chart-box" label="Reports" color="#FF9800" onPress={() => navigation.navigate('Reports')} />
          </View>
        </Card.Content>
      </Card>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      {/* Platform Overview */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Avatar.Icon size={40} icon="view-dashboard" style={{ backgroundColor: colors.primary }} />
            <Title style={styles.sectionTitle}>Platform Overview</Title>
          </View>
          
          <View style={styles.metricsGrid}>
            <View style={styles.statBox}>
              <LinearGradient colors={['#5C6BF2', '#4A5AD6']} style={styles.statGradient}>
                <Avatar.Icon size={48} icon="domain" color="#FFF" style={styles.statIcon} />
                <Title style={styles.statValue}>{stats?.totalProducts || 0}</Title>
                <Text style={styles.statLabel}>Organizations</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statBox}>
              <LinearGradient colors={['#4CAF50', '#4CAF50']} style={styles.statGradient}>
                <Avatar.Icon size={48} icon="account-multiple" color="#FFF" style={styles.statIcon} />
                <Title style={styles.statValue}>{stats?.totalCustomers || 0}</Title>
                <Text style={styles.statLabel}>Total Users</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statBox}>
              <LinearGradient colors={['#FF9800', '#F57C00']} style={styles.statGradient}>
                <Avatar.Icon size={48} icon="store" color="#FFF" style={styles.statIcon} />
                <Title style={styles.statValue}>{stats?.lowStockCount || 0}</Title>
                <Text style={styles.statLabel}>Active Branches</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statBox}>
              <LinearGradient colors={['#5C6BF2', '#4A5AD6']} style={styles.statGradient}>
                <Avatar.Icon size={48} icon="cash-multiple" color="#FFF" style={styles.statIcon} />
                <Title style={styles.statValue}>${stats?.totalRevenue?.toFixed(0) || '0'}</Title>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </LinearGradient>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* System Management */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Avatar.Icon size={40} icon="cog" style={{ backgroundColor: colors.warning }} />
            <Title style={styles.sectionTitle}>System Management</Title>
          </View>
          
          <View style={styles.quickActionsGrid}>
            <QuickActionCard 
              icon="domain" 
              label="Organizations" 
              color="#5C6BF2" 
              onPress={() => navigation.navigate('Organizations')} 
            />
            <QuickActionCard 
              icon="account-group" 
              label="All Users" 
              color="#4CAF50" 
              onPress={() => navigation.navigate('AdminUsers')} 
            />
            <QuickActionCard 
              icon="chart-line" 
              label="Analytics" 
              color="#FF9800" 
              onPress={() => navigation.navigate('AdminAnalytics')} 
            />
            <QuickActionCard 
              icon="database" 
              label="Database" 
              color="#5C6BF2" 
              onPress={() => {}} 
            />
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Avatar.Icon size={40} icon="lightning-bolt" style={{ backgroundColor: colors.error }} />
            <Title style={styles.sectionTitle}>Quick Actions</Title>
          </View>
          
          <View style={styles.actionsList}>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('NewOrganization')}>
              <Avatar.Icon size={40} icon="plus-circle" style={{ backgroundColor: colors.success }} />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Add Organization</Text>
                <Text style={styles.actionSubtitle}>Create new organization</Text>
              </View>
              <IconButton icon="chevron-right" size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('AdminSettings')}>
              <Avatar.Icon size={40} icon="cog-outline" style={{ backgroundColor: colors.info }} />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>System Settings</Text>
                <Text style={styles.actionSubtitle}>Configure platform settings</Text>
              </View>
              <IconButton icon="chevron-right" size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Reports')}>
              <Avatar.Icon size={40} icon="file-chart" style={{ backgroundColor: colors.warning }} />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>System Reports</Text>
                <Text style={styles.actionSubtitle}>View platform analytics</Text>
              </View>
              <IconButton icon="chevron-right" size={24} />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5C6BF2']} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient colors={['#5C6BF2', '#4A5AD6', '#4A5AD6']} style={styles.header}>
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
        {/* OTA Update Banner */}
        <Card style={[styles.sectionCard, { backgroundColor: '#E8F5E9', borderLeftWidth: 4, borderLeftColor: '#4CAF50' }]}>
          <Card.Content>
            <View style={styles.updateBannerContent}>
              <Avatar.Icon size={40} icon="check-circle" style={{ backgroundColor: '#4CAF50' }} />
              <View style={styles.updateBannerText}>
                <Title style={{ color: '#2E7D32', fontSize: 16 }}>App Updated!</Title>
                <Paragraph style={{ color: '#558B2F', fontSize: 12 }}>You're running the latest version with new features and improvements.</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

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
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#5C6BF2', marginLeft: 12 },
  
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  statBox: { width: '50%', padding: 6 },
  statGradient: { padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statIcon: { backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#FFF', opacity: 0.9, textAlign: 'center' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 },
  statItem: { alignItems: 'center', flex: 1 },
  statItemValue: { fontSize: 24, fontWeight: 'bold', color: '#5C6BF2', marginBottom: 4 },
  statItemLabel: { fontSize: 13, color: '#757575', textAlign: 'center' },
  
  topProductRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, padding: 12, backgroundColor: '#FFF8E1', borderRadius: 12 },
  topProductName: { fontSize: 16, fontWeight: 'bold', color: '#424242', marginBottom: 4 },
  topProductSales: { fontSize: 13, color: '#757575' },
  topProductRevenue: { fontSize: 20, fontWeight: 'bold', color: colors.success },
  
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  quickAction: { width: '50%', padding: 6 },
  quickActionSurface: { padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  quickActionLabel: { marginTop: 8, fontSize: 13, fontWeight: '600', color: '#424242', textAlign: 'center' },
  
  actionsList: { gap: 8 },
  actionItem: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#F5F5F5', borderRadius: 12 },
  actionContent: { flex: 1, marginLeft: 12 },
  actionTitle: { fontSize: 15, fontWeight: '600', color: '#424242', marginBottom: 2 },
  actionSubtitle: { fontSize: 13, color: '#757575' },
  
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

  updateBannerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  updateBannerText: { flex: 1 },
});
