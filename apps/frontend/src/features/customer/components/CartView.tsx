import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, fetchCart, removeFromCart } from "../api";
import { type FormEvent, useState } from "react";

interface AddToCartFormProps {
  onSubmit: (payload: { productId: string; quantity: number }) => void;
  isSubmitting: boolean;
}

const AddToCartForm = ({ onSubmit, isSubmitting }: AddToCartFormProps) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productId) return;
    onSubmit({ productId, quantity });
  };

  return (
    <form className="flex flex-wrap items-center gap-3" onSubmit={handleSubmit}>
      <input
        className="w-36 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        placeholder="ID Produk"
        value={productId}
        onChange={(event) => setProductId(event.target.value)}
        required
      />
      <input
        className="w-24 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        type="number"
        min={1}
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Menambah..." : "Tambah"}
      </button>
    </form>
  );
};

export const CartView = () => {
  const queryClient = useQueryClient();
  const cartQuery = useQuery({
    queryKey: ["customer-cart"],
    queryFn: fetchCart,
  });

  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-cart"] });
    },
  });

  const handleAdd = (payload: { productId: string; quantity: number }) => {
    addMutation.mutate(payload);
  };

  const handleRemove = (cartItemId: string) => {
    removeMutation.mutate(cartItemId);
  };

  if (cartQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Memuat keranjang...
      </section>
    );
  }

  const cart = cartQuery.data;

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Keranjang Belanja</h3>
      </header>
      <AddToCartForm onSubmit={handleAdd} isSubmitting={addMutation.isPending} />
      <ul className="grid gap-4">
        {cart?.items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <strong className="text-sm text-slate-800">{item.product.name}</strong>
              <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
              <p className="text-sm font-semibold text-blue-600">
                Rp{" "}
                {Number(item.product.price).toLocaleString("id-ID", {
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="self-start rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      {cart?.items.length === 0 && (
        <p className="text-sm text-slate-500">Keranjang masih kosong.</p>
      )}
    </section>
  );
};
