import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../utils/error";
import { useRegister } from "../hooks";

export const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");
  const [phoneNumber, setPhoneNumber] = useState("");

  const mutation = useRegister();
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({
      email,
      password,
      fullName,
      role,
      phoneNumber: phoneNumber || undefined,
    });
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      navigate("/catalog");
    }
  }, [mutation.isSuccess, navigate]);

  return (
    <form
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-semibold text-slate-800">Daftar</h2>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Nama Lengkap
        <input
          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Email
        <input
          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Password
        <input
          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Nomor Telepon
        <input
          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Peran
        <select
          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={role}
          onChange={(event) => setRole(event.target.value as typeof role)}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="SELLER">Seller</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? "Memproses..." : "Daftar"}
      </button>
      {mutation.error && (
        <p className="text-sm font-medium text-rose-600">
          {getErrorMessage(mutation.error, "Registrasi gagal")}
        </p>
      )}
    </form>
  );
};
