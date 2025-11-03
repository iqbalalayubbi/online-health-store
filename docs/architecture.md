# Architecture Overview

## Backend
- **Framework**: Express 5 + TypeScript dengan struktur layered (routes → controllers → services → repositories/Prisma).
- **Autentikasi**: JSON Web Token (Bearer) dengan middleware role-based (uthenticate). Password disimpan menggunakan bcrypt dengan salt dinamis dari env.
- **Validasi**: Zod digunakan di setiap service untuk memastikan payload sesuai sebelum menyentuh database.
- **Error Handling**: middleware errorHandler memberikan response JSON seragam, sedangkan 
otFoundHandler menangani 404.
- **Prisma**: koneksi tunggal melalui src/lib/prisma.ts untuk menghindari masalah re-instansiasi selama pengembangan.

### Model Data Utama
| Model | Deskripsi | Relasi Penting |
| --- | --- | --- |
| User | Inti akun dengan role ADMIN, SELLER, CUSTOMER. | Terhubung ke profil admin/seller/customer. |
| AdminProfile | Informasi admin. | Satu-satu dengan User. |
| SellerProfile | Data seller. | Memiliki banyak Shop, Product, ShopCreationRequest. |
| CustomerProfile | Data customer termasuk alamat default. | Memiliki Cart dan Order. |
| ShopCreationRequest | Permintaan seller untuk membuat toko. | Disetujui / ditolak oleh admin, otomatis membuat Shop saat disetujui. |
| Shop | Toko resmi seller. | Memiliki Category dan Product. |
| Category | Kategori produk per toko. | Digunakan oleh Product. |
| Product | Produk kesehatan. | Tersedia di keranjang (CartItem) dan order (OrderItem). |
| Cart / CartItem | Keranjang aktif customer. | Di-reset setelah checkout. |
| Order / OrderItem | Pesanan customer. | Memiliki Payment dan Shipment. |
| Payment | Status pembayaran (COD / kartu). | Satu-satu dengan Order. |
| Shipment | Detail pengiriman. | Diisi admin saat mengirim order. |
| Feedback | Umpan balik produk. | Dikaitkan ke User & Product. |
| GuestBookEntry | Buku tamu publik. | Bisa anonim atau terkait user. |

### Alur Fitur Penting
- **Registrasi & Login**: uth.service membuat user + profil (customer/seller) dan mengembalikan JWT. Login memvalidasi password dan mengembalikan token + data user tanpa passwordHash.
- **Permintaan Toko Seller**: Seller mengirim detail toko → admin meninjau (eviewShopRequest) → ketika disetujui dibuat entri Shop otomatis.
- **Checkout Customer**: customer.service melakukan transaksi: membaca cart, membuat order + order items + payment, lalu mengosongkan cart.
- **Pengiriman Admin**: Admin menandai order sebagai SHIPPED dan membuat/ memperbarui Shipment.

## Frontend
- **Framework**: React 19 dengan Vite, TypeScript.
- **State Management**: Zustand (uthStore) untuk menyimpan token & user, dipersist ke localStorage. React Query mengatur state async (catalog, cart, orders, dll).
- **Routing**: React Router dengan layout utama dan ProtectedRoute untuk akses terbatas.
- **Komposisi**: Struktur per fitur (src/features/<domain>) menyimpan komponen, API client, dan hooks masing-masing.
- **Styling**: CSS utilitarian sederhana (index.css) dengan komponen UI umum seperti card, dashboard-grid, dll.

### Fitur Halaman
- **Home / Catalog**: menampilkan kategori + produk.
- **Login / Register**: form otentikasi dengan redirect otomatis setelah sukses.
- **Dashboard**: menyesuaikan role (admin / seller / customer) dan memanfaatkan komponen domain masing-masing.
- **Guestbook & Feedback**: endpoint tersedia untuk integrasi lanjutan (UI dasar dapat ditambahkan sesuai kebutuhan).

### Integrasi API
- services/apiClient.ts mengatur Axios baseURL (VITE_API_URL) dan menyisipkan header Authorization dari store.
- Setiap fitur memiliki berkas pi.ts yang membungkus endpoint terkait sehingga komponen hanya berurusan dengan hooks React Query.

## Testing & Kualitas Kode
- **Linting**: ESLint Flat Config di backend & frontend (
pm run lint).
- **Formatting**: Prettier lint (
pm run format).
- **Prisma**: jalankan 
pm run prisma:migrate setiap ada perubahan schema dan 
pm run prisma:seed untuk seed ulang.

## Langkah Pengembangan Lanjutan
1. Tambahkan pengujian otomatis (Vitest / Jest) untuk service kritikal.
2. Buat UI tambahan untuk buku tamu dan feedback (backend sudah siap).
3. Integrasikan payment gateway sesungguhnya untuk metode kartu.
4. Implementasi notifikasi email ketika order dikirim.
