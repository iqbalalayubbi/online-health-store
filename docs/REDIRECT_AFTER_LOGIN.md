# Post-Login Redirect Guide

## Overview

Setelah login atau registrasi, pengguna akan diarahkan ke halaman yang sesuai dengan role mereka.

## Redirect Logic

### Redirect Destinations by Role

| Role         | Redirect Path | Halaman          |
| ------------ | ------------- | ---------------- |
| **CUSTOMER** | `/catalog`    | Katalog Produk   |
| **SELLER**   | `/seller`     | Dashboard Seller |
| **ADMIN**    | `/admin`      | Dashboard Admin  |

## Implementasi

### 1. LoginForm Component

**File**: `apps/frontend/src/features/auth/components/LoginForm.tsx`

```typescript
useEffect(() => {
  if (mutation.isSuccess && user) {
    // Redirect based on user role
    const redirectPath =
      user.role === "ADMIN" ? "/admin" : user.role === "SELLER" ? "/seller" : "/catalog"; // Default to catalog for CUSTOMER

    navigate(redirectPath);
  }
}, [mutation.isSuccess, user, navigate]);
```

**Logika**:

- Memeriksa `mutation.isSuccess` (login berhasil)
- Mengambil `user` dari Zustand store
- Menentukan path berdasarkan `user.role`
- Navigate ke path yang sesuai

### 2. RegisterForm Component

**File**: `apps/frontend/src/features/auth/components/RegisterForm.tsx`

```typescript
useEffect(() => {
  if (mutation.isSuccess && user) {
    // Redirect based on user role
    const redirectPath =
      user.role === "ADMIN" ? "/admin" : user.role === "SELLER" ? "/seller" : "/catalog"; // Default to catalog for CUSTOMER

    navigate(redirectPath);
  }
}, [mutation.isSuccess, user, navigate]);
```

**Logika**:

- Sama seperti LoginForm
- User baru diarahkan sesuai role yang dipilih saat registrasi
- SELLER dan CUSTOMER dapat memilih role saat registrasi

## User Stories

### Scenario 1: Customer Login

```
1. Customer login dengan email customer@example.com
2. Credentials valid ✓
3. Auth store updated dengan user.role = "CUSTOMER"
4. Redirect ke /catalog
5. Customer melihat katalog produk
```

### Scenario 2: Seller Login

```
1. Seller login dengan email seller@example.com
2. Credentials valid ✓
3. Auth store updated dengan user.role = "SELLER"
4. Redirect ke /seller
5. Seller melihat dashboard seller (shop setup)
```

### Scenario 3: Admin Login

```
1. Admin login dengan email admin@example.com
2. Credentials valid ✓
3. Auth store updated dengan user.role = "ADMIN"
4. Redirect ke /admin
5. Admin melihat admin dashboard
```

### Scenario 4: New Seller Registration

```
1. User daftar dengan role="SELLER"
2. Registration berhasil ✓
3. Auth store updated dengan user.role = "SELLER"
4. Redirect ke /seller
5. Seller langsung masuk ke dashboard seller
```

### Scenario 5: New Customer Registration

```
1. User daftar dengan role="CUSTOMER"
2. Registration berhasil ✓
3. Auth store updated dengan user.role = "CUSTOMER"
4. Redirect ke /catalog
5. Customer langsung melihat katalog produk
```

## Technical Details

### Dependencies

- `react-router-dom`: `useNavigate` hook untuk routing
- `zustand`: `useAuthStore` untuk mengakses data user
- `react`: `useEffect` untuk trigger redirect

### Flow Diagram

```
Login/Register Submit
    ↓
API Call (useLogin/useRegister mutation)
    ↓
Success? → NO → Show Error Message
    ↓
    YES
    ↓
Auth Store Updated (setAuth called)
    ↓
useEffect triggered (mutation.isSuccess && user)
    ↓
Check user.role
    ↓
┌─────────┬──────────┬──────────┐
│ ADMIN   │ SELLER   │ CUSTOMER │
├─────────┼──────────┼──────────┤
│ /admin  │ /seller  │ /catalog │
└─────────┴──────────┴──────────┘
    ↓
Navigate to destination
    ↓
Route Protection (ProtectedRoute) validates role
    ↓
Correct role? → YES → Show Page
    ↓
             NO → Redirect to login or home
```

## Testing Checklist

### Login Testing

- [ ] Login as CUSTOMER → Redirect to `/catalog`
- [ ] Login as SELLER → Redirect to `/seller`
- [ ] Login as ADMIN → Redirect to `/admin`
- [ ] Invalid credentials → Show error, stay on login page
- [ ] Network error → Show error, stay on login page

### Registration Testing

- [ ] Register as CUSTOMER → Redirect to `/catalog`
- [ ] Register as SELLER → Redirect to `/seller`
- [ ] Missing required fields → Show error, stay on register page
- [ ] Duplicate email → Show error, stay on register page
- [ ] Password too short → Show error, stay on register page

### Edge Cases

- [ ] Rapid clicks on login button → Only one request sent (isPending state)
- [ ] Network slow → Show "Memproses..." state
- [ ] Logout and login as different role → Redirect to new role's page
- [ ] Browser refresh after login → Session persisted via Zustand persist middleware

## Related Files

### Authentication Flow

- `apps/frontend/src/stores/authStore.ts` - State management
- `apps/frontend/src/features/auth/hooks.ts` - useLogin, useRegister mutations
- `apps/frontend/src/components/ProtectedRoute.tsx` - Route protection
- `apps/frontend/src/app/routes.tsx` - Route definitions

### UI Components

- `apps/frontend/src/features/auth/pages/LoginPage.tsx` - Login page wrapper
- `apps/frontend/src/features/auth/pages/RegisterPage.tsx` - Register page wrapper
- `apps/frontend/src/features/auth/components/LoginForm.tsx` - Login form (UPDATED)
- `apps/frontend/src/features/auth/components/RegisterForm.tsx` - Register form (UPDATED)

### Dashboard Pages

- `apps/frontend/src/features/admin/pages/AdminDashboardPage.tsx` - Admin dashboard
- `apps/frontend/src/features/seller/pages/SellerShopSetupPage.tsx` - Seller dashboard
- `apps/frontend/src/features/catalog/components/CatalogView.tsx` - Catalog for customers

## Changelog

### v1.0 (November 3, 2025)

- ✅ Implemented role-based post-login redirect
- ✅ Updated LoginForm to redirect based on user role
- ✅ Updated RegisterForm to redirect based on user role
- ✅ Added Zustand auth store integration
- ✅ Maintained backward compatibility with existing routes
