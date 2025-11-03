import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, fetchOrders } from "../api";

export const OrdersList = () => {
  const queryClient = useQueryClient();
  const ordersQuery = useQuery({
    queryKey: ["customer-orders"],
    queryFn: fetchOrders,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });

  if (ordersQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Memuat pesanan...
      </section>
    );
  }

  const orders = ordersQuery.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">Pesanan Saya</h3>
      <ul className="grid gap-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1 text-sm text-slate-600">
              <strong className="text-sm font-semibold text-slate-800">{order.orderNumber}</strong>
              <p>Status: {order.status}</p>
              <p>Total: Rp {Number(order.totalAmount).toLocaleString("id-ID")}</p>
            </div>
            {order.status === "PENDING" && (
              <button
                type="button"
                onClick={() => cancelMutation.mutate(order.id)}
                className="self-start rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
              >
                Batalkan
              </button>
            )}
          </li>
        ))}
      </ul>
      {orders.length === 0 && <p className="text-sm text-slate-500">Belum ada pesanan.</p>}
    </section>
  );
};
