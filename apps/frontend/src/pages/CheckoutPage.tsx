import type { FormEvent } from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, checkout } from "../features/customer/api";
import { toast } from "../components/Toast";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch cart data
  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  // Form states
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("Indonesia");
  const [paymentMethod, setPaymentMethod] = useState<"CREDIT_CARD" | "DEBIT_CARD" | "COD">("COD");

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Pesanan berhasil dibuat!");
      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    },
    onError: () => {
      toast.error("Gagal membuat pesanan. Silakan coba lagi.");
    },
  });

  const cart = cartQuery.data as any;
  const cartItems = cart?.items ?? [];

  const subtotal = cartItems.reduce((total: number, item: any) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const shippingCost = 10000; // Fixed shipping cost for demo
  const total = subtotal + shippingCost;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !shippingName ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingPostalCode
    ) {
      toast.error("Mohon isi semua field yang diperlukan");
      return;
    }

    checkoutMutation.mutate({
      shippingName,
      shippingPhone: shippingPhone || undefined,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      paymentMethod,
    });
  };

  if (cartQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Memuat data checkout...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-white py-16">
        <svg
          className="mb-4 h-16 w-16 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="mb-4 text-lg font-medium text-slate-600">Keranjang Anda kosong</p>
        <Link
          to="/cart"
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Kembali ke Keranjang
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Checkout</h1>
        <p className="mt-1 text-slate-600">Selesaikan pembelian Anda</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Section */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">📦 Alamat Pengiriman</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Nama Penerima *
                <input
                  type="text"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              {/* Phone */}
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Nomor Telepon
                <input
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>

              {/* Address */}
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Alamat Lengkap *
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Jl. Contoh No. 123, Blok A"
                  rows={3}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              {/* City */}
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Kota *
                <input
                  type="text"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  placeholder="Jakarta"
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* State */}
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Provinsi *
                  <input
                    type="text"
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    placeholder="DKI Jakarta"
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </label>

                {/* Postal Code */}
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Kode Pos *
                  <input
                    type="text"
                    value={shippingPostalCode}
                    onChange={(e) => setShippingPostalCode(e.target.value)}
                    placeholder="12345"
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </label>
              </div>

              {/* Country */}
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Negara
                <input
                  type="text"
                  value={shippingCountry}
                  onChange={(e) => setShippingCountry(e.target.value)}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              {/* Payment Method Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">💳 Metode Pembayaran</h3>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Pilih Metode Pembayaran *
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="COD">Bayar di Tempat (COD)</option>
                    <option value="DEBIT_CARD">Kartu Debit</option>
                    <option value="CREDIT_CARD">Kartu Kredit</option>
                  </select>
                </label>

                <p className="mt-2 text-xs text-slate-500">
                  {paymentMethod === "COD"
                    ? "Bayar ketika paket sampai di tangan Anda"
                    : paymentMethod === "DEBIT_CARD"
                      ? "Bayar menggunakan kartu debit Anda"
                      : "Bayar menggunakan kartu kredit Anda"}
                </p>
              </div>

              {/* Submit Button */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  type="submit"
                  disabled={checkoutMutation.isPending}
                  className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutMutation.isPending ? "Memproses..." : "Buat Pesanan"}
                </button>

                <Link
                  to="/cart"
                  className="mt-3 block w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Kembali ke Keranjang
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary & Items */}
        <div className="space-y-6">
          {/* Order Items */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">📋 Detail Pesanan</h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-slate-200 pb-4 last:border-b-0"
                >
                  {/* Product Image Placeholder */}
                  <div className="h-16 w-16 shrink-0 rounded-md bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-blue-600 mt-2">
                      Rp{" "}
                      {(Number(item.product.price) * item.quantity).toLocaleString("id-ID", {
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">💰 Ringkasan Harga</h2>

            <div className="space-y-3 border-b border-slate-200 pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal ({cartItems.length} item)</span>
                <span className="font-medium text-slate-800">
                  Rp {subtotal.toLocaleString("id-ID", { minimumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Ongkos Kirim</span>
                <span className="font-medium text-slate-800">
                  Rp {shippingCost.toLocaleString("id-ID", { minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <span className="text-base font-semibold text-slate-800">Total Pembayaran</span>
              <span className="text-2xl font-bold text-blue-600">
                Rp {total.toLocaleString("id-ID", { minimumFractionDigits: 0 })}
              </span>
            </div>

            {/* Payment Method Info */}
            <div className="mt-4 rounded-md bg-blue-50 p-3 border border-blue-200">
              <p className="text-xs font-semibold text-blue-900">Metode Pembayaran</p>
              <p className="text-sm text-blue-800 mt-1">
                {paymentMethod === "COD"
                  ? "Bayar di Tempat"
                  : paymentMethod === "DEBIT_CARD"
                    ? "Kartu Debit"
                    : "Kartu Kredit"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
