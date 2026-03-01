# 📱 Run Akariza on Your Android Phone

## Quick Start (3 Steps)

### Step 1: Install Expo Go on Your Phone
1. Open Google Play Store on your Android phone
2. Search for "Expo Go"
3. Install the app
4. **Or visit**: https://play.google.com/store/apps/details?id=host.exp.exponent

### Step 2: Run the Setup Script
```bash
cd mobile
./run-on-phone.sh
```

This script will:
- ✅ Detect your computer's IP address
- ✅ Update the API URL automatically
- ✅ Check if backend is running
- ✅ Start Expo development server

### Step 3: Scan QR Code
1. Open **Expo Go** app on your phone
2. Tap **"Scan QR code"**
3. Scan the QR code shown in your terminal
4. Wait for the app to load

---

## Manual Setup (If Script Doesn't Work)

### 1. Find Your Computer's IP Address

**Linux:**
```bash
hostname -I
# or
ip addr show
```

**Mac:**
```bash
ifconfig en0 | grep inet
```

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address"
```

Example IP: `192.168.1.100`

### 2. Update API URL

Edit `mobile/src/utils/constants.ts`:
```typescript
export const API_URL = 'http://YOUR_IP_HERE:5000/api/v1';
// Example: 'http://192.168.1.100:5000/api/v1'
```

### 3. Start Backend

```bash
cd backend
npm run start:dev
```

### 4. Start Mobile App

```bash
cd mobile
npm start
```

### 5. Connect Your Phone

1. Make sure your phone and computer are on the **SAME WiFi network**
2. Open **Expo Go** app
3. Tap **"Scan QR code"**
4. Scan the QR code from terminal

---

## Important Notes

### ⚠️ Same WiFi Network Required
Your phone and computer **MUST** be on the same WiFi network for this to work.

### 🔥 Firewall Settings
If you can't connect, check your firewall:

**Linux:**
```bash
sudo ufw allow 5000
sudo ufw allow 8081
sudo ufw allow 19000:19001/tcp
```

**Mac:**
System Preferences → Security & Privacy → Firewall → Allow incoming connections for Node

**Windows:**
Windows Defender Firewall → Allow an app → Allow Node.js

### 🌐 Backend Must Be Accessible
Your backend must accept connections from your local network:

Edit `backend/src/main.ts` if needed:
```typescript
await app.listen(5000, '0.0.0.0'); // Listen on all interfaces
```

---

## Troubleshooting

### Problem: Can't scan QR code
**Solution**: 
- Type `a` in terminal to open Android emulator
- Or manually enter the URL shown in Expo Go app

### Problem: "Network request failed"
**Solution**:
1. Check your IP address is correct in `constants.ts`
2. Verify backend is running: `curl http://YOUR_IP:5000/api/v1/health`
3. Check firewall settings
4. Ensure same WiFi network

### Problem: "Unable to connect to development server"
**Solution**:
1. Restart Expo: Press `r` in terminal
2. Clear cache: `npm start -- --clear`
3. Restart Expo Go app on phone

### Problem: Backend connection timeout
**Solution**:
1. Check backend is running: `cd backend && npm run start:dev`
2. Test backend from phone's browser: `http://YOUR_IP:5000/api/v1/health`
3. If browser works but app doesn't, restart the app

---

## Alternative: Use Deployed Backend

If local network doesn't work, deploy your backend and use that URL:

### Deploy Backend to Render.com (Free)
1. Push backend to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect your GitHub repo
5. Deploy

### Update Mobile App
Edit `mobile/src/utils/constants.ts`:
```typescript
export const API_URL = 'https://your-app.onrender.com/api/v1';
```

---

## Login Credentials

```
Email:    admin@akariza.com
Password: admin123
```

---

## Testing Checklist

Once app loads on your phone:

- [ ] Login works
- [ ] Dashboard shows stats
- [ ] Can view products
- [ ] Can create a sale
- [ ] Can view customers
- [ ] Navigation works
- [ ] Pull-to-refresh works

---

## Quick Commands

```bash
# Run on phone (automated)
./run-on-phone.sh

# Start manually
npm start

# Clear cache
npm start -- --clear

# Restart
# Press 'r' in terminal

# Open on Android emulator
# Press 'a' in terminal
```

---

## Need Help?

1. Check your IP is correct
2. Verify same WiFi network
3. Check firewall settings
4. Restart backend and Expo
5. Clear Expo cache

---

## Success! 🎉

Once connected, you should see:
- Login screen
- Can login with credentials
- Dashboard with stats
- All features working

**Enjoy your mobile app!** 📱
