import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCustomers, setCustomerStatus } from "../api";

export const CustomerTable = () => {
  const queryClient = useQueryClient();
  const customersQuery = useQuery({
    queryKey: ["admin-customers"],
    queryFn: fetchCustomers,
  });

  const mutation = useMutation({
    mutationFn: ({ customerId, isActive }: { customerId: string; isActive: boolean }) =>
      setCustomerStatus(customerId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
    },
  });

  if (customersQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Memuat data customer...
      </section>
    );
  }

  const customers = customersQuery.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">Customers</h3>
      <ul className="grid gap-4">
        {customers.map((customer) => (
          <li
            key={customer.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <strong className="text-sm font-semibold text-slate-800">
                {customer.customerProfile?.fullName ?? customer.email}
              </strong>
              <p className="text-sm text-slate-600">{customer.email}</p>
            </div>
            <button
              type="button"
              onClick={() => mutation.mutate({ customerId: customer.id, isActive: !customer.isActive })}
              className="self-start rounded-md border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-300 hover:bg-blue-50"
            >
              {customer.isActive ? "Nonaktifkan" : "Aktifkan"}
            </button>
          </li>
        ))}
      </ul>
      {customers.length === 0 && <p className="text-sm text-slate-500">Belum ada data customer.</p>}
    </section>
  );
};
