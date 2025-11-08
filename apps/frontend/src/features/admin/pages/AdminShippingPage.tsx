import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrdersForShipping, markOrderAsShipped, markOrderAsDelivered } from "../api";
import { StatusBadge } from "../../../components/StatusBadge";
import { Money } from "../../../components/Money";
import { toast } from "../../../components/Toast";

interface ShippingOrder {
  id: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export const AdminShippingPage = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"PENDING" | "SHIPPED" | "DELIVERED" | "ALL">("PENDING");

  const ordersQuery = useQuery({
    queryKey: ["admin-shipping"],
    queryFn: fetchOrdersForShipping,
  });

  const shipMutation = useMutation({
    mutationFn: (orderId: string) => markOrderAsShipped(orderId, "JNE", `TRK-${Date.now()}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipping"] });
      toast.success("Order marked as shipped");
    },
    onError: () => {
      toast.error("Gagal update status pengiriman");
    },
  });

  const deliverMutation = useMutation({
    mutationFn: (orderId: string) => markOrderAsDelivered(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipping"] });
      toast.success("Order marked as delivered");
    },
    onError: () => {
      toast.error("Gagal mengubah status menjadi delivered");
    },
  });

  const orders = (ordersQuery.data ?? []) as ShippingOrder[];
  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    return order.status === filter;
  });

  // Status colors handled by StatusBadge

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Manajemen Pengiriman</h1>
        <p className="mt-1 text-slate-600">Kelola pengiriman pesanan dan tracking</p>
      </div>

      <div className="flex gap-3">
        {(["PENDING", "SHIPPED", "DELIVERED", "ALL"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-md px-4 py-2 font-semibold transition ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {status === "PENDING"
              ? "Pending"
              : status === "SHIPPED"
                ? "Shipped"
                : status === "DELIVERED"
                  ? "Delivered"
                  : "Semua"}
          </button>
        ))}
      </div>

      {ordersQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Memuat orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center">
          <p className="text-slate-600">Tidak ada orders dengan filter ini</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Tracking
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{order.customerEmail}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    <Money value={order.totalPrice} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {order.trackingNumber ? (
                      <div>
                        <p className="font-mono text-xs font-semibold text-slate-900">
                          {order.trackingNumber}
                        </p>
                        {order.estimatedDelivery && (
                          <p className="text-xs text-slate-500">
                            Est: {new Date(order.estimatedDelivery).toLocaleDateString("id-ID")}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => shipMutation.mutate(order.id)}
                        disabled={shipMutation.isPending}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Ship
                      </button>
                    )}
                    {order.status === "SHIPPED" && (
                      <button
                        onClick={() => deliverMutation.mutate(order.id)}
                        disabled={deliverMutation.isPending}
                        className="ml-2 rounded-md bg-green-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deliverMutation.isPending ? "Delivering..." : "Mark Delivered"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredOrders.length > 0 && (
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
          <p className="font-semibold">Total orders: {filteredOrders.length}</p>
          <p className="text-xs">Pending: {orders.filter((o) => o.status === "PENDING").length}</p>
        </div>
      )}
    </div>
  );
};
