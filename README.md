# Let'sLegal - Law Firm Services Platform

A comprehensive platform for law firm services management with a customer-facing React Native mobile app and an admin web panel built with React.

## 🚀 Features

### Customer Mobile App (React Native)
- User registration and authentication
- Browse legal services (Lawyer consultation, Company registration, GST filing, etc.)
- Apply for services with custom forms
- Secure payment processing
- Reference number generation for tracking
- Real-time application status tracking
- Submit additional documents when requested by admin
- Profile management

### Admin Web Panel (React)
- Dashboard with comprehensive analytics
- View and manage all applications
- Update application status (Success/Failed)
- Initiate refunds for failed applications
- Create and send custom forms to customers
- User management
- Service management (CRUD operations)
- Payment tracking

### Backend API (Node.js + Express)
- RESTful API architecture
- MongoDB database
- JWT authentication
- File upload support
- Payment gateway integration ready
- Comprehensive error handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn
- Expo CLI (for mobile app development)

## 🛠️ Installation

### 1. Clone the Repository

```bash
cd sk122
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configurations
# Important: Update MONGODB_URI, JWT_SECRET, and payment gateway credentials

# Start MongoDB (if not running)
# mongod

# Start the backend server
npm start
```

The backend will run on http://localhost:5000

### 3. Admin Panel Setup

```bash
cd admin-panel
npm install

# Create environment file
cp .env.example .env

# Edit .env file
# Update REACT_APP_API_URL if needed

# Start the admin panel
npm start
```

The admin panel will run on http://localhost:3000

### 4. Mobile App Setup

```bash
cd mobile-app
npm install

# Create environment file
cp .env.example .env

# Edit .env file
# Update API_URL if needed

# Start the Expo development server
npx expo start

# Or use npm start
npm start
```

Scan the QR code with Expo Go app on your phone or run on an emulator.

## 🗂️ Project Structure

```
sk122/
├── backend/                 # Node.js Backend API
│   ├── controllers/        # Request handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & upload middleware
│   ├── server.js          # Entry point
│   └── package.json
│
├── admin-panel/            # React Admin Web App
│   ├── src/
│   │   ├── pages/         # Dashboard, Applications, Services, Users
│   │   ├── context/       # Auth context
│   │   ├── routes/        # Route configuration
│   │   └── config/        # API configuration
│   └── package.json
│
└── mobile-app/             # React Native Mobile App
    ├── src/
    │   ├── screens/       # All app screens
    │   │   ├── auth/      # Login, Register
    │   │   └── main/      # Home, Services, Applications, etc.
    │   ├── navigation/    # Navigation setup
    │   ├── context/       # Auth context
    │   └── config/        # API configuration
    ├── App.js
    └── package.json
```

## 🔐 Default Admin Credentials

After setting up the backend, you need to create an admin user. You can do this by:

1. Using MongoDB directly:
```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@letslegal.com",
  password: "$2a$10$hashed_password", // Use bcrypt to hash
  role: "admin",
  phone: "1234567890",
  createdAt: new Date()
})
```

2. Or modify the registration endpoint temporarily to create an admin user.

## 🎯 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Services
- GET `/api/services` - Get all services
- GET `/api/services/:id` - Get service by ID

### Applications
- POST `/api/applications` - Create new application
- GET `/api/applications/my-applications` - Get user's applications
- GET `/api/applications/:id` - Get application details
- GET `/api/applications/track/:referenceNumber` - Track by reference number

### Payments
- POST `/api/payments/create-order` - Create payment order
- POST `/api/payments/verify` - Verify payment

### Admin
- GET `/api/admin/dashboard/stats` - Dashboard statistics
- GET `/api/admin/applications` - All applications
- PUT `/api/admin/applications/:id/status` - Update status
- POST `/api/admin/create-form` - Create custom form
- GET `/api/admin/users` - All users
- POST `/api/admin/services` - Create service
- PUT `/api/admin/services/:id` - Update service
- DELETE `/api/admin/services/:id` - Delete service

## 📱 Mobile App Screens

1. **Auth Screens**: Login, Register
2. **Home Screen**: Service overview and quick actions
3. **Services Screen**: Browse all services
4. **Service Detail**: View service details
5. **Application Form**: Apply for service
6. **Payment Screen**: Process payment
7. **My Applications**: View all applications
8. **Application Detail**: View specific application
9. **Track Screen**: Track by reference number
10. **Profile Screen**: User profile and settings

## 💻 Admin Panel Pages

1. **Dashboard**: Overview statistics and recent applications
2. **Applications**: Manage all applications, update status, create forms
3. **Services**: CRUD operations for services
4. **Users**: View all registered users

## 🔧 Environment Variables

### Backend (.env)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `RAZORPAY_KEY_ID` - Payment gateway key
- `RAZORPAY_KEY_SECRET` - Payment gateway secret

### Admin Panel (.env)
- `REACT_APP_API_URL` - Backend API URL

### Mobile App (.env)
- `API_URL` - Backend API URL

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set up environment variables
2. Configure MongoDB Atlas
3. Deploy using platform-specific commands

### Admin Panel (Vercel/Netlify)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Mobile App
1. Build for Android: `expo build:android`
2. Build for iOS: `expo build:ios`
3. Submit to respective app stores

## 📄 Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Razorpay/Stripe Payment Gateway
- Multer for file uploads

### Mobile App
- React Native
- React Navigation
- Redux/Context API
- Axios
- React Native Paper (UI)

### Admin Panel
- React.js
- Material-UI
- Redux/Context API
- Axios
- Chart.js for analytics

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- React Native development environment
- npm or yarn

### Installation

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

#### Mobile App Setup
```bash
cd mobile-app
npm install
npx react-native run-android
# or
npx react-native run-ios
```

#### Admin Panel Setup
```bash
cd admin-panel
npm install
npm start
```

## Environment Variables

See `.env.example` files in respective directories for required configuration.

## API Documentation

API documentation will be available at `/api-docs` when the backend server is running.

## License

Proprietary - All rights reserved
