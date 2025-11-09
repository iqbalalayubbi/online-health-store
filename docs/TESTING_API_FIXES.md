# Testing Checklist - API Endpoint Fixes

## Quick Start Testing

### 1️⃣ Test Seller Shop Setup Flow

#### Step 1: Verify API Endpoints Works

```bash
# Test 1: Get shops (should return empty array or list of shops)
curl -X GET http://localhost:5000/api/seller/shops \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN"

# Response if no shop exists:
# []

# Response if shop exists:
# [{ "id": "...", "name": "My Shop", "description": "...", "isActive": true }]
```

#### Step 2: Test Create Shop Request

```bash
# This submits a shop request to admin for approval
curl -X POST http://localhost:5000/api/seller/shop-requests \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "My Health Store",
    "description": "Premium health products"
  }'

# Response:
# { "id": "...", "businessName": "...", "description": "...", "status": "pending", ... }
```

#### Step 3: Test Frontend Page

1. Login sebagai Seller
2. Goto `/seller/shop` page
3. Verify salah satu dari:
   - ✅ Page menampilkan form untuk "Submit Shop Request" (jika belum ada shop)
   - ✅ Page menampilkan shop details dan "Update Shop" form (jika sudah ada shop)
4. Verify no 404 errors di console

---

### 2️⃣ Test Seller Products (Already Working ✅)

#### Step 1: Test Get Products

```bash
curl -X GET http://localhost:5000/api/seller/products \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN"

# Response:
# [{ "id": "...", "name": "Vitamin C", "price": 15000, ... }, ...]
```

#### Step 2: Test Frontend

1. Login sebagai Seller
2. Goto `/seller/products` page
3. Verify products list atau empty state menampilkan
4. Verify no errors

---

### 3️⃣ Test Seller Orders (Already Working ✅)

#### Step 1: Test Get Orders

```bash
curl -X GET http://localhost:5000/api/seller/orders \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN"

# Response:
# [{ "id": "...", "status": "pending", "items": [...], ... }, ...]
```

#### Step 2: Test Frontend

1. Login sebagai Seller
2. Goto `/seller/orders` page
3. Verify orders list display dengan correct data
4. Verify no errors

---

### 4️⃣ Test Admin Features (Should Not Be Affected ✅)

#### Step 1: Admin Dashboard

1. Login sebagai Admin
2. Goto `/admin/dashboard`
3. Verify page load dengan no errors
4. Verify statistics display

#### Step 2: Admin Customers

1. Goto `/admin/customers`
2. Verify customer list
3. Verify search/filter works

#### Step 3: Admin Shop Requests

1. Goto `/admin/shop-requests`
2. Verify requests list (from sellers)
3. Verify approve/reject buttons work

---

## Error Scenarios to Test

### Scenario 1: Seller Belum Punya Shop

**Expected Behavior**:

- ✅ Page tidak crash
- ✅ Show "Create Shop Request" form
- ✅ No 404 errors di console
- ✅ `shopQuery.data` is `null`

**Test**:

```javascript
// Di browser console saat di Seller Shop Setup page:
// Verify no error thrown
console.log("shopQuery.data is null:", shopQuery.data === null);
// Should print: true
```

### Scenario 2: Network Error

**Expected Behavior**:

- ✅ Page tidak crash
- ✅ Show error toast
- ✅ Show retry button atau fallback UI

---

## Manual Testing Steps

### Test 1: Complete Seller Setup Flow

```
1. Register sebagai Seller
   ↓
2. Login sebagai Seller
   ↓
3. Go to /seller/shop
   ↓
4. Should see "Submit Shop Request" form
   ↓
5. Fill form:
   - Business Name: "Vitamin Store Indonesia"
   - Description: "Premium health products"
   ↓
6. Click "Submit"
   ↓
7. Verify:
   ✓ Success toast appears
   ✓ Form reset atau page update
   ✓ Network tab shows POST /api/seller/shop-requests (201 or 200)
   ↓
8. Logout and login sebagai Admin
   ↓
9. Go to /admin/shop-requests
   ↓
10. Verify request muncul di list
    ↓
11. Click Approve
    ↓
12. Logout and login sebagai Seller again
    ↓
13. Go to /seller/shop
    ↓
14. Verify shop details sekarang tampil (with update form)
    ↓
15. Edit shop details
    ↓
16. Click Update
    ↓
17. Verify:
    ✓ Success toast
    ✓ Data updated
    ✓ Network tab shows PUT /api/seller/shops
```

---

## Postman Collection

```json
{
  "info": {
    "name": "Seller API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Seller Shops",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/seller/shops",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          }
        ]
      }
    },
    {
      "name": "Create Shop Request",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/seller/shop-requests",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"businessName\": \"My Shop\",\n  \"description\": \"Shop description\"\n}"
        }
      }
    },
    {
      "name": "Get Seller Products",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/seller/products",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          }
        ]
      }
    },
    {
      "name": "Get Seller Orders",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/seller/orders",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          }
        ]
      }
    }
  ]
}
```

---

## Verification Checklist

- [ ] Seller Shop Setup page loads without 404 errors
- [ ] New seller can submit shop request
- [ ] API calls use correct endpoints (no 404s)
- [ ] Error handling works gracefully (null shop scenario)
- [ ] Admin can see shop requests and approve
- [ ] Seller can view approved shop
- [ ] Seller can update shop details
- [ ] Seller products page works
- [ ] Seller orders page works
- [ ] Admin features still work (not affected)
- [ ] All error toasts display correctly
- [ ] Network tab shows correct endpoint calls
- [ ] No console errors

---

## Files Modified

1. ✅ `src/features/seller/api.ts`
   - Updated: `fetchSellerShop()`
   - Updated: `createShop()`
   - Updated: `updateShop()`

2. ✅ `src/features/seller/pages/SellerShopSetupPage.tsx`
   - Updated: Handle `null` shop gracefully
   - Removed: Unused `Shop` type import

---

## Known Issues

1. ❌ Backend might not have PUT endpoint for shop updates
   - **Solution**: Check if `updateShop()` works
   - **If not**: Either backend needs enhancement OR use shop-requests for updates

2. ⚠️ Shop creation goes to `/seller/shop-requests` (needs admin approval)
   - **This is correct**: Sellers submit requests, admin approves
   - **Expected flow**: Submit → Pending → Admin Review → Approved

---

## Next Steps if Tests Fail

### If `/seller/shops` returns 404

- [ ] Check backend route defined: `router.get("/shops", ...)`
- [ ] Check backend controller has `listShops` method
- [ ] Check seller is properly authenticated

### If Create Shop Request fails

- [ ] Check backend route: `router.post("/shop-requests", ...)`
- [ ] Check controller method `submitShopRequest`
- [ ] Verify body fields match: `businessName`, `description`

### If Update Shop fails

- [ ] Check if backend has PUT endpoint: `router.put("/shops", ...)`
- [ ] If not, implement in backend
- [ ] Or modify frontend to use shop-requests instead

---

## Success Criteria

✅ All seller pages load without errors
✅ API endpoints call correctly (verified in Network tab)
✅ CRUD operations work for shops, products, orders
✅ Error handling graceful (no crashes on null data)
✅ Admin features unaffected
✅ Role-based access control works
