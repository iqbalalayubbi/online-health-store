# Online Health Store Monorepo

Monorepo ini berisi aplikasi toko online alat kesehatan untuk kebutuhan sertifikasi *Junior Web Programmer*. Backend dibangun dengan Express.js + Prisma (MySQL) dan frontend menggunakan React + Zustand agar fitur admin, seller, dan customer dapat dikembangkan secara modular.

## Teknologi Utama
- Node.js 18+, Express 5, TypeScript
- Prisma ORM & MySQL
- React 19, Vite, Zustand, React Query
- Axios untuk komunikasi API
- ESLint & Prettier untuk kualitas kode

## Struktur Direktori
`
.
├── apps
│   ├── backend            # REST API Express + Prisma
│   │   ├── prisma         # Schema, konfigurasi, seed
│   │   └── src            # App, routes, services, controllers
│   └── frontend           # Aplikasi React
│       ├── public         # Static assets
│       └── src            # Komponen, fitur, state store
├── docs                   # Dokumentasi teknis tambahan
├── package.json           # Konfigurasi workspace npm
└── .prettierrc            # Aturan formatting bersama
`

## Persiapan Lingkungan
1. Pastikan Node.js >= 18.18 dan server MySQL sudah tersedia.
2. Install dependensi seluruh workspace:
   `ash
   npm install --workspaces
   `
3. Salin berkas environment lalu sesuaikan kredensial:
   `ash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   `
   - DATABASE_URL harus mengarah ke database MySQL yang telah dibuat.
   - JWT_SECRET minimal 16 karakter.
4. Jalankan Prisma dan seed data awal:
   `ash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   `
   Akun admin awal akan dibuat dengan email dmin@onlinehealth.local dan password Admin123!.

## Menjalankan Aplikasi
Gunakan dua terminal terpisah:
`ash
# Terminal 1 - menjalankan API
npm run dev:backend

# Terminal 2 - menjalankan frontend
npm run dev:frontend
`
- API tersedia di http://localhost:4000.
- Frontend berjalan di http://localhost:5173 (default Vite).

## Skrip Penting
`ash
npm run build   # build seluruh workspace
npm run lint    # lint backend & frontend
npm run format  # format dengan Prettier
`

## Fitur Utama
### Admin
- Manajemen customer (aktif/non-aktif)
- Kelola kategori produk
- Review buku tamu & permintaan pembuatan toko
- Monitoring pesanan dan update status pengiriman

### Seller
- Registrasi & login seller
- Pengajuan pembuatan toko
- CRUD produk per toko
- Melihat pesanan yang masuk

### Customer
- Registrasi & login customer
- Browsing kategori dan produk
- Keranjang belanja dan checkout (kartu kredit/debit & COD)
- Membatalkan pesanan sebelum dikirim
- Memberikan feedback pada produk

## Arsitektur Backend
- outes/modules → pemetaan endpoint per domain (auth, admin, seller, customer, dsb).
- controllers → menangani request/response HTTP.
- services → logika bisnis, transaksi, dan akses Prisma.
- alidators → validasi payload menggunakan Zod.
- middleware → autentikasi JWT, error handler, 404 handler.

## Catatan Pengembangan
- Gunakan akun admin default untuk menyetujui permintaan toko dari seller baru.
- Tambahkan kategori terlebih dahulu agar seller dapat mengaitkan produk dengan tokonya.
- Beberapa aksi di frontend (mis. menambah item ke keranjang) memerlukan ID yang bisa diperoleh dari halaman katalog atau dashboard terkait.

Detail arsitektur dan model data dijelaskan lebih lanjut di [docs/architecture.md](docs/architecture.md).

## Lisensi
Proyek dirilis menggunakan lisensi MIT.
