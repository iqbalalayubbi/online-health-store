import { useQuery } from "@tanstack/react-query";
import { fetchCustomers, fetchCategories, fetchShopRequests, fetchOrdersForShipping } from "../api";
import { Link } from "react-router";

interface ShippingOrder {
  id: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
}

export const AdminDashboardPage = () => {
  const customersQuery = useQuery({
    queryKey: ["admin-customers"],
    queryFn: fetchCustomers,
  });

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const shopRequestsQuery = useQuery({
    queryKey: ["admin-shop-requests"],
    queryFn: fetchShopRequests,
  });

  const ordersQuery = useQuery({
    queryKey: ["admin-shipping"],
    queryFn: fetchOrdersForShipping,
  });

  const customers = customersQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const shopRequests = shopRequestsQuery.data ?? [];
  const orders = (ordersQuery.data ?? []) as ShippingOrder[];

  const pendingShopRequests = shopRequests.filter((r) => r.status === "PENDING");
  const pendingOrders = orders.filter((o: ShippingOrder) => o.status === "PENDING");

  const StatCard = ({
    label,
    value,
    icon,
    link,
  }: {
    label: string;
    value: number;
    icon: string;
    link: string;
  }) => (
    <Link
      to={link}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="mt-1 text-slate-600">Ringkasan aktivitas dan manajemen sistem</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Customers"
          value={customers.length}
          icon="👥"
          link="/admin/customers"
        />
        <StatCard label="Categories" value={categories.length} icon="📦" link="/admin/categories" />
        <StatCard
          label="Pending Shops"
          value={pendingShopRequests.length}
          icon="🏪"
          link="/admin/shop-requests"
        />
        <StatCard
          label="Pending Orders"
          value={pendingOrders.length}
          icon="📦"
          link="/admin/shipping"
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/customers"
            className="rounded-md bg-blue-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Manage Customers
          </Link>
          <Link
            to="/admin/categories"
            className="rounded-md bg-green-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-green-700"
          >
            Manage Categories
          </Link>
          <Link
            to="/admin/shop-requests"
            className="rounded-md bg-yellow-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-yellow-700"
          >
            Shop Requests
          </Link>
          <Link
            to="/admin/shipping"
            className="rounded-md bg-purple-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-purple-700"
          >
            Manage Shipping
          </Link>
          <Link
            to="/admin/guestbook"
            className="rounded-md bg-indigo-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-indigo-700"
          >
            Moderate Guestbook
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending Shop Requests */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Pending Shop Requests</h2>
            {pendingShopRequests.length > 0 && (
              <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                {pendingShopRequests.length}
              </span>
            )}
          </div>
          {pendingShopRequests.length === 0 ? (
            <p className="text-sm text-slate-600">No pending requests</p>
          ) : (
            <div className="space-y-2">
              {pendingShopRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-md bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{request.businessName}</p>
                    <p className="text-xs text-slate-600">{request.sellerEmail}</p>
                  </div>
                  <Link
                    to="/admin/shop-requests"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Orders */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Pending Shipments</h2>
            {pendingOrders.length > 0 && (
              <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                {pendingOrders.length}
              </span>
            )}
          </div>
          {pendingOrders.length === 0 ? (
            <p className="text-sm text-slate-600">No pending orders</p>
          ) : (
            <div className="space-y-2">
              {pendingOrders.slice(0, 5).map((order: ShippingOrder) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-md bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-slate-600">
                      Rp{order.totalPrice.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Link
                    to="/admin/shipping"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Ship
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="rounded-lg bg-slate-50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">System Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-slate-600">Total Customers</p>
            <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Categories</p>
            <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Orders</p>
            <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Pending Orders</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
