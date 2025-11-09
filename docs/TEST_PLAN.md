# Comprehensive Test Plan - Role-Based Features

## Test Overview

This document outlines comprehensive testing for the 3-role system implementation including Admin, Seller, and Customer features.

## Unit Tests

### ProtectedRoute Component

```javascript
Test 1: Redirect unauthenticated user to login
- Initial state: user = null
- Expected: Navigate to /login
- Assertion: navigateSpy.toEqual('/login')

Test 2: Redirect unauthorized role to home
- Initial state: user = { role: "CUSTOMER" }, requiredRole = "ADMIN"
- Expected: Navigate to /
- Assertion: navigateSpy.toEqual('/')

Test 3: Render children with authorized role
- Initial state: user = { role: "ADMIN" }, requiredRole = "ADMIN"
- Expected: Render children component
- Assertion: component.render().children.length > 0

Test 4: Support multiple roles
- Initial state: user = { role: "SELLER" }, requiredRole = ["ADMIN", "SELLER"]
- Expected: Render children
- Assertion: component.render().children.length > 0
```

### API Functions

```javascript
Test: Admin API - fetchCustomers
- Mock: apiClient.get('/admin/customers')
- Input: none
- Expected: Returns array of Customer objects
- Assertion: result.length >= 0

Test: Seller API - createProduct
- Mock: apiClient.post('/seller/products', data)
- Input: { name: "Product", price: "50000", stock: 10 }
- Expected: Returns created product with ID
- Assertion: result.id !== undefined

Test: Admin API - markOrderAsShipped
- Mock: apiClient.post('/admin/orders/{id}/ship', data)
- Input: orderId, courier, trackingNumber
- Expected: Returns updated order with tracking info
- Assertion: result.trackingNumber === input.trackingNumber
```

## Integration Tests

### Admin Dashboard

```javascript
Test 1: Load admin dashboard with data
- Setup: Mock React Query to return sample data
- Action: Render AdminDashboardPage
- Expected: Display customer count, category count, pending requests
- Assertion: screen.getByText('Total Customers') visible

Test 2: Click quick action button
- Setup: Render dashboard with mock data
- Action: Click "Manage Categories" button
- Expected: Navigate to /admin/categories
- Assertion: urlSpy.toEqual('/admin/categories')

Test 3: Display pending requests widget
- Setup: Mock shopRequests with PENDING status
- Action: Render dashboard
- Expected: Show pending count and request cards
- Assertion: screen.getByText('1') (count visible)
```

### Admin - Manage Customers

```javascript
Test 1: Load and display customers
- Setup: Mock fetchCustomers API
- Action: Render AdminCustomersPage
- Expected: Display customers in table
- Assertion: table.rows.length === customers.length

Test 2: Delete customer with confirmation
- Setup: Mock deleteCustomer API
- Action: Click delete button, confirm
- Expected: Customer removed, list updated
- Assertion: initialCount - 1 === finalCount

Test 3: Handle delete error
- Setup: Mock deleteCustomer to fail
- Action: Click delete button
- Expected: Show error toast
- Assertion: toastSpy.error called with message

Test 4: Show loading state
- Setup: Create delayed mock
- Action: Render with pending query
- Expected: Display loading message
- Assertion: screen.getByText('Memuat customers...') visible
```

### Admin - Manage Categories

```javascript
Test 1: Create new category
- Setup: Mock createCategory API
- Action: Fill form, click Create
- Expected: Category added to list
- Assertion: finalCount === initialCount + 1

Test 2: Edit category
- Setup: Mock updateCategory API, render with data
- Action: Click edit, change name, save
- Expected: Category updated in list
- Assertion: updated.name === newName

Test 3: Delete category
- Setup: Mock deleteCategory API
- Action: Click delete on category
- Expected: Category removed
- Assertion: finalCount === initialCount - 1

Test 4: Form validation
- Setup: Render create form
- Action: Leave name empty, submit
- Expected: Show validation error
- Assertion: errorMessage visible

Test 5: Duplicate category check
- Setup: Mock API to return duplicate error
- Action: Create category with existing name
- Expected: Show error message
- Assertion: toastSpy.error called
```

### Seller - Shop Setup

```javascript
Test 1: Create shop
- Setup: Mock createShop API, user has no shop
- Action: Fill form, click Create
- Expected: Shop created, UI updates
- Assertion: shop.name === input.name

Test 2: Edit shop
- Setup: Mock updateShop API, render with existing shop
- Action: Click Edit, change details, save
- Expected: Shop updated
- Assertion: updated.description === newDescription

Test 3: Shop status display
- Setup: Mock fetchSellerShop with isActive: true
- Action: Render page
- Expected: Display "Active" badge
- Assertion: screen.getByText('Active') visible

Test 4: Show quick links
- Setup: Render with existing shop
- Action: View page
- Expected: Show "Manage Products" and "View Orders" links
- Assertion: links visible and clickable
```

### Seller - Product Management

```javascript
Test 1: List all products
- Setup: Mock fetchSellerProducts
- Action: Render SellerProductsPage
- Expected: Display all products in grid
- Assertion: productCards.length === mockProducts.length

Test 2: Add product
- Setup: Mock createProduct API
- Action: Fill form (name, price, stock), submit
- Expected: Product added to list
- Assertion: finalCount === initialCount + 1

Test 3: Edit product
- Setup: Mock updateProduct API
- Action: Click edit, change price, save
- Expected: Product updated
- Assertion: updated.price === newPrice

Test 4: Delete product
- Setup: Mock deleteProduct API
- Action: Click delete on product
- Expected: Product removed
- Assertion: finalCount === initialCount - 1

Test 5: Form validation
- Setup: Render create form
- Action: Submit with empty name
- Expected: Show error
- Assertion: errorMessage visible

Test 6: Stock management
- Setup: Render product with stock=0
- Action: View product
- Expected: Show as out of stock
- Assertion: "Stock: 0" visible
```

### Admin - Shop Request Approval

```javascript
Test 1: Display pending requests
- Setup: Mock fetchShopRequests with PENDING status
- Action: Render AdminShopRequestsPage
- Expected: Show pending requests
- Assertion: requestCards.length > 0

Test 2: Approve request
- Setup: Mock approveShopRequest API
- Action: Click Approve button
- Expected: Status changes to APPROVED
- Assertion: statusBadge.text === 'APPROVED'

Test 3: Reject request
- Setup: Mock rejectShopRequest API
- Action: Click Reject button
- Expected: Status changes to REJECTED
- Assertion: statusBadge.text === 'REJECTED'

Test 4: Show processed requests
- Setup: Mock requests with APPROVED/REJECTED status
- Action: Render page
- Expected: Show processed requests section
- Assertion: "Processed Requests" visible with items

Test 5: Handle error
- Setup: Mock API to fail
- Action: Click Approve
- Expected: Show error toast
- Assertion: toastSpy.error called
```

### Admin - Shipping Management

```javascript
Test 1: Filter orders by status
- Setup: Mock orders with different statuses
- Action: Click "Pending" filter tab
- Expected: Show only pending orders
- Assertion: visibleOrders.length === pendingCount

Test 2: Mark order as shipped
- Setup: Mock markOrderAsShipped API
- Action: Click "Ship" button on pending order
- Expected: Status updates, tracking number appears
- Assertion: status === 'SHIPPED' && trackingNumber visible

Test 3: Generate tracking number
- Setup: Mock API marks as shipped
- Action: Click Ship
- Expected: Auto-generated tracking number shown
- Assertion: trackingNumber.startsWith('TRK-')

Test 4: Display order table
- Setup: Mock fetchOrdersForShipping
- Action: Render page
- Expected: Table shows orders with columns
- Assertion: table has Order ID, Customer, Total, Status columns

Test 5: Status color coding
- Setup: Mock orders with different statuses
- Action: Render table
- Expected: Different colors for each status
- Assertion: pendingStatus.color === 'yellow'
```

### Seller - View Orders

```javascript
Test 1: Display all orders
- Setup: Mock fetchSellerOrders
- Action: Render SellerOrdersPage
- Expected: Table shows all orders
- Assertion: rows.length === orders.length

Test 2: Show order stats
- Setup: Mock orders with stats
- Action: Render page
- Expected: Display total orders, pending, delivered, revenue
- Assertion: All stats visible

Test 3: Status color coding
- Setup: Render with mixed statuses
- Action: View table
- Expected: Different colors for each status
- Assertion: Colors correctly mapped

Test 4: Calculate revenue
- Setup: Mock orders with different prices
- Action: Render page
- Expected: Total revenue calculated correctly
- Assertion: revenue === sum of all prices

Test 5: Handle empty state
- Setup: Mock empty orders array
- Action: Render page
- Expected: Show "No orders" message
- Assertion: message visible
```

## End-to-End Tests

### Admin User Flow

```
Scenario 1: Complete Admin Session
1. Login with admin credentials
   - Navigate to /login
   - Submit form with admin email/password
   - Verify redirect to home page
   - Assertion: user.role === 'ADMIN'

2. Access Admin Panel
   - Click user menu
   - Click "Admin Panel"
   - Verify at /admin
   - Assertion: Dashboard loads

3. Manage Categories
   - Navigate to /admin/categories
   - Create new category
   - Edit category
   - Delete category
   - Assertion: CRUD operations successful

4. Approve Shop Request
   - Navigate to /admin/shop-requests
   - View pending requests
   - Click Approve
   - Verify status updates
   - Assertion: Request approved

5. Manage Shipping
   - Navigate to /admin/shipping
   - View pending orders
   - Click Ship
   - Verify tracking number generated
   - Assertion: Order marked as shipped

6. Logout
   - Click user menu
   - Click Logout
   - Verify redirect to home
   - Assertion: user === null
```

### Seller User Flow

```
Scenario 1: Complete Seller Session
1. Login with seller credentials
   - Navigate to /login
   - Submit with seller email/password
   - Verify redirect
   - Assertion: user.role === 'SELLER'

2. Create Shop
   - Navigate to /seller
   - Fill shop form
   - Click Create
   - Assertion: Shop created successfully

3. Add Products
   - Click "Manage Products"
   - Navigate to /seller/products
   - Click "Add Product"
   - Fill product form
   - Click Create
   - Assertion: Product appears in list

4. Edit Product
   - Click Edit on product
   - Change price/stock
   - Click Update
   - Assertion: Changes saved

5. View Orders
   - Navigate to /seller/orders
   - View customer orders
   - Check stats
   - Assertion: Orders displayed correctly

6. Edit Shop
   - Navigate to /seller
   - Click Edit Shop
   - Update description
   - Click Update
   - Assertion: Shop updated

7. Logout
   - Click user menu
   - Click Logout
   - Assertion: Logged out successfully
```

### Customer User Flow (for comparison)

```
Scenario 1: Customer doesn't see admin/seller features
1. Login as customer
   - Assertion: user.role === 'CUSTOMER'
   - Assertion: No "Admin Panel" link
   - Assertion: No "Seller Panel" link

2. Try direct navigation to /admin
   - Navigate to /admin
   - Assertion: Redirect to home page
   - Assertion: No error, just redirect

3. Try direct navigation to /seller
   - Navigate to /seller
   - Assertion: Redirect to home page
   - Assertion: Protected route working
```

## Security Tests

```javascript
Test: Unauthorized access to admin endpoint
- Setup: User has CUSTOMER role
- Action: Try to access /admin
- Expected: Redirect to /
- Assertion: No data leaked, clean redirect

Test: Invalid JWT token
- Setup: Token is expired/invalid
- Action: Make API call with invalid token
- Expected: API returns 401, redirect to login
- Assertion: User logged out

Test: Missing JWT token
- Setup: No token in localStorage
- Action: Navigate to protected route
- Expected: Redirect to login
- Assertion: Not accessible without auth

Test: Role tampering
- Setup: User tries to modify role in JWT
- Action: Backend validates token
- Expected: Signature invalid, reject
- Assertion: Security maintained

Test: XSS prevention
- Setup: Input contains <script> tag
- Action: Submit form with malicious input
- Expected: Sanitized before display
- Assertion: Script not executed
```

## Performance Tests

```javascript
Test: React Query caching
- Setup: Fetch data twice
- Action: Make same request again
- Expected: Second request uses cache
- Assertion: No network call for cached data

Test: Page load time
- Setup: Render with 100+ items
- Action: Measure render time
- Expected: < 1 second
- Assertion: Performance acceptable

Test: Mutation optimization
- Setup: Perform mutation
- Action: Measure update time
- Expected: < 500ms
- Assertion: Optimistic updates working

Test: Memory usage
- Setup: Render admin dashboard
- Action: Monitor memory with DevTools
- Expected: < 50MB increase
- Assertion: No memory leaks
```

## Error Scenarios

```javascript
Test 1: Network timeout
- Setup: Mock API to timeout
- Action: Make request
- Expected: Show timeout error
- Assertion: Error handled gracefully

Test 2: 500 server error
- Setup: Mock API to return 500
- Action: Make request
- Expected: Show error message
- Assertion: User can retry

Test 3: 403 Forbidden
- Setup: User tries unauthorized action
- Action: Make request
- Expected: Redirect to home
- Assertion: Access denied handled

Test 4: Invalid form input
- Setup: Form validation enabled
- Action: Submit invalid data
- Expected: Show validation errors
- Assertion: Submission blocked

Test 5: Concurrent mutations
- Setup: Two mutations at once
- Action: Submit both
- Expected: Queue or handle properly
- Assertion: No race conditions
```

## Browser Compatibility

- [ ] Chrome/Edge (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Accessibility Tests

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Form labels present
- [ ] Alt text on images
- [ ] ARIA attributes proper

## Test Execution

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- AdminDashboardPage.test.tsx

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Expected Coverage

- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## Sign-off Checklist

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Performance acceptable
- [ ] Security validated
- [ ] Accessibility checked
- [ ] Browser compatibility verified
- [ ] Ready for production

---

**Test Status**: Ready for execution
**Last Updated**: [Current Date]
**Test Coordinator**: [Your Name]
