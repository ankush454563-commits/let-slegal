# Backend Deployment Guide

## Deploy to Render.com

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (use your account: ankush454563-commits)

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `let-slegal`
3. Select the repository when it appears

### Step 3: Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `letslegal-backend`
- **Region**: Singapore (or closest to you)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (or Starter if you prefer)

### Step 4: Add Environment Variables
Click **"Advanced"** and add these environment variables:

```
PORT=10000
MONGODB_URI=mongodb+srv://abhisheks08100_db_user:VkADFyflwmJR7xOj@letslegal.0sqsxfj.mongodb.net/?appName=letslegal
JWT_SECRET=28b5c25ada6d8eb3ec4dc3d5a1212a28daa3eb3d4a7ab15025088fb0076ef4e4
NODE_ENV=production
```

**Optional (leave blank for now):**
```
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://letslegal-backend.onrender.com`

### Step 6: Test Deployment
Once deployed, test the API:
```bash
curl https://letslegal-backend.onrender.com/api/health
```

You should see: `{"status":"OK","message":"Server is running"}`

---

## Alternative: Deploy to Railway.app

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Deploy
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select `let-slegal` repository
3. Railway will auto-detect the Node.js app

### Step 3: Configure
1. Go to **Settings** → **Root Directory** → Set to `backend`
2. Go to **Variables** and add:
   - `MONGODB_URI=mongodb+srv://abhisheks08100_db_user:VkADFyflwmJR7xOj@letslegal.0sqsxfj.mongodb.net/?appName=letslegal`
   - `JWT_SECRET=28b5c25ada6d8eb3ec4dc3d5a1212a28daa3eb3d4a7ab15025088fb0076ef4e4`
   - `NODE_ENV=production`

3. Railway will auto-assign PORT

### Step 4: Get URL
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. You'll get a URL like: `https://letslegal-backend.up.railway.app`

---

## Alternative: Deploy to Cyclic.sh

### Step 1: Create Account
1. Go to https://cyclic.sh
2. Sign up with GitHub

### Step 2: Deploy
1. Click **"Link Your Own"**
2. Select `let-slegal` repository
3. Cyclic will auto-deploy

### Step 3: Configure
1. Go to **Advanced** → **Environment Variables**
2. Add the same variables as above
3. Set **"Root Directory"** to `backend`

---

## After Deployment

Once you have your backend URL (e.g., `https://letslegal-backend.onrender.com`), you need to:

1. **Update Admin Panel API URL**
   - File: `admin-panel/src/config/api.js`
   - Change: `baseURL: 'YOUR_BACKEND_URL/api'`

2. **Update Customer Web API URL**
   - File: `customer-web/src/config/api.js`
   - Change: `baseURL: 'YOUR_BACKEND_URL/api'`

3. **Update Mobile App API URL**
   - File: `mobile-app/src/config/api.js`
   - Change: `baseURL: 'YOUR_BACKEND_URL/api'`

4. **Redeploy Frontend Apps**
   ```bash
   cd admin-panel
   vercel --prod
   
   cd ../customer-web
   vercel --prod
   ```

5. **Rebuild Mobile APK**
   ```bash
   cd ../mobile-app/android
   ./gradlew assembleRelease
   ```

---

## Troubleshooting

### Issue: "Cannot find module 'razorpay'"
**Solution**: Already fixed in `backend/controllers/paymentController.js` - Razorpay is optional

### Issue: "MongoServerError: bad auth"
**Solution**: Double-check MongoDB URI is correct in environment variables

### Issue: "Port already in use"
**Solution**: Use `PORT` environment variable (Render uses 10000, Railway auto-assigns)

### Issue: "404 on all routes"
**Solution**: Make sure Root Directory is set to `backend` in deployment settings

---

## Your Backend Info

- **Repository**: https://github.com/ankush454563-commits/let-slegal
- **Branch**: main
- **Backend Folder**: backend
- **Start Command**: npm start
- **MongoDB**: Already configured in .env
- **JWT Secret**: Already configured in .env

**Current Admin Panel**: https://letslegal-admin-panel.vercel.app
**Current Customer Web**: https://letslegal-admin-panel-6t0pipp6g.vercel.app

Once backend is deployed, both will need API URL updates and redeployment.
