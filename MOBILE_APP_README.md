# Akariza Mobile App

A comprehensive stock management and sales application built with React Native and Expo, designed for cashiers, managers, and business owners.

## Features

### 🔐 Authentication
- Email/Password login with OTP verification
- Secure token management with automatic refresh
- Forgot password with OTP reset
- Role-based access control (CASHIER, MANAGER, BOSS, SYSTEM_ADMIN)

### 📊 Dashboard
- Role-specific dashboards with key metrics
- Real-time sales and profit tracking
- Low stock alerts
- Employee and customer statistics
- Sales trends visualization

### 💰 Sales Management
- Fast cashier interface for quick sales entry
- Product search and quantity controls
- Multiple payment methods (CASH, MOBILE, CARD, BANK_TRANSFER)
- Customer credit sales with loyalty tracking
- Automatic change calculation
- Receipt generation

### 📦 Inventory Management
- Product catalog with SKU and categories
- Real-time stock levels
- Low stock alerts
- Stock adjustments with reasons
- Stock valuation reports
- Product type filtering (REGULAR, FAST_MOVING)

### 👥 Customer Management
- Customer database with contact information
- Loyalty points system
- Purchase history tracking
- Customer transactions
- Customer type classification (VIP, WHOLESALE, RETAIL)

### 🛒 Purchase Management
- Purchase orders from suppliers
- Purchase tracking and history
- Payment status management
- Supplier management
- Purchase order approval workflow

### 💼 Employee Management
- Employee directory
- Attendance tracking
- Sales targets management
- User role management
- Activity logging

### 📊 Reports & Analytics
- Sales reports (daily, monthly)
- Profit analysis
- Best-selling products
- Low stock reports
- Expense tracking by category
- Revenue by category

### 📢 Notifications
- Real-time notifications
- Low stock alerts
- Expiring product alerts
- Debt reminders
- Task deadlines
- Unread notification badge

### 📝 Tasks & Collaboration
- Task management with status tracking
- Task assignment to employees
- Task comments and discussions
- Priority levels (LOW, MEDIUM, HIGH)
- Task completion tracking

### 💬 Messaging
- Direct messaging between users
- Branch-wide announcements
- Organization-wide broadcasts
- Conversation history
- Unread message tracking

### 🏢 Organization Management
- Multi-branch support
- Branch inventory transfers
- Organization statistics
- User management per branch
- Organization chat

### 🔄 Offline Support
- Automatic sync queue for offline operations
- Retry logic with exponential backoff
- Persistent storage of pending operations
- Automatic sync when online

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** Zustand
- **UI Components:** React Native Paper
- **Charts:** react-native-chart-kit
- **Storage:** AsyncStorage
- **HTTP Client:** Axios
- **Navigation:** React Navigation
- **Styling:** StyleSheet + Linear Gradient

## Project Structure

```
src/
├── api/              # API endpoints and services
├── screens/          # Screen components
├── components/       # Reusable components
├── store/           # Zustand state management
├── services/        # Business logic services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── theme/           # Theme and styling
└── navigation/      # Navigation configuration
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Expo CLI
- Android Studio or Xcode (for native builds)

### Installation

1. Clone the repository
```bash
git clone https://github.com/jeromeboitenge/Akariza-app.git
cd Akariza-app
```

2. Install dependencies
```bash
npm install
```

3. Configure API URL
Edit `src/utils/constants.ts`:
```typescript
export const API_URL = 'https://akariza-backend.onrender.com/api/v1';
```

4. Start the app
```bash
npm start
```

5. Run on device/emulator
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## API Integration

The app is fully integrated with the Akariza backend API. See [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md) for detailed API documentation.

### Key Features
- Automatic token refresh on 401 errors
- Centralized error handling
- User-friendly error messages
- Request/response logging
- Offline sync queue

## Authentication

### Login Flow
1. User enters email and password
2. Backend sends OTP to email
3. User enters OTP code
4. Tokens are stored securely
5. User is redirected to dashboard

### Token Management
- Access tokens stored in AsyncStorage
- Automatic refresh on expiration
- Logout clears all tokens

## Data Management

### Caching Strategy
- 5-minute cache TTL for data
- Cache validation before fetching
- Manual refresh capability
- Error state tracking

### Offline Support
- Sync queue for pending operations
- Automatic retry with backoff
- Queue status monitoring
- Manual sync triggering

## Screens

### Authentication
- LoginScreen - Email/password login
- OTPVerificationScreen - OTP entry
- ForgotPasswordScreen - Password reset request
- ResetPasswordScreen - New password entry

### Main Navigation
- DashboardScreen - Role-based dashboard
- SalesScreen - Sales list and creation
- ProductsScreen - Product catalog
- CustomersScreen - Customer management
- PurchasesScreen - Purchase management
- SuppliersScreen - Supplier management
- EmployeesScreen - Employee management
- BranchesScreen - Branch management
- ExpensesScreen - Expense tracking
- ReportsScreen - Report generation
- TasksScreen - Task management
- MessagesScreen - Messaging
- NotificationsScreen - Notifications

### Detail Screens
- ProductDetailScreen - Product information
- CustomerDetailScreen - Customer details
- SaleDetailScreen - Sale information
- PurchaseDetailScreen - Purchase details

## Styling

The app uses a consistent design system:
- Primary color: #5C6BF2
- Success: #4CAF50
- Warning: #FF9800
- Error: #F44336
- Info: #7B88F5

## Performance Optimization

- Lazy loading of screens
- Memoized components
- Efficient list rendering with FlatList
- Image optimization
- Bundle size optimization

## Error Handling

All API errors are handled with:
- User-friendly messages
- Automatic retries for network errors
- Token refresh on 401
- Detailed logging for debugging

## Debugging

Enable debug logging:
```typescript
// In any API call
console.log('📡 API Request:', endpoint);
console.log('✅ API Response:', data);
console.log('❌ API Error:', error);
```

## Building for Production

### Android APK
```bash
eas build --platform android --profile production
```

### iOS App
```bash
eas build --platform ios --profile production
```

### OTA Updates
```bash
eas update --branch production
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with descriptive messages
4. Push to GitHub
5. Create a pull request

## Commit Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Tests
- `chore:` - Build/dependency updates

## Troubleshooting

### App won't start
- Clear cache: `npm start -- --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node version: `node --version`

### API connection issues
- Verify API URL in constants
- Check internet connection
- Verify backend is running
- Check firewall settings

### Build errors
- Clear Gradle cache: `cd android && ./gradlew clean`
- Update Expo: `npm install -g expo-cli@latest`
- Check Java version: `java -version`

## Support

For issues and questions:
- GitHub Issues: [Akariza-app/issues](https://github.com/jeromeboitenge/Akariza-app/issues)
- Email: support@akariza.com

## License

MIT License - see LICENSE file for details

## Changelog

### v1.0.0 (Current)
- Initial release
- Full authentication flow
- Sales management
- Inventory management
- Customer management
- Reports and analytics
- Offline support
- Real-time notifications

## Future Roadmap

- [ ] Biometric authentication
- [ ] Advanced analytics
- [ ] Barcode scanning
- [ ] Receipt printing
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Push notifications
- [ ] WebSocket real-time updates
