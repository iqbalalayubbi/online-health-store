import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitGuestbookEntry } from "../api";
import { toast } from "../../../components/Toast";

export const GuestbookPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: submitGuestbookEntry,
    onSuccess: () => {
      toast.success("Terima kasih! Pesan Anda telah dikirim.");
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: () => {
      toast.error("Gagal mengirim pesan. Periksa data Anda dan coba lagi.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Nama wajib diisi");
    if (message.trim().length < 5) return toast.error("Pesan minimal 5 karakter");
    mutation.mutate({
      name: name.trim(),
      email: email.trim() || undefined,
      message: message.trim(),
    });
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Buku Tamu</h1>
        <p className="mt-1 text-slate-600">Tinggalkan pesan atau saran Anda untuk kami.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Nama *
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email (opsional)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@contoh.com"
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Pesan *
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Tulis pesan atau masukan Anda..."
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Kirim
          </button>
        </div>
      </form>

      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
        <p>Admin dapat melihat dan menghapus pesan dari halaman Admin → Guestbook.</p>
      </div>
    </div>
  );
};
