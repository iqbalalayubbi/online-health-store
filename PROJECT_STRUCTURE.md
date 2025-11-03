# Project Structure After Cleanup

## Directory Tree

```
frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx                      # Root component
│   │   ├── providers.tsx                # React providers (Query, Router)
│   │   └── routes.tsx                   # Route definitions
│   │
│   ├── components/                      # Shared UI components
│   │   ├── CartIcon.tsx                 # Shopping cart icon with badge
│   │   ├── Toast.tsx                    # Custom toast notifications
│   │   └── UserMenu.tsx                 # User profile dropdown menu
│   │
│   ├── features/                        # Feature-based modules
│   │   ├── auth/                        # Authentication feature
│   │   │   ├── api.ts                   # Login/Register API calls
│   │   │   ├── hooks.ts                 # useLogin, useRegister hooks
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   └── pages/
│   │   │       ├── LoginPage.tsx
│   │   │       └── RegisterPage.tsx
│   │   │
│   │   ├── catalog/                     # Product catalog feature
│   │   │   ├── api.ts                   # Fetch categories, products
│   │   │   └── components/
│   │   │       ├── CatalogView.tsx      # Main catalog page
│   │   │       ├── ProductCard.tsx      # Individual product card
│   │   │       └── ProductDetailModal.tsx
│   │   │
│   │   ├── customer/                    # Customer operations
│   │   │   └── api.ts                   # Cart, checkout, orders
│   │   │
│   │   └── shared/                      # Shared pages
│   │       └── HomePage.tsx             # Landing page
│   │
│   ├── hooks/                           # Custom React hooks
│   │
│   ├── layouts/
│   │   └── MainLayout.tsx               # Main app layout (header, footer)
│   │
│   ├── pages/                           # Page components (not in features)
│   │   ├── CartPage.tsx                 # Shopping cart page
│   │   ├── CheckoutPage.tsx             # Checkout form page
│   │   ├── ProfilePage.tsx              # User profile page
│   │   ├── OrdersPage.tsx               # Orders list page
│   │   └── OrderDetailPage.tsx          # Order detail page
│   │
│   ├── services/
│   │   └── apiClient.ts                 # Axios instance with auth
│   │
│   ├── stores/
│   │   └── authStore.ts                 # Zustand auth store
│   │
│   ├── types/
│   │   └── api.ts                       # TypeScript interfaces
│   │
│   ├── utils/
│   │   └── error.ts                     # Error handling utilities
│   │
│   ├── index.css                        # Global styles
│   └── main.tsx                         # Entry point
│
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Feature Modules Explanation

### 1. `features/auth/`

Handles user authentication (login, register)

- **api.ts**: Login and register API calls
- **hooks.ts**: Custom hooks for auth mutations
- **components/**: Form components
- **pages/**: Page-level components

### 2. `features/catalog/`

Product discovery and browsing

- **api.ts**: Fetch categories and products
- **components/**: Product catalog, cards, modals

### 3. `features/customer/`

Customer-specific operations

- **api.ts**: Cart, checkout, orders, profile operations
- No pages/components (uses pages from root)

### 4. `features/shared/`

Shared pages used across the app

- **HomePage.tsx**: Landing/home page

## Pages Structure

### Root Pages (`pages/`)

Main user-facing pages:

- **CartPage**: Shopping cart management
- **CheckoutPage**: Checkout form
- **ProfilePage**: User profile view
- **OrdersPage**: Orders list
- **OrderDetailPage**: Individual order details

These are separate from features for easy routing and page-level concerns.

## Components Structure

### Shared Components (`components/`)

Reusable UI components:

- **CartIcon**: Shopping cart icon with item count badge
- **Toast**: Custom toast notification system
- **UserMenu**: User profile dropdown menu

## Services & Stores

### `services/apiClient.ts`

- Axios instance with base URL and auth headers
- Automatic token attachment from auth store

### `stores/authStore.ts`

- Zustand store for auth state
- Persisted to localStorage
- Token and user info management

## Routing Structure

```
/                   → HomePage
/catalog            → CatalogView (product list)
/cart               → CartPage
/checkout           → CheckoutPage
/profile            → ProfilePage
/orders             → OrdersPage
/orders/:orderId    → OrderDetailPage
/login              → LoginPage
/register           → RegisterPage
```

## Data Flow

```
Components
    ↓
useQuery (React Query)
    ↓
API Functions
    ↓
apiClient (Axios)
    ↓
Backend

useMutation (React Query)
    ↓
API Functions
    ↓
apiClient (Axios)
    ↓
Backend
```

## State Management

### Global State

- **authStore** (Zustand)
  - token
  - user
  - setAuth()
  - clearAuth()

- **toastStore** (Zustand, inside Toast component)
  - messages
  - addMessage()
  - removeMessage()

### Server State

- **React Query**
  - Products
  - Cart
  - Orders
  - Categories

## Key Design Decisions

### ✅ Feature-Based Organization

- Each feature is self-contained
- Easy to add/remove features
- Clear responsibility boundaries

### ✅ Separation of Pages

- Pages in root `pages/` folder
- Features contain components/hooks for specific features
- Makes routing clearer

### ✅ Custom Toast Notification

- No external dependencies (React 19 compatible)
- Zustand-based state management
- Clean API: `toast.success()`, `toast.error()`

### ✅ API Client Pattern

- Centralized apiClient service
- Automatic auth header injection
- Error handling

### ✅ TypeScript Types

- All API responses typed
- Props interfaces for components
- Type-safe routing

## Removed Elements

❌ Dashboard (not needed for customer app)
❌ Admin features (separate app needed)
❌ Seller features (separate app needed)
❌ ProtectedRoute (no protected routes needed)
❌ Orders feature module (migrated to pages/)

## Performance Considerations

### ✅ Code Splitting

- Pages are separate components
- Lazy loading via React Router possible

### ✅ Query Optimization

- React Query caching
- Refetch on focus/visibility
- Stale time management

### ✅ Bundle Size

- Removed unused admin/seller code
- No unused dependencies
- Optimized imports

## Future Enhancements

1. **Admin App** - Separate Next.js/React app
2. **Seller App** - Separate app for sellers
3. **Mobile App** - React Native or responsive web
4. **Component Library** - Shared UI components
5. **Testing** - Unit/integration tests
6. **E2E Tests** - Cypress/Playwright
