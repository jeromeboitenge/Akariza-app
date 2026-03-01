import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, List, Switch, Button, Divider } from 'react-native-paper';
import { adminTheme } from '../theme/adminTheme';
import { useAuthStore } from '../store/authStore';

export default function AdminSettingsScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleBackup = () => {
    Alert.alert('Backup', 'Database backup initiated');
  };

  const handleClearCache = () => {
    Alert.alert('Cache Cleared', 'Application cache has been cleared');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>System Settings</Title>
        <Paragraph style={styles.headerSubtitle}>Admin Configuration</Paragraph>
      </View>

      {/* Profile */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Profile</Title>
          <View style={styles.profileInfo}>
            <Paragraph style={styles.profileLabel}>Name:</Paragraph>
            <Paragraph style={styles.profileValue}>{user?.name}</Paragraph>
          </View>
          <View style={styles.profileInfo}>
            <Paragraph style={styles.profileLabel}>Email:</Paragraph>
            <Paragraph style={styles.profileValue}>{user?.email}</Paragraph>
          </View>
          <View style={styles.profileInfo}>
            <Paragraph style={styles.profileLabel}>Role:</Paragraph>
            <Paragraph style={[styles.profileValue, styles.roleValue]}>{user?.role}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Notifications</Title>
          <View style={styles.settingRow}>
            <Paragraph style={styles.settingLabel}>Email Notifications</Paragraph>
            <Switch value={emailNotifications} onValueChange={setEmailNotifications} color={adminTheme.colors.primary} />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingRow}>
            <Paragraph style={styles.settingLabel}>Push Notifications</Paragraph>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} color={adminTheme.colors.primary} />
          </View>
        </Card.Content>
      </Card>

      {/* System */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>System</Title>
          <View style={styles.settingRow}>
            <Paragraph style={styles.settingLabel}>Auto Backup</Paragraph>
            <Switch value={autoBackup} onValueChange={setAutoBackup} color={adminTheme.colors.primary} />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingRow}>
            <Paragraph style={styles.settingLabel}>Maintenance Mode</Paragraph>
            <Switch value={maintenanceMode} onValueChange={setMaintenanceMode} color={adminTheme.colors.error} />
          </View>
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Actions</Title>
          <Button 
            mode="outlined" 
            icon="database-export" 
            onPress={handleBackup}
            style={styles.actionButton}
            textColor={adminTheme.colors.primary}
          >
            Backup Database
          </Button>
          <Button 
            mode="outlined" 
            icon="delete-sweep" 
            onPress={handleClearCache}
            style={styles.actionButton}
            textColor={adminTheme.colors.secondary}
          >
            Clear Cache
          </Button>
          <Button 
            mode="contained" 
            icon="logout" 
            onPress={handleLogout}
            style={[styles.actionButton, styles.logoutButton]}
            buttonColor={adminTheme.colors.error}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      {/* System Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>System Information</Title>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Version:</Paragraph>
            <Paragraph style={styles.infoValue}>1.0.0</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Build:</Paragraph>
            <Paragraph style={styles.infoValue}>2026.02.26</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Environment:</Paragraph>
            <Paragraph style={styles.infoValue}>Production</Paragraph>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: adminTheme.colors.background },
  header: { 
    backgroundColor: adminTheme.colors.primary, 
    padding: adminTheme.spacing.lg,
    elevation: adminTheme.elevation,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: adminTheme.colors.white },
  headerSubtitle: { fontSize: 14, color: adminTheme.colors.primaryLight, marginTop: 4 },
  card: { 
    margin: adminTheme.spacing.md, 
    elevation: adminTheme.elevation,
    borderRadius: adminTheme.borderRadius,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: adminTheme.colors.secondary, marginBottom: 16 },
  profileInfo: { flexDirection: 'row', marginBottom: 8 },
  profileLabel: { fontSize: 14, color: adminTheme.colors.secondaryLight, width: 80 },
  profileValue: { fontSize: 14, color: adminTheme.colors.secondary, fontWeight: '500', flex: 1 },
  roleValue: { color: adminTheme.colors.primary, fontWeight: 'bold' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLabel: { fontSize: 15, color: adminTheme.colors.secondary },
  divider: { marginVertical: 8 },
  actionButton: { marginTop: 12 },
  logoutButton: { marginTop: 16 },
  infoRow: { flexDirection: 'row', marginBottom: 8 },
  infoLabel: { fontSize: 13, color: adminTheme.colors.secondaryLight, width: 100 },
  infoValue: { fontSize: 13, color: adminTheme.colors.secondary, fontWeight: '500' },
});
