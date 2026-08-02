# Daily News - Quick Start Guide

## 🚀 Quick Setup

### Step 1: Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection
# MONGO_URI=mongodb://localhost:27017/daily-news
# JWT_SECRET=your-secret-key
# PORT=5000

# Start backend
npm start
# Backend running at http://localhost:5000
```

### Step 2: Frontend Setup (5 minutes)

```bash
# From project root
npm install

# Start frontend
npm start
# Frontend running at http://localhost:3000
```

### Step 3: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Sign Up" to create an account
3. Log in with your credentials
4. Explore news articles
5. Check subscription options
6. Try premium article access

## 📝 Creating Demo Data

### Option 1: Manual Creation
1. Sign up as a new user
2. Log in as admin (create admin account)
3. Go to editor dashboard
4. Create sample articles

### Option 2: Seed Script (Add to backend)

Create `backend/seed.js`:
```javascript
const mongoose = require('mongoose');
const User = require('./models/User');
const Article = require('./models/Article');

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  // Clear existing data
  await User.deleteMany({});
  await Article.deleteMany({});

  // Create users
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@news.com',
    password: 'password123',
    role: 'admin'
  });

  const editor = await User.create({
    name: 'Editor User',
    email: 'editor@news.com',
    password: 'password123',
    role: 'editor'
  });

  // Create articles
  await Article.create({
    title: 'Breaking: Major News Event',
    summary: 'This is a breaking news summary',
    content: 'Full article content here...',
    category: 'world',
    author: editor._id,
    isBreakingNews: true,
    isPremium: false
  });

  console.log('Database seeded!');
  process.exit();
};

seedData();
```

Run with: `node backend/seed.js`

## 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@news.com | password123 |
| Editor | editor@news.com | password123 |
| User | user@news.com | password123 |

## 📚 Key Routes to Try

### Frontend Routes
- `/` - Home page
- `/login` - Login page
- `/signup` - Sign up page
- `/article/:id` - Article detail
- `/subscriptions` - Subscription plans
- `/world`, `/politics`, `/sports`, etc. - Category pages

### Backend API Routes (Test with Postman)
- `GET /api/articles` - Get all articles
- `GET /api/articles/breaking` - Get breaking news
- `POST /api/auth/login` - Login
- `POST /api/articles` - Create article (requires token & editor role)
- `GET /api/subscriptions/plans` - Get subscription plans

## 🐛 Common Issues & Solutions

### Issue: Backend won't start
```
Error: Cannot connect to MongoDB
```
**Solution**: 
- Start MongoDB: `mongod`
- Check MONGO_URI in .env
- Use connection string: `mongodb://localhost:27017/daily-news`

### Issue: Frontend shows blank/error
```
TypeError: useNews is not defined
```
**Solution**:
- Restart frontend: `npm start`
- Clear browser cache

### Issue: 401 Unauthorized on API calls
```
Error: Invalid or expired token
```
**Solution**:
- Login again to get new token
- Clear browser localStorage
- Check JWT_SECRET in backend .env

### Issue: CORS errors
```
Access to XMLHttpRequest blocked by CORS
```
**Solution**:
- Backend is not running on port 5000
- Check proxy setting in `package.json`: `"proxy": "http://localhost:5000"`
- Verify backend CORS configuration

## 🎯 Next Steps

1. **Customize Content**
   - Modify article data
   - Change news categories
   - Update subscription plans

2. **Add Features**
   - Implement article search
   - Add comment section
   - Create admin dashboard
   - Implement payment processing

3. **Deploy**
   - Frontend: Vercel, Netlify
   - Backend: Heroku, Railway
   - Database: MongoDB Atlas

## 📞 Support

Need help? Check the main README or create an issue!

---

**Happy coding! 🎉**
