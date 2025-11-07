import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchOrders, cancelOrder, fetchMyReviewedProductIds } from "../features/customer/api";
import { toast } from "../components/Toast";
import { downloadOrderPDF } from "../utils/pdf";
import type { Order } from "../types/api";
import { FeedbackModal } from "../features/customer/components/FeedbackModal";

export const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [downloadingPDFId, setDownloadingPDFId] = useState<string | null>(null);
  const [feedbackProductId, setFeedbackProductId] = useState<string | null>(null);
  const [feedbackProductName, setFeedbackProductName] = useState<string | undefined>(undefined);

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pesanan berhasil dibatalkan");
    },
    onError: () => {
      toast.error("Gagal membatalkan pesanan");
    },
  });

  const orders = (ordersQuery.data ?? []) as Order[];
  const isLoading = ordersQuery.isLoading;

  // Track product IDs that are already reviewed by this user
  const [reviewedProductIds, setReviewedProductIds] = useState<string[]>([]);

  // Load reviewed product IDs for delivered products (refetch when feedback modal closes or orders change)
  useEffect(() => {
    if (!ordersQuery.isSuccess) return;
    const deliveredProductIds = Array.from(
      new Set(
        orders
          .filter((o) => o.status === "DELIVERED")
          .flatMap((o) => o.items.map((it) => it.product.id)),
      ),
    );
    if (deliveredProductIds.length === 0) {
      setReviewedProductIds([]);
      return;
    }
    let cancelled = false;
    fetchMyReviewedProductIds(deliveredProductIds)
      .then((data) => {
        if (cancelled) return;
        const reviewed = Array.isArray((data as any)?.reviewed) ? data.reviewed : [];
        setReviewedProductIds(reviewed);
      })
      .catch(() => {
        if (!cancelled) setReviewedProductIds([]); // fallback
      });
    return () => {
      cancelled = true;
    };
  }, [ordersQuery.isSuccess, orders, feedbackProductId]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Pesanan Saya</h1>
        <p className="mt-1 text-slate-600">Lihat dan kelola pesanan Anda</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg bg-white py-12">
          <p className="text-slate-500">Memuat pesanan...</p>
        </div>
      ) : orders.length === 0 ? (
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mb-4 text-lg font-medium text-slate-600">Anda belum memiliki pesanan</p>
          <p className="mb-6 text-center text-sm text-slate-500">
            Mulai belanja sekarang dan pesanan Anda akan muncul di sini
          </p>
          <Link
            to="/catalog"
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              className="rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Order Header */}
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Order ID</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-slate-800">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
                    <p
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-b border-slate-200 px-6 py-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">Produk Dipesan:</p>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{item.product.name}</p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity} × Rp
                          {Number(item.price).toLocaleString("id-ID", {
                            minimumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:justify-end">
                        <p className="text-sm font-semibold text-blue-600">
                          Rp
                          {(Number(item.price) * item.quantity).toLocaleString("id-ID", {
                            minimumFractionDigits: 0,
                          })}
                        </p>
                        {order.status === "DELIVERED" &&
                          !(reviewedProductIds?.includes(item.product.id) ?? false) && (
                            <button
                              type="button"
                              onClick={() => {
                                setFeedbackProductId(item.product.id);
                                setFeedbackProductName(item.product.name);
                              }}
                              className="rounded-md border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                            >
                              Feedback
                            </button>
                          )}
                        {order.status === "DELIVERED" &&
                          (reviewedProductIds?.includes(item.product.id) ?? false) && (
                            <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                              Sudah direview
                            </span>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Shipping Info */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                      Alamat Pengiriman
                    </p>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">{order.shippingName}</span>
                    </p>
                    <p className="text-sm text-slate-600">{order.shippingCity}</p>
                    <p className="text-sm text-slate-600">{order.shippingState}</p>
                    <p className="text-sm text-slate-600">{order.shippingPostalCode}</p>
                    <p className="text-sm text-slate-600">{order.shippingCountry}</p>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                      Informasi Pembayaran
                    </p>
                    {order.payment ? (
                      <>
                        <p className="text-sm text-slate-700">
                          <span className="font-medium">Metode:</span>{" "}
                          {order.payment.method === "COD"
                            ? "Bayar di Tempat"
                            : order.payment.method === "DEBIT_CARD"
                              ? "Kartu Debit"
                              : "Kartu Kredit"}
                        </p>
                        <p className="text-sm text-slate-700">
                          <span className="font-medium">Status:</span>{" "}
                          {order.payment.status === "COMPLETED" ? "✅ Selesai" : "⏳ Menunggu"}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-600">Belum ada data pembayaran</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipment Info */}
              {order.shipment && (
                <div className="border-b border-slate-200 px-6 py-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                    Informasi Pengiriman
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {order.shipment.courier && (
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Kurir:</span> {order.shipment.courier}
                      </p>
                    )}
                    {order.shipment.trackingNumber && (
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">No Resi:</span>{" "}
                        {order.shipment.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="px-6 py-4">
                <div className="mb-4 rounded-md bg-slate-50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium text-slate-800">
                      Rp
                      {order.items
                        .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
                        .toLocaleString("id-ID", {
                          minimumFractionDigits: 0,
                        })}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-base font-semibold text-slate-800">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-blue-600">
                    Rp
                    {Number(order.totalAmount).toLocaleString("id-ID", {
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3 flex-wrap">
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => cancelMutation.mutate(order.id)}
                      disabled={cancelMutation.isPending}
                      className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancelMutation.isPending ? "Membatalkan..." : "Batalkan Pesanan"}
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      setDownloadingPDFId(order.id);
                      try {
                        await downloadOrderPDF(order);
                        toast.success("Laporan PDF siap diunduh");
                      } catch (error) {
                        toast.error("Gagal membuat laporan PDF");
                      } finally {
                        setDownloadingPDFId(null);
                      }
                    }}
                    disabled={downloadingPDFId === order.id}
                    className="rounded-md border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {downloadingPDFId === order.id ? (
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
                        Membuat...
                      </span>
                    ) : (
                      "📄 Download PDF"
                    )}
                  </button>
                  <Link
                    to={`/orders/${order.id}`}
                    className="ml-auto rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Detail Pesanan
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <FeedbackModal
        isOpen={Boolean(feedbackProductId)}
        productId={feedbackProductId}
        productName={feedbackProductName}
        onSubmitted={(pid) => {
          if (pid) {
            setReviewedProductIds((prev) => (prev.includes(pid) ? prev : [...prev, pid]));
          }
        }}
        onClose={() => {
          setFeedbackProductId(null);
          setFeedbackProductName(undefined);
        }}
      />
    </div>
  );
};
