# 🔐 Login Required Modal - Buy Feature (v1.0)

**Date**: November 4, 2025  
**Status**: ✅ COMPLETE  
**Feature**: Modal untuk redirect ke login/register saat user belum login menekan tombol Buy

---

## 📋 Overview

Saat user belum login menekan tombol **"Buy"** pada salah satu produk di katalog, maka akan menampilkan modal popup yang menawarkan user untuk login atau membuat akun baru.

---

## 🎯 User Flow

```
1. User (Not Logged In) Browse Catalog
    ↓
2. User Click "Buy" Button
    ↓
3. LoginRequiredModal Appears
    ├─ Title: "Login Diperlukan"
    ├─ Message: "Silakan login atau buat akun..."
    ├─ Button 1: "Login" (Link to /login)
    ├─ Button 2: "Buat Akun" (Link to /register)
    └─ Button 3: "Tutup" (Close Modal)
    ↓
4. User Click Action
    ├─ Login → Navigate to /login
    ├─ Buat Akun → Navigate to /register
    └─ Tutup → Modal Closed
```

---

## 🛠️ Components

### 1. LoginRequiredModal Component

**File**: `apps/frontend/src/components/LoginRequiredModal.tsx`

**Props**:

```typescript
interface LoginRequiredModalProps {
  isOpen: boolean; // Show/hide modal
  onClose: () => void; // Close handler
}
```

**Features**:

- ✅ Modal overlay dengan semi-transparent background
- ✅ Centered dialog box
- ✅ Icon for visual indication
- ✅ Two action buttons (Login, Register)
- ✅ Close button
- ✅ Links to `/login` and `/register`

**UI Structure**:

```
┌─────────────────────────────────────┐
│                                     │
│            [Info Icon]              │
│                                     │
│      Login Diperlukan               │
│                                     │
│  Silakan login atau buat akun       │
│  terlebih dahulu untuk menambahkan  │
│  produk ke keranjang.               │
│                                     │
│  [  Login  ]  [  Buat Akun  ]       │
│                                     │
│      [ Tutup ]                      │
│                                     │
└─────────────────────────────────────┘
```

### 2. CatalogView Component Updates

**File**: `apps/frontend/src/features/catalog/components/CatalogView.tsx`

**Changes**:

```typescript
// Add imports
import { useAuthStore } from "../../../stores/authStore";
import { LoginRequiredModal } from "../../../components/LoginRequiredModal";

// Add state
const [showLoginModal, setShowLoginModal] = useState(false);
const { user } = useAuthStore();

// Update handleAddToCart
const handleAddToCart = (productId: string) => {
  // Check if user is logged in
  if (!user) {
    setShowLoginModal(true);  // Show modal
    return;
  }
  addToCartMutation.mutate(productId);  // Add to cart
};

// Add LoginRequiredModal to JSX
<LoginRequiredModal
  isOpen={showLoginModal}
  onClose={() => setShowLoginModal(false)}
/>
```

---

## 🎨 Modal Styling

### Colors

- Background overlay: `bg-black/50` (50% opacity)
- Dialog bg: `bg-white`
- Icon background: `bg-blue-100`
- Icon color: `text-blue-600`
- Buttons: Blue primary, secondary border

### Responsive

- Max-width: `max-w-md` (medium size)
- Padding: `p-6`
- Full-width on mobile (w-full)

### Animations

- Modal appears instantly (no animation needed for now)
- Buttons have hover effects
- Smooth transitions

---

## 📍 Behavior

### When Modal Shows

1. User not logged in (`!user`)
2. User clicks "Buy" button
3. Modal appears with overlay
4. Blocks interaction with page (modal is z-50)

### When User Clicks Actions

- **Login Button**: Navigate to `/login` → Modal closes
- **Buat Akun Button**: Navigate to `/register` → Modal closes
- **Tutup Button**: Modal closes, stay on current page

### After Login

- User redirected back to catalog
- Can now click "Buy" button successfully
- Product added to cart

---

## 🔄 Complete Flow Diagram

```
CatalogView Component
├─ useState: showLoginModal, selectedProduct
├─ useAuthStore: { user }
├─ handleAddToCart(productId)
│  ├─ if (!user) → setShowLoginModal(true) ✅
│  └─ else → addToCartMutation.mutate(productId)
├─ ProductCard Component
│  └─ onAddToCart → handleAddToCart
└─ LoginRequiredModal Component
   ├─ isOpen: showLoginModal
   └─ onClose: () => setShowLoginModal(false)
```

---

## ✅ Features Implemented

- ✅ Modal only shows when user not logged in
- ✅ Modal hidden for logged-in users (normal flow)
- ✅ Modal can be closed by:
  - Clicking "Tutup" button
  - Clicking "Login" button (redirect + close)
  - Clicking "Buat Akun" button (redirect + close)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessible UI with clear messaging
- ✅ Professional styling
- ✅ Smooth user experience

---

## 🚀 Testing Steps

### Test 1: Not Logged In User Clicks Buy

1. Open browser (incognito/private mode to ensure not logged in)
2. Go to `/catalog`
3. Click "Buy" button on any product
4. **Expected**: Modal appears with login options

### Test 2: Modal Actions

1. From modal, click "Login"
   - **Expected**: Redirect to `/login`, modal closes
2. Go back to catalog and click "Buy" again
3. From modal, click "Buat Akun"
   - **Expected**: Redirect to `/register`, modal closes

### Test 3: Logged In User Clicks Buy

1. Login with any account
2. Go to `/catalog`
3. Click "Buy" button
4. **Expected**: Product added to cart immediately (no modal)
5. Toast message: "Produk berhasil ditambahkan ke keranjang!"

### Test 4: Close Button

1. Not logged in, go to `/catalog`
2. Click "Buy"
3. Click "Tutup" button
4. **Expected**: Modal closes, stay on catalog page

---

## 📱 Responsive Behavior

| Screen Size | Behavior                      |
| ----------- | ----------------------------- |
| Mobile      | Modal full width with padding |
| Tablet      | Modal max-w-md centered       |
| Desktop     | Modal max-w-md centered       |

---

## 🔐 Security Notes

- ✅ Check `!user` before allowing add to cart (client-side)
- ✅ Backend also validates ownership (server-side check)
- ✅ No sensitive data in modal
- ✅ Links are safe (internal routes only)

---

## 📂 Files Modified/Created

### Created

- `apps/frontend/src/components/LoginRequiredModal.tsx`

### Modified

- `apps/frontend/src/features/catalog/components/CatalogView.tsx`
  - Added imports for auth and modal
  - Added state: `showLoginModal`
  - Updated `handleAddToCart` with login check
  - Added `<LoginRequiredModal />` to JSX

---

## 🎯 Future Enhancements (Optional)

1. **Animation**: Add fade-in/slide-in animation to modal
2. **Keyboard Navigation**: Close modal on ESC key
3. **Remember Location**: Redirect back to same product after login
4. **Social Login**: Add "Login with Google/Facebook" options
5. **Toast Message**: Show toast "Silakan login terlebih dahulu" in addition to modal

---

**Status**: ✅ Complete & Ready  
**User Experience**: ✅ Seamless & Professional  
**Testing**: ✅ All scenarios covered
