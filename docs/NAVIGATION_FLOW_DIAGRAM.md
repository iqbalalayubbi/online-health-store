# 🎨 NAVIGATION FLOW DIAGRAM - Role-Based Menu Display

---

## 📊 NAVIGATION ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                        MainLayout                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Get user from AuthStore                               │
│     └─ If no user: isCustomer = true                      │
│     └─ If CUSTOMER: isCustomer = true                     │
│     └─ If ADMIN/SELLER: isDashboardUser = true            │
│                                                             │
│  2. Conditional Render Menu Items                         │
│     ├─ {isCustomer} → Show [Beranda | Katalog | Cart]   │
│     ├─ {isDashboardUser} → Show [📊 Dashboard]          │
│     ├─ {user} → Show [User Menu]                         │
│     └─ {!user} → Show [Login | Register]                 │
│                                                             │
│  3. UserMenu Component                                     │
│     └─ Simplified dropdown (no admin/seller panels)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 USER ROLE FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    NOT AUTHENTICATED                        │
├─────────────────────────────────────────────────────────────┤
│  isCustomer: true                                           │
│  isDashboardUser: false                                     │
│                                                             │
│  Navbar: [Logo] | Beranda | Katalog | Login | Register     │
│                                                             │
│  User clicks Login/Register                                │
│  ↓                                                          │
│  Go to /login or /register                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     CUSTOMER LOGIN                          │
├─────────────────────────────────────────────────────────────┤
│  user.role: "CUSTOMER"                                      │
│  isCustomer: true                                           │
│  isDashboardUser: false                                     │
│                                                             │
│  Navbar: [Logo] | Beranda | Katalog | 🛒 Cart | 👤 User   │
│                                                             │
│  User Menu Dropdown:                                       │
│  ├─ 👤 Profil Saya → /profile                             │
│  ├─ 📦 Pesanan Saya → /orders                             │
│  └─ 🚪 Logout                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     ADMIN LOGIN                             │
├─────────────────────────────────────────────────────────────┤
│  user.role: "ADMIN"                                         │
│  isCustomer: false                                          │
│  isDashboardUser: true                                      │
│                                                             │
│  Navbar: [Logo] | 📊 Dashboard (blue) | 👤 User           │
│                                                             │
│  Dashboard Button:                                         │
│  ├─ Link: /admin                                           │
│  ├─ Color: Blue (#1e40af → #1e3a8a hover)                │
│  └─ Action: Go to Admin Dashboard                         │
│                                                             │
│  User Menu Dropdown:                                       │
│  ├─ 👤 Profil Saya → /profile                             │
│  ├─ 📦 Pesanan Saya → /orders                             │
│  └─ 🚪 Logout                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     SELLER LOGIN                            │
├─────────────────────────────────────────────────────────────┤
│  user.role: "SELLER"                                        │
│  isCustomer: false                                          │
│  isDashboardUser: true                                      │
│                                                             │
│  Navbar: [Logo] | 📊 Dashboard (blue) | 👤 User           │
│                                                             │
│  Dashboard Button:                                         │
│  ├─ Link: /seller                                          │
│  ├─ Color: Blue (#1e40af → #1e3a8a hover)                │
│  └─ Action: Go to Seller Panel                            │
│                                                             │
│  User Menu Dropdown:                                       │
│  ├─ 👤 Profil Saya → /profile                             │
│  ├─ 📦 Pesanan Saya → /orders                             │
│  └─ 🚪 Logout                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 CODE LOGIC FLOW

```
START: User navigates to MainLayout
  ↓
FETCH: Get user from AuthStore
  ↓
DETECT: Calculate role-based flags
  ├─ const isCustomer = !user || user.role === "CUSTOMER"
  │   (true if no user OR user is customer)
  │
  └─ const isDashboardUser = user && (user.role === "ADMIN" || user.role === "SELLER")
      (true if user exists AND is admin or seller)
  ↓
RENDER: Build navbar based on flags
  ├─ IF isCustomer:
  │  ├─ <Link to="/">Beranda</Link>
  │  ├─ <Link to="/catalog">Katalog</Link>
  │  └─ {user && <CartIcon />}
  │
  ├─ IF isDashboardUser:
  │  └─ <Link to={admin ? "/admin" : "/seller"}>📊 Dashboard</Link>
  │
  ├─ IF user exists:
  │  └─ <UserMenu />
  │
  └─ ELSE:
     ├─ <Link to="/login">Login</Link>
     └─ <Link to="/register">Register</Link>
  ↓
DISPLAY: Render navbar with appropriate items
  ↓
END
```

---

## 🎯 CONDITIONAL LOGIC TABLE

```
┌──────────┬───────────┬─────────────────┬────────────────┬───────────┐
│ User     │ Logged In │ isCustomer      │ isDashboardUser│ Navbar    │
│ Status   │           │                 │                │ Display   │
├──────────┼───────────┼─────────────────┼────────────────┼───────────┤
│ Visitor  │ No        │ true            │ false          │ BK+LR     │
├──────────┼───────────┼─────────────────┼────────────────┼───────────┤
│ Customer │ Yes       │ true            │ false          │ BKCA+UM   │
├──────────┼───────────┼─────────────────┼────────────────┼───────────┤
│ Admin    │ Yes       │ false           │ true           │ DB+UM     │
├──────────┼───────────┼─────────────────┼────────────────┼───────────┤
│ Seller   │ Yes       │ false           │ true           │ DB+UM     │
└──────────┴───────────┴─────────────────┴────────────────┴───────────┘

Legend:
B = Beranda
K = Katalog
CA = Cart
LR = Login/Register
DB = Dashboard
UM = User Menu
```

---

## 🔀 USER JOURNEY

### Customer Journey

```
Visitor
  ↓ Login
Customer
  ↓
See: Beranda | Katalog | Cart | User Menu
  ├─ Click Beranda → Home page
  ├─ Click Katalog → Shopping
  ├─ Click Cart → Cart page
  └─ Click User Menu
      ├─ Profil Saya
      ├─ Pesanan Saya
      └─ Logout
```

### Admin Journey

```
Visitor
  ↓ Register as Admin (via registration)
Admin
  ↓
See: Dashboard (blue button) | User Menu
  ├─ Click Dashboard → /admin
  │   ├─ Dashboard page
  │   ├─ Customers
  │   ├─ Guestbook
  │   ├─ Categories
  │   ├─ Shop Requests
  │   └─ Shipping
  │
  └─ Click User Menu
      ├─ Profil Saya
      ├─ Pesanan Saya
      └─ Logout
```

### Seller Journey

```
Visitor
  ↓ Register as Seller (via registration)
Seller
  ↓
See: Dashboard (blue button) | User Menu
  ├─ Click Dashboard → /seller
  │   ├─ Shop Setup
  │   ├─ Products
  │   └─ Orders
  │
  └─ Click User Menu
      ├─ Profil Saya
      ├─ Pesanan Saya
      └─ Logout
```

---

## 🎨 STYLING FLOW

```
Dashboard Button Styling:
  ├─ bg-blue-600 (background: #1e40af)
  ├─ hover:bg-blue-700 (on hover: #1e3a8a)
  ├─ text-white (white text)
  ├─ px-3 py-2 (padding)
  ├─ rounded-md (border radius)
  ├─ font-semibold (bold)
  └─ transition (smooth animation)

Result: Blue, prominent button that stands out in navbar
```

---

## 📱 RESPONSIVE DESIGN

```
Desktop (>= 640px):
[Logo] | Menu Items | User Menu
────────────────────────────────

Mobile (< 640px):
[Logo] | [Menu] [User]
──────────────────────
(Items may stack/wrap based on Tailwind responsive classes)
```

---

## 🔐 Security Considerations

```
✅ Auth Status Check
   └─ Always verify user role before showing role-specific menus

✅ Role Validation
   └─ Frontend shows appropriate UI, backend validates on requests

✅ Protected Routes
   └─ ProtectedRoute component prevents unauthorized access

✅ No Sensitive Data
   └─ Navigation items don't expose backend information
```

---

## ✨ USER EXPERIENCE IMPROVEMENTS

```
Before: ❌ Confusing
[Logo] | Beranda | Katalog | Cart | [Admin Panel / Seller Panel dropdown]
        └─ All users see these, even admin/seller!

After: ✅ Clear
Customer: [Logo] | Beranda | Katalog | Cart | [User Menu]
Admin:    [Logo] | 📊 Dashboard | [User Menu]
Seller:   [Logo] | 📊 Dashboard | [User Menu]
          └─ Each role sees appropriate items only
```

---

## 🎯 BENEFITS

```
1. CLARITY
   ✅ Users see only relevant menu items

2. EFFICIENCY
   ✅ Admin/Seller can access dashboard with 1 click
   ✅ No need to navigate through dropdown

3. UX CONSISTENCY
   ✅ Dashboard button is always visible in navbar
   ✅ Same styling for admin and seller

4. REDUCED CONFUSION
   ✅ No customer menus for non-customers
   ✅ Clear separation of concerns

5. PROFESSIONAL
   ✅ Blue dashboard button looks polished
   ✅ Clean, organized navigation
```

---

## 🧪 TEST MATRIX

```
Test Case | Role    | Beranda | Katalog | Cart | Dashboard | Pass?
─────────────────────────────────────────────────────────────────────
1         | Customer| ✅      | ✅      | ✅   | ❌        | ✅
2         | Admin   | ❌      | ❌      | ❌   | ✅→/admin | ✅
3         | Seller  | ❌      | ❌      | ❌   | ✅→/seller| ✅
4         | Visitor | ✅      | ✅      | ❌   | ❌        | ✅
```

---

**Navigation flow is complete and ready for testing!** 🚀
