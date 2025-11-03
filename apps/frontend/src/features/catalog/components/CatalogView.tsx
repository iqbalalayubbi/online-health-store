import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../../components/Toast";
import { fetchCategories, fetchProducts } from "../api";
import { addToCart } from "../../customer/api";
import { ProductCard } from "./ProductCard";
import { ProductDetailModal } from "./ProductDetailModal";
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
              <ProductCard
                key={product.id}
                product={product}
                isLoading={addToCartMutation.isPending}
                onView={setSelectedProduct}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isLoading={addToCartMutation.isPending}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </section>
  );
};
