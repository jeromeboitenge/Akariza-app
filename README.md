# Akariza Mobile - React Native

Offline-first mobile app for Akariza Stock Management System.

## 🏗️ Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Database**: SQLite (offline)
- **State**: Zustand
- **Navigation**: React Navigation
- **UI**: React Native Paper

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Update API URL
# Edit src/utils/constants.ts with your backend IP

# Start Expo
npm start

# Scan QR code with Expo Go app
```

## ✨ Features

- ✅ Offline-first architecture
- ✅ Local SQLite database
- ✅ Automatic background sync
- ✅ Point of Sale (POS) interface
- ✅ Product management
- ✅ Real-time stock updates
- ✅ Role-based UI

## 📱 Screens

- **LoginScreen** - User authentication
- **DashboardScreen** - Home with sync status
- **ProductsScreen** - Product listing
- **SalesScreen** - Point of Sale
- **PurchasesScreen** - Record purchases
- **ReportsScreen** - View analytics
- **SyncScreen** - Sync status

## 🔄 Offline Sync

The app works 100% offline:
- Sales and purchases stored locally
- Auto-sync when internet available
- Manual "Sync Now" option
- Duplicate prevention
- Conflict resolution

## 🗄️ Local Database (SQLite)

**Tables:**
- products
- sales / sale_items
- purchases / purchase_items
- suppliers
- sync_metadata

## 🛠️ Development

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Clear cache
npm start -- --clear
```

## 📦 Configuration

Update `src/utils/constants.ts`:
```typescript
export const API_URL = 'http://YOUR_IP:5000/api';
```

Find your IP:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

## 🔐 User Roles

- **Boss** - Full access
- **Manager** - Products, purchases, stock
- **Cashier** - Sales only

## 📚 Related Repositories

- **Backend API**: [akariza-backend](https://github.com/YOUR_USERNAME/akariza-backend)
- **Web App**: [akariza-web](https://github.com/YOUR_USERNAME/akariza-web)

## 📄 License

Proprietary - All rights reserved
