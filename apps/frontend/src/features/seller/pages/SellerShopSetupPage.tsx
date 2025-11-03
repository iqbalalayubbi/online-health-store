import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSellerShop, createShop, updateShop } from "../api";
import { toast } from "../../../components/Toast";

export const SellerShopSetupPage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const shopQuery = useQuery({
    queryKey: ["seller-shop"],
    queryFn: fetchSellerShop,
  });

  useEffect(() => {
    if (shopQuery.data) {
      setFormData({
        name: shopQuery.data.name,
        description: shopQuery.data.description || "",
      });
    }
  }, [shopQuery.data]);

  const createMutation = useMutation({
    mutationFn: () => createShop(formData.name, formData.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-shop"] });
      toast.success("Shop created successfully");
      setIsEditing(false);
    },
    onError: () => {
      toast.error("Gagal membuat shop");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => updateShop(formData.name, formData.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-shop"] });
      toast.success("Shop updated successfully");
      setIsEditing(false);
    },
    onError: () => {
      toast.error("Gagal update shop");
    },
  });

  const shop = shopQuery.data;
  const isLoading = shopQuery.isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Shop name is required");
      return;
    }

    if (shop) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Shop Setup</h1>
        <p className="mt-1 text-slate-600">Kelola informasi toko Anda</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Memuat informasi toko...</p>
        </div>
      ) : shop && !isEditing ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{shop.name}</h2>
            <p className="mt-2 text-slate-600">{shop.description}</p>
            <div className="mt-4 flex items-center gap-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                  shop.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {shop.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Edit Shop
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-slate-800">
            {shop ? "Edit Shop" : "Create Your Shop"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Shop Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Healthy Pharmacy"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Describe your shop..."
                rows={5}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {shop ? "Update Shop" : "Create Shop"}
              </button>
              {shop && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-md bg-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {!shop && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
              <p className="font-semibold">📝 Next Steps</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
                <li>Fill in your shop details above</li>
                <li>Create your first product</li>
                <li>Start selling and earning!</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
      {shop && (
        <div className="rounded-lg bg-slate-50 p-6">
          <h3 className="mb-4 font-semibold text-slate-800">Quick Links</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="/seller/products"
              className="rounded-md bg-white px-4 py-3 text-center font-semibold text-blue-600 transition hover:bg-slate-100"
            >
              Manage Products
            </a>
            <a
              href="/seller/orders"
              className="rounded-md bg-white px-4 py-3 text-center font-semibold text-blue-600 transition hover:bg-slate-100"
            >
              View Orders
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
