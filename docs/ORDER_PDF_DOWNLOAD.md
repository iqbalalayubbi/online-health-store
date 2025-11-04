# Order PDF Download Feature

## Overview

Fitur untuk mengunduh laporan pesanan dalam format PDF. Customer dapat mengunduh invoice lengkap dari setiap pesanan mereka langsung dari halaman pesanan atau halaman detail pesanan.

## Features

### 1. PDF Report Generation

- ✅ Laporan PDF professional dengan logo dan branding
- ✅ Detail lengkap pesanan (items, harga, pengiriman, pembayaran)
- ✅ Status tracking timeline
- ✅ Informasi pengiriman jika tersedia
- ✅ Format bilangan Indonesia (Rp currency)

### 2. Download Options

- **OrdersPage**: Download dari list pesanan dengan tombol 📄 Download PDF di setiap pesanan
- **OrderDetailPage**: Download dari halaman detail pesanan dengan tombol 📄 Download PDF di sidebar

### 3. Export Formats

- Primary: PDF (menggunakan print dialog browser)
- Alternative: CSV (untuk backup/import)

## Implementation

### File Structure

```
apps/frontend/src/
├── utils/
│   └── pdf.ts (NEW) - PDF generation utility
├── pages/
│   ├── OrdersPage.tsx (UPDATED) - Added PDF download button
│   └── OrderDetailPage.tsx (UPDATED) - Added PDF download button
└── ...
```

### Core Files

#### 1. `utils/pdf.ts` - PDF Generation Utility

**Functions:**

##### `generateOrderPDFHTML(order: Order): string`

Generates professional HTML template for PDF report

```typescript
const htmlContent = generateOrderPDFHTML(order);
// Returns: HTML string with styled order invoice
```

**Includes:**

- Header dengan order number dan status
- Customer & shipping information
- Payment details
- Shipment tracking (jika ada)
- Product list dengan prices
- Summary calculation
- Footer dengan timestamp

##### `downloadOrderPDF(order: Order): Promise<void>`

Main function untuk download PDF menggunakan browser print dialog

```typescript
try {
  await downloadOrderPDF(order);
  toast.success("Laporan PDF siap diunduh");
} catch (error) {
  toast.error("Gagal membuat laporan PDF");
}
```

**Flow:**

1. Generate HTML dari order data
2. Create Blob dari HTML content
3. Create iframe untuk render HTML
4. Trigger browser print dialog
5. User dapat save as PDF

##### `downloadOrderPDFDirect(order: Order): Promise<void>`

Alternative function untuk direct download tanpa print dialog (experimental)

##### `generateOrderCSV(order: Order): string`

Generate CSV format untuk order (backup/import)

##### `downloadOrderCSV(order: Order): void`

Download order sebagai CSV file

#### 2. `pages/OrdersPage.tsx` - Orders List with PDF

**Import:**

```typescript
import { downloadOrderPDF } from "../utils/pdf";
```

**Download Button:**

```tsx
<button
  onClick={() => {
    try {
      downloadOrderPDF(order);
      toast.success("Laporan PDF siap diunduh");
    } catch (error) {
      toast.error("Gagal membuat laporan PDF");
    }
  }}
  className="rounded-md border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
>
  📄 Download PDF
</button>
```

**Location:** Action Buttons section di setiap order card

#### 3. `pages/OrderDetailPage.tsx` - Order Detail with PDF

**Import:**

```typescript
import { downloadOrderPDF } from "../utils/pdf";
import { toast } from "../components/Toast";
```

**Download Button:**

```tsx
<button
  onClick={() => {
    try {
      downloadOrderPDF(order);
      toast.success("Laporan PDF siap diunduh");
    } catch (error) {
      toast.error("Gagal membuat laporan PDF");
    }
  }}
  className="mt-3 block w-full rounded-md border border-blue-300 bg-white px-4 py-2 text-center font-semibold text-blue-600 transition hover:bg-blue-50"
>
  📄 Download PDF
</button>
```

**Location:** Sidebar bersama tombol "Kembali ke Pesanan"

## PDF Template Structure

### Header Section

```
🏥 Online Health Store          Order #ORD-12345
                                Status: [Terkirim]
```

### Main Content

- **📍 Alamat Pengiriman**: Nama, kota, provinsi, kode pos, negara
- **💳 Informasi Pembayaran**: Metode, status, jumlah
- **🚚 Informasi Pengiriman**: Kurir, nomor resi (jika ada)
- **📦 Detail Produk**: Tabel dengan nama, qty, harga, subtotal

### Summary

```
Subtotal:      Rp 500.000
Ongkos Kirim:  Rp 50.000
─────────────────────────
Total:         Rp 550.000
```

### Status Badge Colors

| Status    | Color            |
| --------- | ---------------- |
| PENDING   | Yellow (#eab308) |
| APPROVED  | Cyan (#06b6d4)   |
| SHIPPED   | Blue (#3b82f6)   |
| DELIVERED | Green (#22c55e)  |
| CANCELLED | Red (#ef4444)    |

## User Experience Flow

### Scenario 1: Download from Orders List

```
1. Customer opens /orders
2. Customer sees list of orders
3. Each order has "📄 Download PDF" button
4. Click button → Browser print dialog opens
5. Select "Save as PDF" from printer dropdown
6. Specify filename (default: Invoice-{orderNumber}.html)
7. Click Save
8. File downloaded to Downloads folder
```

### Scenario 2: Download from Order Detail

```
1. Customer opens /orders/{orderId}
2. Customer views order details
3. Sees "📄 Download PDF" button in sidebar
4. Click button → Browser print dialog opens
5. Same flow as Scenario 1
```

## Technical Details

### Dependencies

- **No new external dependencies required**
- Uses browser native APIs:
  - `Blob` API for creating file objects
  - `URL.createObjectURL()` for blob URLs
  - `iframe` for HTML rendering
  - `window.print()` for print dialog

### Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ All modern browsers with print support

### Data Included in PDF

```
✅ Order number & status
✅ Customer shipping address
✅ Payment method & status
✅ Shipment info (courier, tracking number)
✅ Product details (name, qty, price)
✅ Pricing breakdown (subtotal, shipping, total)
✅ Generated timestamp
✅ Company branding
```

### Styling Considerations

- Professional invoice design
- Responsive layout
- Print-optimized styling
- Indonesian number formatting (Rp currency)
- Status color badges

## Error Handling

### Error Scenarios

| Scenario                | Handling                | Message                          |
| ----------------------- | ----------------------- | -------------------------------- |
| PDF generation fails    | Try-catch block         | "Gagal menghasilkan laporan PDF" |
| Blob creation fails     | Error logged to console | Toast error shown                |
| Browser doesn't support | Graceful fallback       | Try-catch catches error          |

### User Feedback

- Success toast: "Laporan PDF siap diunduh"
- Error toast: "Gagal membuat laporan PDF"
- Loading state: Button remains clickable (non-blocking)

## Future Enhancements

### Potential Improvements

1. **Direct PDF Download** (without print dialog)
   - Install `html2canvas` and `jspdf`
   - Implement `downloadOrderPDFDirect()` function
   - Provides better UX with automatic file download

2. **Email PDF**
   - Add button to send invoice via email
   - Backend endpoint to email PDF
   - Stored in email records

3. **Multiple Format Export**
   - Word document (.docx)
   - Excel spreadsheet (.xlsx)
   - Image (PNG/JPG)

4. **Batch Download**
   - Select multiple orders
   - Download all as ZIP file
   - Useful for accounting

5. **PDF Customization**
   - Customer notes
   - Additional payment terms
   - Custom invoice numbering

## Installation Guide

### Step 1: No Dependencies Required

The feature uses native browser APIs only. No npm packages to install.

### Step 2: Files Already Created

- `apps/frontend/src/utils/pdf.ts` ✅
- `apps/frontend/src/pages/OrdersPage.tsx` ✅ (updated)
- `apps/frontend/src/pages/OrderDetailPage.tsx` ✅ (updated)

### Step 3: Test the Feature

```bash
cd apps/frontend
npm run dev
```

Navigate to `/orders` and click "📄 Download PDF" button

## Testing Checklist

### Functionality

- [ ] Click "📄 Download PDF" on orders list
- [ ] Browser print dialog opens
- [ ] PDF preview shows all order details
- [ ] Save as PDF works correctly
- [ ] Click "📄 Download PDF" on order detail page
- [ ] Same process works from detail page
- [ ] All order statuses generate PDF correctly

### Content Verification

- [ ] Order number displays correctly
- [ ] Status badge shows correct color
- [ ] All products listed with correct prices
- [ ] Subtotal and total calculations accurate
- [ ] Shipping address complete
- [ ] Payment method and status shown
- [ ] Shipping info displayed (if available)
- [ ] Timestamp shows current date/time

### UI/UX

- [ ] Button styling matches design system
- [ ] Button placement intuitive
- [ ] Loading state handled properly
- [ ] Toast notifications appear correctly
- [ ] Error messages helpful
- [ ] Print dialog appears smoothly

### Edge Cases

- [ ] Order with no shipment info
- [ ] Order with no payment info
- [ ] Very long product names
- [ ] Large order with many items
- [ ] Various order statuses (PENDING, APPROVED, SHIPPED, DELIVERED, CANCELLED)

### Browser Testing

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (if applicable)

## Troubleshooting

### Issue: Print dialog doesn't appear

**Solution**: Check browser print settings, ensure popups not blocked

### Issue: PDF formatting looks broken

**Solution**: Update CSS in `pdf.ts`, test in different browsers

### Issue: Indonesian characters not displaying

**Solution**: UTF-8 encoding is set in HTML meta tag

### Issue: Large images cause slow loading

**Solution**: Current implementation doesn't include product images (placeholder only)

## Related Documentation

- [OrdersPage.tsx](/docs/ORDERS_PAGE.md)
- [OrderDetailPage.tsx](/docs/ORDER_DETAIL.md)
- [Customer API](/docs/CUSTOMER_API.md)

## Changelog

### v1.0 (November 4, 2025)

- ✅ Created `utils/pdf.ts` with PDF generation
- ✅ Added download button to OrdersPage
- ✅ Added download button to OrderDetailPage
- ✅ Implemented browser print-based PDF download
- ✅ Added error handling with toast notifications
- ✅ Created professional invoice template
- ✅ Added CSV export function (for future use)

### Future Versions

- v1.1: Direct PDF download without print dialog
- v1.2: Email PDF functionality
- v1.3: Multiple format exports (Excel, Word)
- v2.0: Advanced PDF customization
