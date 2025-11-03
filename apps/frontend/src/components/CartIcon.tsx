import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "../features/customer/api";

export const CartIcon = () => {
  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const cart = cartQuery.data as any;
  const cartItemCount = cart?.items?.length ?? 0;

  return (
    <Link
      to="/cart"
      className="relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {cartItemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
          {cartItemCount}
        </span>
      )}
    </Link>
  );
};
