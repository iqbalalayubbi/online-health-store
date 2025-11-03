import { useAuthStore } from "../stores/authStore";
import { Link } from "react-router-dom";

export const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-lg bg-white">
        <div className="text-center">
          <p className="mb-4 text-lg font-medium text-slate-600">
            Anda harus login terlebih dahulu
          </p>
          <Link
            to="/login"
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      ADMIN: "Administrator",
      SELLER: "Penjual",
      CUSTOMER: "Pelanggan",
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      ADMIN: "bg-red-100 text-red-700",
      SELLER: "bg-purple-100 text-purple-700",
      CUSTOMER: "bg-blue-100 text-blue-700",
    };
    return colors[role] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Profil Akun</h1>
        <p className="mt-1 text-slate-600">Kelola informasi akun Anda</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          {/* Avatar */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
            <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-800">{user.email}</h2>
            <p className="mt-1 text-slate-600">User ID: {user.id}</p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${getRoleColor(user.role)}`}
              >
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Info */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">📧 Email</h3>
          <p className="break-all text-slate-600">{user.email}</p>
          <p className="mt-2 text-xs text-slate-500">Email yang digunakan untuk login</p>
        </div>

        {/* Role Info */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">🎯 Role</h3>
          <p className="text-slate-600">{getRoleLabel(user.role)}</p>
          <p className="mt-2 text-xs text-slate-500">
            {user.role === "CUSTOMER"
              ? "Anda dapat membeli produk dari toko kami"
              : user.role === "SELLER"
                ? "Anda dapat mengelola dan menjual produk"
                : "Anda memiliki akses administrator penuh"}
          </p>
        </div>

        {/* User ID */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">🔑 User ID</h3>
          <p className="break-all font-mono text-sm text-slate-600">{user.id}</p>
          <p className="mt-2 text-xs text-slate-500">ID unik untuk akun Anda</p>
        </div>

        {/* Account Status */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">✅ Status</h3>
          <p className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            Aktif
          </p>
          <p className="mt-2 text-xs text-slate-500">Akun Anda dalam kondisi baik</p>
        </div>
      </div>

      {/* Quick Links - Only for CUSTOMER */}
      {user.role === "CUSTOMER" && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">🔗 Navigasi Cepat</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/orders"
              className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <span>📦</span>
              <div>
                <p className="font-medium text-slate-700">Pesanan Saya</p>
                <p className="text-xs text-slate-500">Lihat riwayat pesanan</p>
              </div>
            </Link>

            <Link
              to="/catalog"
              className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <span>🛒</span>
              <div>
                <p className="font-medium text-slate-700">Katalog</p>
                <p className="text-xs text-slate-500">Belanja produk kesehatan</p>
              </div>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <span>🛍️</span>
              <div>
                <p className="font-medium text-slate-700">Keranjang</p>
                <p className="text-xs text-slate-500">Lihat keranjang belanja</p>
              </div>
            </Link>

            <button
              className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
              disabled
            >
              <span>⚙️</span>
              <div>
                <p className="font-medium text-slate-700">Pengaturan</p>
                <p className="text-xs text-slate-500">Segera hadir</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
