import { useState } from "react";
import { createFeedback, type CreateFeedbackPayload } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../../components/Toast";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  productName?: string;
  onSubmitted?: (productId: string) => void;
}

export const FeedbackModal = ({
  isOpen,
  onClose,
  productId,
  productName,
  onSubmitted,
}: FeedbackModalProps) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: (payload: CreateFeedbackPayload) => createFeedback(payload),
    onSuccess: () => {
      toast.success("Feedback berhasil dikirim");
      queryClient.invalidateQueries({ queryKey: ["product-feedback", productId] });
      if (productId) {
        onSubmitted?.(productId);
      }
      onClose();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.response?.data?.error || "Gagal mengirim feedback";
      toast.error(message);
    },
  });

  if (!isOpen || !productId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ productId, rating, comment: comment.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">Berikan Feedback</h2>
        {productName && (
          <p className="mb-4 text-sm text-slate-600">
            Produk: <strong>{productName}</strong>
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`h-8 w-8 rounded-md border text-sm font-medium transition ${rating >= star ? "bg-yellow-400 border-yellow-500 text-white" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Komentar (opsional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Tuliskan pengalaman kamu dengan produk ini"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
