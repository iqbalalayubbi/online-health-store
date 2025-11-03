import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, markOrderShipped } from "../api";

export const AdminOrders = () => {
  const queryClient = useQueryClient();
  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });

  const [shipmentState, setShipmentState] = useState<Record<string, { courier: string; trackingNumber: string }>>({});

  const mutation = useMutation({
    mutationFn: ({ orderId, courier, trackingNumber }: { orderId: string; courier?: string; trackingNumber?: string }) =>
      markOrderShipped(orderId, { courier, trackingNumber }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setShipmentState((prev) => ({ ...prev, [variables.orderId]: { courier: "", trackingNumber: "" } }));
    },
  });

  if (ordersQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Memuat pesanan...
      </section>
    );
  }

  const orders = ordersQuery.data ?? [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>, orderId: string) => {
    event.preventDefault();
    const state = shipmentState[orderId] ?? { courier: "", trackingNumber: "" };
    mutation.mutate({ orderId, courier: state.courier, trackingNumber: state.trackingNumber });
  };

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">Pengiriman Pesanan</h3>
      <ul className="grid gap-4">
        {orders.map((order) => {
          const state = shipmentState[order.id] ?? { courier: "", trackingNumber: "" };
          return (
            <li
              key={order.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <strong className="text-sm font-semibold text-slate-800">{order.orderNumber}</strong>
                <p className="text-sm text-slate-600">Status: {order.status}</p>
              </div>
              {order.status === "APPROVED" || order.status === "PENDING" ? (
                <form className="flex flex-wrap items-center gap-2" onSubmit={(event) => handleSubmit(event, order.id)}>
                  <input
                    className="w-32 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Kurir"
                    value={state.courier}
                    onChange={(event) =>
                      setShipmentState((prev) => ({
                        ...prev,
                        [order.id]: { ...state, courier: event.target.value },
                      }))
                    }
                  />
                  <input
                    className="w-40 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="No Resi"
                    value={state.trackingNumber}
                    onChange={(event) =>
                      setShipmentState((prev) => ({
                        ...prev,
                        [order.id]: { ...state, trackingNumber: event.target.value },
                      }))
                    }
                  />
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {mutation.isPending ? "Memproses..." : "Kirim"}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-slate-500">
                  Dikirim via {order.shipment?.courier ?? "-"}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
