import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../../components/Toast";
import { fetchCategories, fetchProducts } from "../api";
import { addToCart } from "../../customer/api";
import type { Product } from "../../../types/api";

export const CatalogView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const productsQuery = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => fetchProducts({ categoryId: selectedCategory }),
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addToCart({ productId, quantity: 1 }),
    onSuccess: () => {
      // Invalidate cart query to refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produk berhasil ditambahkan ke keranjang!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Gagal menambahkan produk ke keranjang";
      toast.error(errorMessage);
    },
  });

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate(productId);
  };

  const categories = categoriesQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const activeCategoryName =
    categories.find((category) => category.id === selectedCategory)?.name ?? "Semua Produk";

  return (
    <section className="space-y-4">
      {/* <ToastContainer /> */}
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-800">Katalog</h2>
        <p className="text-sm text-slate-600">
          Pilih kategori untuk melihat produk alat kesehatan yang tersedia.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="flex flex-col gap-3">
          <button
            className={`rounded-md border px-3 py-2 text-left text-sm font-medium transition ${
              !selectedCategory
                ? "border-blue-500 bg-blue-100 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={() => setSelectedCategory(undefined)}
          >
            Semua
          </button>
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                className={`rounded-md border px-3 py-2 text-left text-sm font-medium transition ${
                  isActive
                    ? "border-blue-500 bg-blue-100 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            );
          })}
        </aside>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">{activeCategoryName}</h3>
          {productsQuery.isLoading && <p className="text-sm text-slate-500">Memuat produk...</p>}
          {!productsQuery.isLoading && products.length === 0 && (
            <p className="text-sm text-slate-500">Tidak ada produk yang tersedia.</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                {/* Product Image */}
                <div className="aspect-square w-full overflow-hidden bg-slate-100">
                  <div className="flex h-full w-full items-center justify-center">
                    <svg
                      className="h-16 w-16 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-2 p-4">
                  <h4 className="font-semibold text-slate-800">{product.name}</h4>
                  <p className="text-lg font-semibold text-blue-600">
                    Rp {Number(product.price).toLocaleString("id-ID", { minimumFractionDigits: 0 })}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      className="flex-1 rounded-md border border-blue-500 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                      onClick={() => setSelectedProduct(product)}
                    >
                      View
                    </button>
                    <button
                      className="flex-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={addToCartMutation.isPending || product.stock === 0}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      {addToCartMutation.isPending ? "Menambah..." : "Buy"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <h3 className="text-xl font-semibold text-slate-800">Detail Produk</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Product Image */}
              <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                <div className="flex h-full w-full items-center justify-center">
                  <svg
                    className="h-24 w-24 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-semibold text-slate-800">{selectedProduct.name}</h4>
                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    Rp{" "}
                    {Number(selectedProduct.price).toLocaleString("id-ID", {
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>

                <div>
                  <h5 className="mb-2 font-semibold text-slate-700">Deskripsi</h5>
                  <p className="whitespace-pre-wrap text-slate-600">
                    {selectedProduct.description ?? "Tidak ada deskripsi untuk produk ini."}
                  </p>
                </div>

                <div>
                  <h5 className="mb-2 font-semibold text-slate-700">Stok</h5>
                  <p className="text-slate-600">
                    {selectedProduct.stock > 0 ? (
                      <span className="text-green-600">
                        Tersedia ({selectedProduct.stock} unit)
                      </span>
                    ) : (
                      <span className="text-red-600">Stok habis</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  className="flex-1 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setSelectedProduct(null)}
                >
                  Tutup
                </button>
                <button
                  className="flex-1 rounded-md border border-transparent bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={selectedProduct.stock === 0 || addToCartMutation.isPending}
                  onClick={() => {
                    handleAddToCart(selectedProduct.id);
                    setSelectedProduct(null);
                  }}
                >
                  {addToCartMutation.isPending ? "Menambahkan..." : "Tambah ke Keranjang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
