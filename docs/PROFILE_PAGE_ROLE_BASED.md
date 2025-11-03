# Profile Page - Role-Based Navigation

## Overview

Halaman profil sekarang menampilkan section "Navigasi Cepat" hanya untuk user dengan role CUSTOMER. Role lain (ADMIN, SELLER) tidak akan melihat section ini.

## Feature Details

### Profile Page Sections

#### 1. Header (All Roles)

```
Profil Akun
Kelola informasi akun Anda
```

#### 2. Profile Card (All Roles)

- Avatar gradient
- Email/User Identifier
- Role badge dengan warna berbeda per role

#### 3. Account Details (All Roles)

Grid dengan 4 card informasi:

- 📧 Email
- 🎯 Role (dengan deskripsi berbeda per role)
- 🔑 User ID
- ✅ Status (Aktif)

#### 4. Quick Navigation - Only CUSTOMER ✨

Section ini hanya tampil untuk role CUSTOMER dan berisi:

- 📦 Pesanan Saya → `/orders`
- 🛒 Katalog → `/catalog`
- 🛍️ Keranjang → `/cart`
- ⚙️ Pengaturan → (disabled, segera hadir)

## Implementasi

### File: `apps/frontend/src/pages/ProfilePage.tsx`

```typescript
{/* Quick Links - Only for CUSTOMER */}
{user.role === "CUSTOMER" && (
  <div className="rounded-lg bg-white p-6 shadow-sm">
    <h3 className="mb-4 text-lg font-semibold text-slate-800">🔗 Navigasi Cepat</h3>
    <div className="grid gap-3 sm:grid-cols-2">
      {/* Links untuk orders, catalog, cart, settings */}
    </div>
  </div>
)}
```

### Conditional Rendering

```typescript
if (user.role === "CUSTOMER") {
  // Tampilkan section "Navigasi Cepat"
} else {
  // Jangan tampilkan section "Navigasi Cepat"
}
```

## View Behavior by Role

### 👤 CUSTOMER Profile View

```
✅ Header
✅ Profile Card
✅ Account Details
✅ Quick Navigation (4 links)
   - Pesanan Saya
   - Katalog
   - Keranjang
   - Pengaturan (disabled)
```

### 👨‍💼 ADMIN Profile View

```
✅ Header
✅ Profile Card
✅ Account Details
❌ Quick Navigation (HIDDEN)
```

### 🏪 SELLER Profile View

```
✅ Header
✅ Profile Card
✅ Account Details
❌ Quick Navigation (HIDDEN)
```

## User Stories

### Story 1: Customer Viewing Profile

```
1. Customer login → redirect /catalog
2. Customer click profile menu → navigate /profile
3. Page loaded dengan role "CUSTOMER"
4. Section "Navigasi Cepat" TERLIHAT
5. Customer dapat akses quick links:
   - View orders history
   - Browse catalog
   - Check cart
   - Settings (disabled)
```

### Story 2: Admin Viewing Profile

```
1. Admin login → redirect /admin
2. Admin click profile menu → navigate /profile
3. Page loaded dengan role "ADMIN"
4. Section "Navigasi Cepat" TERSEMBUNYI
5. Admin hanya lihat:
   - Account details
   - Role info (Administrator)
```

### Story 3: Seller Viewing Profile

```
1. Seller login → redirect /seller
2. Seller click profile menu → navigate /profile
3. Page loaded dengan role "SELLER"
4. Section "Navigasi Cepat" TERSEMBUNYI
5. Seller hanya lihat:
   - Account details
   - Role info (Penjual)
```

## Styling Details

### Quick Navigation Card

- Background: `bg-white`
- Padding: `p-6`
- Shadow: `shadow-sm`
- Border radius: `rounded-lg`

### Quick Link Items

- Layout: `grid gap-3 sm:grid-cols-2` (2 column on desktop, 1 on mobile)
- Border: `border border-slate-200`
- Hover effect: `hover:border-blue-300 hover:bg-blue-50`
- Padding: `px-4 py-3`
- Flex gap: `gap-3`

### Icon + Text Structure

```
[Icon] [Title + Description]
📦    Pesanan Saya
       Lihat riwayat pesanan
```

## Related Components

### Dependencies

- `react-router-dom`: `Link` component untuk navigation
- `zustand`: `useAuthStore` untuk role checking

### Files

- `apps/frontend/src/pages/ProfilePage.tsx` - Profile page (UPDATED)
- `apps/frontend/src/stores/authStore.ts` - Auth state
- `apps/frontend/src/layouts/MainLayout.tsx` - Layout dengan profile link

## Testing Checklist

### Customer Role

- [ ] Login as CUSTOMER
- [ ] Navigate to profile
- [ ] Verify "Navigasi Cepat" section visible
- [ ] All 4 links functional:
  - [ ] "Pesanan Saya" → `/orders`
  - [ ] "Katalog" → `/catalog`
  - [ ] "Keranjang" → `/cart`
  - [ ] "Pengaturan" → disabled (no action)

### Admin Role

- [ ] Login as ADMIN
- [ ] Navigate to profile
- [ ] Verify "Navigasi Cepat" section NOT visible
- [ ] Verify Account Details visible
- [ ] Verify role label shows "Administrator"

### Seller Role

- [ ] Login as SELLER
- [ ] Navigate to profile
- [ ] Verify "Navigasi Cepat" section NOT visible
- [ ] Verify Account Details visible
- [ ] Verify role label shows "Penjual"

## Responsive Design

### Mobile (sm < 640px)

- Quick links displayed as single column
- `grid-cols-1` (default)
- Full width pada mobile devices

### Desktop (sm ≥ 640px)

- Quick links displayed as 2 columns
- `sm:grid-cols-2`
- Better use of horizontal space

## Future Enhancements

### Potential Additions

1. Settings page implementation (currently disabled)
2. Additional quick links for different roles:
   - Admin: Dashboard link, Manage Users, etc.
   - Seller: Manage Products, View Sales, etc.
3. Recent activity section
4. Account security options
5. Profile picture upload

### Role-Specific Quick Links

Consider adding role-specific quick navigation in future:

```typescript
// Admin quick links
if (user.role === "ADMIN") {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3>🔗 Navigasi Cepat</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/admin">Admin Dashboard</Link>
        <Link to="/admin/customers">Kelola Customers</Link>
        <Link to="/admin/categories">Kategori</Link>
        <Link to="/admin/shop-requests">Shop Requests</Link>
      </div>
    </div>
  );
}

// Seller quick links
if (user.role === "SELLER") {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3>🔗 Navigasi Cepat</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/seller">Shop Setup</Link>
        <Link to="/seller/products">Produk</Link>
        <Link to="/seller/orders">Pesanan</Link>
      </div>
    </div>
  );
}
```

## Changelog

### v1.0 (November 3, 2025)

- ✅ Implemented conditional rendering for "Navigasi Cepat" section
- ✅ Section only visible for CUSTOMER role
- ✅ Section hidden for ADMIN and SELLER roles
- ✅ Maintained responsive design
- ✅ All links and styling preserved for CUSTOMER view
