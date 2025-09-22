# Quick Setup Guide for CivicReport

## 🚀 **Fast Track Setup (5 minutes)**

### **Step 1: Setup MongoDB Atlas (Free Cloud Database)**

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas/register
2. **Sign up** with Google/GitHub or create account
3. **Create a Free Cluster**:
   - Choose "Build a Database" 
   - Select "M0 Sandbox" (FREE)
   - Choose a region close to you
   - Click "Create Cluster"
4. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. **Update Backend Config**:
   - Open `backend/.env`
   - Replace the MONGODB_URI line with your Atlas URI:
   ```
   MONGODB_URI=your-atlas-connection-string-here
   ```

### **Step 2: Run the Application**

Open **3 separate terminals** in your project directory:

#### **Terminal 1: Start Backend**
```powershell
cd backend
npm run dev
```
*Should show "✅ MongoDB connected successfully"*

#### **Terminal 2: Start Frontend**
```powershell
cd frontend  
npm start
```
*Will open browser at http://localhost:3000*

#### **Terminal 3: Monitor**
Keep this open to run additional commands or check logs.

## 🛠️ **Alternative: Local MongoDB (If you prefer)**

### **Option A: MongoDB Community Server**
1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```

### **Option B: MongoDB using Chocolatey**
```powershell
# Install Chocolatey if not installed
choco install mongodb

# Start MongoDB
mongod --dbpath C:\data\db
```

### **Option C: Docker (if you have Docker Desktop)**
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🎯 **Testing Your Setup**

1. **Backend Test**: Visit http://localhost:5000 - should see "Civic Issues API is running!"
2. **Frontend Test**: Visit http://localhost:3000 - should see the CivicReport homepage
3. **Full Test**: Register a new user account and login

## 🐛 **Common Issues & Fixes**

### **"MongoDB connection error"**
- Check your MONGODB_URI in backend/.env
- Ensure your Atlas cluster is running
- Check your internet connection

### **"Port 3000 already in use"**
```powershell
# Kill process on port 3000
npx kill-port 3000
# Then restart frontend
```

### **"Port 5000 already in use"**
```powershell
# Kill process on port 5000  
npx kill-port 5000
# Then restart backend
```

### **Frontend can't connect to backend**
- Ensure backend is running on port 5000
- Check frontend/.env has: `REACT_APP_API_URL=http://localhost:5000`

## 📱 **Demo Flow**

1. **Register**: Create new account at http://localhost:3000/register
2. **Login**: Sign in with your credentials
3. **Explore Feed**: See the issues feed with filters
4. **Test Features**: Try voting, filtering by category/severity

## 🏆 **Hackathon Ready!**

Once both servers are running, you have:
- ✅ User authentication system
- ✅ Social media-style interface
- ✅ Post feed with filtering
- ✅ Voting system
- ✅ Category management
- ✅ Responsive design

Perfect foundation for demonstrating and building upon during your hackathon!
