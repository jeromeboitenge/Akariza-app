export const API_URL = 'http://localhost:5000/api/v1';

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
