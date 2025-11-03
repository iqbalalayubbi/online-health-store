import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteGuestBookEntry, fetchGuestbook } from "../api";

export const GuestBookList = () => {
  const queryClient = useQueryClient();
  const entriesQuery = useQuery({
    queryKey: ["admin-guestbook"],
    queryFn: fetchGuestbook,
  });

  const mutation = useMutation({
    mutationFn: deleteGuestBookEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-guestbook"] });
    },
  });

  if (entriesQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Memuat buku tamu...
      </section>
    );
  }

  const entries = entriesQuery.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">Buku Tamu</h3>
      <ul className="grid gap-4">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <strong className="text-sm font-semibold text-slate-800">{entry.name}</strong>
              <p className="text-sm text-slate-600">{entry.message}</p>
            </div>
            <button
              type="button"
              onClick={() => mutation.mutate(entry.id)}
              className="self-start rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      {entries.length === 0 && <p className="text-sm text-slate-500">Belum ada entri.</p>}
    </section>
  );
};
