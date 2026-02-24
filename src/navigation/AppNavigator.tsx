import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProductsScreen from '../screens/ProductsScreen';
import SalesScreen from '../screens/SalesScreen';
import { useAuthStore } from '../store/authStore';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ title: 'Akariza Dashboard' }}
            />
            <Stack.Screen
              name="Products"
              component={ProductsScreen}
              options={{ title: 'Products' }}
            />
            <Stack.Screen
              name="Sales"
              component={SalesScreen}
              options={{ title: 'Point of Sale' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
