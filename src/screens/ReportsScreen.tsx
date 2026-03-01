import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { reportsApi } from '../api';
import { safeFormatDate } from '../utils/formatters';

export default function ReportsScreen() {
  const [reportType, setReportType] = useState('sales');
  const [period, setPeriod] = useState('today');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const getDateRange = () => {
    const now = new Date();
    switch (period) {
      case 'today':
        return { start: safeFormatDate(now, 'yyyy-MM-dd'), end: safeFormatDate(now, 'yyyy-MM-dd') };
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { start: safeFormatDate(weekAgo, 'yyyy-MM-dd'), end: safeFormatDate(now, 'yyyy-MM-dd') };
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start: safeFormatDate(monthStart, 'yyyy-MM-dd'), end: safeFormatDate(monthEnd, 'yyyy-MM-dd') };
      default:
        return { start: safeFormatDate(now, 'yyyy-MM-dd'), end: safeFormatDate(now, 'yyyy-MM-dd') };
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange();
      let data;
      switch (reportType) {
        case 'sales':
          data = await reportsApi.getSales(start, end);
          break;
        case 'purchases':
          data = await reportsApi.getPurchases(start, end);
          break;
        case 'profit':
          data = await reportsApi.getProfit(start, end);
          break;
        case 'stock':
          data = await reportsApi.getStock();
          break;
      }
      setReport(data);
    } catch (error: any) {
      console.error('Report error:', error.response?.data || error);
      alert(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Reports</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Report Type</Paragraph>
          <Picker
            selectedValue={reportType}
            onValueChange={setReportType}
            style={styles.picker}
          >
            <Picker.Item label="Sales Report" value="sales" />
            <Picker.Item label="Purchases Report" value="purchases" />
            <Picker.Item label="Profit/Loss Report" value="profit" />
            <Picker.Item label="Stock Report" value="stock" />
          </Picker>

          {reportType !== 'stock' && (
            <>
              <Paragraph style={styles.marginTop}>Period</Paragraph>
              <Picker
                selectedValue={period}
                onValueChange={setPeriod}
                style={styles.picker}
              >
                <Picker.Item label="Today" value="today" />
                <Picker.Item label="Last 7 Days" value="week" />
                <Picker.Item label="This Month" value="month" />
              </Picker>
            </>
          )}

          <Button mode="contained" onPress={generateReport} loading={loading} disabled={loading}>
            Generate Report
          </Button>
        </Card.Content>
      </Card>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {report && !loading && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Report Results</Title>
            {reportType === 'sales' && (
              <>
                <Paragraph style={styles.stat}>Total Sales: ${report.totalSales?.toFixed(2) || '0.00'}</Paragraph>
                <Paragraph style={styles.stat}>Transactions: {report.items?.length || 0}</Paragraph>
              </>
            )}
            {reportType === 'purchases' && (
              <>
                <Paragraph style={styles.stat}>Total Purchases: ${report.totalPurchases?.toFixed(2) || '0.00'}</Paragraph>
                <Paragraph style={styles.stat}>Orders: {report.items?.length || 0}</Paragraph>
              </>
            )}
            {reportType === 'profit' && (
              <>
                <Paragraph style={styles.stat}>Total Sales: ${report.totalSales?.toFixed(2) || '0.00'}</Paragraph>
                <Paragraph style={styles.stat}>Total Expenses: ${report.totalExpenses?.toFixed(2) || '0.00'}</Paragraph>
                <Paragraph style={[styles.stat, styles.profit]}>
                  Net Profit: ${report.profit?.toFixed(2) || '0.00'}
                </Paragraph>
              </>
            )}
            {reportType === 'stock' && report.items && (
              <>
                <Paragraph style={styles.stat}>Total Products: {report.items.length}</Paragraph>
                <Paragraph style={styles.stat}>
                  Total Value: ${report.items.reduce((sum: number, item: any) => 
                    sum + (item.currentStock * item.costPrice), 0).toFixed(2)}
                </Paragraph>
              </>
            )}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { marginBottom: 16 },
  card: { marginBottom: 16, elevation: 2 },
  picker: { marginVertical: 8 },
  marginTop: { marginTop: 16 },
  center: { padding: 32, alignItems: 'center' },
  stat: { fontSize: 16, marginVertical: 8 },
  profit: { fontWeight: 'bold', color: '#4caf50', fontSize: 18 },
});
