import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory } from "../api";
import { fetchCategories } from "../../catalog/api";

export const CategoryManager = () => {
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const [formState, setFormState] = useState({
    shopId: "",
    name: "",
    description: "",
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setFormState({ shopId: "", name: "", description: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMutation.mutate({
      shopId: formState.shopId,
      name: formState.name,
      description: formState.description || undefined,
    });
  };

  if (categoriesQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Memuat kategori...
      </section>
    );
  }

  const categories = categoriesQuery.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">Kelola Kategori</h3>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          ID Toko
          <input
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={formState.shopId}
            onChange={(event) => setFormState((prev) => ({ ...prev, shopId: event.target.value }))}
            placeholder="Masukkan ID toko"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Nama Kategori
          <input
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={formState.name}
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Deskripsi
          <textarea
            className="min-h-[7rem] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, description: event.target.value }))
            }
          />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createMutation.isPending ? "Menambah..." : "Tambah Kategori"}
        </button>
      </form>
      <ul className="grid gap-4">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <strong className="text-sm font-semibold text-slate-800">{category.name}</strong>
              <p className="text-sm text-slate-600">{category.description ?? "-"}</p>
            </div>
            <button
              type="button"
              onClick={() => deleteMutation.mutate(category.id)}
              className="self-start rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
