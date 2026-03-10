# API Testing Guide

This guide helps you test the Akariza mobile app's API integration.

## Prerequisites

- Postman or similar API testing tool
- Backend running at `https://akariza-backend.onrender.com`
- Valid test credentials

## Base URL

```
https://akariza-backend.onrender.com/api/v1
```

## Authentication

### 1. Login

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email",
  "requiresOtp": true
}
```

### 2. Verify OTP

**Endpoint:** `POST /auth/verify-otp`

**Request:**
```json
{
  "email": "test@example.com",
  "otpCode": "123456"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-id",
    "email": "test@example.com",
    "fullName": "Test User",
    "role": "CASHIER"
  }
}
```

**Save the `accessToken` for subsequent requests.**

### 3. Token Refresh

**Endpoint:** `POST /auth/refresh`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

## Testing Endpoints

### Products

#### Get All Products
```
GET /products
Authorization: Bearer {accessToken}
```

#### Create Product
```
POST /products
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Test Product",
  "sku": "TEST-001",
  "category": "Electronics",
  "unit": "piece",
  "costPrice": 100,
  "sellingPrice": 150,
  "currentStock": 50,
  "minStockLevel": 10,
  "maxStockLevel": 100,
  "hasExpiry": false
}
```

#### Get Low Stock Products
```
GET /products/low-stock
Authorization: Bearer {accessToken}
```

### Sales

#### Get All Sales
```
GET /sales
Authorization: Bearer {accessToken}
```

#### Create Sale
```
POST /sales
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "items": [
    {
      "productId": "product-id",
      "quantity": 5,
      "sellingPrice": 150
    }
  ],
  "paymentMethod": "CASH",
  "amountPaid": 750,
  "customerId": "customer-id",
  "discount": 0
}
```

### Customers

#### Get All Customers
```
GET /customers
Authorization: Bearer {accessToken}
```

#### Create Customer
```
POST /customers
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "customerType": "RETAIL"
}
```

#### Add Loyalty Points
```
POST /customers/{customerId}/loyalty/add
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "points": 100,
  "reason": "Purchase reward"
}
```

### Purchases

#### Get All Purchases
```
GET /purchases
Authorization: Bearer {accessToken}
```

#### Create Purchase
```
POST /purchases
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "supplierId": "supplier-id",
  "items": [
    {
      "productId": "product-id",
      "quantity": 100,
      "costPrice": 100
    }
  ],
  "paymentStatus": "PENDING",
  "amountPaid": 0,
  "notes": "Test purchase"
}
```

### Dashboard

#### Get Dashboard Data
```
GET /dashboard
Authorization: Bearer {accessToken}
```

**Response includes:**
- todaySales
- todayProfit
- todayTransactions
- totalBranches
- totalEmployees
- totalCustomers
- totalProducts
- lowStockCount
- topProduct
- totalRevenue
- totalSales
- totalPurchases
- totalExpenses

### Reports

#### Get Sales Report
```
GET /reports/sales/daily?date=2024-01-15
Authorization: Bearer {accessToken}
```

#### Get Profit Report
```
GET /reports/profit?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {accessToken}
```

#### Get Best Selling Products
```
GET /reports/best-selling?limit=10
Authorization: Bearer {accessToken}
```

### Notifications

#### Get All Notifications
```
GET /notifications
Authorization: Bearer {accessToken}
```

#### Get Unread Count
```
GET /notifications/unread-count
Authorization: Bearer {accessToken}
```

#### Mark as Read
```
PATCH /notifications/{notificationId}/read
Authorization: Bearer {accessToken}
```

### Tasks

#### Get All Tasks
```
GET /tasks
Authorization: Bearer {accessToken}
```

#### Create Task
```
POST /tasks
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Restock products",
  "description": "Restock low inventory items",
  "assignedTo": "user-id",
  "priority": "HIGH",
  "dueDate": "2024-01-20"
}
```

#### Complete Task
```
PATCH /tasks/{taskId}/complete
Authorization: Bearer {accessToken}
```

### Messages

#### Send Message
```
POST /messages
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "targetType": "USER",
  "receiverId": "user-id",
  "message": "Hello, this is a test message"
}
```

#### Get Conversation
```
GET /messages/conversation/{userId}
Authorization: Bearer {accessToken}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid request data",
  "errors": ["Field validation error"]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized - Token expired or invalid"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Testing Workflow

### 1. Authentication Test
1. Login with test credentials
2. Verify OTP
3. Save tokens
4. Test token refresh

### 2. CRUD Operations Test
1. Create resource (POST)
2. Read resource (GET)
3. Update resource (PATCH)
4. Delete resource (DELETE)

### 3. Business Logic Test
1. Create sale with multiple items
2. Verify inventory updated
3. Check dashboard metrics
4. Generate reports

### 4. Error Handling Test
1. Send invalid data
2. Use expired token
3. Access unauthorized resource
4. Test network timeout

## Postman Collection

Import this collection for quick testing:

```json
{
  "info": {
    "name": "Akariza API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\": \"test@example.com\", \"password\": \"password123\"}"
            }
          }
        }
      ]
    }
  ]
}
```

## Performance Testing

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 -H "Authorization: Bearer {token}" \
  https://akariza-backend.onrender.com/api/v1/products
```

### Response Time Monitoring
- Dashboard: < 500ms
- Product list: < 1000ms
- Sales creation: < 2000ms
- Reports: < 3000ms

## Common Issues

### 401 Unauthorized
- Token expired - refresh token
- Invalid token - login again
- Missing Authorization header

### 400 Bad Request
- Check JSON format
- Verify required fields
- Validate data types

### 500 Server Error
- Check backend logs
- Verify database connection
- Check API server status

## Testing Checklist

- [ ] Authentication flow works
- [ ] Token refresh works
- [ ] CRUD operations work
- [ ] Error handling works
- [ ] Pagination works
- [ ] Filtering works
- [ ] Sorting works
- [ ] Search works
- [ ] Offline sync works
- [ ] Performance acceptable

## Continuous Integration

Run tests automatically:
```bash
npm test
npm run test:integration
npm run test:e2e
```

## Monitoring

Monitor API health:
- Response times
- Error rates
- Success rates
- Token refresh frequency
- Sync queue status

## Documentation

- API Docs: [Swagger/OpenAPI](https://akariza-backend.onrender.com/api-docs)
- Backend Repo: [Akariza Backend](https://github.com/jeromeboitenge/Akariza-backend)
- Mobile Repo: [Akariza Mobile](https://github.com/jeromeboitenge/Akariza-app)
