import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { apiClient } from "../services/apiClient";
import { toast } from "../components/Toast";
import { downloadOrderPDF } from "../utils/pdf";
import type { Order } from "../types/api";

const fetchOrderDetail = async (orderId: string): Promise<Order> => {
  const { data } = await apiClient.get(`/customer/orders/${orderId}`);
  return data;
};

export const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetail(orderId!),
    enabled: !!orderId,
  });

  const order = orderQuery.data as Order | undefined;

  if (orderQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (orderQuery.isError || !order) {
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
            d="M12 9v2m0 4v2m0 5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="mb-4 text-lg font-medium text-slate-600">Pesanan tidak ditemukan</p>
        <Link
          to="/orders"
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Kembali ke Pesanan
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700";
      case "APPROVED":
        return "bg-cyan-100 text-cyan-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "Terkirim";
      case "SHIPPED":
        return "Dikirim";
      case "APPROVED":
        return "Disetujui";
      case "PENDING":
        return "Menunggu";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const subtotal = order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shippingCost = Number(order.totalAmount) - subtotal;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Detail Pesanan</h1>
          <p className="mt-1 text-slate-600">Pesanan #{order.orderNumber}</p>
        </div>
        <div className="text-right">
          <p
            className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(order.status)}`}
          >
            {getStatusLabel(order.status)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">📦 Produk Dipesan</h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-slate-200 pb-4 last:border-b-0"
                >
                  {/* Product Image Placeholder */}
                  <div className="h-20 w-20 shrink-0 rounded-md bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <svg
                      className="h-10 w-10 text-slate-400"
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
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{item.product.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Rp
                      {Number(item.price).toLocaleString("id-ID", {
                        minimumFractionDigits: 0,
                      })}
                      {" × "} {item.quantity}
                    </p>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      Rp
                      {(Number(item.price) * item.quantity).toLocaleString("id-ID", {
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">📍 Alamat Pengiriman</h2>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">{order.shippingName}</p>
              <p className="text-sm text-slate-600">
                {order.shippingCity}, {order.shippingState}
              </p>
              <p className="text-sm text-slate-600">{order.shippingPostalCode}</p>
              <p className="text-sm text-slate-600">{order.shippingCountry}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">💳 Informasi Pembayaran</h2>

            {order.payment ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Metode Pembayaran</span>
                  <span className="font-medium text-slate-800">
                    {order.payment.method === "COD"
                      ? "Bayar di Tempat (COD)"
                      : order.payment.method === "DEBIT_CARD"
                        ? "Kartu Debit"
                        : "Kartu Kredit"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Status Pembayaran</span>
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                      order.payment.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : order.payment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.payment.status === "COMPLETED"
                      ? "Selesai"
                      : order.payment.status === "PENDING"
                        ? "Menunggu"
                        : "Gagal"}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <span className="font-semibold text-slate-800">Total</span>
                  <span className="font-bold text-blue-600">
                    Rp
                    {Number(order.payment.amount).toLocaleString("id-ID", {
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-600">Belum ada data pembayaran</p>
            )}
          </div>

          {/* Shipment Information */}
          {order.shipment && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">🚚 Informasi Pengiriman</h2>

              <div className="space-y-3">
                {order.shipment.courier && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Kurir Pengiriman</span>
                    <span className="font-medium text-slate-800">{order.shipment.courier}</span>
                  </div>
                )}

                {order.shipment.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nomor Resi</span>
                    <span className="font-mono font-medium text-slate-800">
                      {order.shipment.trackingNumber}
                    </span>
                  </div>
                )}

                {!order.shipment.courier && !order.shipment.trackingNumber && (
                  <p className="text-sm text-slate-600">Menunggu kurir untuk pickup paket Anda</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Order Summary */}
        <div className="rounded-lg bg-white p-6 shadow-sm h-fit">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">💰 Ringkasan Pesanan</h2>

          <div className="space-y-3 border-b border-slate-200 pb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium text-slate-800">
                Rp
                {subtotal.toLocaleString("id-ID", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Ongkos Kirim</span>
              <span className="font-medium text-slate-800">
                Rp
                {shippingCost.toLocaleString("id-ID", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <span className="font-semibold text-slate-800">Total Pembayaran</span>
            <span className="text-2xl font-bold text-blue-600">
              Rp
              {Number(order.totalAmount).toLocaleString("id-ID", {
                minimumFractionDigits: 0,
              })}
            </span>
          </div>

          {/* Timeline */}
          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="mb-3 text-xs font-semibold text-slate-500 uppercase">Status Timeline</p>
            <div className="space-y-3">
              {[
                { status: "PENDING", label: "Pesanan Dibuat", icon: "✓" },
                { status: "APPROVED", label: "Pesanan Disetujui", icon: "✓" },
                { status: "SHIPPED", label: "Dikirim", icon: "✓" },
                { status: "DELIVERED", label: "Terkirim", icon: "✓" },
              ].map((step, idx) => {
                const statusOrder = ["PENDING", "APPROVED", "SHIPPED", "DELIVERED"];
                const currentStatusIndex = statusOrder.indexOf(order.status);
                const stepStatusIndex = statusOrder.indexOf(step.status as any);
                const isCompleted = stepStatusIndex <= currentStatusIndex;
                const isCurrent = stepStatusIndex === currentStatusIndex;

                return (
                  <div key={idx} className="flex gap-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isCompleted ? "bg-green-500 text-white" : "bg-slate-300 text-slate-600"
                      }`}
                    >
                      {isCurrent ? "→" : "✓"}
                    </div>
                    <p
                      className={`text-sm ${
                        isCurrent
                          ? "font-semibold text-slate-800"
                          : isCompleted
                            ? "text-slate-600 line-through"
                            : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Back Button */}
          <Link
            to="/orders"
            className="mt-6 block w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Kembali ke Pesanan
          </Link>

          {/* Download PDF Button */}
          <button
            onClick={async () => {
              setIsDownloadingPDF(true);
              try {
                await downloadOrderPDF(order);
                toast.success("Laporan PDF siap diunduh");
              } catch (error) {
                toast.error("Gagal membuat laporan PDF");
              } finally {
                setIsDownloadingPDF(false);
              }
            }}
            disabled={isDownloadingPDF}
            className="mt-3 block w-full rounded-md border border-blue-300 bg-white px-4 py-2 text-center font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDownloadingPDF ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Membuat PDF...
              </span>
            ) : (
              "📄 Download PDF"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
