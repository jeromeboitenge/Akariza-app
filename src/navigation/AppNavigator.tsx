import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { mockUser } from '../data/mockData';
import AdminNavigator from './AdminNavigator';
import MainNavigator from './MainNavigator';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  // DEVELOPMENT MODE: Bypass authentication to view all screens
  // Set mockUser role to test different views: BOSS, MANAGER, CASHIER, SYSTEM_ADMIN
  const user = mockUser;
  const isAdmin = user?.role === 'SYSTEM_ADMIN';

  // Uncomment below to show login screen
  // if (!user) {
  //   return (
  //     <NavigationContainer>
  //       <Stack.Navigator screenOptions={{ headerShown: false }}>
  //         <Stack.Screen name="Login" component={LoginScreen} />
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   );
  // }

  // Admin gets dedicated admin panel
  if (isAdmin) {
    return <AdminNavigator />;
  }

  // Regular users get standard navigation
  return <MainNavigator />;
}
