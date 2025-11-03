import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchShopRequests, reviewShopRequest } from "../api";

export const ShopRequests = () => {
  const queryClient = useQueryClient();
  const requestsQuery = useQuery({
    queryKey: ["admin-shop-requests"],
    queryFn: fetchShopRequests,
  });

  const mutation = useMutation({
    mutationFn: ({ requestId, decision }: { requestId: string; decision: "APPROVED" | "REJECTED" }) =>
      reviewShopRequest(requestId, decision),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shop-requests"] });
    },
  });

  if (requestsQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Memuat permintaan toko...
      </section>
    );
  }

  const requests = requestsQuery.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">Permintaan Toko</h3>
      <ul className="grid gap-4">
        {requests.map((request) => (
          <li
            key={request.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <strong className="text-sm font-semibold text-slate-800">{request.proposedName}</strong>
              <p className="text-sm text-slate-600">Status: {request.status}</p>
            </div>
            {request.status === "PENDING" ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => mutation.mutate({ requestId: request.id, decision: "APPROVED" })}
                  className="rounded-md border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-600 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  Setujui
                </button>
                <button
                  type="button"
                  onClick={() => mutation.mutate({ requestId: request.id, decision: "REJECTED" })}
                  className="rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                >
                  Tolak
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Keputusan: {request.status}</p>
            )}
          </li>
        ))}
      </ul>
      {requests.length === 0 && <p className="text-sm text-slate-500">Tidak ada permintaan.</p>}
    </section>
  );
};
