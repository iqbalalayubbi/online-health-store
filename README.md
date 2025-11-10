# Online Health Store – Monorepo

Aplikasi toko online alat kesehatan (monorepo) untuk keperluan sertifikasi dan pembelajaran. Backend menggunakan Express 5 + TypeScript + Prisma (MySQL). Frontend menggunakan React 19 + Vite + Zustand + React Query.

## 🚀 Teknologi Utama

- Node.js 18+ (disarankan 20 LTS), Express 5, TypeScript
- Prisma ORM & MySQL
- React 19, Vite, Zustand, React Query
- Axios (HTTP), ESLint & Prettier

## 📦 Struktur Direktori

```
.
├── apps
│   ├── backend            # REST API (Express + Prisma)
│   │   ├── prisma         # Schema, migrations, seed
│   │   └── src            # App, routes, services, controllers, middleware
│   └── frontend           # React app (Vite)
│       ├── public         # Static assets
│       └── src            # Komponen, fitur, state store
├── docs                   # Dokumentasi tambahan
├── package.json           # Konfigurasi workspaces
└── README.md
```

## 👤 Peran & Fitur

### Admin

- Manajemen customer (aktif/non-aktif)
- Kelola kategori produk
- Review buku tamu & permintaan pembuatan toko
- Monitoring pesanan; update pengiriman (ship/deliver)

### Seller

- Registrasi & login seller
- Pengajuan pembuatan toko
- CRUD produk per toko
- Melihat pesanan yang masuk

### Customer

- Registrasi & login
- Browsing kategori dan produk
- Keranjang dan checkout (Credit/Debit/COD)
- Batalkan pesanan saat PENDING
- Feedback per-produk per-order

## 🔐 Akun Seed (default)

- Admin: `admin@onlinehealth.local` / `Admin123!`
- Seller: `seller1@onlinehealth.local` / `Seller123!`
- Customer: `customer1@onlinehealth.local` / `Customer123!`

> Catatan: proses seed akan menghapus data yang ada terlebih dahulu (destructive reset).

## 🧰 Prasyarat

- Node.js >= 18.18 (disarankan 20.x)
- MySQL (8.0/8.4/9.x – gunakan database baru sesuai versi)
- PowerShell (Windows) atau shell setara

## ⚙️ Variabel Lingkungan

### Backend (`apps/backend/.env`)

- `DATABASE_URL` (wajib): koneksi MySQL, contoh: `mysql://user:pass@host:3306/dbname`
- `JWT_SECRET` (wajib): minimal 16 karakter
- `HASH_SALT_ROUNDS` (opsional): default `10`
- `PORT` (opsional): default `4000`
- `FRONTEND_ORIGIN` (opsional, production): origin frontend yang diizinkan CORS, contoh: `https://your-frontend.up.railway.app`

### Frontend (`apps/frontend/.env`)

- `VITE_API_URL` (wajib di production): alamat publik backend, sertakan protokol dan prefix `/api`
  - Contoh: `https://your-backend.up.railway.app/api`

## 🧪 Setup Lokal

Install dependensi (root):

```powershell
npm install --workspaces
```

Siapkan environment file (opsional jika belum ada):

```powershell
Copy-Item apps/backend/.env.example apps/backend/.env
Copy-Item apps/frontend/.env.example apps/frontend/.env
```

Generate Prisma Client, migrasi, dan seed (opsional):

```powershell
cd apps/backend
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

Jalankan backend (dev):

```powershell
cd apps/backend
npm run dev
# API: http://localhost:4000
# Swagger UI: http://localhost:4000/api/docs
```

Jalankan frontend (dev):

```powershell
cd apps/frontend
npm run dev
# Frontend: http://localhost:5173
```

## 📜 API & Dokumentasi

- Healthcheck: `GET /health`
- Base path API: `/api`
- Swagger (otomatis):
  - UI: `GET /api/docs`
  - Spec: `GET /api/openapi.json`

Endpoint penting (cuplikan):

- Auth: `POST /api/auth/login`
- Orders (customer): `GET /api/customer/orders`, `POST /api/customer/orders`
- Orders (admin): `POST /api/admin/orders/{orderId}/ship`, `POST /api/admin/orders/{orderId}/deliver`
- Feedback: `POST /api/feedback`
- Catalog: `GET /api/catalog/categories`, `GET /api/catalog/products`

## 🐳 Docker (Backend)

Dockerfile multi-stage: `apps/backend/Dockerfile`

Build & run (lokal):

```powershell
cd apps/backend
docker build -t ohs-backend:local .
docker run --rm -p 4000:4000 `
  -e DATABASE_URL="mysql://user:pass@host:3306/db" `
  -e JWT_SECRET="your-secret" `
  ohs-backend:local
```

Seed (destructive): jalankan sekali dengan `-e RUN_SEED=true`. Hapus setelah sukses agar data tidak terhapus di restart berikutnya.

## 🐳 Docker (Frontend)

Frontend Dockerfile: `apps/frontend/Dockerfile`

```Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM nginx:1.27-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build & run (lokal):

```powershell
cd apps/frontend
docker build -t ohs-frontend:local --build-arg VITE_API_URL=http://localhost:4000/api .
docker run --rm -p 5173:80 ohs-frontend:local
```

Catatan:

- Mengganti endpoint API memerlukan rebuild (karena Vite inject saat build). Untuk fleksibilitas runtime, Anda bisa menambah skrip kecil yang menulis `window.__API_BASE__` dan membaca itu di `apiClient`.
- Template nginx (`default.conf.template`) memungkinkan Railway mengganti port via env substitution otomatis.
- Pastikan `VITE_API_URL` selalu menyertakan protokol (`https://`) dan suffix `/api` saat production.

## ☁️ Deploy ke Railway

### 1) Database (MySQL)

- Buat service MySQL baru. Gunakan versi stabil dan baru (misal 8.4 atau tetap 9.x tapi JANGAN downgrade volume lama).
- Catat host internal, port, username, password, dan nama database.

### 2) Backend

- Buat service baru, pilih builder: Dockerfile.
- Root directory: `apps/backend`
- Variables minimal:
  - `DATABASE_URL` → gunakan host internal (`mysql.railway.internal`) dan port internal
  - `JWT_SECRET`, `HASH_SALT_ROUNDS` (opsional), `PORT=4000`
  - `FRONTEND_ORIGIN=https://<frontend-public-domain>`
- Seed satu kali: set `RUN_SEED=true` lalu deploy; setelah berhasil, hapus `RUN_SEED` dan deploy ulang.

### 3) Frontend

- Set `VITE_API_URL=https://<backend-public-domain>/api` (Wajib sertakan `https://` dan `/api`).
- Deploy sebagai static site (Vercel/Netlify) atau service Node/Ngx di Railway.

## 🧾 Catatan Arsitektur Backend

- `routes/modules` → routing per domain (auth, admin, seller, customer, dsb)
- `controllers` → adapter request/response
- `services` → logika bisnis, transaksi, akses Prisma
- `validators` → validasi Zod
- `middleware` → auth JWT, error handler, 404

## 🆘 Troubleshooting

- Prisma generate gagal (DATABASE_URL missing)
  - Solusi: telah ditangani via fallback di `prisma.config.ts` dan Dockerfile build arg dummy.
- `ERR_MODULE_NOT_FOUND` saat runtime
  - Solusi: backend dikompilasi sebagai CommonJS; `package.json` backend `type=commonjs`.
- `@prisma/client did not initialize yet`
  - Solusi: pastikan `node_modules` hasil build (yang sudah di-`prisma generate`) ikut di image runtime; entrypoint menjalankan `npx prisma generate` secara defensif.
- Seed error `Cannot find module '../src/lib/prisma'`
  - Solusi: image runtime menyertakan folder `src` agar `tsx prisma/seed.ts` dapat mengimpor modul.
- P1000 (auth DB gagal)
  - Solusi: cek kredensial Railway (USER/PASS/DB), gunakan host internal, URL-encode password bila perlu, pastikan nama DB benar.
- Frontend blank screen / `A.find is not a function`
  - Solusi: set `VITE_API_URL` ke URL publik backend yang benar, dengan protokol (https) dan `/api`; guard array sudah ditambahkan.
- 405 pada login di production
  - Penyebab umum: `VITE_API_URL` salah (tanpa protokol → jadi path). Pastikan `https://.../api`.
- PathError `Missing parameter name at index 1: *` (Express 5)
  - Penyebab: `app.options("*")` – sudah dihapus. CORS tetap aktif dari middleware global.

## 📚 Referensi Tambahan

- Prisma: https://www.prisma.io/docs
- Express 5: https://expressjs.com/
- Vite: https://vitejs.dev/

## 📝 Lisensi

MIT
