import type { Product } from "../../../types/api";

interface ProductDetailModalProps {
  product: Product | null;
  isLoading?: boolean;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
}

export const ProductDetailModal = ({
  product,
  isLoading = false,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h3 className="text-xl font-semibold text-slate-800">Detail Produk</h3>
          <button
            onClick={onClose}
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
              <h4 className="text-2xl font-semibold text-slate-800">{product.name}</h4>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                Rp{" "}
                {Number(product.price).toLocaleString("id-ID", {
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>

            <div>
              <h5 className="mb-2 font-semibold text-slate-700">Deskripsi</h5>
              <p className="whitespace-pre-wrap text-slate-600">
                {product.description ?? "Tidak ada deskripsi untuk produk ini."}
              </p>
            </div>

            <div>
              <h5 className="mb-2 font-semibold text-slate-700">Stok</h5>
              <p className="text-slate-600">
                {product.stock > 0 ? (
                  <span className="text-green-600">Tersedia ({product.stock} unit)</span>
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
              onClick={onClose}
            >
              Tutup
            </button>
            <button
              className="flex-1 rounded-md border border-transparent bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={product.stock === 0 || isLoading}
              onClick={() => {
                onAddToCart(product.id);
                onClose();
              }}
            >
              {isLoading ? "Menambahkan..." : "Tambah ke Keranjang"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
