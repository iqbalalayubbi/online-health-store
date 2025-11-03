import { useQuery } from "@tanstack/react-query";
import { fetchSellerOrders } from "../api";

export const SellerOrders = () => {
  const ordersQuery = useQuery({
    queryKey: ["seller-orders"],
    queryFn: fetchSellerOrders,
  });

  if (ordersQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Memuat pesanan toko...
      </section>
    );
  }

  const orders = ordersQuery.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">Pesanan Masuk</h3>
      <ul className="grid gap-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm"
          >
            <strong className="text-sm font-semibold text-slate-800">{order.orderNumber}</strong>
            <p>Status: {order.status}</p>
            <p>Total: Rp {Number(order.totalAmount).toLocaleString("id-ID")}</p>
          </li>
        ))}
      </ul>
      {orders.length === 0 && <p className="text-sm text-slate-500">Belum ada pesanan.</p>}
    </section>
  );
};

