# Daily News Website - Full Stack React + Node.js

A comprehensive full-stack news website application with role-based access control, subscription management, and JWT authentication.

## Project Overview

This is a complete news platform featuring:
- **Frontend**: React with Bootstrap, React Router for navigation
- **Backend**: Node.js/Express REST API with MongoDB
- **Authentication**: JWT-based authentication with password hashing (bcryptjs)
- **Authorization**: Role-based access control (Admin, Editor, Subscriber, Guest)
- **Subscription System**: Free, Monthly, and Yearly plans
- **Content Management**: Create, read, update, delete articles with premium/free distinction
- **Responsive Design**: Mobile-first approach with modern CSS

## Project Structure

```
daily-news/
├── frontend/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── NewsCard.js
│   │   │   ├── BreakingNewsTicker.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/               # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── ArticleDetail.js
│   │   │   ├── Subscriptions.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── EditorDashboard.js
│   │   ├── context/             # Context API for state management
│   │   │   ├── AuthContext.js
│   │   │   └── NewsContext.js
│   │   ├── services/            # API service layer
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── backend/                     # Node.js backend
│   ├── models/                  # MongoDB models
│   │   ├── User.js
│   │   ├── Article.js
│   │   └── Subscription.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── articles.js
│   │   ├── subscriptions.js
│   │   └── users.js
│   ├── middleware/              # Custom middleware
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Features

### Frontend Features
- ✅ Sticky navbar with navigation, search, and user menu
- ✅ Breaking news ticker with auto-scrolling
- ✅ Responsive news grid layout with NewsCard components
- ✅ Category-based filtering
- ✅ Article detail page with full content
- ✅ User authentication (Login/Signup)
- ✅ Subscription management page with plan selection
- ✅ Premium content protection
- ✅ Footer with links and newsletter signup
- ✅ Context API for global state management
- ✅ Protected routes with role-based access

### Backend Features
- ✅ User authentication with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control middleware
- ✅ User CRUD operations (Admin only)
- ✅ Article CRUD operations (Editor/Admin)
- ✅ Subscription management system
- ✅ Admin dashboard statistics
- ✅ Input validation with express-validator
- ✅ Error handling and custom error responses

### Database Models

**User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'guest' | 'subscriber' | 'editor' | 'admin',
  subscription: {
    type: 'free' | 'monthly' | 'yearly',
    isActive: Boolean,
    startDate: Date,
    endDate: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Article Model**
```javascript
{
  title: String,
  summary: String,
  content: String,
  imageUrl: String,
  category: 'world' | 'politics' | 'sports' | 'entertainment' | 'technology' | 'business',
  author: ObjectId (ref: User),
  isPremium: Boolean,
  isBreakingNews: Boolean,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Subscription Model**
```javascript
{
  userId: ObjectId (ref: User, unique),
  planType: 'free' | 'monthly' | 'yearly',
  status: 'active' | 'inactive' | 'cancelled' | 'expired',
  price: Number,
  startDate: Date,
  endDate: Date,
  autoRenewal: Boolean,
  paymentInfo: {
    lastPaymentDate: Date,
    paymentMethod: String,
    transactionId: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   MONGO_URI=mongodb://localhost:27017/daily-news
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the backend server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install dependencies** (from project root)
   ```bash
   npm install
   ```

2. **Create .env file** (optional - proxy is configured in package.json)
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```

The frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Articles
- `GET /api/articles` - Get all articles (with filtering & pagination)
- `GET /api/articles/breaking` - Get breaking news
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create article (Editor/Admin)
- `PUT /api/articles/:id` - Update article (Author/Admin)
- `DELETE /api/articles/:id` - Delete article (Author/Admin)

### Subscriptions
- `GET /api/subscriptions/plans` - Get available plans
- `GET /api/subscriptions/my-subscription` - Get current user subscription
- `POST /api/subscriptions/upgrade` - Upgrade/change subscription
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/subscriptions` - Get all subscriptions (Admin)
- `PUT /api/subscriptions/:id` - Update subscription (Admin)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/assign-role` - Assign role to user
- `GET /api/users/stats/dashboard` - Get dashboard statistics

## User Roles & Permissions

### Guest
- View free articles
- Limited to 5 articles/month
- Cannot access premium content

### Subscriber
- View all articles (free & premium)
- Unlimited article access
- Ad-free experience

### Editor
- All subscriber features
- Create and edit their own articles
- Cannot manage users

### Admin
- All features
- Manage all articles
- Manage users and their roles
- View subscription statistics
- Access admin dashboard

## Demo Credentials

Use these credentials to test the application:

**Admin Account**
- Email: `admin@news.com`
- Password: `password123`

**Editor Account**
- Email: `editor@news.com`
- Password: `password123`

**User Account**
- Email: `user@news.com`
- Password: `password123`

(Create these demo accounts by modifying the backend to seed them on startup, or manually create them through signup)

## Styling & Design

- **Bootstrap 5**: For responsive layout and components
- **Custom CSS**: Component-specific styling with BEM methodology
- **Color Scheme**:
  - Primary: #667eea (Purple/Blue)
  - Success: #22c55e (Green)
  - Danger: #e63946 (Red)
  - Background: #f8f9fa (Light Gray)
- **Responsive**: Mobile-first approach, breakpoints at 576px, 768px, 992px

## Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/daily-news
JWT_SECRET=your_secure_jwt_secret
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Available Scripts

### Frontend
- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

### Backend
- `npm start` - Run server
- `npm run dev` - Run with nodemon (development)

## Next Steps / TODO

- [ ] Create Editor Dashboard for article management
- [ ] Create Admin Dashboard for user & subscription management
- [ ] Create Profile/Settings page
- [ ] Implement search functionality
- [ ] Add pagination to article lists
- [ ] Implement payment gateway (Stripe/PayPal)
- [ ] Add email notifications
- [ ] Create article comments system
- [ ] Implement article tags and advanced filtering
- [ ] Add unit tests
- [ ] Deploy to production (Heroku, Vercel, etc.)

## Technology Stack

### Frontend
- React 19
- React Router v6
- Bootstrap 5
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

## Security Considerations

1. **Password Security**: Passwords are hashed using bcryptjs with 10 salt rounds
2. **JWT Tokens**: Short-lived tokens (7 days) with secure secret
3. **Input Validation**: All inputs validated on both client and server
4. **CORS**: Configured for frontend-backend communication
5. **Role-Based Access**: Middleware validates user roles for protected routes
6. **Environment Variables**: Sensitive data stored in .env files (not in repo)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: Ensure IP is whitelisted and credentials are correct

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check `proxy` setting in frontend `package.json`
- CORS should be enabled in backend

### JWT Token Issues
- Clear browser localStorage if getting 401 errors
- Verify JWT_SECRET is same in backend .env
- Token expires after 7 days - user will need to login again

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**
