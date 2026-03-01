# 📱 Quick Setup - Run on Your Android Phone

## 3 Simple Steps:

### 1. Install Expo Go
- Open Google Play Store on your phone
- Search "Expo Go" and install
- Or visit: https://play.google.com/store/apps/details?id=host.exp.exponent

### 2. Run the Script
```bash
cd mobile
./run-on-phone.sh
```

### 3. Scan QR Code
- Open Expo Go app
- Tap "Scan QR code"
- Scan the QR code from terminal
- Login: admin@akariza.com / admin123

## That's it! 🎉

**Important**: Your phone and computer must be on the same WiFi network.

---

## Troubleshooting

### Can't connect?
1. Check both devices on same WiFi
2. Run `./get-ip.sh` to verify your IP
3. Update IP in `src/utils/constants.ts`
4. Restart: `npm start -- --clear`

### Backend not accessible?
```bash
# Make backend listen on all interfaces
# Edit backend/src/main.ts:
await app.listen(5000, '0.0.0.0');
```

### Firewall blocking?
```bash
# Linux
sudo ufw allow 5000
sudo ufw allow 8081
sudo ufw allow 19000:19001/tcp
```

---

## Manual Setup

If script doesn't work:

1. **Find your IP**: `hostname -I` (Linux) or `ipconfig` (Windows)
2. **Update** `src/utils/constants.ts`:
   ```typescript
   export const API_URL = 'http://YOUR_IP:5000/api/v1';
   ```
3. **Start backend**: `cd backend && npm run start:dev`
4. **Start mobile**: `cd mobile && npm start`
5. **Scan QR** with Expo Go app

---

## Need Help?

Read the full guide: [RUN_ON_PHONE.md](./RUN_ON_PHONE.md)
