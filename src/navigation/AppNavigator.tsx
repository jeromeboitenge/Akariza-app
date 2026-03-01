import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import AdminNavigator from './AdminNavigator';
import MainNavigator from './MainNavigator';
import LoginScreen from '../screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const user = useAuthStore((state) => state.user);
  const loadUser = useAuthStore((state) => state.loadUser);
  const isAdmin = user?.role === 'SYSTEM_ADMIN';

  useEffect(() => {
    loadUser();
  }, []);

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Admin gets dedicated admin panel
  if (isAdmin) {
    return <AdminNavigator />;
  }

  // Regular users get standard navigation
  return <MainNavigator />;
}
