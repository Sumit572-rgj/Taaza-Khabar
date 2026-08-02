# Daily News API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔓 Authentication Endpoints

### 1. Sign Up (Create New Account)
- **Route**: `POST /auth/signup`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (201):
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "guest",
      "subscription": { ... }
    }
  }
  ```

### 2. Login
- **Route**: `POST /auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": { ... }
  }
  ```

### 3. Get Current User Profile
- **Route**: `GET /auth/profile`
- **Access**: Protected
- **Response** (200):
  ```json
  {
    "user": { ... }
  }
  ```

### 4. Update Profile
- **Route**: `PUT /auth/profile`
- **Access**: Protected
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Profile updated successfully",
    "user": { ... }
  }
  ```

### 5. Logout
- **Route**: `POST /auth/logout`
- **Access**: Protected
- **Response** (200):
  ```json
  {
    "message": "Logout successful"
  }
  ```

---

## 📰 Article Endpoints

### 1. Get All Articles
- **Route**: `GET /articles`
- **Access**: Public
- **Query Parameters**:
  - `category`: Filter by category (world, politics, sports, entertainment, technology, business)
  - `search`: Search by title or summary
  - `isPremium`: true/false
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
- **Example**: `GET /articles?category=world&page=1&limit=12`
- **Response** (200):
  ```json
  {
    "articles": [
      {
        "_id": "article_id",
        "title": "Article Title",
        "summary": "Article summary",
        "content": "Full content",
        "category": "world",
        "author": { "name": "Author Name", "email": "author@email.com" },
        "isPremium": false,
        "isBreakingNews": true,
        "views": 1234,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "pages": 13
    }
  }
  ```

### 2. Get Breaking News
- **Route**: `GET /articles/breaking`
- **Access**: Public
- **Response** (200):
  ```json
  [
    { ... article object },
    { ... article object }
  ]
  ```

### 3. Get Article by ID
- **Route**: `GET /articles/:id`
- **Access**: Public (limited access for premium)
- **Response** (200):
  ```json
  { ... article object }
  ```
- **Premium Response** (403):
  ```json
  {
    "error": "Premium content requires subscription",
    "preview": "Article summary..."
  }
  ```

### 4. Create Article
- **Route**: `POST /articles`
- **Access**: Protected (Editor, Admin only)
- **Request Body**:
  ```json
  {
    "title": "New Article",
    "summary": "Article summary",
    "content": "Full article content",
    "imageUrl": "https://example.com/image.jpg",
    "category": "technology",
    "isPremium": false,
    "isBreakingNews": false
  }
  ```
- **Response** (201):
  ```json
  {
    "message": "Article created successfully",
    "article": { ... }
  }
  ```

### 5. Update Article
- **Route**: `PUT /articles/:id`
- **Access**: Protected (Author or Admin)
- **Request Body**: (Same as create, all fields optional)
- **Response** (200):
  ```json
  {
    "message": "Article updated successfully",
    "article": { ... }
  }
  ```

### 6. Delete Article
- **Route**: `DELETE /articles/:id`
- **Access**: Protected (Author or Admin)
- **Response** (200):
  ```json
  {
    "message": "Article deleted successfully"
  }
  ```

---

## 💎 Subscription Endpoints

### 1. Get Available Plans
- **Route**: `GET /subscriptions/plans`
- **Access**: Public
- **Response** (200):
  ```json
  {
    "free": { "price": 0, "durationDays": null },
    "monthly": { "price": 9.99, "durationDays": 30 },
    "yearly": { "price": 99.99, "durationDays": 365 }
  }
  ```

### 2. Get Current User Subscription
- **Route**: `GET /subscriptions/my-subscription`
- **Access**: Protected
- **Response** (200):
  ```json
  {
    "_id": "subscription_id",
    "userId": "user_id",
    "planType": "monthly",
    "status": "active",
    "price": 9.99,
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-02-15T00:00:00Z",
    "autoRenewal": true
  }
  ```

### 3. Upgrade/Change Subscription
- **Route**: `POST /subscriptions/upgrade`
- **Access**: Protected
- **Request Body**:
  ```json
  {
    "planType": "monthly"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Successfully upgraded to monthly plan",
    "subscription": { ... }
  }
  ```

### 4. Cancel Subscription
- **Route**: `POST /subscriptions/cancel`
- **Access**: Protected
- **Response** (200):
  ```json
  {
    "message": "Subscription cancelled successfully"
  }
  ```

### 5. Get All Subscriptions (Admin)
- **Route**: `GET /subscriptions`
- **Access**: Protected (Admin only)
- **Response** (200):
  ```json
  [
    { ... subscription object },
    { ... subscription object }
  ]
  ```

### 6. Update Subscription (Admin)
- **Route**: `PUT /subscriptions/:subscriptionId`
- **Access**: Protected (Admin only)
- **Request Body**:
  ```json
  {
    "planType": "yearly",
    "status": "active",
    "autoRenewal": true
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Subscription updated successfully",
    "subscription": { ... }
  }
  ```

---

## 👥 User Management Endpoints (Admin Only)

### 1. Get All Users
- **Route**: `GET /users`
- **Access**: Protected (Admin only)
- **Query Parameters**:
  - `role`: Filter by role
  - `search`: Search by name or email
  - `page`: Page number
  - `limit`: Results per page
- **Response** (200):
  ```json
  {
    "users": [ ... ],
    "pagination": { ... }
  }
  ```

### 2. Get User by ID
- **Route**: `GET /users/:id`
- **Access**: Protected (Admin only)
- **Response** (200):
  ```json
  { ... user object }
  ```

### 3. Update User
- **Route**: `PUT /users/:id`
- **Access**: Protected (Admin only)
- **Request Body**:
  ```json
  {
    "name": "New Name",
    "email": "new@email.com",
    "role": "subscriber"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "User updated successfully",
    "user": { ... }
  }
  ```

### 4. Delete User
- **Route**: `DELETE /users/:id`
- **Access**: Protected (Admin only)
- **Response** (200):
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

### 5. Assign Role to User
- **Route**: `POST /users/:id/assign-role`
- **Access**: Protected (Admin only)
- **Request Body**:
  ```json
  {
    "role": "editor"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "User role updated to editor",
    "user": { ... }
  }
  ```

### 6. Get Dashboard Statistics
- **Route**: `GET /users/stats/dashboard`
- **Access**: Protected (Admin only)
- **Response** (200):
  ```json
  {
    "totalUsers": 150,
    "byRole": {
      "guests": 100,
      "subscribers": 40,
      "editors": 8,
      "admins": 2
    }
  }
  ```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Required roles: admin"
}
```

### 404 Not Found
```json
{
  "error": "Article not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Testing with Postman

1. **Create Environment**:
   - Base URL: `http://localhost:5000/api`
   - Token: (will be populated after login)

2. **Login to Get Token**:
   - Send POST request to `/auth/login`
   - Copy token from response
   - Set in Postman: `Authorization: Bearer {{token}}`

3. **Test Protected Routes**:
   - All subsequent requests will include the token

---

## Rate Limiting

Currently not implemented. Recommended for production:
- 100 requests/minute for public routes
- 50 requests/minute for authenticated routes

## Pagination

Use `page` and `limit` query parameters:
- Default page: 1
- Default limit: 10
- Max limit: 100

Example: `/articles?page=2&limit=20`

---

**Last Updated**: January 2024
