export const API_URL = 'http://192.168.1.100:5000/api';

export const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const PAYMENT_METHODS = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Mobile Money', value: 'MOBILE_MONEY' },
  { label: 'Card', value: 'CARD' }
];

export const PAYMENT_STATUS = [
  { label: 'Paid', value: 'PAID' },
  { label: 'Partial', value: 'PARTIAL' },
  { label: 'Unpaid', value: 'UNPAID' }
];
