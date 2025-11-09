# Order API Implementation Guide

## Overview

Implementasi Order API untuk menampilkan dan mengelola pesanan yang telah dibuat oleh user. Sistem terintegrasi penuh antara frontend dan backend.

## Backend Endpoints

### GET /customer/orders

Mengambil daftar semua pesanan untuk customer yang login.

**Request:**

```bash
GET /customer/orders
Authorization: Bearer {token}
```

**Response:**

```json
[
  {
    "id": "order-123",
    "orderNumber": "ORD-2025-001",
    "status": "PENDING",
    "totalAmount": "250000",
    "shippingName": "John Doe",
    "shippingCity": "Jakarta",
    "shippingState": "DKI Jakarta",
    "shippingPostalCode": "12345",
    "shippingCountry": "Indonesia",
    "items": [
      {
        "id": "item-1",
        "quantity": 2,
        "price": "100000",
        "product": {
          "id": "prod-1",
          "name": "Vitamin C",
          "price": "100000",
          "stock": 50
        }
      }
    ],
    "payment": {
      "id": "pay-1",
      "method": "COD",
      "status": "PENDING",
      "amount": "250000"
    },
    "shipment": {
      "id": "ship-1",
      "courier": "JNE",
      "trackingNumber": "1234567890"
    }
  }
]
```

**Status Codes:**

- 200: Success
- 401: Unauthorized
- 404: Customer profile not found

## Frontend Components

### 1. OrdersPage (`src/pages/OrdersPage.tsx`)

Halaman daftar pesanan dengan fitur lengkap.

**Features:**

- ✅ Fetch orders dari API
- ✅ Display daftar order dengan informasi lengkap
- ✅ Status badge dengan warna berbeda
- ✅ Product list per order
- ✅ Shipping address display
- ✅ Payment info display
- ✅ Shipment tracking info
- ✅ Cancel order functionality (untuk status PENDING)
- ✅ Link ke detail order
- ✅ Loading state
- ✅ Empty state dengan link ke catalog

**Status Colors:**

- PENDING: Yellow (`bg-yellow-100 text-yellow-700`) - ⏳ Menunggu
- APPROVED: Cyan (`bg-cyan-100 text-cyan-700`) - Disetujui
- SHIPPED: Blue (`bg-blue-100 text-blue-700`) - Dikirim
- DELIVERED: Green (`bg-green-100 text-green-700`) - Terkirim
- CANCELLED: Red (`bg-red-100 text-red-700`) - Dibatalkan

**Order Card Sections:**

1. **Header** - Order number & status badge
2. **Items** - List produk dengan qty & subtotal
3. **Details** - Shipping address & payment info
4. **Shipment** - Courier & tracking number (if available)
5. **Summary** - Price breakdown & action buttons

### 2. OrderDetailPage (`src/pages/OrderDetailPage.tsx`)

Halaman detail order individual.

**Features:**

- ✅ Fetch single order by ID
- ✅ Full product details
- ✅ Shipping address information
- ✅ Payment status tracking
- ✅ Shipment tracking with timeline
- ✅ Order summary with price breakdown
- ✅ Status timeline visualization
- ✅ Error handling for order not found
- ✅ Back to orders button

**Layout:**

- **Left Column (2/3):**
  - 📦 Produk Dipesan
  - 📍 Alamat Pengiriman
  - 💳 Informasi Pembayaran
  - 🚚 Informasi Pengiriman

- **Right Sidebar (1/3):**
  - 💰 Ringkasan Pesanan
  - Status Timeline (visual progress)
  - Back button

**Timeline States:**

- Pesanan Dibuat (PENDING)
- Pesanan Disetujui (APPROVED)
- Dikirim (SHIPPED)
- Terkirim (DELIVERED)

## Frontend API Integration

### `src/features/customer/api.ts`

```typescript
// Fetch all orders
export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>("/customer/orders");
  return data;
};

// Cancel specific order
export const cancelOrder = async (orderId: string): Promise<Order> => {
  const { data } = await apiClient.delete<Order>(`/customer/orders/${orderId}`);
  return data;
};
```

### `src/pages/OrderDetailPage.tsx`

```typescript
// Fetch single order detail
const fetchOrderDetail = async (orderId: string): Promise<Order> => {
  const { data } = await apiClient.get(`/customer/orders/${orderId}`);
  return data;
};
```

## Routes

### OrdersPage Route

```
GET /orders → OrdersPage
```

### OrderDetailPage Route

```
GET /orders/:orderId → OrderDetailPage
```

Example:

- `/orders` - List all orders
- `/orders/order-123` - Detail for order with ID "order-123"

## Data Types

### Order Interface (`src/types/api.ts`)

```typescript
export interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "APPROVED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: string;
  shippingName: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: OrderItem[];
  payment?: Payment;
  shipment?: Shipment;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: Product;
}

export interface Payment {
  id: string;
  method: "CREDIT_CARD" | "DEBIT_CARD" | "COD";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  amount: string;
}

export interface Shipment {
  id: string;
  courier?: string | null;
  trackingNumber?: string | null;
}
```

## State Management

### React Query

- **Query Key:** `["orders"]` untuk daftar order
- **Query Key:** `["order", orderId]` untuk detail order

### Mutations

- `useMutation(cancelOrder)` - Cancel order mutation
  - On success: Invalidate orders query & show toast
  - On error: Show error toast

### Toast Notifications

- ✅ Success: "Pesanan berhasil dibatalkan"
- ❌ Error: "Gagal membatalkan pesanan"

## User Flow

```
Orders List
├── Order Card 1
│   ├── View Details → OrderDetailPage
│   └── Cancel (if PENDING)
├── Order Card 2
│   └── View Details → OrderDetailPage
└── Empty State (no orders)
    └── Link to Catalog

OrderDetailPage
├── Full order details
├── Product information
├── Shipping & Payment info
├── Status timeline
└── Back to Orders
```

## Features Breakdown

### Orders List Features

**Display:**

- Order number (orderNumber)
- Status badge with color coding
- Product list with quantities
- Shipping address
- Payment method & status
- Shipment courier & tracking (if available)

**Actions:**

- Cancel button (PENDING status only)
- Detail link for each order
- Link to catalog (empty state)

**States:**

- Loading: "Memuat pesanan..."
- Empty: No orders + catalog link
- Loaded: Order cards grid

### Order Detail Features

**Display:**

- Order header with number & status
- Product list with images & prices
- Shipping address
- Payment information with status
- Shipment tracking details
- Order summary with breakdown
- Status timeline visualization

**Calculations:**

- Subtotal from all items
- Shipping cost (total - subtotal)
- Display both in order summary

**Error Handling:**

- Order not found display
- Loading state
- Back to orders button

## Integration Checklist

- [x] Backend API endpoints configured
- [x] Frontend API client functions
- [x] OrdersPage component with real data
- [x] OrderDetailPage component
- [x] Routes configured (/orders, /orders/:orderId)
- [x] React Query integration
- [x] Cancel order functionality
- [x] Toast notifications
- [x] Loading states
- [x] Error handling
- [x] Empty states
- [x] Responsive layouts
- [x] Status color coding
- [x] Timeline visualization

## Testing Checklist

- [ ] Navigate to /orders page
- [ ] View list of orders (if any)
- [ ] Click on order card to view detail
- [ ] Check status badge colors
- [ ] Verify product information displays correctly
- [ ] Check shipping address
- [ ] Verify payment method displays
- [ ] Check shipment tracking info
- [ ] Click "Kembali ke Pesanan" button
- [ ] Test cancel order button (PENDING only)
- [ ] Test error notifications
- [ ] Test loading states
- [ ] Test empty state
- [ ] Check responsive layout on mobile
- [ ] Verify back button navigation

## Future Enhancements

- [ ] Add filter by status
- [ ] Add search functionality
- [ ] Add date range filter
- [ ] Add print order functionality
- [ ] Add re-order functionality
- [ ] Add order tracking map
- [ ] Add estimated delivery time
- [ ] Add customer support chatbot
- [ ] Add return request functionality
- [ ] Add review & rating interface
