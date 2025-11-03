# Backend API Endpoint Mapping

## Status Perbaikan: API Endpoints Seller

### Problem Ditemukan ❌

- Endpoint frontend `/api/seller/shop` tidak ada di backend
- Backend mengembalikan 404 saat diakses
- Hanya endpoint `/api/seller/shops` (plural) yang tersedia

### Solusi yang Diterapkan ✅

#### 1. Update `fetchSellerShop()` API

**File**: `src/features/seller/api.ts`

```typescript
// SEBELUM (Error 404)
export const fetchSellerShop = async (): Promise<Shop> => {
  const { data } = await apiClient.get("/seller/shop");
  return data;
};

// SESUDAH (Works dengan /seller/shops)
export const fetchSellerShop = async (): Promise<Shop | null> => {
  try {
    const { data } = await apiClient.get("/seller/shops");
    // Return first shop if exists, otherwise null
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    // If no shop exists, return null instead of throwing error
    return null;
  }
};
```

**Perubahan**:

- ✅ Gunakan endpoint yang benar: `/seller/shops` (plural)
- ✅ Tangani response array (bukan single object)
- ✅ Return `null` jika belum ada shop (graceful)
- ✅ Error handling untuk prevent crash

#### 2. Update `createShop()` API

**File**: `src/features/seller/api.ts`

```typescript
// SESUDAH
export const createShop = async (name: string, description?: string): Promise<Shop> => {
  const { data } = await apiClient.post("/seller/shop-requests", {
    businessName: name,
    description,
  });
  return data;
};
```

**Perubahan**:

- ✅ Gunakan endpoint yang benar: `/seller/shop-requests`
- ✅ Gunakan field name yang benar: `businessName` (bukan `name`)

#### 3. Update `updateShop()` API

**File**: `src/features/seller/api.ts`

```typescript
// SESUDAH
export const updateShop = async (name: string, description?: string): Promise<Shop> => {
  const { data } = await apiClient.put("/seller/shops", { name, description });
  return data;
};
```

**Perubahan**:

- ✅ Gunakan endpoint yang benar: `/seller/shops` (plural)

---

## Backend Endpoints Reference

### Seller Endpoints (dari backend)

```
GET    /api/seller/shops              - Get all seller shops
POST   /api/seller/shop-requests      - Submit shop request
GET    /api/seller/products           - Get seller products
POST   /api/seller/products           - Create product
PUT    /api/seller/products/:productId - Update product
DELETE /api/seller/products/:productId - Delete product
GET    /api/seller/orders             - Get seller orders
```

### Updated Frontend API Calls

✅ `fetchSellerShop()` → `GET /seller/shops`
✅ `createShop()` → `POST /seller/shop-requests`
✅ `updateShop()` → `PUT /seller/shops`
✅ `fetchSellerProducts()` → `GET /seller/products`
✅ `createProduct()` → `POST /seller/products`
✅ `updateProduct()` → `PUT /seller/products/:productId`
✅ `deleteProduct()` → `DELETE /seller/products/:productId`
✅ `fetchSellerOrders()` → `GET /seller/orders`

---

## Testing dengan Postman

### Test fetchSellerShop

```
Method: GET
URL: http://localhost:5000/api/seller/shops
Headers:
  Authorization: Bearer <token>

Response (jika ada shop):
[
  {
    "id": "shop-123",
    "name": "My Shop",
    "description": "My description",
    "isActive": true
  }
]

Response (jika belum ada shop):
[]
```

---

## File yang Diupdate

- ✅ `src/features/seller/api.ts` - Updated endpoints
- ✅ `src/features/seller/pages/SellerShopSetupPage.tsx` - Handle null shop

---

## Status Saat Ini

✅ **fetchSellerShop()** - Working (handles null gracefully)
✅ **createShop()** - Ready
⏳ **updateShop()** - Ready
✅ **fetchSellerProducts()** - Already correct
✅ **createProduct()** - Already correct
✅ **updateProduct()** - Already correct
✅ **deleteProduct()** - Already correct
✅ **fetchSellerOrders()** - Already correct

---

## Next Steps

1. Test dengan Postman untuk verify endpoints
2. Verify backend mengembalikan data yang expected
3. Check SellerShopSetupPage menampilkan form untuk create shop
4. Test create/update shop functionality

---

## Notes

- Backend menggunakan `/seller/shop-requests` untuk create shop (submit request)
- Frontend sekarang handle case ketika seller belum punya shop
- Graceful error handling dengan return `null` instead of throwing error
