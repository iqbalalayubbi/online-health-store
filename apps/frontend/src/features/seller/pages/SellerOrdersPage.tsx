import { useQuery } from "@tanstack/react-query";
import { fetchSellerOrders } from "../api";

interface SellerOrder {
  id: string;
  customerEmail: string;
  totalPrice: string;
  status: string;
  itemCount: number;
  createdAt: string;
}

export const SellerOrdersPage = () => {
  const ordersQuery = useQuery({
    queryKey: ["seller-orders"],
    queryFn: fetchSellerOrders,
  });

  const orders = (ordersQuery.data ?? []) as SellerOrder[];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "APPROVED":
        return "bg-blue-100 text-blue-700";
      case "SHIPPED":
        return "bg-purple-100 text-purple-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Orders</h1>
        <p className="mt-1 text-slate-600">Kelola pesanan dari pelanggan</p>
      </div>

      {/* Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-xs text-blue-600">Total Orders</p>
            <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4">
            <p className="text-xs text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">
              {orders.filter((o) => o.status === "PENDING").length}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-xs text-green-600">Delivered</p>
            <p className="text-2xl font-bold text-green-900">
              {orders.filter((o) => o.status === "DELIVERED").length}
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-xs text-purple-600">Revenue</p>
            <p className="text-2xl font-bold text-purple-900">
              Rp
              {orders.reduce((sum, o) => sum + parseFloat(o.totalPrice), 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      )}

      {/* Orders List */}
      {ordersQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Memuat orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center">
          <p className="text-slate-600">Belum ada orders. Tunggu pelanggan membeli produk Anda!</p>
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Items</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{order.customerEmail}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    Rp{parseFloat(order.totalPrice).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
