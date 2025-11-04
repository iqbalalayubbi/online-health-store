import { Link } from "react-router-dom";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginRequiredModal = ({ isOpen, onClose }: LoginRequiredModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold text-slate-800">Login Diperlukan</h2>

        {/* Message */}
        <p className="text-center text-sm text-slate-600">
          Silakan login atau buat akun terlebih dahulu untuk menambahkan produk ke keranjang.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Link
            to="/login"
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700"
            onClick={onClose}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="flex-1 rounded-md border border-blue-600 px-4 py-2 text-center text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            onClick={onClose}
          >
            Buat Akun
          </Link>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
