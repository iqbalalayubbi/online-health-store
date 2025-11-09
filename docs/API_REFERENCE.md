# API Endpoints Reference Guide

## Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

## Admin Endpoints (Protected - ADMIN role required)

### Customers

- `GET /admin/customers` - Get all customers
- `DELETE /admin/customers/:customerId` - Delete customer

### Guestbook Management

- `GET /admin/guestbook` - Get all guestbook entries
- `DELETE /admin/guestbook/:entryId` - Delete guestbook entry

### Categories

- `GET /admin/categories` - Get all categories
- `POST /admin/categories` - Create category
  - Body: `{ name: string, description?: string }`
- `PUT /admin/categories/:categoryId` - Update category
  - Body: `{ name: string, description?: string }`
- `DELETE /admin/categories/:categoryId` - Delete category

### Shop Requests

- `GET /admin/shop-requests` - Get shop creation requests
- `POST /admin/shop-requests/:requestId/approve` - Approve request
- `POST /admin/shop-requests/:requestId/reject` - Reject request

### Shipping Management

- `GET /admin/orders/shipping` - Get orders for shipping
- `POST /admin/orders/:orderId/ship` - Mark order as shipped
  - Body: `{ courier: string, trackingNumber: string }`

## Seller Endpoints (Protected - SELLER role required)

### Shop Management

- `GET /seller/shop` - Get seller's shop
- `POST /seller/shop` - Create shop
  - Body: `{ name: string, description?: string }`
- `PUT /seller/shop` - Update shop
  - Body: `{ name: string, description?: string }`

### Products

- `GET /seller/products` - Get all seller's products
- `POST /seller/products` - Create product
  - Body: `{ name: string, description?: string, price: string, stock: number, categoryId: string }`
- `PUT /seller/products/:productId` - Update product
  - Body: `{ name?: string, description?: string, price?: string, stock?: number, categoryId?: string }`
- `DELETE /seller/products/:productId` - Delete product

### Orders

- `GET /seller/orders` - Get seller's orders

## Customer Endpoints (Protected - CUSTOMER role)

### Catalog

- `GET /catalog` - Get all products
- `GET /catalog/:productId` - Get product details
- `GET /catalog/category/:categoryId` - Get products by category

### Cart

- `GET /customer/cart` - Get shopping cart
- `POST /customer/cart/:productId` - Add to cart
  - Body: `{ quantity: number }`
- `DELETE /customer/cart/:cartItemId` - Remove from cart
- `PUT /customer/cart/:cartItemId` - Update cart item
  - Body: `{ quantity: number }`

### Checkout & Orders

- `POST /customer/orders` - Create order
  - Body: `{ items: Array, shippingAddress: object, paymentMethod: string }`
- `GET /customer/orders` - Get user's orders
- `GET /customer/orders/:orderId` - Get order details
- `DELETE /customer/orders/:orderId` - Cancel order

### Profile

- `GET /customer/profile` - Get user profile
- `PUT /customer/profile` - Update profile
  - Body: `{ fullName?: string, phoneNumber?: string }`

### Guestbook (Customer can post)

- `POST /customer/guestbook` - Post feedback
  - Body: `{ name: string, email: string, message: string }`

## Public Endpoints (No authentication required)

### Catalog (browsing)

- `GET /catalog` - Get all products
- `GET /catalog/categories` - Get all categories
- `GET /catalog/search?q=query` - Search products

## Response Format

### Success Response

```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "status": "error",
  "error": "Error description",
  "message": "User-friendly error message"
}
```

## Authentication

All protected endpoints require:

- `Authorization: Bearer <JWT_TOKEN>` header
- User must have appropriate role

## Rate Limits

- Login: 5 attempts per 15 minutes
- API: 100 requests per minute per user

## Pagination

Some endpoints support pagination:

- `?page=1&limit=20`

## Sorting

Some endpoints support sorting:

- `?sort=createdAt&order=desc`

## Filtering

Supported filter parameters vary by endpoint:

- Admin: Can filter by status, date range, user role
- Seller: Can filter by status, category, date range
- Customer: Can filter by status, date range, amount range
