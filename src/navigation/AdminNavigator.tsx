import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { adminTheme } from '../theme/adminTheme';

// Admin Screens
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminOrganizationsScreen from '../screens/AdminOrganizationsScreen';
import AdminAnalyticsScreen from '../screens/AdminAnalyticsScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import AdminSettingsScreen from '../screens/AdminSettingsScreen';
import OrganizationBranchesScreen from '../screens/OrganizationBranchesScreen';
import NewOrganizationScreen from '../screens/NewOrganizationScreen';
import NewBranchScreen from '../screens/NewBranchScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Dashboard') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'Organizations') iconName = focused ? 'business' : 'business-outline';
          else if (route.name === 'Analytics') iconName = focused ? 'analytics' : 'analytics-outline';
          else if (route.name === 'Users') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: adminTheme.colors.primary,
        tabBarInactiveTintColor: adminTheme.colors.secondaryLight,
        tabBarStyle: {
          backgroundColor: adminTheme.colors.white,
          borderTopWidth: 1,
          borderTopColor: adminTheme.colors.background,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: adminTheme.colors.primary,
          elevation: 4,
        },
        headerTintColor: adminTheme.colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Organizations"
        component={AdminOrganizationsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Analytics"
        component={AdminAnalyticsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={AdminSettingsScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: adminTheme.colors.primary,
            elevation: 4,
          },
          headerTintColor: adminTheme.colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="AdminMain" 
          component={AdminTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="OrganizationBranches" 
          component={OrganizationBranchesScreen} 
          options={{ title: 'Organization Branches' }} 
        />
        <Stack.Screen 
          name="NewOrganization" 
          component={NewOrganizationScreen} 
          options={{ title: 'New Organization' }} 
        />
        <Stack.Screen 
          name="NewBranch" 
          component={NewBranchScreen} 
          options={{ title: 'New Branch' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
