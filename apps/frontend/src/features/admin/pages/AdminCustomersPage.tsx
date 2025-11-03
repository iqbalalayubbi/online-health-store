import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCustomers, deleteCustomer } from "../api";
import { toast } from "../../../components/Toast";

export const AdminCustomersPage = () => {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ["admin-customers"],
    queryFn: fetchCustomers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("Customer berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus customer");
    },
  });

  const customers = customersQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Manajemen Customer</h1>
        <p className="mt-1 text-slate-600">Kelola semua customer terdaftar</p>
      </div>

      {customersQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Memuat customer...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center">
          <p className="text-slate-600">Tidak ada customer terdaftar</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Nama Lengkap
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Telepon
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-800">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{customer.fullName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.phoneNumber || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteMutation.mutate(customer.id)}
                      disabled={deleteMutation.isPending}
                      className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
