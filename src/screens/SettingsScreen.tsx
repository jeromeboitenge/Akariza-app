import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, List, Divider, Avatar, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';

export default function SettingsScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const clearData = useDataStore((state) => state.clear);
  const canManage = user?.role === 'BOSS' || user?.role === 'MANAGER';
  const isAdmin = user?.role === 'SYSTEM_ADMIN' || user?.role === 'BOSS';

  const handleLogout = async () => {
    await logout();
    clearData();
  };

  const MenuItem = ({ icon, title, subtitle, onPress, color = '#1976D2' }: any) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.menuItem}>
        <Avatar.Icon size={48} icon={icon} style={[styles.menuIcon, { backgroundColor: `${color}20` }]} color={color} />
        <View style={styles.menuContent}>
          <Title style={styles.menuTitle}>{title}</Title>
          {subtitle && <Paragraph style={styles.menuSubtitle}>{subtitle}</Paragraph>}
        </View>
        <Ionicons name="chevron-forward" size={24} color="#757575" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Text 
              size={80} 
              label={user?.fullName?.substring(0, 2).toUpperCase() || 'U'} 
              style={styles.profileAvatar} 
            />
            <View style={styles.profileInfo}>
              <Title style={styles.profileName}>{user?.fullName}</Title>
              <Paragraph style={styles.profileEmail}>{user?.email}</Paragraph>
              <View style={styles.roleChip}>
                <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
                <Paragraph style={styles.roleText}>{user?.role}</Paragraph>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Main Features */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Inventory & Sales</Title>
          <Divider style={styles.divider} />
          
          <MenuItem
            icon="receipt"
            title="Sales History"
            subtitle="View all sales transactions"
            onPress={() => navigation.navigate('Sales')}
            color="#9C27B0"
          />
          
          {canManage && (
            <>
              <MenuItem
                icon="cart-plus"
                title="New Purchase"
                subtitle="Create purchase order"
                onPress={() => navigation.navigate('NewPurchase')}
                color="#4CAF50"
              />
              <MenuItem
                icon="package-variant"
                title="Purchases"
                subtitle="View all purchases"
                onPress={() => navigation.navigate('Purchases')}
                color="#2196F3"
              />
              <MenuItem
                icon="truck"
                title="Suppliers"
                subtitle="Manage suppliers"
                onPress={() => navigation.navigate('Suppliers')}
                color="#FF9800"
              />
            </>
          )}
        </Card.Content>
      </Card>

      {/* Business Management */}
      {canManage && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Business Management</Title>
            <Divider style={styles.divider} />
            
            <MenuItem
              icon="store"
              title="Branches"
              subtitle="Manage branch locations"
              onPress={() => navigation.navigate('Branches')}
              color="#4CAF50"
            />
            <MenuItem
              icon="account-group"
              title="Employees"
              subtitle="Manage staff members"
              onPress={() => navigation.navigate('Employees')}
              color="#2196F3"
            />
            <MenuItem
              icon="cash-minus"
              title="Expenses"
              subtitle="Track business expenses"
              onPress={() => navigation.navigate('Expenses')}
              color="#F44336"
            />
            <MenuItem
              icon="chart-bar"
              title="Reports & Analytics"
              subtitle="View detailed reports"
              onPress={() => navigation.navigate('Reports')}
              color="#FF9800"
            />
          </Card.Content>
        </Card>
      )}

      {/* Marketing & Operations */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Marketing & Operations</Title>
          <Divider style={styles.divider} />
          
          <MenuItem
            icon="tag-multiple"
            title="Promotions"
            subtitle="Manage discounts & offers"
            onPress={() => navigation.navigate('Promotions')}
            color="#E91E63"
          />
          <MenuItem
            icon="clipboard-text"
            title="Tasks"
            subtitle="Track team tasks"
            onPress={() => navigation.navigate('Tasks')}
            color="#9C27B0"
          />
          <MenuItem
            icon="message"
            title="Messages"
            subtitle="Team communication"
            onPress={() => navigation.navigate('Messages')}
            color="#2196F3"
          />
          <MenuItem
            icon="bell"
            title="Notifications"
            subtitle="View all notifications"
            onPress={() => navigation.navigate('Notifications')}
            color="#FF5722"
          />
        </Card.Content>
      </Card>

      {/* System Administration */}
      {isAdmin && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>System Administration</Title>
            <Divider style={styles.divider} />
            
            <MenuItem
              icon="domain"
              title="Organizations"
              subtitle="Manage all organizations"
              onPress={() => navigation.navigate('Organizations')}
              color="#9C27B0"
            />
          </Card.Content>
        </Card>
      )}

      {/* App Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Settings</Title>
          <Divider style={styles.divider} />
          
          <List.Item
            title="Sync Data"
            description="Sync offline data with server"
            left={(props) => <List.Icon {...props} icon="sync" color="#1976D2" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Clear Cache"
            description="Clear local cached data"
            left={(props) => <List.Icon {...props} icon="delete" color="#1976D2" />}
            onPress={clearData}
          />
          <Divider />
          <List.Item
            title="About"
            description="Version 1.0.0"
            left={(props) => <List.Icon {...props} icon="information" color="#1976D2" />}
          />
        </Card.Content>
      </Card>

      {/* Logout */}
      <Card style={styles.logoutCard}>
        <Card.Content>
          <Button 
            mode="contained" 
            onPress={handleLogout} 
            icon="logout"
            style={styles.logoutButton}
            contentStyle={styles.logoutButtonContent}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  
  profileCard: { margin: 16, marginBottom: 8, elevation: 4, borderRadius: 16, backgroundColor: '#1976D2' },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  profileAvatar: { backgroundColor: '#42A5F5', marginRight: 16 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: '#E3F2FD', marginBottom: 8 },
  roleChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#42A5F5', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  roleText: { color: '#FFFFFF', fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
  
  card: { margin: 16, marginBottom: 8, elevation: 4, borderRadius: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1976D2', marginBottom: 8 },
  divider: { marginBottom: 12 },
  
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuIcon: { marginRight: 16 },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#212121', marginBottom: 2 },
  menuSubtitle: { fontSize: 13, color: '#757575' },
  
  logoutCard: { margin: 16, marginBottom: 8, elevation: 4, borderRadius: 16 },
  logoutButton: { backgroundColor: '#F44336', borderRadius: 8 },
  logoutButtonContent: { paddingVertical: 8 },
  
  footer: { height: 24 },
});
