# Let'sLegal - Quick Start Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies

```powershell
# Run the setup script (Windows PowerShell)
.\setup.ps1
```

Or manually install for each component:

```bash
# Backend
cd backend
npm install

# Admin Panel
cd admin-panel
npm install

# Mobile App
cd mobile-app
npm install
```

### Step 2: Setup MongoDB & Environment

1. **Start MongoDB**:
   ```powershell
   # Start MongoDB service (Windows)
   net start MongoDB
   ```

2. **Create .env files** (already created by setup script):
   - `backend/.env` - Update MongoDB URI and JWT secret
   - `admin-panel/.env` - Set API URL
   - `mobile-app/.env` - Set API URL

### Step 3: Seed Database & Start Apps

```bash
# Seed database with sample data and admin user
cd backend
npm run seed

# Start backend (Terminal 1)
npm start

# Start admin panel (Terminal 2)
cd admin-panel
npm start

# Start mobile app (Terminal 3)
cd mobile-app
npm start
```

## 📱 Access the Applications

- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000
- **Mobile App**: Scan QR code with Expo Go app

## 🔐 Default Admin Login

- **Email**: admin@letslegal.com
- **Password**: Admin@123

## 🎯 Test the Flow

### On Mobile App:
1. Register a new user
2. Browse services
3. Apply for "Legal Consultation"
4. Complete payment
5. Note the reference number
6. Track application status

### On Admin Panel:
1. Login with admin credentials
2. View the new application in Dashboard
3. Go to Applications page
4. Update status to "in-progress"
5. Create a custom form for additional info
6. Update status to "success"

## 🛠️ Common Commands

```bash
# Backend
npm start              # Start server
npm run dev           # Start with nodemon
npm run seed          # Seed database

# Admin Panel
npm start             # Start dev server
npm run build         # Build for production

# Mobile App
npm start             # Start Expo
npm run android       # Run on Android
npm run ios           # Run on iOS
```

## 📝 Project Structure Overview

```
sk122/
├── backend/           # API server (Port 5000)
├── admin-panel/       # Web admin (Port 3000)
├── mobile-app/        # React Native app
└── setup.ps1          # Setup script
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
net start MongoDB

# Or start manually
mongod
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (admin)
npx kill-port 3000
```

### Expo Issues
```bash
# Clear cache
cd mobile-app
npx expo start -c
```

## 📚 Next Steps

1. Read the main [README.md](README.md) for detailed documentation
2. Check API endpoints documentation
3. Customize services in admin panel
4. Configure payment gateway (Razorpay)
5. Deploy to production

## 💡 Tips

- Use **Postman** to test API endpoints
- Check **backend console** for API logs
- Use **React DevTools** for admin panel debugging
- Use **Expo DevTools** for mobile app debugging

## 🆘 Need Help?

- Check console errors in browser/terminal
- Verify all dependencies are installed
- Ensure MongoDB is running
- Check .env files are configured
- Review error messages carefully

---

**Happy Coding! 🎉**
