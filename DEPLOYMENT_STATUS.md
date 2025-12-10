# Let'sLegal - Complete System Deployment Guide

## 🚀 System Overview

**Let'sLegal** is a comprehensive law firm management system with three main components:

1. **Backend API** (Node.js + Express + MongoDB)
2. **Web Application** (React - Customer Portal + Admin Panel)
3. **Mobile Application** (React Native - Android APK)

---

## 📱 Live Deployments

### Backend API
- **URL**: https://letslegal-backend.onrender.com
- **Health Check**: https://letslegal-backend.onrender.com/api/health
- **Platform**: Render.com
- **Auto-Deploy**: Connected to GitHub `main` branch

### Web Application (Unified)
- **Production URL**: https://web-nckr8z4kq-ankush-mishras-projects-3af5bd1b.vercel.app
- **Customer Portal**: `/` (home page)
- **Admin Portal**: `/admin` (protected route)
- **Platform**: Vercel
- **Auto-Deploy**: Connected to GitHub

### Mobile Application
- **APK Location**: `mobile-app/android/app/build/outputs/apk/debug/app-debug.apk`
- **Size**: 168 MB
- **Platform**: Android (Native)
- **API Connection**: Currently points to production backend

---

## 🔑 Test Credentials

### Admin Account
```
Email: admin@letslegal.com
Password: Admin@123
Role: admin
```

### Customer Account
Register a new account through:
- Web: https://web-nckr8z4kq-ankush-mishras-projects-3af5bd1b.vercel.app/register
- Mobile: Use the Register screen

---

## 🎯 Features

### Customer Portal Features
✅ Browse 9 legal services (Company Incorporation, GST, FSSAI, etc.)
✅ View detailed service information
✅ Register/Login authentication
✅ Apply for services with form submission
✅ Track application status
✅ View application history
✅ Admin Portal button on homepage

### Admin Portal Features
✅ Dashboard with statistics and charts
✅ Manage applications (view, update status)
✅ Manage services (CRUD operations)
✅ Manage users (view all customers)
✅ Role-based access control
✅ Quick navigation sidebar

### Mobile App Features
✅ Browse all services
✅ Register/Login
✅ Apply for services
✅ View application history
✅ Push notifications ready
✅ Offline capability

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js v22
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT + Bcrypt
- **Payment**: Razorpay (optional)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer

### Web Frontend
- **Framework**: React 18.2
- **UI Library**: Material-UI 5
- **Routing**: React Router 6
- **State Management**: Context API
- **HTTP Client**: Axios
- **Charts**: Recharts

### Mobile App
- **Framework**: React Native + Expo SDK 54
- **Navigation**: React Navigation
- **UI**: React Native Paper
- **Storage**: AsyncStorage
- **Build**: Native Android (Gradle 8.14.3)

---

## 📊 Database Schema

### Collections
1. **users** - Customer and admin accounts
2. **services** - 9 legal services
3. **applications** - Customer applications
4. **payments** - Payment records
5. **forms** - Dynamic form submissions

### Pre-seeded Services
1. Company Incorporation - ₹6,999
2. Annual Compliance - ₹3,999
3. Legal Litigation - ₹2,999
4. Tender Tie-Up - Custom Pricing
5. FSSAI License - ₹1,499
6. Shop & Establishment - ₹2,499
7. MSME Registration - ₹999
8. Digital Signature Certificate - ₹1,999
9. Import Export Code - ₹2,999

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=10000
MONGODB_URI=mongodb+srv://abhisheks08100_db_user:VkADFyflwmJR7xOj@letslegal.0sqsxfj.mongodb.net/?appName=letslegal
JWT_SECRET=28b5c25ada6d8eb3ec4dc3d5a1212a28daa3eb3d4a7ab15025088fb0076ef4e4
NODE_ENV=production
```

### Web App (api.js)
```javascript
baseURL: 'https://letslegal-backend.onrender.com/api'
```

### Mobile App (api.js)
```javascript
baseURL: 'https://letslegal-backend.onrender.com/api'
```

---

## 🚀 Deployment Steps

### Backend (Render)
1. Connected to GitHub: `ankush454563-commits/let-slegal`
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment variables configured
6. Auto-deploys on push to `main`

### Web App (Vercel)
1. Connected to GitHub repository
2. Root Directory: `web-app`
3. Build Command: `npm run build`
4. Output Directory: `build`
5. Auto-deploys on push to `main`

### Mobile App (Manual)
1. Navigate to `mobile-app/android`
2. Run `./gradlew assembleDebug` (or assembleRelease)
3. APK generated in `app/build/outputs/apk/`
4. Install on Android device

---

## 🔧 Local Development

### Backend
```bash
cd backend
npm install
npm run dev  # Uses nodemon
# Server runs on http://localhost:5000
```

### Web App
```bash
cd web-app
npm install
npm start
# App runs on http://localhost:3000
```

### Mobile App
```bash
cd mobile-app
npm install
npx expo start
# Scan QR code with Expo Go app
```

---

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Services
- GET `/api/services` - Get all services
- GET `/api/services/:id` - Get single service
- POST `/api/admin/services` - Create service (admin)
- PUT `/api/admin/services/:id` - Update service (admin)
- DELETE `/api/admin/services/:id` - Delete service (admin)

### Applications
- GET `/api/applications/my-applications` - Get user's applications
- POST `/api/applications` - Create new application
- GET `/api/admin/applications` - Get all applications (admin)
- PUT `/api/admin/applications/:id` - Update application (admin)

### Admin
- GET `/api/admin/dashboard/stats` - Get dashboard statistics
- GET `/api/admin/users` - Get all users

---

## 🐛 Troubleshooting

### Registration 500 Error
**Fixed**: Phone validation was too strict (required exactly 10 digits)
- Updated model regex to allow 10-15 characters with +, -, spaces
- Removed strict validation from route middleware
- Added better error logging

### Backend Health Check
Access: https://letslegal-backend.onrender.com/api/health
Shows: MongoDB connection status, environment

### Mobile APK Issues
- Ensure Java 17 is installed and in PATH
- Run `./gradlew clean` before building
- Check `gradle.properties` for Java home path

### Vercel Build Failures
- Ensure `node_modules` is in `.gitignore`
- Check `vercel.json` configuration
- Verify `build` script in `package.json`

---

## 📦 Repository Structure

```
let-slegal/
├── backend/              # Node.js API
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, upload, etc.
│   └── scripts/         # Database seeding
├── web-app/             # React web application
│   ├── src/
│   │   ├── pages/       # Customer pages
│   │   ├── pages/admin/ # Admin pages
│   │   ├── components/  # Shared components
│   │   ├── context/     # Auth context
│   │   └── routes/      # Route configuration
│   └── public/
├── mobile-app/          # React Native app
│   ├── src/
│   │   ├── screens/     # App screens
│   │   ├── navigation/  # Navigation config
│   │   └── context/     # Auth context
│   └── android/         # Native Android
├── admin-panel/         # (Legacy - replaced by web-app)
└── customer-web/        # (Legacy - replaced by web-app)
```

---

## ✅ Completion Checklist

- [x] Backend API deployed to Render
- [x] MongoDB Atlas configured with production data
- [x] 9 services seeded in database
- [x] Admin account created
- [x] Web app deployed to Vercel
- [x] Customer portal functional
- [x] Admin portal functional (/admin)
- [x] Mobile APK built successfully
- [x] All API endpoints tested
- [x] Authentication working
- [x] Registration fixed (phone validation)
- [x] GitHub repository up to date
- [x] Auto-deployment configured

---

## 🎉 System Status: FULLY OPERATIONAL

All components are live and functional. The system is ready for production use.

**Last Updated**: December 10, 2025
**Git Commit**: 96980e8
**Deployment Status**: ✅ Active
