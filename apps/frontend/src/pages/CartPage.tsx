import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, removeFromCart, updateCartItemQuantity } from "../features/customer/api";
import { toast } from "../components/Toast";

export const CartPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const cart = cartQuery.data as any;
  const cartItems = cart?.items ?? [];

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId);
      await cartQuery.refetch();
      toast.success("Produk dihapus dari keranjang");
    } catch (error) {
      toast.error("Gagal menghapus produk dari keranjang");
    }
  };

  const updatingIds = new Set<string>();

  const changeQuantity = async (cartItemId: string, nextQty: number) => {
    if (nextQty < 1) return; // guard
    try {
      updatingIds.add(cartItemId);
      // Optimistic UI: mutate local cache before refetch
      queryClient.setQueryData(["cart"], (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((it: any) =>
            it.id === cartItemId ? { ...it, quantity: nextQty } : it,
          ),
        };
      });
      await updateCartItemQuantity(cartItemId, nextQty);
      await cartQuery.refetch();
    } catch (error) {
      toast.error("Gagal memperbarui jumlah produk");
      await cartQuery.refetch();
    } finally {
      updatingIds.delete(cartItemId);
    }
  };

  const totalPrice = cartItems.reduce((total: number, item: any) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Keranjang Belanja</h1>
        <p className="mt-1 text-slate-600">Atur produk dalam keranjang Anda</p>
      </div>

      {cartQuery.isLoading ? (
        <div className="flex items-center justify-center rounded-lg bg-white py-12">
          <p className="text-slate-500">Memuat keranjang...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg bg-white py-16">
          <svg
            className="mb-4 h-16 w-16 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="mb-4 text-lg font-medium text-slate-600">Keranjang Anda kosong</p>
          <Link
            to="/catalog"
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Lanjut Belanja
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-3 rounded-lg bg-white p-6">
              {cartItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 last:border-b-0"
                >
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{item.product.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Rp{" "}
                      {Number(item.product.price).toLocaleString("id-ID", {
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium text-slate-600">Qty</p>
                    <div className="mt-1 flex items-center rounded-md border border-slate-300 bg-white">
                      <button
                        disabled={updatingIds.has(item.id) || item.quantity <= 1}
                        onClick={() => changeQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-slate-600 disabled:opacity-40 hover:bg-slate-100"
                        aria-label="Kurangi"
                      >
                        -
                      </button>
                      <div className="min-w-10 text-center text-sm font-semibold text-slate-800">
                        {item.quantity}
                      </div>
                      <button
                        disabled={updatingIds.has(item.id)}
                        onClick={() => changeQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-slate-600 disabled:opacity-40 hover:bg-slate-100"
                        aria-label="Tambah"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-600">Subtotal</p>
                    <p className="text-lg font-semibold text-blue-600">
                      Rp{" "}
                      {(Number(item.product.price) * item.quantity).toLocaleString("id-ID", {
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="rounded-md p-2 text-slate-400 transition hover:bg-red-100 hover:text-red-500"
                    title="Hapus dari keranjang"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Ringkasan Pesanan</h3>

            <div className="space-y-3 border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal ({cartItems.length} item)</span>
                <span>Rp {totalPrice.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Ongkir</span>
                <span className="font-medium text-slate-800">Dihitung saat checkout</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-800">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                Rp {totalPrice.toLocaleString("id-ID", { minimumFractionDigits: 0 })}
              </span>
            </div>

            <button
              className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              onClick={() => {
                navigate("/checkout");
              }}
            >
              Lanjut ke Checkout
            </button>

            <Link
              to="/catalog"
              className="mt-3 block w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
