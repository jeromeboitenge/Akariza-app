# Akariza Mobile App

Complete mobile application for the Akariza Stock Management System with full backend integration.

## 📱 Features

### Core Functionality
- ✅ **Authentication** - Login with JWT tokens and auto-refresh
- ✅ **Dashboard** - Real-time stats and quick actions
- ✅ **Products Management** - View, create, search products
- ✅ **Sales** - Create sales with cart, customer selection, multiple payment methods
- ✅ **Purchases** - Create purchases with supplier selection
- ✅ **Customers** - Manage customer database
- ✅ **Tasks** - Task management and assignment
- ✅ **Messages** - Organization-wide chat
- ✅ **Reports** - Sales, purchases, profit, and stock reports
- ✅ **Settings** - Account management and logout

### Role-Based Access
- **BOSS** - Full access to all features
- **MANAGER** - Access to products, purchases, reports
- **CASHIER** - Access to sales, products (read-only), customers

### Technical Features
- Offline-first architecture (ready for SQLite integration)
- Token refresh on 401 errors
- Pull-to-refresh on all lists
- Search and filtering
- Responsive UI with React Native Paper
- Bottom tabs + drawer navigation
- Type-safe with TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

```bash
cd mobile
npm install
```

### Configuration

Update the API URL in `src/utils/constants.ts`:

```typescript
export const API_URL = 'http://localhost:5000/api/v1';
// For production:
// export const API_URL = 'https://your-backend.onrender.com/api/v1';
```

### Run the App

```bash
# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 📂 Project Structure

```
mobile/
├── src/
│   ├── api/                    # API client and endpoints
│   │   ├── client.ts          # Axios client with interceptors
│   │   ├── authApi.ts         # Authentication endpoints
│   │   ├── productsApi.ts     # Products endpoints
│   │   ├── salesApi.ts        # Sales endpoints
│   │   ├── purchasesApi.ts    # Purchases endpoints
│   │   ├── customersApi.ts    # Customers endpoints
│   │   ├── suppliersApi.ts    # Suppliers endpoints
│   │   ├── branchesApi.ts     # Branches endpoints
│   │   ├── employeesApi.ts    # Employees endpoints
│   │   ├── expensesApi.ts     # Expenses endpoints
│   │   ├── tasksApi.ts        # Tasks endpoints
│   │   ├── messagesApi.ts     # Messages endpoints
│   │   ├── notificationsApi.ts # Notifications endpoints
│   │   ├── analyticsApi.ts    # Analytics & reports
│   │   ├── otherApi.ts        # Promotions, POs
│   │   └── index.ts           # API exports
│   │
│   ├── screens/               # All app screens
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   ├── NewProductScreen.tsx
│   │   ├── CustomersScreen.tsx
│   │   ├── NewCustomerScreen.tsx
│   │   ├── SalesScreen.tsx
│   │   ├── NewSaleScreen.tsx
│   │   ├── NewPurchaseScreen.tsx
│   │   ├── TasksScreen.tsx
│   │   ├── MessagesScreen.tsx
│   │   ├── ReportsScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── navigation/            # Navigation setup
│   │   └── AppNavigator.tsx  # Stack, Tab, Drawer navigation
│   │
│   ├── store/                 # State management (Zustand)
│   │   ├── authStore.ts      # Auth state
│   │   ├── dataStore.ts      # Data caching
│   │   └── syncStore.ts      # Sync state
│   │
│   ├── types/                 # TypeScript types
│   │   └── index.ts          # All entity types
│   │
│   └── utils/                 # Utilities
│       └── constants.ts      # App constants
│
├── App.tsx                    # Root component
├── app.json                   # Expo config
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

## 🔌 API Integration

All backend endpoints are integrated:

### Authentication
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token

### Products
- `GET /products` - List all products
- `POST /products` - Create product
- `GET /products/:id` - Get product details
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /products/low-stock` - Low stock alerts

### Sales
- `GET /sales` - List all sales
- `POST /sales` - Create sale
- `GET /sales/:id` - Get sale details
- `GET /sales/my-sales` - Current user's sales

### Purchases
- `GET /purchases` - List all purchases
- `POST /purchases` - Create purchase
- `GET /purchases/:id` - Get purchase details

### Customers
- `GET /customers` - List all customers
- `POST /customers` - Create customer
- `GET /customers/:id` - Get customer details
- `PATCH /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Analytics & Reports
- `GET /analytics/dashboard` - Dashboard stats
- `GET /analytics/sales-trends` - Sales trends
- `GET /analytics/top-products` - Top products
- `GET /reports/sales` - Sales report
- `GET /reports/purchases` - Purchases report
- `GET /reports/profit` - Profit/loss report
- `GET /reports/stock` - Stock report

### Tasks & Messages
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `PATCH /tasks/:id/complete` - Complete task
- `GET /messages/org-chat` - Organization chat
- `POST /messages` - Send message

## 🎨 UI Components

Built with **React Native Paper** for Material Design:
- Cards, Buttons, TextInput
- Searchbar, Chips, FAB
- ActivityIndicator, Snackbar
- List, Divider, Badge

Navigation:
- **Bottom Tabs** - Main navigation (Dashboard, Products, Sales, Customers, More)
- **Stack Navigator** - Screen transitions
- **Drawer** - Additional features (Tasks, Messages, Reports, Settings)

## 🔐 Authentication Flow

1. User enters credentials on LoginScreen
2. App calls `/auth/login` endpoint
3. Receives `accessToken` and `refreshToken`
4. Tokens stored in AsyncStorage
5. All API requests include `Authorization: Bearer <token>`
6. On 401 error, auto-refresh token
7. On refresh failure, redirect to login

## 📊 State Management

Using **Zustand** for lightweight state management:

### Auth Store
- User data
- Tokens
- Login/logout functions
- Auto-load user on app start

### Data Store
- Cached products, sales, customers, etc.
- Add/update functions
- Clear cache on logout

## 🎯 User Roles & Permissions

### BOSS
- Full access to all features
- Create/manage users, branches
- View all reports
- Manage products, sales, purchases

### MANAGER
- Manage products
- Create purchases
- View reports
- Manage customers
- Create/assign tasks

### CASHIER
- Create sales
- View products (read-only)
- Manage customers
- View assigned tasks

## 📱 Screens Overview

### Dashboard
- Today's sales, profit, transactions
- Low stock alerts
- Quick actions (New Sale, New Purchase)
- Stats chips (customers, messages, tasks)

### Products
- Searchable product list
- Stock levels with color coding
- Create new products (BOSS/MANAGER)
- Low stock indicators

### Sales
- Sales history
- Create new sale with cart
- Customer selection
- Multiple payment methods
- Real-time total calculation

### Customers
- Customer database
- Search by name, phone, email
- Loyalty points display
- Customer type badges

### Reports
- Sales report
- Purchases report
- Profit/loss report
- Stock valuation report
- Date range selection

### Tasks
- Task list with status
- Priority indicators
- Create/assign tasks (BOSS/MANAGER)
- Mark as complete

### Messages
- Organization-wide chat
- Real-time message list
- Unread indicators
- Send new messages

## 🔄 Offline Support (Ready)

The app structure supports offline functionality:
- SQLite database schema ready
- Sync service structure in place
- Queue for offline operations
- Auto-sync when online

To enable:
1. Implement SQLite operations in `src/database/`
2. Enable sync service in `src/services/syncService.ts`
3. Add background sync with `expo-background-fetch`

## 🚀 Deployment

### Build for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Both
eas build --platform all
```

### Update API URL

Before building, update `src/utils/constants.ts`:

```typescript
export const API_URL = 'https://your-backend.onrender.com/api/v1';
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npx tsc --noEmit
```

## 📝 Environment Variables

Create `.env` file:

```env
API_URL=http://localhost:5000/api/v1
```

## 🐛 Troubleshooting

### Cannot connect to backend
- Ensure backend is running
- Check API_URL in constants.ts
- For Android emulator, use `http://10.0.2.2:5000/api/v1`
- For iOS simulator, use `http://localhost:5000/api/v1`

### Token expired errors
- Token auto-refresh should handle this
- If persists, logout and login again

### Navigation issues
- Clear cache: `npm start -- --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📄 License

Proprietary - All rights reserved

## 🤝 Support

For issues or questions, contact the development team.
