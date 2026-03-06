# Akariza Mobile App - Design System & Architecture

## Overview
Production-ready React Native mobile application for retail management with offline-first architecture, following UR Binary Hub branding.

## Design System - UR Binary Hub Branding

### Primary Brand Color
- **Primary**: `#1C6FB7` - Main brand color for headers, buttons, primary actions
- **Primary Light**: `#2D9CDB` - Hover states, secondary elements
- **Primary Dark**: `#155A94` - Active states, emphasis

### Dashboard Card Colors
```typescript
Innovators Card:
  Background: #E6F2FF
  Icon: #2D9CDB

Solutions Card:
  Background: #E6F7F1
  Icon: #27AE60

Stakeholders Card:
  Background: #F1E8FF
  Icon: #9B51E0

Mentors Card:
  Background: #FFF1E6
  Icon: #F2994A
```

### Semantic Colors
- **Success**: `#27AE60` - Positive actions, confirmations
- **Warning**: `#F2994A` - Alerts, cautions
- **Error**: `#EB5757` - Errors, destructive actions
- **Info**: `#2D9CDB` - Information, neutral actions

### Background & Surface
- **Background**: `#F5F7FA` - Main app background
- **Background Gradient**: `#F5F7FA` → `#DCE6F2`
- **Surface**: `#FFFFFF` - Cards, modals
- **Surface Header**: `#F8F9FB` - Header backgrounds

### Text Colors
- **Primary Text**: `#1F2937` - Main content
- **Secondary Text**: `#6B7280` - Supporting text
- **Light Text**: `#9CA3AF` - Disabled, placeholders

### Spacing Scale
Use 8px base unit:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

### Typography
```typescript
Heading 1: 28px, Bold
Heading 2: 24px, Bold
Heading 3: 20px, SemiBold
Body: 16px, Regular
Caption: 14px, Regular
Small: 12px, Regular
```

### Border Radius
- **Small**: 8px - Badges, chips
- **Medium**: 12px - Buttons, inputs
- **Large**: 16px - Cards
- **XLarge**: 24px - Modals, sheets

### Shadows
```typescript
Small: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}

Medium: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4,
}

Large: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 8,
}
```

## Architecture

### Technology Stack
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Server State**: TanStack React Query (future)
- **Offline Database**: SQLite (expo-sqlite)
- **Forms**: React Hook Form + Zod
- **Charts**: React Native Chart Kit
- **Barcode**: expo-barcode-scanner
- **Notifications**: expo-notifications
- **i18n**: react-i18next (future)

### Folder Structure
```
mobile/
├── src/
│   ├── api/              # API client & endpoints
│   ├── components/       # Reusable components
│   ├── data/            # Mock data for development
│   ├── database/        # SQLite schema & queries
│   ├── hooks/           # Custom React hooks
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # Screen components
│   ├── services/        # Business logic services
│   ├── store/           # Zustand stores
│   ├── theme/           # Design system tokens
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── assets/              # Images, fonts, icons
└── App.tsx             # Root component
```

## Offline-First Architecture

### SQLite Schema
```sql
-- Products
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  barcode TEXT,
  category TEXT,
  costPrice REAL,
  sellingPrice REAL,
  currentStock INTEGER,
  minStockLevel INTEGER,
  unit TEXT,
  isActive INTEGER DEFAULT 1,
  syncStatus TEXT DEFAULT 'synced',
  clientGeneratedId TEXT,
  lastModified INTEGER,
  organizationId TEXT,
  branchId TEXT
);

-- Customers
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  customerType TEXT,
  loyaltyPoints INTEGER DEFAULT 0,
  creditLimit REAL DEFAULT 0,
  currentDebt REAL DEFAULT 0,
  isActive INTEGER DEFAULT 1,
  syncStatus TEXT DEFAULT 'synced',
  clientGeneratedId TEXT,
  lastModified INTEGER,
  organizationId TEXT
);

-- Sales
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  saleNumber TEXT UNIQUE,
  customerId TEXT,
  customerName TEXT,
  totalAmount REAL,
  discount REAL DEFAULT 0,
  finalAmount REAL,
  paymentMethod TEXT,
  paymentStatus TEXT,
  notes TEXT,
  createdAt INTEGER,
  syncStatus TEXT DEFAULT 'pending',
  clientGeneratedId TEXT,
  userId TEXT,
  branchId TEXT,
  organizationId TEXT
);

-- Sale Items
CREATE TABLE sale_items (
  id TEXT PRIMARY KEY,
  saleId TEXT,
  productId TEXT,
  productName TEXT,
  quantity INTEGER,
  sellingPrice REAL,
  total REAL,
  syncStatus TEXT DEFAULT 'pending',
  clientGeneratedId TEXT,
  FOREIGN KEY (saleId) REFERENCES sales(id)
);

-- Sync Queue
CREATE TABLE sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entityType TEXT NOT NULL,
  entityId TEXT NOT NULL,
  operation TEXT NOT NULL,
  payload TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  lastAttempt INTEGER,
  error TEXT,
  createdAt INTEGER DEFAULT (strftime('%s', 'now'))
);
```

### Sync Strategy
1. **Write-First**: All mutations write to SQLite first
2. **Queue**: Add to sync_queue with operation type
3. **Background Sync**: Sync when online
4. **Conflict Resolution**: Server wins, merge strategies
5. **Retry Logic**: Exponential backoff for failed syncs

### Sync Flow
```typescript
// 1. User creates sale offline
await createSaleLocally(saleData);
await addToSyncQueue('sale', saleId, 'CREATE', saleData);

// 2. When online, sync engine runs
const pendingItems = await getSyncQueue();
for (const item of pendingItems) {
  try {
    await syncToServer(item);
    await markAsSynced(item.id);
  } catch (error) {
    await incrementRetryCount(item.id);
  }
}

// 3. Pull updates from server
const lastSync = await getLastSyncTime();
const updates = await fetchUpdates(lastSync);
await mergeUpdates(updates);
```

## User Roles & Permissions

### BOSS
- Full access to all features
- View all branches
- Manage employees
- Financial reports
- Organization settings

### MANAGER
- Manage inventory
- View sales & reports
- Manage suppliers
- Manage purchases
- Branch operations

### CASHIER
- Create sales (POS)
- View products
- View customers
- Limited reports

## Core Screens

### 1. Dashboard
- Role-based metrics
- Quick actions
- Sales trends chart
- Low stock alerts
- Recent activity

### 2. POS (Point of Sale)
- Product search with autocomplete
- Barcode scanning
- Cart management
- Quick quantity adjustment
- Discount application
- Multiple payment methods
- Receipt generation

### 3. Products
- Product list with search/filter
- Stock levels with color coding
- Add/Edit product
- Barcode generation
- Stock movements
- Low stock alerts

### 4. Sales
- Sales history
- Sale details
- Receipt view/share
- Payment status
- Customer info

### 5. Purchases
- Purchase orders
- Supplier selection
- Item management
- Payment tracking

### 6. Customers
- Customer list
- Purchase history
- Loyalty points
- Credit management

### 7. Suppliers
- Supplier list
- Contact info
- Payment terms
- Purchase history

### 8. Reports
- Daily sales
- Profit analysis
- Best selling products
- Stock valuation
- Custom date ranges

## Development Mode

### Mock Data
All screens use mock data from `src/data/mockData.ts` for development.

### Bypass Authentication
Authentication is bypassed in `AppNavigator.tsx` to view all screens.

### Change User Role
Edit `mockUser.role` in `src/data/mockData.ts`:
- `BOSS` - Full access
- `MANAGER` - Management features
- `CASHIER` - POS only
- `SYSTEM_ADMIN` - Platform admin

## Component Library

### Cards
```typescript
<MetricCard
  icon="cash-register"
  value="$12,500"
  label="Today's Sales"
  color="#27AE60"
  trend={12}
/>
```

### Buttons
```typescript
<PrimaryButton onPress={handleSubmit}>
  Save Product
</PrimaryButton>

<SecondaryButton onPress={handleCancel}>
  Cancel
</SecondaryButton>
```

### Forms
```typescript
<FormInput
  label="Product Name"
  value={name}
  onChangeText={setName}
  error={errors.name}
/>
```

## Performance Optimization

### List Rendering
- Use `FlatList` with `getItemLayout`
- Implement `keyExtractor`
- Use `memo` for list items
- Virtualization for long lists

### Images
- Use `FastImage` for caching
- Optimize image sizes
- Lazy load images

### State Management
- Minimize re-renders
- Use selectors in Zustand
- Memoize expensive computations

## Testing Strategy

### Unit Tests
- Business logic
- Utility functions
- Custom hooks

### Integration Tests
- API integration
- Database operations
- Sync engine

### E2E Tests
- Critical user flows
- POS workflow
- Offline scenarios

## Deployment

### Build Configuration
```json
{
  "expo": {
    "name": "Akariza",
    "slug": "akariza-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1C6FB7"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.akariza.mobile"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1C6FB7"
      },
      "package": "com.akariza.mobile"
    }
  }
}
```

### OTA Updates
```bash
# Publish update
expo publish

# Build for stores
eas build --platform android
eas build --platform ios
```

## Next Steps

1. ✅ Design system implementation
2. ✅ Mock data setup
3. ✅ Authentication bypass for development
4. 🔄 Update all screens with new design
5. 🔄 Implement offline database
6. 🔄 Build sync engine
7. 🔄 Barcode scanning
8. 🔄 Receipt printing
9. 🔄 Push notifications
10. 🔄 Backend integration

## Notes

- All colors follow UR Binary Hub branding
- No additional colors should be introduced
- Offline-first is critical for retail environments
- Performance is priority for POS speed
- Design must be intuitive for non-technical users
