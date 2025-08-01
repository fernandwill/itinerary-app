# Authentication System Documentation

## Overview

The Wanderlog authentication system provides secure user registration, login, and session management using JWT tokens. It includes comprehensive validation, rate limiting, and security features.

## Features

- ✅ User registration with email validation
- ✅ Secure password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Refresh token support for extended sessions
- ✅ Rate limiting for security
- ✅ Input validation and sanitization
- ✅ Profile management
- ✅ Password updates
- ✅ Comprehensive error handling

## API Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://example.com/avatar.jpg" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  },
  "message": "User registered successfully"
}
```

### POST /api/auth/login

Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  },
  "message": "Login successful"
}
```

### GET /api/auth/me

Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### POST /api/auth/logout

Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### PUT /api/auth/profile

Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "avatar": "https://example.com/new-avatar.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Profile updated successfully"
}
```

### PUT /api/auth/password

Update user password (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### POST /api/auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-access-token",
    "refreshToken": "new-jwt-refresh-token"
  },
  "message": "Tokens refreshed successfully"
}
```

## Security Features

### Password Requirements

- Minimum 6 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number

### Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP

### Token Security

- Access tokens expire in 7 days (configurable)
- Refresh tokens expire in 30 days
- Tokens include issuer and audience claims
- Secure JWT secret required in environment

### Input Validation

- Email format validation and normalization
- Name validation (letters and spaces only)
- URL validation for avatar
- SQL injection protection through Sequelize ORM

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `USER_EXISTS` | Email already registered |
| `INVALID_CREDENTIALS` | Wrong email or password |
| `NO_TOKEN` | Authorization token missing |
| `INVALID_TOKEN` | Token is invalid or malformed |
| `TOKEN_EXPIRED` | Token has expired |
| `USER_NOT_FOUND` | User account not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INVALID_PASSWORD` | Current password incorrect |

## Environment Variables

```env
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wanderlog_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

## Usage Examples

### Frontend Integration

```javascript
// Register user
const registerUser = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Login user
const loginUser = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

// Make authenticated request
const makeAuthenticatedRequest = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
```

## Testing

Run authentication tests:
```bash
npm test -- auth.test.js
```

The test suite covers:
- User registration validation
- Login with valid/invalid credentials
- Token-based authentication
- Profile retrieval
- Logout functionality
- Error handling scenarios