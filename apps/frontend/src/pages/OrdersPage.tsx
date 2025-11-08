import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchOrders,
  cancelOrder,
  fetchMyReviewedProductIdsByOrder,
} from "../features/customer/api";
import { toast } from "../components/Toast";
import { downloadOrderPDF } from "../utils/pdf";
import type { Order } from "../types/api";
import { FeedbackModal } from "../features/customer/components/FeedbackModal";
import { StatusBadge } from "../components/StatusBadge";
import { Money } from "../components/Money";

export const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [downloadingPDFId, setDownloadingPDFId] = useState<string | null>(null);
  const [feedbackProductId, setFeedbackProductId] = useState<string | null>(null);
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
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

  // Track reviewed product IDs per orderId
  const [reviewedByOrder, setReviewedByOrder] = useState<Record<string, string[]>>({});

  // Load reviewed product IDs grouped by order for delivered orders
  useEffect(() => {
    if (!ordersQuery.isSuccess) return;
    const deliveredOrderIds = orders.filter((o) => o.status === "DELIVERED").map((o) => o.id);
    if (deliveredOrderIds.length === 0) {
      setReviewedByOrder({});
      return;
    }
    let cancelled = false;
    fetchMyReviewedProductIdsByOrder(deliveredOrderIds)
      .then((data: { reviewedByOrder: Record<string, string[]> }) => {
        if (cancelled) return;
        const map = (data && (data as any).reviewedByOrder) || {};
        setReviewedByOrder(map);
      })
      .catch(() => {
        if (!cancelled) setReviewedByOrder({}); // fallback
      });
    return () => {
      cancelled = true;
    };
  }, [ordersQuery.isSuccess, orders, feedbackProductId, feedbackOrderId]);

  // Status mapping now handled by reusable StatusBadge component

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
                    <StatusBadge status={order.status} className="mt-1" />
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
                          <Money value={Number(item.price) * item.quantity} />
                        </p>
                        {order.status === "DELIVERED" &&
                          !(reviewedByOrder[order.id] || []).includes(item.product.id) && (
                            <button
                              type="button"
                              onClick={() => {
                                setFeedbackProductId(item.product.id);
                                setFeedbackOrderId(order.id);
                                setFeedbackProductName(item.product.name);
                              }}
                              className="rounded-md border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                            >
                              Feedback
                            </button>
                          )}
                        {order.status === "DELIVERED" &&
                          (reviewedByOrder[order.id] || []).includes(item.product.id) && (
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
                      <Money
                        value={order.items.reduce(
                          (sum, item) => sum + Number(item.price) * item.quantity,
                          0,
                        )}
                      />
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-base font-semibold text-slate-800">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-blue-600">
                    <Money value={Number(order.totalAmount)} />
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3 flex-wrap justify-between">
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
                    disabled={downloadingPDFId === order.id || order.status === "PENDING"}
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
                  {/* <Link
                    to={`/orders/${order.id}`}
                    className="ml-auto rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Detail Pesanan
                  </Link> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <FeedbackModal
        isOpen={Boolean(feedbackProductId)}
        productId={feedbackProductId}
        orderId={feedbackOrderId}
        productName={feedbackProductName}
        onSubmitted={(pid, oid) => {
          if (pid && oid) {
            setReviewedByOrder((prev) => {
              const curr = prev[oid] || [];
              if (curr.includes(pid)) return prev;
              return { ...prev, [oid]: [...curr, pid] };
            });
          }
        }}
        onClose={() => {
          setFeedbackProductId(null);
          setFeedbackOrderId(null);
          setFeedbackProductName(undefined);
        }}
      />
    </div>
  );
};
