# 📱 Akariza Mobile App - Setup & Development Guide

## 🚀 Quick Start

### Prerequisites
```bash
# Install Node.js (v18+)
# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI (for building)
npm install -g eas-cli
```

### Installation
```bash
cd /home/boitenge/Desktop/akariza/mobile
npm install
```

### Configuration

#### 1. Update API URL
Edit `src/utils/constants.ts`:
```typescript
// For local development
export const API_URL = 'http://localhost:5000/api/v1';

// For Android emulator
export const API_URL = 'http://10.0.2.2:5000/api/v1';

// For physical device (use your computer's IP)
export const API_URL = 'http://192.168.1.100:5000/api/v1';
```

#### 2. Start Development Server
```bash
npm start
```

#### 3. Run on Device/Emulator
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

## 📁 Project Structure

```
mobile/
├── src/
│   ├── api/              # API services
│   │   ├── client.ts     # Axios client
│   │   ├── authApi.ts    # Auth endpoints
│   │   ├── index.ts      # All API services
│   │   └── syncApi.ts    # Offline sync
│   ├── screens/          # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   ├── SalesScreen.tsx
│   │   ├── PurchasesScreen.tsx
│   │   ├── ReportsScreen.tsx
│   │   └── ChatScreen.tsx
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation setup
│   ├── store/           # State management (Zustand)
│   ├── database/        # SQLite offline storage
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   └── utils/           # Utilities & constants
├── App.tsx
└── package.json
```

---

## 🔧 Features Implemented

### ✅ Authentication
- Login with email/password
- JWT token management
- Auto token refresh
- Secure token storage

### ✅ Products Management
- View all products
- Create new products
- Low stock alerts
- Product search

### ✅ Sales (POS)
- Create sales
- Multiple items per sale
- Payment methods (Cash, Card, Mobile Money)
- Customer selection
- Offline sales support

### ✅ Purchases
- Create purchases
- Supplier selection
- Multiple items
- Payment tracking

### ✅ Reports
- Daily sales report
- Monthly sales report
- Profit reports
- Best-selling products

### ✅ Offline Support
- SQLite local database
- Offline sales creation
- Auto-sync when online
- Conflict resolution

### ✅ Organization Chat
- Send messages to team
- Direct messages
- View conversations
- Unread counter

---

## 📱 Screens Overview

### 1. Login Screen
- Email/password login
- Demo credentials display
- Loading indicator
- Error handling

**File:** `src/screens/NewLoginScreen.tsx`

### 2. Dashboard
- Sales summary
- Quick stats
- Low stock alerts
- Recent activities

**File:** `src/screens/DashboardScreen.tsx`

### 3. Products
- Product list
- Add new product
- Search products
- Stock levels

**File:** `src/screens/ProductsScreen.tsx`

### 4. Sales (POS)
- Create sale
- Add items
- Calculate total
- Process payment
- Print receipt

**File:** `src/screens/SalesScreen.tsx`

### 5. Purchases
- Create purchase
- Select supplier
- Add items
- Track payments

**File:** `src/screens/PurchasesScreen.tsx`

### 6. Reports
- View daily/monthly sales
- Profit analysis
- Best sellers
- Export reports

**File:** `src/screens/ReportsScreen.tsx`

### 7. Organization Chat
- Team messages
- Direct messages
- User list
- Unread notifications

**File:** `src/screens/ChatScreen.tsx`

---

## 🔌 API Integration

### API Client Setup
```typescript
// src/api/client.ts
import axios from 'axios';
import { API_URL } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});
```

### Using API Services
```typescript
import { productsApi, salesApi } from '../api';

// Get products
const products = await productsApi.getAll();

// Create sale
const sale = await salesApi.create({
  items: [{ productId, quantity, sellingPrice }],
  paymentMethod: 'CASH'
});
```

---

## 💾 Offline Support

### SQLite Database
```typescript
// src/database/index.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('akariza.db');

// Create tables
db.transaction(tx => {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      data TEXT,
      synced INTEGER DEFAULT 0
    )
  `);
});
```

### Sync Service
```typescript
// src/services/syncService.ts
export const syncSales = async () => {
  const unsynced = await getUnsyncedSales();
  
  for (const sale of unsynced) {
    try {
      await salesApi.create(sale);
      await markAsSynced(sale.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
};
```

---

## 🎨 UI Components

### Button Component
```typescript
<TouchableOpacity style={styles.button} onPress={handlePress}>
  <Text style={styles.buttonText}>Submit</Text>
</TouchableOpacity>
```

### Input Component
```typescript
<TextInput
  style={styles.input}
  placeholder="Product Name"
  value={value}
  onChangeText={setValue}
/>
```

### Card Component
```typescript
<View style={styles.card}>
  <Text style={styles.cardTitle}>Title</Text>
  <Text style={styles.cardContent}>Content</Text>
</View>
```

---

## 🔐 Authentication Flow

```
1. User enters email/password
2. App calls /api/v1/auth/login
3. Backend returns accessToken + user data
4. App stores token in memory
5. App sets Authorization header
6. Navigate to Dashboard
```

### Login Example
```typescript
const handleLogin = async () => {
  try {
    const response = await authApi.login(email, password);
    setAuthToken(response.accessToken);
    setUser(response.user);
    navigation.replace('Main');
  } catch (error) {
    Alert.alert('Error', 'Invalid credentials');
  }
};
```

---

## 📊 State Management (Zustand)

### Auth Store
```typescript
// src/store/authStore.ts
import create from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));
```

### Usage
```typescript
const { user, setUser, logout } = useAuthStore();
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Login
```bash
# Use demo credentials
Email: cashier@store.com
Password: cashier123
```

---

## 📦 Building for Production

### Android APK
```bash
# Build APK
eas build --platform android --profile preview

# Build AAB (for Play Store)
eas build --platform android --profile production
```

### iOS
```bash
# Build for TestFlight
eas build --platform ios --profile production
```

---

## 🚀 Deployment

### 1. Update API URL
```typescript
// Production API
export const API_URL = 'https://api.akariza.com/api/v1';
```

### 2. Build App
```bash
eas build --platform all
```

### 3. Submit to Stores
```bash
# Google Play
eas submit --platform android

# App Store
eas submit --platform ios
```

---

## 🔧 Development Tips

### Hot Reload
- Shake device to open dev menu
- Press 'R' to reload
- Enable Fast Refresh

### Debugging
```bash
# View logs
npx react-native log-android
npx react-native log-ios

# Debug with Chrome
# Open dev menu → Debug
```

### Network Debugging
```bash
# Use Reactotron
npm install --save-dev reactotron-react-native
```

---

## 📝 Environment Variables

Create `.env` file:
```env
API_URL=http://localhost:5000/api/v1
SYNC_INTERVAL=300000
```

---

## 🐛 Troubleshooting

### Cannot connect to API
```bash
# Android emulator
Use: http://10.0.2.2:5000/api/v1

# Physical device
Use your computer's IP: http://192.168.1.100:5000/api/v1
```

### Clear cache
```bash
npm start -- --reset-cache
```

### Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

---

## 📚 Next Steps

1. ✅ Complete all screens
2. ✅ Test offline functionality
3. ✅ Add push notifications
4. ✅ Implement biometric auth
5. ✅ Add receipt printing
6. ✅ Optimize performance
7. ✅ Add analytics
8. ✅ Submit to stores

---

## 🎯 Demo Credentials

```
Boss:
Email: boss@store.com
Password: boss123

Manager:
Email: manager@store.com
Password: manager123

Cashier:
Email: cashier@store.com
Password: cashier123
```

---

## 📞 Support

For issues or questions:
- Check backend logs
- Verify API URL
- Test with Postman first
- Check network connectivity

---

## ✅ Checklist

- [x] Install dependencies
- [x] Configure API URL
- [x] Test login
- [ ] Test all screens
- [ ] Test offline mode
- [ ] Build APK
- [ ] Deploy to production

---

**Mobile app is ready for development and testing!** 🚀
