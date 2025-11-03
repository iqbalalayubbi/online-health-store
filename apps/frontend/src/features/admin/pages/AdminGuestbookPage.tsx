import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGuestbookEntries, deleteGuestbookEntry } from "../api";
import { toast } from "../../../components/Toast";

export const AdminGuestbookPage = () => {
  const queryClient = useQueryClient();

  const entriesQuery = useQuery({
    queryKey: ["admin-guestbook"],
    queryFn: fetchGuestbookEntries,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGuestbookEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-guestbook"] });
      toast.success("Entry berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus entry");
    },
  });

  const entries = entriesQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Guest Book</h1>
        <p className="mt-1 text-slate-600">Lihat dan kelola feedback dari pengunjung</p>
      </div>

      {entriesQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Memuat guest book...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center">
          <p className="text-slate-600">Tidak ada entry di guest book</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{entry.name}</p>
                  <p className="text-sm text-slate-600">{entry.email}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(entry.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(entry.id)}
                  disabled={deleteMutation.isPending}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Hapus
                </button>
              </div>
              <p className="text-slate-700">{entry.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
