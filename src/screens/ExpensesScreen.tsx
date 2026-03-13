import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, Chip, ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import { expensesApi } from '../api';
import { Expense } from '../types';
import { safeFormatDate } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';
import { hasPermission } from '../utils/permissions';

export default function ExpensesScreen({ navigation }: any) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const canCreate = hasPermission(user, 'CREATE_EXPENSES');
  const canDelete = hasPermission(user, 'DELETE_EXPENSES');

  const loadExpenses = async () => {
    try {
      const data = await expensesApi.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Load expenses error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: any = {
      'RENT': '#5C6BF2',
      'UTILITIES': '#FF9800',
      'SALARIES': '#4CAF50',
      'SUPPLIES': '#7B88F5',
      'MARKETING': '#F44336',
      'OTHER': '#757575',
    };
    return colors[category] || '#5C6BF2';
  };

  const renderExpense = ({ item }: { item: Expense }) => {
    // Handle missing or invalid dates
    const expenseDate = item.date || item.createdAt || new Date().toISOString();
    const formattedDate = safeFormatDate(expenseDate, 'MMM dd, yyyy');
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Avatar.Icon 
              size={48} 
              icon="cash-minus" 
              style={[styles.avatar, { backgroundColor: getCategoryColor(item.category) }]} 
            />
            <View style={styles.headerContent}>
              <Title style={styles.amount}>${item.amount.toFixed(2)}</Title>
              <Paragraph style={styles.date}>{formattedDate}</Paragraph>
            </View>
            <Chip style={[styles.categoryChip, { backgroundColor: `${getCategoryColor(item.category)}20` }]} textStyle={{ color: getCategoryColor(item.category) }}>
              {item.category}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <Paragraph style={styles.description}>{item.description}</Paragraph>

          {item.paymentMethod && (
            <Chip icon="credit-card" style={styles.paymentChip}>
              {item.paymentMethod}
            </Chip>
          )}
        </Card.Content>
      </Card>
    );
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C6BF2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Paragraph style={styles.summaryLabel}>Total Expenses</Paragraph>
          <Title style={styles.summaryValue}>${totalExpenses.toFixed(2)}</Title>
          <Chip icon="receipt" style={styles.countChip}>
            {expenses.length} Transactions
          </Chip>
        </Card.Content>
      </Card>

      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadExpenses(); }} colors={['#5C6BF2']} />
        }
      />

      {canCreate && (
        <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('NewExpense')} color="#FFFFFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summaryCard: { margin: 16, marginBottom: 8, elevation: 4, borderRadius: 16, backgroundColor: '#F44336' },
  summaryLabel: { color: '#FFFFFF', fontSize: 14, marginBottom: 4 },
  summaryValue: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', marginBottom: 8 },
  countChip: { backgroundColor: 'rgba(255,255,255,0.3)', alignSelf: 'flex-start' },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 4, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { marginRight: 12 },
  headerContent: { flex: 1 },
  amount: { fontSize: 24, fontWeight: 'bold', color: '#F44336' },
  date: { fontSize: 13, color: '#757575' },
  categoryChip: {},
  divider: { marginVertical: 12 },
  description: { fontSize: 14, color: '#212121', marginBottom: 12 },
  paymentChip: { backgroundColor: '#E3F2FD', alignSelf: 'flex-start' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#5C6BF2' },
});
