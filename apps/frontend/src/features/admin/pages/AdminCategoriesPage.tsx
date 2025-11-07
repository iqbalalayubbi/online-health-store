import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchAdminShops,
} from "../api";
import { toast } from "../../../components/Toast";
import type { FormEvent } from "react";

export const AdminCategoriesPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shopId, setShopId] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const shopsQuery = useQuery({
    queryKey: ["admin-shops"],
    queryFn: fetchAdminShops,
  });

  const createMutation = useMutation({
    mutationFn: () => createCategory(name, shopId, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategori berhasil dibuat");
      setName("");
      setDescription("");
      setShopId("");
      setShowForm(false);
    },
    onError: () => {
      toast.error("Gagal membuat kategori");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      editingId
        ? updateCategory(editingId, name, description, shopId || undefined)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategori berhasil diupdate");
      setName("");
      setDescription("");
      setShopId("");
      setEditingId(null);
      setShowForm(false);
    },
    onError: () => {
      toast.error("Gagal update kategori");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategori berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus kategori");
    },
  });

  const categories = categoriesQuery.data ?? [];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }
    if (!editingId && !shopId) {
      toast.error("Pilih shop untuk kategori baru");
      return;
    }
    if (editingId) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const handleEdit = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
      setShopId(category.shop?.id ?? "");
      setEditingId(categoryId);
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setShopId("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Kategori</h1>
          <p className="mt-1 text-slate-600">Kelola kategori produk</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            + Tambah Kategori
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
          </h2>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Nama Kategori *
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Vitamin"
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Deskripsi
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi kategori"
              rows={3}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Shop *
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              disabled={shopsQuery.isLoading}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
            >
              <option value="">{shopsQuery.isLoading ? "Memuat shop..." : "Pilih shop"}</option>
              {(shopsQuery.data ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.isActive ? "" : "(inactive)"}
                </option>
              ))}
            </select>
            {shopsQuery.isError && (
              <span className="text-xs text-red-600">Gagal memuat daftar shop</span>
            )}
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? "Update" : "Tambah"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {categoriesQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Memuat kategori...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center">
          <p className="text-slate-600">Tidak ada kategori</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 font-semibold text-slate-800">{category.name}</h3>
              {category.description && (
                <p className="mb-4 text-sm text-slate-600">{category.description}</p>
              )}
              {category.shop && (
                <p className="mb-2 text-xs text-slate-500">Shop: {category.shop.name}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category.id)}
                  className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(category.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
