# Let'sLegal - Complete System Documentation

## 🏗️ System Architecture

### **Three-Tier Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Customer Web │  │  Admin Panel │  │  Mobile App  │     │
│  │   (Vercel)   │  │   (Vercel)   │  │  (Android)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND LAYER                           │
│              Node.js + Express API (Render)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication │ Services │ Applications │ Payments │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ MongoDB Driver
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                          │
│              MongoDB Atlas (Cloud Database)                 │
│     Users │ Services │ Applications │ Payments │ Forms     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **How Each Component Works**

### **1. Backend API (Node.js + Express)**
**Location:** `backend/`
**Deployment:** Render.com

#### **Core Files:**
- `server.js` - Main application entry point
- `models/` - Database schemas (User, Service, Application, Payment)
- `controllers/` - Business logic for each feature
- `routes/` - API endpoint definitions
- `middleware/` - Authentication & file upload handlers

#### **Key Features:**
- **Authentication:** JWT tokens for secure user sessions
- **Role-Based Access:** Customer vs Admin permissions
- **File Uploads:** Multer for document handling
- **Payment Integration:** Razorpay (optional, simulation mode enabled)
- **Database:** MongoDB Atlas with Mongoose ODM

#### **API Endpoints:**
```
POST   /api/auth/register          - Create new user account
POST   /api/auth/login             - User login (get JWT token)
GET    /api/services               - List all services
GET    /api/services/:id           - Get service details
POST   /api/applications           - Submit new application
GET    /api/applications/my        - User's applications
GET    /api/applications           - Admin: all applications
PUT    /api/applications/:id       - Update application status
POST   /api/payments/create-order  - Initiate payment
POST   /api/payments/verify        - Verify payment callback
GET    /api/admin/stats            - Dashboard statistics
```

#### **How Backend Processes Requests:**
```javascript
// Example: Customer applies for service
1. Customer clicks "Apply Now" on frontend
2. Frontend sends POST to /api/applications with:
   {
     serviceId: "12345",
     formData: { details: "..." }
   }
3. Backend middleware checks JWT token
4. Controller creates Application record in MongoDB
5. Generates unique reference number
6. Returns application data to frontend
7. Frontend redirects to payment page
```

---

### **2. Customer Web App (React)**
**Location:** `customer-web/`
**Deployment:** Vercel
**URL:** https://letslegal-admin-panel-6t0pipp6g.vercel.app

#### **Pages & Flow:**

**Home Page (`/`)**
- Displays all 9 services in card grid
- Shows service name, description, price, category
- "View Details" → Service detail page
- "Apply Now" → Application form (requires login)

**Login/Register (`/login`, `/register`)**
- User authentication via backend API
- Stores JWT token in localStorage
- Auto-redirects to home after login

**Service Detail (`/service/:id`)**
- Full service information
- Features, required documents, pricing
- Processing time estimate
- Direct "Apply" button

**Apply for Service (`/apply/:id`)**
- Protected route (login required)
- Pre-filled user information
- Text area for additional details
- Submits application to backend
- Creates payment order

**My Applications (`/my-applications`)**
- Lists all user's applications
- Shows status: pending/in_progress/completed/rejected
- Reference number for tracking
- View details button

#### **State Management:**
- `AuthContext` - Global user authentication state
- `localStorage` - Persists JWT token & user data
- `axios` interceptors - Auto-attaches JWT to API calls

---

### **3. Admin Panel (React + Material-UI)**
**Location:** `admin-panel/`
**Deployment:** Vercel
**URL:** https://letslegal-admin-panel.vercel.app

#### **Admin Pages:**

**Dashboard (`/dashboard`)**
- Total users count
- Total applications count
- Total revenue sum
- Recent applications table
- Recharts for data visualization

**Services Management (`/services`)**
- Create new services
- Edit existing services (name, price, description, features)
- Activate/deactivate services
- Set required documents & form fields

**Applications Management (`/applications`)**
- View all customer applications
- Filter by status
- Update application status (pending → in_progress → completed)
- View customer details & submitted documents
- Add admin notes

**Users Management (`/users`)**
- List all registered users
- View user profiles
- See user's application history
- Search & filter users

#### **Admin Credentials:**
```
Email: admin@letslegal.com
Password: Admin@123
```

---

### **4. Mobile App (React Native + Expo)**
**Location:** `mobile-app/`
**Platform:** Android (iOS compatible)

#### **Screens:**

**Authentication:**
- LoginScreen - Email/password login
- RegisterScreen - New user signup

**Main Navigation (Bottom Tabs):**
- HomeScreen - Browse services
- ServicesScreen - Full service list
- MyApplicationsScreen - User's applications
- ProfileScreen - User account settings

**Feature Screens:**
- ServiceDetailScreen - Service info
- ApplicationFormScreen - Apply for service
- PaymentScreen - Razorpay integration
- ApplicationDetailScreen - View status
- TrackScreen - Track by reference number

#### **Native Features:**
- AsyncStorage for offline token storage
- React Native Paper for Material Design UI
- React Navigation for screen transitions
- Axios for API communication

---

## 🔐 **Authentication Flow**

### **User Registration:**
```
1. User enters: name, email, phone, password
2. Frontend validates input
3. POST /api/auth/register
4. Backend hashes password (bcrypt)
5. Creates user in MongoDB
6. Returns JWT token + user object
7. Frontend stores in localStorage/AsyncStorage
8. User automatically logged in
```

### **Subsequent Requests:**
```
1. Frontend reads token from storage
2. Axios interceptor adds: Authorization: Bearer <token>
3. Backend middleware (auth.js) verifies JWT
4. Extracts user ID from token
5. Attaches user to req.user
6. Controller processes request with user context
```

---

## 💳 **Payment Flow**

### **Razorpay Integration:**
```
1. User submits application
2. Backend creates Razorpay order
3. Returns order_id to frontend
4. Frontend opens Razorpay checkout
5. User completes payment
6. Razorpay sends callback to backend
7. Backend verifies payment signature
8. Updates Payment & Application records
9. Sends success response
```

**Simulation Mode** (when Razorpay not configured):
- Creates mock payment records
- Auto-marks as successful
- Allows testing without actual payment gateway

---

## 📊 **Database Schema**

### **Collections:**

**Users**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  phone: String,
  role: "customer" | "admin",
  createdAt: Date
}
```

**Services**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  price: Number,
  processingTime: String,
  features: [String],
  requiredDocuments: [String],
  isActive: Boolean,
  createdAt: Date
}
```

**Applications**
```javascript
{
  _id: ObjectId,
  referenceNumber: String (unique, auto-generated),
  user: ObjectId (ref: User),
  service: ObjectId (ref: Service),
  status: "pending" | "in_progress" | "completed" | "rejected",
  formData: Object,
  documents: [String], // file paths
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Payments**
```javascript
{
  _id: ObjectId,
  application: ObjectId (ref: Application),
  user: ObjectId (ref: User),
  amount: Number,
  orderId: String,
  paymentId: String,
  status: "pending" | "completed" | "failed",
  paymentMethod: String,
  createdAt: Date
}
```

---

## 🚀 **Deployment Architecture**

### **Production URLs:**
- **Backend API:** `https://letslegal-backend.onrender.com` (to be deployed)
- **Customer Web:** `https://letslegal-admin-panel-6t0pipp6g.vercel.app` (live)
- **Admin Panel:** `https://letslegal-admin-panel.vercel.app` (live)
- **Mobile App:** Android APK (to be built)

### **Environment Variables:**

**Backend (Render):**
```
MONGODB_URI=mongodb+srv://abhisheks08100_db_user:VkADFyflwmJR7xOj@letslegal.0sqsxfj.mongodb.net/?appName=letslegal
JWT_SECRET=28b5c25ada6d8eb3ec4dc3d5a1212a28daa3eb3d4a7ab15025088fb0076ef4e4
NODE_ENV=production
PORT=5000
RAZORPAY_KEY_ID=(optional)
RAZORPAY_KEY_SECRET=(optional)
```

**Frontend (Vercel):**
```
REACT_APP_API_URL=https://letslegal-backend.onrender.com/api
```

**Mobile App (.env):**
```
API_URL=http://192.168.1.6:5000/api (local)
API_URL=https://letslegal-backend.onrender.com/api (production)
```

---

## 🔄 **Complete User Journey**

### **Customer Flow:**
```
1. Customer visits website → Home page shows 9 services
2. Clicks service → Sees full details & pricing
3. Clicks "Apply Now" → Redirected to login (if not logged in)
4. Registers/Logs in → Stores JWT token
5. Fills application form → Submits with details
6. Redirected to payment → Completes payment via Razorpay
7. Gets confirmation → Reference number generated
8. Tracks application → Views status updates
9. Receives completion → Downloads documents (future)
```

### **Admin Flow:**
```
1. Admin logs in → admin@letslegal.com
2. Dashboard → Sees overview stats
3. Applications tab → Views pending applications
4. Clicks application → Sees customer details
5. Updates status → "In Progress"
6. Adds notes → "Documents verified, processing started"
7. Completes work → Updates to "Completed"
8. Customer notified → Can see updated status
```

---

## 🛠️ **Technology Stack**

### **Backend:**
- Node.js v18+
- Express.js 4.18
- MongoDB Atlas (Cloud)
- Mongoose ODM
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- Multer (file uploads)
- Razorpay SDK
- Helmet (security)
- CORS (cross-origin)

### **Customer Web:**
- React 18.2
- React Router 6
- Material-UI 5
- Axios
- localStorage

### **Admin Panel:**
- React 18.2
- Material-UI 5
- React Router 6
- Recharts (graphs)
- Axios

### **Mobile App:**
- React Native
- Expo SDK 54
- React Navigation
- React Native Paper
- AsyncStorage
- Axios

---

## 📦 **Project Structure**

```
sk122/
├── backend/                    # Node.js API
│   ├── server.js              # Entry point
│   ├── models/                # Database schemas
│   ├── controllers/           # Business logic
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth & upload
│   ├── scripts/seed.js        # Database seeding
│   └── package.json
│
├── admin-panel/               # Admin web app
│   ├── src/
│   │   ├── pages/            # Dashboard, Services, Users, Apps
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth state
│   │   └── config/api.js     # Axios setup
│   └── package.json
│
├── customer-web/              # Customer web app
│   ├── src/
│   │   ├── pages/            # Home, Login, Apply, etc.
│   │   ├── context/          # Auth state
│   │   └── config/api.js     # Axios setup
│   └── package.json
│
├── mobile-app/                # React Native app
│   ├── App.js
│   ├── android/              # Native Android code
│   ├── src/
│   │   ├── screens/          # App screens
│   │   ├── navigation/       # Stack & tab navigation
│   │   └── context/          # Auth state
│   └── package.json
│
└── README.md                  # This file
```

---

## 🔧 **Local Development Setup**

### **1. Backend:**
```bash
cd backend
npm install
# Create .env with MongoDB URI and JWT secret
npm run seed      # Seed database
npm start         # Start on port 5000
```

### **2. Customer Web:**
```bash
cd customer-web
npm install
# Create .env: REACT_APP_API_URL=http://localhost:5000/api
npm start         # Start on port 3000
```

### **3. Admin Panel:**
```bash
cd admin-panel
npm install
# Create .env: REACT_APP_API_URL=http://localhost:5000/api
npm start         # Start on port 3001
```

### **4. Mobile App:**
```bash
cd mobile-app
npm install
npx expo start    # Start Expo dev server
# Scan QR code with Expo Go app
# OR
# For Android Studio:
npx expo prebuild
cd android
./gradlew assembleDebug
```

---

## 🎨 **Key Features Implemented**

✅ User registration & authentication
✅ JWT-based secure sessions
✅ 9 comprehensive legal services
✅ Service application system
✅ Reference number tracking
✅ Payment integration (Razorpay)
✅ Admin dashboard with stats
✅ Application status management
✅ Document upload support
✅ Mobile-responsive design
✅ Role-based access control
✅ Form validation
✅ Error handling
✅ Loading states

---

## 🚧 **Remaining Tasks**

- [ ] Deploy backend to Render
- [ ] Update API URLs in all frontends
- [ ] Build Android APK
- [ ] Set up custom domains
- [ ] Add email notifications
- [ ] Implement document download
- [ ] Add payment history page
- [ ] Create invoice generation
- [ ] Add search & filters
- [ ] Implement chat support

---

## 🔒 **Security Features**

1. **Password Hashing:** Bcrypt with salt rounds
2. **JWT Tokens:** Secure, expiring tokens
3. **CORS:** Configured for allowed origins
4. **Helmet:** HTTP security headers
5. **Input Validation:** Express-validator
6. **MongoDB Injection Protection:** Mongoose sanitization
7. **File Upload Limits:** Max size restrictions
8. **Environment Variables:** Sensitive data not in code

---

## 📱 **Mobile App Specific**

### **Android Build:**
```bash
# Generate native code
npx expo prebuild --clean

# Open in Android Studio
# Build > Generate Signed Bundle / APK
# Select "APK"
# Create keystore if needed
# Build variant: release
```

### **App Features:**
- Offline token storage
- Push notifications ready
- Camera integration for documents
- Biometric authentication ready
- Deep linking support

---

## 📈 **Future Enhancements**

1. **WhatsApp Integration** for notifications
2. **Document OCR** for auto-fill
3. **Video KYC** for verification
4. **Chatbot** for customer support
5. **Multi-language** support
6. **Dark mode** theme
7. **PWA** for customer web
8. **Email reminders** for pending actions
9. **Analytics dashboard** for admin
10. **Referral program** for customers

---

## 🎓 **Learning Resources**

- **React:** https://react.dev
- **React Native:** https://reactnative.dev
- **Node.js:** https://nodejs.org/docs
- **Express:** https://expressjs.com
- **MongoDB:** https://www.mongodb.com/docs
- **Material-UI:** https://mui.com
- **Expo:** https://docs.expo.dev

---

**Built with ❤️ for Let'sLegal**
**Version:** 1.0.0
**Last Updated:** December 9, 2025
