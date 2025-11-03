import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type SellerProduct,
} from "../api";
import { toast } from "../../../components/Toast";

export const SellerProductsPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const productsQuery = useQuery({
    queryKey: ["seller-products"],
    queryFn: fetchSellerProducts,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createProduct({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      toast.success("Product created successfully");
      resetForm();
    },
    onError: () => {
      toast.error("Gagal membuat product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (productId: string) =>
      updateProduct(productId, {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      toast.success("Product updated successfully");
      resetForm();
    },
    onError: () => {
      toast.error("Gagal update product");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Gagal delete product");
    },
  });

  const products = productsQuery.data ?? [];

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", stock: "", categoryId: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (product: SellerProduct) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryId: product.categoryId,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingId) {
      updateMutation.mutate(editingId);
    } else {
      createMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Products</h1>
          <p className="mt-1 text-slate-600">Kelola katalog produk Anda</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Add Product
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Price (Rp) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Stock *</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Category ID</label>
              <input
                type="text"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId ? "Update Product" : "Create Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 rounded-md bg-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {productsQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Memuat products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center">
          <p className="text-slate-600">Belum ada products. Mulai dengan menambah product baru!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{product.name}</h3>
              {product.description && (
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{product.description}</p>
              )}
              <div className="mt-3 space-y-1">
                <p className="text-lg font-bold text-slate-900">
                  Rp{parseFloat(product.price).toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-slate-600">Stock: {product.stock}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(product.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
