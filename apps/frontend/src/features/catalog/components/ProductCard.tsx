import type { Product } from "../../../types/api";

interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
  onView: (product: Product) => void;
  onAddToCart: (productId: string) => void;
}

export const ProductCard = ({
  product,
  isLoading = false,
  onView,
  onAddToCart,
}: ProductCardProps) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
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
        {typeof product.averageRating !== "undefined" && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-0.5">
              {/* Simple star visualization using unicode; replace with icons if available */}
              <span className="text-yellow-500">★</span>
              <span className="font-medium text-slate-800">{product.averageRating ?? 0}</span>
            </div>
            <span>({product.feedbackCount ?? 0})</span>
          </div>
        )}
        <p className="text-lg font-semibold text-blue-600">
          Rp {Number(product.price).toLocaleString("id-ID", { minimumFractionDigits: 0 })}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            className="flex-1 rounded-md border border-blue-500 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            onClick={() => onView(product)}
          >
            View
          </button>
          <button
            className="flex-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || product.stock === 0}
            onClick={() => onAddToCart(product.id)}
          >
            {isLoading ? "Menambah..." : "Buy"}
          </button>
        </div>
      </div>
    </article>
  );
};
