# Deploy Backend to Render

## Step 1: Go to Render Dashboard
1. Visit https://render.com
2. Sign up or log in with GitHub
3. Click "New +" → "Web Service"

## Step 2: Connect Repository
1. Connect your GitHub account if not connected
2. Select repository: `ankush454563-commits/let-slegal`
3. Click "Connect"

## Step 3: Configure Web Service
Fill in the following details:

**Name:** `letslegal-backend`

**Region:** Choose closest to you (e.g., Oregon, Frankfurt)

**Branch:** `main`

**Root Directory:** `backend`

**Runtime:** `Node`

**Build Command:** `npm install`

**Start Command:** `node server.js`

**Instance Type:** `Free` (or paid plan for production)

## Step 4: Add Environment Variables
Click "Advanced" and add these environment variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://abhisheks08100_db_user:VkADFyflwmJR7xOj@letslegal.0sqsxfj.mongodb.net/?appName=letslegal
JWT_SECRET=28b5c25ada6d8eb3ec4dc3d5a1212a28daa3eb3d4a7ab15025088fb0076ef4e4
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=https://letslegal-admin-panel-a9fwozja4.vercel.app
MOBILE_APP_URL=http://localhost:8081
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend will be live at: `https://letslegal-backend.onrender.com`

## Step 6: Seed Database
After deployment, open the Shell tab in Render dashboard and run:
```bash
npm run seed
```

## Step 7: Update Admin Panel
Go to Vercel dashboard:
1. Open your `letslegal-admin-panel` project
2. Settings → Environment Variables
3. Add/Update:
   - Key: `REACT_APP_API_URL`
   - Value: `https://letslegal-backend.onrender.com/api`
4. Redeploy from Deployments tab

## Step 8: Test
1. Visit: https://letslegal-admin-panel-a9fwozja4.vercel.app
2. Login with: admin@letslegal.com / Admin@123
3. Check if dashboard loads

## Troubleshooting

### Backend not starting:
- Check Logs tab in Render
- Verify all environment variables are set
- Check MongoDB connection string

### CORS errors:
- Ensure CLIENT_URL is set correctly
- Check browser console for error details

### Database not seeding:
- Run seed command from Render Shell
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)

---

**Important Notes:**
- Free tier on Render spins down after inactivity (first request may be slow)
- MongoDB Atlas should allow connections from anywhere for Render
- Save your backend URL for mobile app configuration
