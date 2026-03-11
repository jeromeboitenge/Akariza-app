# Mobile App - Next Phases Implementation Guide

## Quick Reference for Remaining Work

---

## Phase 2: Multi-language Support (Priority: HIGH)

### Libraries to Install
```bash
npm install react-i18next i18next
npm install @react-native-async-storage/async-storage # Already installed
```

### Files to Create

**1. `mobile/src/i18n/index.ts`**
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import rw from './locales/rw.json';
import fr from './locales/fr.json';

const LANGUAGE_KEY = 'app_language';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      rw: { translation: rw },
      fr: { translation: fr },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Load saved language
AsyncStorage.getItem(LANGUAGE_KEY).then((lang) => {
  if (lang) i18n.changeLanguage(lang);
});

export default i18n;
```

**2. Translation Files**
- `mobile/src/i18n/locales/en.json` - Copy from `akariza-web/messages/en.json`
- `mobile/src/i18n/locales/rw.json` - Copy from `akariza-web/messages/rw.json`
- `mobile/src/i18n/locales/fr.json` - Copy from `akariza-web/messages/fr.json`

**3. Language Switcher Component**
```typescript
// mobile/src/components/LanguageSwitcher.tsx
import React from 'react';
import { View } from 'react-native';
import { Menu, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [visible, setVisible] = React.useState(false);

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('app_language', lang);
    setVisible(false);
  };

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={<Button onPress={() => setVisible(true)}>Language</Button>}
    >
      <Menu.Item onPress={() => changeLanguage('en')} title="English" />
      <Menu.Item onPress={() => changeLanguage('rw')} title="Kinyarwanda" />
      <Menu.Item onPress={() => changeLanguage('fr')} title="Français" />
    </Menu>
  );
}
```

### Usage in Screens
```typescript
import { useTranslation } from 'react-i18next';

function MyScreen() {
  const { t } = useTranslation();
  
  return (
    <Title>{t('dashboard.title')}</Title>
  );
}
```

---

## Phase 3: User Management (Priority: MEDIUM)

### Screens to Create

**1. UsersScreen.tsx**
- List all users with role badges
- Search and filter functionality
- Permission-based action buttons
- Pull to refresh

**2. NewUserScreen.tsx**
- Form to create new user
- Role selection (based on permissions)
- Branch/Organization assignment
- Validation

**3. Update EditUserScreen.tsx**
- Only accessible to BOSS and SYSTEM_ADMIN
- Edit user details
- Change role
- Activate/deactivate user

### Permission Checks
```typescript
import { hasPermission } from '../utils/permissions';
import { useAuthStore } from '../store/authStore';

const user = useAuthStore((state) => state.user);
const canCreate = hasPermission(user, 'CREATE_USERS');
const canEdit = hasPermission(user, 'EDIT_USERS');
const canDelete = hasPermission(user, 'DELETE_USERS');
```

---

## Phase 4: Dashboard Enhancements (Priority: MEDIUM)

### Date Formatting Fixes
Update all date displays to use consistent formatting:

```typescript
// mobile/src/utils/formatters.ts
import { format, parseISO } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
}
```

### Role-Specific Dashboard Views
```typescript
// In DashboardScreen.tsx
const user = useAuthStore((state) => state.user);

// Show different stats based on role
const showAdminStats = isSystemAdmin(user);
const showBossStats = isBoss(user) || isSystemAdmin(user);
const showManagerStats = isManager(user) || isBoss(user) || isSystemAdmin(user);
```

---

## Phase 5: Additional Features (Priority: LOW)

### Purchase Orders
- Create PurchaseOrdersScreen
- Implement approval workflow
- Add status tracking

### Stock Management
- Create StockManagementScreen
- Implement stock adjustments
- Add transfer functionality

### Reports
- Create ReportsScreen
- Implement report generation
- Add export functionality

### Analytics
- Create AnalyticsScreen
- Add charts and graphs
- Implement date range filtering

---

## Testing Checklist

### After Each Phase
- [ ] Test with all user roles (SYSTEM_ADMIN, BOSS, MANAGER, CASHIER)
- [ ] Verify permission checks work correctly
- [ ] Test on both Android and iOS (if applicable)
- [ ] Check offline functionality
- [ ] Verify data sync works
- [ ] Test error handling
- [ ] Check performance
- [ ] Verify UI/UX consistency

### Before Production
- [ ] All phases complete
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance optimized
- [ ] Security audit complete
- [ ] Documentation updated
- [ ] User acceptance testing done

---

## Commit Message Format

Use conventional commits:
```
feat: add multi-language support
fix: resolve date formatting issues
docs: update user management guide
refactor: improve permission checks
test: add unit tests for sales module
```

---

## Resources

### Frontend Reference Files
- `akariza-web/lib/permissions.ts` - Permission system
- `akariza-web/app/(dashboard)/sales/page.tsx` - Sales implementation
- `akariza-web/messages/*.json` - Translation files
- `akariza-web/components/language-switcher.tsx` - Language switcher

### Backend API Documentation
- Base URL: `https://akariza-backend.onrender.com/api/v1`
- Auth endpoints: `/auth/*`
- Resource endpoints: `/products`, `/sales`, `/users`, etc.

### Test Credentials
- BOSS: boss@store.com / boss123
- MANAGER: manager@store.com / manager123
- CASHIER: cashier@store.com / cashier123

---

## Quick Commands

### Development
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

### Git
```bash
# Commit changes
git add -A
git commit -m "feat: description"
git push origin main

# Check status
git status
git log --oneline -5
```

### Build
```bash
# Build APK
eas build --platform android --profile preview

# Build for production
eas build --platform android --profile production
```

---

**Last Updated:** March 11, 2026
**Current Phase:** 1 Complete, Starting Phase 2
