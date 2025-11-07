import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchShopRequests, approveShopRequest, rejectShopRequest } from "../api";
import { toast } from "../../../components/Toast";

export const AdminShopRequestsPage = () => {
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: ["admin-shop-requests"],
    queryFn: fetchShopRequests,
  });

  const approveMutation = useMutation({
    mutationFn: approveShopRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shop-requests"] });
      toast.success("Shop request approved");
    },
    onError: () => {
      toast.error("Gagal approve shop request");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectShopRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shop-requests"] });
      toast.success("Shop request rejected");
    },
    onError: () => {
      toast.error("Gagal reject shop request");
    },
  });

  const requests = (requestsQuery.data ?? []) as any[];
  const pendingRequests = requests.filter((r) => r.status === "PENDING");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Persetujuan Shop</h1>
        <p className="mt-1 text-slate-600">Kelola permintaan pembuatan shop dari seller</p>
      </div>

      {requestsQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Memuat shop requests...</p>
        </div>
      ) : pendingRequests.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center">
          <p className="text-slate-600">Tidak ada pending requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{request.businessName}</p>
                  <p className="text-sm text-slate-600">{request.sellerEmail}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(request.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                  Pending
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approveMutation.mutate(request.id)}
                  disabled={approveMutation.isPending}
                  className="flex-1 rounded-md bg-green-600 px-3 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectMutation.mutate(request.id)}
                  disabled={rejectMutation.isPending}
                  className="flex-1 rounded-md bg-red-600 px-3 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {requests.length > pendingRequests.length && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Processed Requests</h2>
          <div className="space-y-2">
            {requests
              .filter((r) => r.status !== "PENDING")
              .map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-medium text-slate-800">{request.businessName}</p>
                    <p className="text-sm text-slate-600">{request.sellerEmail}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      request.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
