# 📱 Run Akariza on Your Android Phone

## ✅ Using Hosted Backend on Render

Your app is configured to use: **https://akariza-backend.onrender.com**

No local backend or network setup needed! 🎉

---

## 🚀 Quick Start (2 Steps)

### Step 1: Install Expo Go
- Open **Google Play Store** on your Android phone
- Search **"Expo Go"** and install
- Or visit: https://play.google.com/store/apps/details?id=host.exp.exponent

### Step 2: Run the App
```bash
cd mobile
./start-app.sh
```

Or manually:
```bash
cd mobile
npm start
```

### Step 3: Scan QR Code
- Open **Expo Go** app on your phone
- Tap **"Scan QR code"**
- Scan the QR code from terminal
- Wait for app to load (first time may take 1-2 minutes)

### Step 4: Login
```
Email:    admin@akariza.com
Password: admin123
```

---

## ✨ Benefits of Using Render Backend

✅ **No local backend needed** - Backend is already running on Render  
✅ **No network setup** - Works from anywhere with internet  
✅ **No firewall issues** - No ports to configure  
✅ **No IP address setup** - Already configured  
✅ **Works on any WiFi** - Not limited to same network  

---

## 📱 What You'll See

Once the app loads on your phone:
1. **Login Screen** - Professional Material Design UI
2. **Dashboard** - Real-time stats (sales, profit, transactions)
3. **Products** - Browse and manage products
4. **Sales** - Create sales with cart functionality
5. **Customers** - Customer management
6. **Reports** - Sales, purchases, profit reports
7. **Tasks & Messages** - Collaboration features

---

## 🐛 Troubleshooting

### App won't load?
- Check your phone has internet connection
- Try clearing Expo cache: `npm start -- --clear`
- Restart Expo Go app

### "Network request failed"?
- Verify backend is up: https://akariza-backend.onrender.com/api/v1/health
- Check your phone's internet connection
- Render free tier may sleep - first request wakes it up (takes ~30 seconds)

### Backend is sleeping?
Render free tier sleeps after inactivity. First request will wake it up:
- Wait 30-60 seconds on login screen
- Backend will wake up automatically
- Subsequent requests will be fast

---

## 🎯 Testing Checklist

- [ ] App loads on phone
- [ ] Login works
- [ ] Dashboard shows data
- [ ] Can view products
- [ ] Can create a sale
- [ ] Navigation works
- [ ] All features accessible

---

## 📝 Notes

- **Backend URL**: https://akariza-backend.onrender.com/api/v1
- **Configured in**: `mobile/src/utils/constants.ts`
- **No changes needed** - Ready to use!

---

## 🎉 That's It!

Your app is configured and ready to run on your Android phone!

```bash
cd mobile
./start-app.sh
```

**Enjoy your mobile app!** 📱
