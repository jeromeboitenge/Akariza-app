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
    setReport(null);
    try {
      const { start, end } = getDateRange();
      let data;
      
      console.log('📊 Generating report:', reportType, 'Period:', period);
      
      switch (reportType) {
        case 'sales':
          data = await reportsApi.getSales(start, end);
          break;
        case 'profit':
          data = await reportsApi.getProfit(start, end);
          break;
        case 'stock':
          data = await reportsApi.getStock();
          break;
        case 'bestselling':
          data = await reportsApi.getBestSelling(10);
          break;
      }
      
      console.log('✅ Report data:', data);
      setReport(data);
    } catch (error: any) {
      console.error('❌ Report error:', error.response?.data || error);
      alert(error.response?.data?.message || error.message || 'Failed to generate report');
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
            <Picker.Item label="Profit/Loss Report" value="profit" />
            <Picker.Item label="Low Stock Report" value="stock" />
            <Picker.Item label="Best Selling Products" value="bestselling" />
          </Picker>

          {reportType !== 'stock' && reportType !== 'bestselling' && (
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
                <Paragraph style={styles.stat}>Total Sales: ${report.totalSales?.toFixed(2) || report.total?.toFixed(2) || '0.00'}</Paragraph>
                <Paragraph style={styles.stat}>Transactions: {report.count || report.items?.length || 0}</Paragraph>
                <Paragraph style={styles.stat}>Average: ${report.average?.toFixed(2) || '0.00'}</Paragraph>
              </>
            )}
            
            {reportType === 'profit' && (
              <>
                <Paragraph style={styles.stat}>Total Revenue: ${report.totalRevenue?.toFixed(2) || '0.00'}</Paragraph>
                <Paragraph style={styles.stat}>Total Expenses: ${report.totalExpenses?.toFixed(2) || '0.00'}</Paragraph>
                <Paragraph style={styles.stat}>Cost of Goods: ${report.totalCost?.toFixed(2) || '0.00'}</Paragraph>
                <Paragraph style={[styles.stat, styles.profit]}>
                  Net Profit: ${report.netProfit?.toFixed(2) || report.profit?.toFixed(2) || '0.00'}
                </Paragraph>
                <Paragraph style={styles.stat}>
                  Profit Margin: {report.profitMargin?.toFixed(1) || '0.0'}%
                </Paragraph>
              </>
            )}
            
            {reportType === 'stock' && (
              <>
                <Paragraph style={styles.stat}>Low Stock Items: {report.length || report.items?.length || 0}</Paragraph>
                {report.length > 0 && (
                  <View style={styles.itemsList}>
                    {report.slice(0, 5).map((item: any, index: number) => (
                      <Paragraph key={index} style={styles.item}>
                        • {item.name}: {item.currentStock || item.stock} units
                      </Paragraph>
                    ))}
                  </View>
                )}
              </>
            )}
            
            {reportType === 'bestselling' && (
              <>
                <Paragraph style={styles.stat}>Top Products: {report.length || 0}</Paragraph>
                {report.length > 0 && (
                  <View style={styles.itemsList}>
                    {report.map((item: any, index: number) => (
                      <Paragraph key={index} style={styles.item}>
                        {index + 1}. {item.name}: {item.totalSold || item.quantity} sold
                      </Paragraph>
                    ))}
                  </View>
                )}
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
  itemsList: { marginTop: 12, paddingLeft: 8 },
  item: { marginVertical: 2, fontSize: 14, color: '#666' },
});
