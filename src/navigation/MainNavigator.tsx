import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { Ionicons } from '@expo/vector-icons';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ProductsScreen from '../screens/ProductsScreen';
import NewProductScreen from '../screens/NewProductScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CustomersScreen from '../screens/CustomersScreen';
import NewCustomerScreen from '../screens/NewCustomerScreen';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import SalesScreen from '../screens/SalesScreen';
import NewSaleScreen from '../screens/NewSaleScreen';
import SaleDetailScreen from '../screens/SaleDetailScreen';
import PurchasesScreen from '../screens/PurchasesScreen';
import NewPurchaseScreen from '../screens/NewPurchaseScreen';
import PurchaseOrdersScreen from '../screens/PurchaseOrdersScreen';
import SuppliersScreen from '../screens/SuppliersScreen';
import NewSupplierScreen from '../screens/NewSupplierScreen';
import BranchesScreen from '../screens/BranchesScreen';
import NewBranchScreen from '../screens/NewBranchScreen';
import BranchUsersScreen from '../screens/BranchUsersScreen';
import EmployeesScreen from '../screens/EmployeesScreen';
import NewEmployeeScreen from '../screens/NewEmployeeScreen';
import EditUserScreen from '../screens/EditUserScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import NewExpenseScreen from '../screens/NewExpenseScreen';
import TasksScreen from '../screens/TasksScreen';
import NewTaskScreen from '../screens/NewTaskScreen';
import PromotionsScreen from '../screens/PromotionsScreen';
import NewPromotionScreen from '../screens/NewPromotionScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ComposeMessageScreen from '../screens/ComposeMessageScreen';
import ChatScreen from '../screens/ChatScreen';
import OrganizationChatScreen from '../screens/OrganizationChatScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StockManagementScreen from '../screens/StockManagementScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
// Advanced Screens
import AdvancedAnalyticsScreen from '../screens/AdvancedAnalyticsScreen';
import InventoryManagementScreen from '../screens/InventoryManagementScreen';
import CustomerManagementScreen from '../screens/CustomerManagementScreen';
import PurchaseOrderManagementScreen from '../screens/PurchaseOrderManagementScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const user = useAuthStore((state) => state.user);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Products') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'Sales') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Customers') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'More') iconName = focused ? 'menu' : 'menu-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5C6BF2',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="More" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="NewProduct" component={NewProductScreen} options={{ title: 'New Product' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
        <Stack.Screen name="NewCustomer" component={NewCustomerScreen} options={{ title: 'New Customer' }} />
        <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} options={{ title: 'Customer Details' }} />
        <Stack.Screen name="NewSale" component={NewSaleScreen} options={{ title: 'New Sale' }} />
        <Stack.Screen name="SaleDetail" component={SaleDetailScreen} options={{ title: 'Sale Details' }} />
        <Stack.Screen name="Purchases" component={PurchasesScreen} options={{ title: 'Purchases' }} />
        <Stack.Screen name="NewPurchase" component={NewPurchaseScreen} options={{ title: 'New Purchase' }} />
        <Stack.Screen name="PurchaseOrders" component={PurchaseOrdersScreen} options={{ title: 'Purchase Orders' }} />
        <Stack.Screen name="Suppliers" component={SuppliersScreen} options={{ title: 'Suppliers' }} />
        <Stack.Screen name="NewSupplier" component={NewSupplierScreen} options={{ title: 'New Supplier' }} />
        <Stack.Screen name="Branches" component={BranchesScreen} options={{ title: 'Branches' }} />
        <Stack.Screen name="NewBranch" component={NewBranchScreen} options={{ title: 'New Branch' }} />
        <Stack.Screen name="BranchUsers" component={BranchUsersScreen} options={{ title: 'Branch Employees' }} />
        <Stack.Screen name="Employees" component={EmployeesScreen} options={{ title: 'Employees' }} />
        <Stack.Screen name="NewEmployee" component={NewEmployeeScreen} options={{ title: 'Add Employee' }} />
        <Stack.Screen name="EditUser" component={EditUserScreen} options={{ title: 'Edit User' }} />
        <Stack.Screen name="Expenses" component={ExpensesScreen} options={{ title: 'Expenses' }} />
        <Stack.Screen name="NewExpense" component={NewExpenseScreen} options={{ title: 'New Expense' }} />
        <Stack.Screen name="Tasks" component={TasksScreen} options={{ title: 'Tasks' }} />
        <Stack.Screen name="NewTask" component={NewTaskScreen} options={{ title: 'New Task' }} />
        <Stack.Screen name="Promotions" component={PromotionsScreen} options={{ title: 'Promotions' }} />
        <Stack.Screen name="NewPromotion" component={NewPromotionScreen} options={{ title: 'New Promotion' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
        <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages' }} />
        <Stack.Screen name="ComposeMessage" component={ComposeMessageScreen} options={{ title: 'New Message' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={({ route }: any) => ({ title: route.params?.userName || 'Chat' })} />
        <Stack.Screen name="OrganizationChat" component={OrganizationChatScreen} options={{ title: 'Organization Chat' }} />
        <Stack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports & Analytics' }} />
        <Stack.Screen name="StockManagement" component={StockManagementScreen} options={{ title: 'Stock Management' }} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} options={{ title: 'Verify OTP' }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Reset Password' }} />
        {/* Advanced Screens */}
        <Stack.Screen name="AdvancedAnalytics" component={AdvancedAnalyticsScreen} options={{ title: 'Advanced Analytics' }} />
        <Stack.Screen name="InventoryManagement" component={InventoryManagementScreen} options={{ title: 'Inventory Management' }} />
        <Stack.Screen name="CustomerManagement" component={CustomerManagementScreen} options={{ title: 'Customer Management' }} />
        <Stack.Screen name="PurchaseOrderManagement" component={PurchaseOrderManagementScreen} options={{ title: 'Purchase Order Management' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
