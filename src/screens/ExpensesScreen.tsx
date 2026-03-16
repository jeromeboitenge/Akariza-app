import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, Chip, ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import { expensesApi } from '../api';
import { Expense } from '../types';
import { safeFormatDate, formatCurrency } from '../utils/formatters';
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
      
      // Debug: Log the actual API response structure
      console.log('📊 Expenses API Response:', JSON.stringify(data, null, 2));
      if (data && data.length > 0) {
        console.log('📊 First expense object:', JSON.stringify(data[0], null, 2));
        console.log('📊 Date fields in first expense:', {
          date: data[0].date,
          createdAt: data[0].createdAt,
          updatedAt: data[0].updatedAt
        });
      }
      
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
    // Enhanced date handling with comprehensive fallbacks
    let displayDate = 'N/A';
    
    try {
      // Try different date fields in order of preference
      const possibleDates = [
        item.date,
        item.createdAt,
        item.updatedAt
      ].filter(Boolean); // Remove null/undefined values
      
      console.log('🗓️ Processing expense date:', {
        expenseId: item.id,
        possibleDates,
        dateField: item.date,
        createdAtField: item.createdAt
      });
      
      if (possibleDates.length > 0) {
        const dateValue = possibleDates[0]; // Use the first available date
        
        // Use the enhanced safeFormatDate function
        displayDate = safeFormatDate(dateValue, 'MMM dd, yyyy');
        
        // If still invalid, try manual parsing approaches
        if (displayDate === 'Invalid date' && dateValue) {
          console.log('🗓️ Trying manual date parsing for:', dateValue);
          
          // Try parsing as timestamp (if it's a number-like string)
          if (typeof dateValue === 'string' && /^\d+$/.test(dateValue)) {
            const timestamp = parseInt(dateValue);
            const timestampDate = new Date(timestamp);
            if (!isNaN(timestampDate.getTime())) {
              displayDate = timestampDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
              });
            }
          } else {
            // Try native Date parsing as last resort
            const nativeDate = new Date(dateValue);
            if (!isNaN(nativeDate.getTime())) {
              displayDate = nativeDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
              });
            }
          }
        }
      }
      
      console.log('🗓️ Final display date:', displayDate);
    } catch (error) {
      console.error('🗓️ Date parsing error for expense:', item.id, error);
      displayDate = 'Date error';
    }
    
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
              <Title style={styles.amount}>{formatCurrency(item.amount, 'RWF')}</Title>
              <Paragraph style={styles.date}>{displayDate}</Paragraph>
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
          <Title style={styles.summaryValue}>{formatCurrency(totalExpenses, 'RWF')}</Title>
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
