import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitShopRequest } from "../api";

export const ShopRequestForm = () => {
  const [proposedName, setProposedName] = useState("");
  const [proposedDescription, setProposedDescription] = useState("");
  const [details, setDetails] = useState("");
  const mutation = useMutation({
    mutationFn: submitShopRequest,
    onSuccess: () => {
      setProposedName("");
      setProposedDescription("");
      setDetails("");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({
      proposedName,
      proposedDescription: proposedDescription || undefined,
      details: details || undefined,
    });
  };

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">Ajukan Toko Baru</h3>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Nama Toko
          <input
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={proposedName}
            onChange={(event) => setProposedName(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Deskripsi
          <textarea
            className="min-h-[7rem] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={proposedDescription}
            onChange={(event) => setProposedDescription(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Catatan Tambahan
          <textarea
            className="min-h-[7rem] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Mengirim..." : "Kirim Permintaan"}
        </button>
        {mutation.error && (
          <p className="text-sm font-medium text-rose-600">Gagal mengirim permintaan toko.</p>
        )}
        {mutation.isSuccess && (
          <p className="text-sm font-medium text-emerald-600">Permintaan berhasil dikirim.</p>
        )}
      </form>
    </section>
  );
};
