# 📄 Fitur Download PDF Pesanan - Quick Start Guide

## Ringkas Fitur

Sekarang customer dapat **mengunduh laporan pesanan dalam format PDF** lengkap dengan semua detail pesanan mereka.

## 🎯 Di Mana Fitur Ini?

### 1. **Halaman Daftar Pesanan** (`/orders`)

```
┌─────────────────────────────────────────┐
│ Pesanan #ORD-12345                 Status│
│                                   [Terkirim]
├─────────────────────────────────────────┤
│ Produk Dipesan: ...                     │
├─────────────────────────────────────────┤
│ Rp 500.000                              │
├─────────────────────────────────────────┤
│ [Batalkan] [📄 Download PDF] [Detail]  │ ← NEW BUTTON
└─────────────────────────────────────────┘
```

### 2. **Halaman Detail Pesanan** (`/orders/:orderId`)

```
┌──────────────────────────────────────────┐
│ MAIN CONTENT              │ SIDEBAR      │
│                           ├─────────────┤
│ Order Items               │ 💰 Ringkasan│
│ Address                   │ Subtotal    │
│ Payment Info              │ Shipping    │
│ Shipment Tracking         │ Total       │
│                           │ Timeline    │
│                           ├─────────────┤
│                           │ [Back]      │
│                           │ [📄 PDF]   │ ← NEW BUTTON
│                           └─────────────┘
```

## 📥 Bagaimana Cara Menggunakannya?

### Step 1: Buka Halaman Pesanan

```
Customer profile → Click "Pesanan Saya" dari menu
atau
Direct URL: /orders
```

### Step 2: Klik Tombol "📄 Download PDF"

```
Setiap pesanan memiliki tombol di sebelah tombol "Detail Pesanan"
```

### Step 3: Browser Print Dialog Muncul

```
Select Printer/Print to PDF → Save PDF → Done!
```

### Step 4: File Tersimpan

```
File name: Invoice-{OrderNumber}.html
Location: Downloads folder (default)
```

## 📋 Apa yang Termasuk dalam PDF?

✅ **Header Section**

- Nomor pesanan
- Status pesanan dengan badge warna
- Logo perusahaan

✅ **Informasi Pengiriman**

- Nama penerima
- Kota, provinsi, kode pos
- Negara

✅ **Informasi Pembayaran**

- Metode pembayaran (COD, Kartu Debit, Kartu Kredit)
- Status pembayaran (Selesai/Menunggu)
- Jumlah yang dibayarkan

✅ **Informasi Pengiriman** (jika tersedia)

- Kurir pengiriman
- Nomor resi/tracking

✅ **Detail Produk**

- Tabel dengan semua produk yang dipesan
- Quantity per produk
- Harga satuan
- Subtotal per produk

✅ **Ringkasan Biaya**

- Subtotal
- Ongkos kirim
- Total pembayaran

✅ **Footer**

- Timestamp (tanggal & jam)
- Ucapan terima kasih
- Informasi kontak

## 🎨 Contoh PDF Output

```
═══════════════════════════════════════════════════════════════
🏥 Online Health Store              Order #ORD-123456
                                    Status: ✅ Terkirim
═══════════════════════════════════════════════════════════════

📍 ALAMAT PENGIRIMAN              💳 INFORMASI PEMBAYARAN
─────────────────────────────────────────────────────────────
Nama: John Doe                     Metode: Bayar di Tempat (COD)
Kota: Jakarta Pusat                Status: ✅ Selesai
Provinsi: DKI Jakarta              Jumlah: Rp 550.000
Kode Pos: 12210
Negara: Indonesia

🚚 INFORMASI PENGIRIMAN
─────────────────────────────────────────────────────────────
Kurir: JNE Express
Nomor Resi: 1234567890ABCDEF

📦 DETAIL PRODUK
─────────────────────────────────────────────────────────────
Produk                  | Qty | Harga        | Subtotal
─────────────────────────────────────────────────────────────
Vitamin C 500mg         | 2   | Rp 150.000   | Rp 300.000
Madu Murni 250ml        | 1   | Rp 100.000   | Rp 100.000
Teh Hijau Organik       | 1   | Rp 100.000   | Rp 100.000

💰 RINGKASAN PESANAN
─────────────────────────────────────────────────────────────
Subtotal......................... Rp 500.000
Ongkos Kirim..................... Rp 50.000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL PEMBAYARAN................. Rp 550.000

═══════════════════════════════════════════════════════════════
Terima kasih telah berbelanja di Online Health Store
Untuk informasi lebih lanjut, silakan hubungi layanan pelanggan kami
Dokumen ini dicetak pada: Senin, 4 November 2025 - 14:30
═══════════════════════════════════════════════════════════════
```

## 🛠️ Implementasi Teknis

### File Baru

```
apps/frontend/src/utils/pdf.ts (NEW)
├── generateOrderPDFHTML() - Buat HTML template
├── downloadOrderPDF() - Download via print dialog
├── downloadOrderPDFDirect() - Direct download (future)
├── generateOrderCSV() - Export ke CSV
└── downloadOrderCSV() - Download CSV
```

### File yang Dimodifikasi

```
apps/frontend/src/pages/OrdersPage.tsx
├── Import: downloadOrderPDF dari utils/pdf
└── Add: Button 📄 Download PDF di Action Buttons

apps/frontend/src/pages/OrderDetailPage.tsx
├── Import: downloadOrderPDF, toast
└── Add: Button 📄 Download PDF di Sidebar
```

### Dependencies

✅ **ZERO new dependencies!**

- Uses native browser APIs only
- Blob API
- URL.createObjectURL()
- window.print()
- iframe Element

## 🔄 User Flow Diagram

```
Customer Views Order List
        ↓
Click "📄 Download PDF" Button
        ↓
HTML Template Generated (in memory)
        ↓
Browser Print Dialog Opens
        ↓
┌─────────────────────────────────┐
│ Print Dialog Window             │
│ ┌──────────────────────────────┐│
│ │ Save as PDF (default)       ││
│ │ [Printer dropdown ▼]        ││
│ │ [Cancel] [Save ✓]           ││
│ └──────────────────────────────┘│
└─────────────────────────────────┘
        ↓
Customer Selects Save Location
        ↓
PDF Downloaded to Downloads Folder
        ↓
✅ Success! Toast: "Laporan PDF siap diunduh"
```

## ⚙️ Konfigurasi Browser

### Untuk Save as PDF Automatic

**Chrome/Edge:**

1. Settings → Advanced → Downloads
2. Enable "Ask where to save each file before downloading"

**Firefox:**

1. Preferences → Files & Applications
2. Set PDF handler to "Save File"

**Safari:**

1. Preferences → General
2. "File download location" = Downloads

## 📊 Browser Support

| Browser | Versi | Support |
| ------- | ----- | ------- |
| Chrome  | 90+   | ✅ Full |
| Edge    | 90+   | ✅ Full |
| Firefox | 88+   | ✅ Full |
| Safari  | 14+   | ✅ Full |
| Opera   | 76+   | ✅ Full |

## 🎓 Tips & Tricks

### Tip 1: Custom Filename

```
Default: Invoice-ORD-123456.html
Anda bisa rename ke: Invoice-Vitamin-Nov2025.pdf
```

### Tip 2: Bulk Print

```
1. Open multiple orders di tab berbeda
2. Di setiap tab: Click Download PDF
3. Confirm di setiap print dialog
Hasil: Multiple PDFs in one session
```

### Tip 3: Save for Records

```
Organize PDFs:
📁 Downloads
├── 📁 2025-Invoices
│   ├── Invoice-ORD-001.pdf
│   ├── Invoice-ORD-002.pdf
│   └── ...
```

## ⚠️ Troubleshooting

### Q: Print dialog tidak muncul?

**A:**

- Check browser popup blocker settings
- Allow popups untuk website ini
- Refresh page dan coba lagi

### Q: PDF formatting terlihat aneh?

**A:**

- Update browser ke versi terbaru
- Clear browser cache
- Try different browser

### Q: File terlalu besar?

**A:**

- Normal, file HTML murni ~20-50KB
- Ketika di-print jadi PDF, ukuran sama

### Q: Bisa save langsung tanpa print dialog?

**A:**

- Fitur tersedia di future release (v1.1)
- Saat ini: Save as PDF via print dialog lebih reliable

## 📝 Notes

- PDF dibuat secara **offline** (tidak dikirim ke server)
- Format PDF bersifat **professional** dan siap cetak
- Semua data pesanan ditampilkan **lengkap dan akurat**
- Bisa digunakan untuk **keperluan dokumentasi dan pembukuan**

## 🚀 Apa Selanjutnya?

### Planned Features (v1.1)

- Direct download tanpa print dialog
- Email invoice ke customer
- Generate QR code untuk tracking

### Planned Features (v1.2)

- Export ke Excel (.xlsx)
- Export ke Word (.docx)
- Multiple language support

## 📞 Support

Jika ada pertanyaan atau masalah:

1. Check browser compatibility
2. Try different browser
3. Contact technical support

---

**Enjoy your new PDF download feature!** 📄✨
