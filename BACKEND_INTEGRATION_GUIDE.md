# Backend Integration Guide

This document outlines how the Akariza mobile app is integrated with the backend API.

## API Configuration

**Base URL:** `https://akariza-backend.onrender.com/api/v1`

All API requests are made through the centralized `client.ts` which handles:
- Authentication (Bearer token)
- Token refresh on 401 errors
- Error handling and user-friendly messages
- Request/response logging

### Configuration File
- Location: `src/utils/constants.ts`
- Can be switched between local development and production URLs

## Authentication Flow

### 1. Login
```
POST /auth/login
Body: { email, password }
Response: { message, requiresOtp }
```

### 2. OTP Verification
```
POST /auth/verify-otp
Body: { email, otpCode }
Response: { accessToken, refreshToken, user }
```

Tokens are stored in AsyncStorage:
- `accessToken` - Used for API requests
- `refreshToken` - Used to refresh expired tokens
- `user` - Current user data

### 3. Token Refresh
Automatic on 401 response:
```
POST /auth/refresh
Body: { refreshToken }
Response: { accessToken, refreshToken }
```

### 4. Logout
```
POST /auth/logout
```
Clears all stored tokens and redirects to login.

## API Modules

### Core APIs

#### Authentication (`src/api/authApi.ts`)
- `login(email, password)` - Initial login
- `verifyOtp(email, otpCode)` - OTP verification
- `logout()` - Logout
- `refresh(refreshToken)` - Token refresh
- `forgotPassword(email)` - Request password reset
- `verifyResetOTP(email, otpCode)` - Verify reset OTP
- `resetPassword(email, otpCode, newPassword)` - Reset password

#### Dashboard (`src/api/dashboardApi.ts`)
- `getDashboard()` - Role-based dashboard data
- `getAdminOverview()` - System-wide overview
- `getOrganizationStats()` - Organization statistics
- `getAdminSalesStats(startDate, endDate)` - Sales analytics
- `getTopSellingProducts(limit)` - Top products
- `getUserActivity()` - User activity tracking
- `getBranchStats()` - Branch statistics

#### Products (`src/api/productsApi.ts`)
- `getAll()` - List all products
- `getById(id)` - Get product details
- `create(product)` - Create new product
- `update(id, product)` - Update product
- `delete(id)` - Delete product
- `getLowStock()` - Get low stock products
- `getByType(type)` - Filter by type (REGULAR, FAST_MOVING)
- `search(query)` - Search products
- `getStockLevels(id)` - Get stock levels

#### Sales (`src/api/salesApi.ts`)
- `getAll()` - List all sales
- `getById(id)` - Get sale details
- `create(sale)` - Create new sale
- `getMySales()` - Get user's sales

#### Purchases (`src/api/purchasesApi.ts`)
- `getAll()` - List all purchases
- `getById(id)` - Get purchase details
- `create(purchase)` - Create new purchase

#### Customers (`src/api/customersApi.ts`)
- `getAll()` - List all customers
- `getById(id)` - Get customer details
- `create(customer)` - Create new customer
- `update(id, customer)` - Update customer
- `delete(id)` - Delete customer
- `getPurchases(id)` - Get customer purchases
- `addLoyaltyPoints(id, points, reason)` - Add loyalty points
- `redeemLoyaltyPoints(id, points)` - Redeem points
- `getLoyaltyBalance(id)` - Get loyalty balance
- `getTransactions(id, startDate, endDate)` - Get transactions
- `addTransaction(id, transaction)` - Add transaction

#### Suppliers (`src/api/suppliersApi.ts`)
- `getAll()` - List all suppliers
- `getById(id)` - Get supplier details
- `create(supplier)` - Create new supplier
- `update(id, supplier)` - Update supplier
- `delete(id)` - Delete supplier

#### Employees (`src/api/employeesApi.ts`)
- `getAll()` - List all employees
- `getById(id)` - Get employee details
- `create(employee)` - Create new employee
- `update(id, employee)` - Update employee
- `delete(id)` - Delete employee
- `markAttendance(id, status)` - Mark attendance
- `setTarget(id, target)` - Set sales target

#### Branches (`src/api/branchesApi.ts`)
- `getAll()` - List all branches
- `getById(id)` - Get branch details
- `create(branch)` - Create new branch
- `update(id, branch)` - Update branch
- `delete(id)` - Delete branch
- `getInventory(id)` - Get branch inventory
- `transfer(id, transfer)` - Transfer inventory

#### Expenses (`src/api/expensesApi.ts`)
- `getAll()` - List all expenses
- `getById(id)` - Get expense details
- `create(expense)` - Create new expense
- `update(id, expense)` - Update expense
- `delete(id)` - Delete expense

#### Stock (`src/api/stockApi.ts`)
- `getTransactions(productId)` - Get stock transactions
- `adjustStock(data)` - Adjust stock levels
- `getValuation()` - Get stock valuation

#### Reports (`src/api/analyticsApi.ts`)
- `getSales(startDate, endDate)` - Sales report
- `getPurchases(startDate, endDate)` - Purchases report
- `getStock()` - Stock report
- `getProfit(startDate, endDate)` - Profit report
- `getBestSelling(limit)` - Best selling products

#### Analytics (`src/api/analyticsApi.ts`)
- `getDashboard()` - Analytics dashboard
- `getSalesTrends(period)` - Sales trends
- `getTopProducts(limit)` - Top products
- `getLowStockAlerts()` - Low stock alerts

#### Notifications (`src/api/notificationsApi.ts`)
- `getAll()` - List all notifications
- `getUnread()` - Get unread notifications
- `getUnreadCount()` - Get unread count
- `markAsRead(id)` - Mark as read
- `markAllAsRead()` - Mark all as read
- `delete(id)` - Delete notification
- `deleteAll()` - Delete all notifications
- `checkLowStock()` - Trigger low stock check
- `checkExpiring()` - Trigger expiring check
- `checkDebt()` - Trigger debt check
- `checkDeadlines()` - Trigger deadline check

#### Tasks (`src/api/tasksApi.ts`)
- `getAll()` - List all tasks
- `getById(id)` - Get task details
- `create(task)` - Create new task
- `update(id, task)` - Update task
- `delete(id)` - Delete task
- `complete(id)` - Mark task complete
- `getMyTasks()` - Get user's tasks
- `getByUser(userId)` - Get user's tasks
- `addComment(id, comment)` - Add comment
- `getComments(id)` - Get comments

#### Messages (`src/api/messagesApi.ts`)
- `getAll()` - List all messages
- `send(message)` - Send message
- `getUnread()` - Get unread count
- `markAsRead(id)` - Mark as read
- `getConversation(userId)` - Get conversation

#### Organization Chat (`src/api/orgChatApi.ts`)
- `send(message)` - Send org chat message
- `getMessages(limit)` - Get messages
- `getConversation(userId)` - Get conversation
- `getUsers()` - Get chat users
- `markAsRead(id)` - Mark as read
- `getUnreadCount()` - Get unread count
- `delete(id)` - Delete message

## Data Store

The app uses Zustand for state management with caching:

```typescript
// src/store/dataStore.ts
- products: Product[]
- sales: Sale[]
- purchases: Purchase[]
- customers: Customer[]
- suppliers: Supplier[]

// Cache metadata for each
- lastUpdated: timestamp
- isLoading: boolean
- error: string | null

// Utilities
- isCacheValid(meta, maxAge) - Check if cache is fresh
```

## Sync Service

Offline support with automatic sync when online:

```typescript
// src/services/syncService.ts
- initialize() - Start sync service
- stop() - Stop sync service
- addToQueue(type, action, data) - Add to sync queue
- syncQueue() - Process sync queue
- getQueueStatus() - Get queue status
- clearQueue() - Clear queue
```

Features:
- Persistent queue in AsyncStorage
- Retry logic with exponential backoff (max 3 retries)
- Periodic sync every 30 seconds
- Support for sales, purchases, and products

## Error Handling

All API errors are handled through the centralized client with:

1. **Automatic Token Refresh** - On 401 errors
2. **User-Friendly Messages** - Based on status codes
3. **Retry Logic** - For network errors
4. **Error Logging** - For debugging

Error messages are attached to responses:
```typescript
error.userMessage // User-friendly message
error.response?.data?.message // Backend message
```

## Usage Examples

### Fetching Data
```typescript
import { productsApi } from '../api';

const loadProducts = async () => {
  try {
    const products = await productsApi.getAll();
    setProducts(products);
  } catch (error) {
    console.error('Error:', error.userMessage);
  }
};
```

### Creating Data
```typescript
const createSale = async (saleData) => {
  try {
    const sale = await salesApi.create(saleData);
    addSale(sale);
  } catch (error) {
    alert(error.userMessage);
  }
};
```

### Offline Support
```typescript
import { SyncService } from '../services/syncService';

// Add to sync queue when offline
await SyncService.addToQueue('sale', 'create', saleData);

// Sync when online
await SyncService.syncQueue();
```

## Best Practices

1. **Always use try-catch** for API calls
2. **Check cache validity** before fetching
3. **Use sync service** for offline support
4. **Handle loading states** in UI
5. **Show user-friendly errors** from `error.userMessage`
6. **Log API calls** for debugging
7. **Validate data** before sending to backend
8. **Use proper TypeScript types** for API responses

## Debugging

Enable detailed logging by checking console output:
- `📡` - API requests
- `✅` - Successful responses
- `❌` - Errors
- `🔄` - Retries
- `📝` - Sync queue operations

## Environment Variables

Set in `.env` file:
```
API_URL=https://akariza-backend.onrender.com/api/v1
NODE_ENV=production
```

## Troubleshooting

### 401 Unauthorized
- Token expired or invalid
- Check AsyncStorage for tokens
- Try logging in again

### Network Error
- Check internet connection
- Verify API URL in constants
- Check backend server status

### Sync Queue Issues
- Check AsyncStorage for queue data
- Clear queue if corrupted: `SyncService.clearQueue()`
- Check retry count in queue status

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] GraphQL API support
- [ ] Advanced caching strategies
- [ ] Offline-first architecture
- [ ] Request batching
- [ ] Rate limiting
