# 🚀 Quick Start Guide - Akariza Mobile App

## ⚡ Get Started in 3 Minutes

### 1. Install & Run
```bash
cd mobile
npm install --legacy-peer-deps
npm start -- --offline --clear
```

### 2. Open on Phone
- Install **Expo Go** from Play Store
- Scan QR code
- Login: `admin@akariza.com` / `admin123`

---

## 📱 Main Features Access

### For BOSS/ADMIN
1. **Dashboard** → Home tab
2. **Products** → Products tab → + button to add
3. **Sales** → Sales tab → + button to create
4. **Customers** → Customers tab → + button to add
5. **Suppliers** → More tab → Suppliers → + button
6. **Branches** → More tab → Branches → + button
7. **Employees** → More tab → Employees
8. **Expenses** → More tab → Expenses → + button
9. **Tasks** → More tab → Tasks → + button
10. **Promotions** → More tab → Promotions → + button
11. **Messages** → More tab → Messages
12. **Notifications** → More tab → Notifications
13. **Organizations** → More tab → Organizations (Admin only)
14. **Reports** → More tab → Reports & Analytics

### For MANAGER
- Products, Purchases, Suppliers, Expenses, Reports, Branches

### For CASHIER
- Sales, Products (view only), Customers, Dashboard

---

## 🎨 Color Scheme

- **Primary**: #1976D2 (Blue)
- **Success**: #4CAF50 (Green)
- **Warning**: #FF9800 (Orange)
- **Error**: #F44336 (Red)
- **Info**: #2196F3 (Light Blue)
- **Purple**: #9C27B0 (Tasks, Admin)
- **Pink**: #E91E63 (Promotions)

---

## 📂 Key Files

### Screens
- `src/screens/` - All 32 screens
- `src/navigation/AppNavigator.tsx` - Navigation setup

### API
- `src/api/` - All 18 API modules
- `src/api/client.ts` - Axios configuration

### State
- `src/store/authStore.ts` - Authentication
- `src/store/dataStore.ts` - Data caching

### Config
- `src/utils/constants.ts` - API URL
- `src/theme/index.ts` - Theme colors

---

## 🔧 Common Tasks

### Change Backend URL
Edit `src/utils/constants.ts`:
```typescript
export const API_URL = 'YOUR_BACKEND_URL/api/v1';
```

### Add New Screen
1. Create `src/screens/NewScreen.tsx`
2. Import in `src/navigation/AppNavigator.tsx`
3. Add to Stack.Navigator
4. Add menu item in `SettingsScreen.tsx`

### Add New API Module
1. Create `src/api/newApi.ts`
2. Export in `src/api/index.ts`
3. Add types in `src/types/index.ts`

---

## 🐛 Troubleshooting

### App won't start
```bash
pkill -f expo
rm -rf node_modules/.cache
npm start -- --clear
```

### Can't connect to backend
- Check `src/utils/constants.ts` has correct URL
- Ensure backend is running
- Check network connectivity

### Package conflicts
```bash
npm install --legacy-peer-deps
```

### TypeScript errors
```bash
npx tsc --noEmit
```

---

## 📱 Testing Checklist

- [ ] Login/Logout works
- [ ] Dashboard loads with data
- [ ] Can create new product
- [ ] Can create new sale
- [ ] Can create new customer
- [ ] Search works on all screens
- [ ] Pull-to-refresh works
- [ ] Navigation between screens works
- [ ] Role-based access works
- [ ] Forms validate input
- [ ] Error messages display

---

## 🎯 Quick Commands

```bash
# Start app
npm start

# Start with cache clear
npm start -- --clear

# Start offline mode
npm start -- --offline

# Check TypeScript
npx tsc --noEmit

# Kill Expo
pkill -f expo

# Reinstall
rm -rf node_modules && npm install --legacy-peer-deps
```

---

## 📊 Screen Count by Module

- **Products**: 3 screens (List, Detail, New)
- **Sales**: 3 screens (List, Detail, New)
- **Customers**: 3 screens (List, Detail, New)
- **Purchases**: 2 screens (List, New)
- **Suppliers**: 2 screens (List, New)
- **Branches**: 2 screens (List, New)
- **Employees**: 1 screen (List)
- **Expenses**: 2 screens (List, New)
- **Tasks**: 2 screens (List, New)
- **Promotions**: 2 screens (List, New)
- **Messages**: 2 screens (List, Chat)
- **Notifications**: 1 screen (List)
- **Organizations**: 3 screens (List, Branches, New)
- **Reports**: 1 screen
- **Dashboard**: 1 screen
- **Settings**: 1 screen
- **Login**: 1 screen

**Total**: 32 screens

---

## 🔐 Test Accounts

### Admin
- Email: `admin@akariza.com`
- Password: `admin123`
- Access: Everything

### Manager (if available)
- Email: `manager@akariza.com`
- Password: `manager123`
- Access: Products, Purchases, Reports

### Cashier (if available)
- Email: `cashier@akariza.com`
- Password: `cashier123`
- Access: Sales, Customers

---

## 📝 Development Tips

1. **Use TypeScript** - All types are defined in `src/types/index.ts`
2. **Follow Material Design** - Use React Native Paper components
3. **Consistent styling** - Use theme colors from `src/theme/index.ts`
4. **Error handling** - Always wrap API calls in try-catch
5. **Loading states** - Show ActivityIndicator during data fetch
6. **Empty states** - Show helpful message when no data
7. **Pull-to-refresh** - Add to all list screens
8. **Search** - Add to screens with many items
9. **Role-based** - Check user role before showing features
10. **Navigation** - Use navigation.navigate() for screen changes

---

## 🎉 You're Ready!

The app is fully functional and ready to use. Explore all features and customize as needed!

**Happy Coding! 🚀**
