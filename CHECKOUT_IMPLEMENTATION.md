# Checkout Implementation Guide

## Fitur Checkout yang Telah Diimplementasikan

### 1. CheckoutPage (`src/pages/CheckoutPage.tsx`)

Halaman checkout lengkap dengan:

#### **Left Column: Shipping & Payment Form**

- **📦 Alamat Pengiriman**
  - Nama Penerima (required)
  - Nomor Telepon (optional)
  - Alamat Lengkap (required)
  - Kota (required)
  - Provinsi (required)
  - Kode Pos (required)
  - Negara (default: Indonesia)

- **💳 Metode Pembayaran**
  - COD (Bayar di Tempat) - default
  - Kartu Debit
  - Kartu Kredit

- **Action Buttons**
  - "Buat Pesanan" - submit form & trigger checkout mutation
  - "Kembali ke Keranjang" - navigate back to /cart

#### **Right Column: Order Summary**

- **📋 Detail Pesanan**
  - List semua produk di keranjang
  - Scrollable list (max-height: 24rem)
  - Per item: product image placeholder, name, quantity, subtotal

- **💰 Ringkasan Harga**
  - Subtotal (jumlah item)
  - Ongkos Kirim (fixed: Rp 10,000 for demo)
  - **Total Pembayaran** (prominent display)
  - Payment method info badge

### 2. User Flow

```
Cart Page → "Lanjut ke Checkout" button
    ↓
/checkout → CheckoutPage
    ↓
Fill shipping form & select payment method
    ↓
Click "Buat Pesanan"
    ↓
Validation (required fields)
    ↓
API Call: checkout()
    ↓
Success: Toast notification → Navigate to /orders
Error: Toast notification → Stay on page
```

### 3. Integration Points

#### **Routes** (`src/app/routes.tsx`)

```tsx
<Route path="checkout" element={<CheckoutPage />} />
```

#### **Cart Page** (`src/pages/CartPage.tsx`)

- Button "Lanjut ke Checkout" navigates to `/checkout`

#### **API Integration** (`src/features/customer/api.ts`)

- `fetchCart()` - Get cart items
- `checkout()` - Submit checkout form & create order

### 4. Features

✅ Form validation (required fields)  
✅ Real-time price calculation  
✅ Cart item listing with scrollable container  
✅ Payment method selection  
✅ Loading state during mutation  
✅ Success/error toast notifications  
✅ Auto-redirect to orders page after successful checkout  
✅ Responsive layout (mobile-friendly)  
✅ Back to cart button  
✅ Empty cart handling

### 5. State Management

- **React Query**: Cart data fetching & mutations
- **Local State**: Form fields (useState)
- **Toast**: Notifications (success/error/info)
- **Navigation**: React Router (useNavigate, Link)

### 6. Component Structure

```
CheckoutPage
├── Header (title, description)
├── Left Column (2/3 width on lg)
│   ├── Shipping Address Form
│   │   ├── Name input
│   │   ├── Phone input
│   │   ├── Address textarea
│   │   ├── City input
│   │   ├── State input
│   │   └── Postal code input
│   ├── Payment Method Selection
│   └── Action Buttons
└── Right Column (1/3 width on lg)
    ├── Order Items List
    ├── Order Summary
    └── Payment Method Info Badge
```

### 7. Styling

- **Color Scheme**: Blue primary (#2563eb), Slate neutral
- **Spacing**: 6 units gap between sections
- **Responsive**:
  - Mobile: Full width stacked
  - Large (lg): 3-column grid (2:1 ratio)
- **Interactive**: Hover states, focus states, disabled states

### 8. Backend API Requirements

The following API functions need to be implemented in `src/features/customer/api.ts`:

```typescript
// Already exists
export async function fetchCart(): Promise<Cart>;

// Needs implementation
export async function checkout(data: CheckoutData): Promise<Order>;

// Types
interface CheckoutData {
  shippingName: string;
  shippingPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "COD";
}

interface Order {
  id: string;
  // ... other order fields
}
```

### 9. Testing Checklist

- [ ] Navigate from cart to checkout
- [ ] Display cart items in checkout
- [ ] Display correct total with shipping cost
- [ ] Form validation (try submit with empty fields)
- [ ] Fill all fields and submit
- [ ] Check success notification
- [ ] Verify redirect to orders page
- [ ] Test "Back to Cart" button
- [ ] Test payment method changes
- [ ] Check responsive layout on mobile

### 10. Future Enhancements

- [ ] Address autocomplete/suggestions
- [ ] Multiple shipping address selection
- [ ] Promo code/coupon input
- [ ] Real shipping cost calculation
- [ ] Payment gateway integration
- [ ] Order summary PDF generation
- [ ] Save shipping address for next purchase
