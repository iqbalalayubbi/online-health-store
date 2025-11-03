import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkout } from "../api";

export const CheckoutForm = () => {
  const queryClient = useQueryClient();
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("Indonesia");
  const [paymentMethod, setPaymentMethod] = useState<"CREDIT_CARD" | "DEBIT_CARD" | "COD">("COD");

  const mutation = useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer-cart"] });
      setShippingAddress("");
      setShippingCity("");
      setShippingCountry("Indonesia");
      setShippingName("");
      setShippingPhone("");
      setShippingPostalCode("");
      setShippingState("");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({
      shippingName,
      shippingPhone: shippingPhone || undefined,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      paymentMethod,
    });
  };

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">Checkout</h3>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Nama Penerima
          <input
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={shippingName}
            onChange={(event) => setShippingName(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Telepon
          <input
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={shippingPhone}
            onChange={(event) => setShippingPhone(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Alamat
          <input
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Kota
          <input
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={shippingCity}
            onChange={(event) => setShippingCity(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Provinsi
          <input
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={shippingState}
            onChange={(event) => setShippingState(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Kode Pos
          <input
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={shippingPostalCode}
            onChange={(event) => setShippingPostalCode(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Negara
          <input
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={shippingCountry}
            onChange={(event) => setShippingCountry(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Metode Pembayaran
          <select
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as typeof paymentMethod)}
          >
            <option value="CREDIT_CARD">Kartu Kredit</option>
            <option value="DEBIT_CARD">Kartu Debit</option>
            <option value="COD">COD</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Memproses..." : "Buat Pesanan"}
        </button>
      </form>
    </section>
  );
};

