import { type FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile } from "../api";

export const ProfileCard = () => {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["customer-profile"],
    queryFn: fetchProfile,
  });

  const profile = profileQuery.data;
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [defaultCity, setDefaultCity] = useState("");
  const [defaultState, setDefaultState] = useState("");
  const [defaultZip, setDefaultZip] = useState("");

  useEffect(() => {
    if (!profile) {
      return;
    }
    setFullName(profile.fullName ?? "");
    setPhoneNumber(profile.phoneNumber ?? "");
    setDefaultCity(profile.defaultCity ?? "");
    setDefaultState(profile.defaultState ?? "");
    setDefaultZip(profile.defaultZip ?? "");
  }, [profile]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
      setIsEditing(false);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({
      fullName,
      phoneNumber,
      defaultCity,
      defaultState,
      defaultZip,
    });
  };

  if (profileQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Memuat profil...
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Profil tidak ditemukan.
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-800">Profil</h3>
        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
        >
          {isEditing ? "Batal" : "Ubah"}
        </button>
      </header>
      {!isEditing ? (
        <dl className="grid gap-3 text-sm text-slate-600">
          <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
            <dt className="font-medium text-slate-500">Nama</dt>
            <dd className="text-slate-800">{profile.fullName}</dd>
          </div>
          <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
            <dt className="font-medium text-slate-500">Telepon</dt>
            <dd className="text-slate-800">{profile.phoneNumber ?? "-"}</dd>
          </div>
          <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
            <dt className="font-medium text-slate-500">Kota</dt>
            <dd className="text-slate-800">{profile.defaultCity ?? "-"}</dd>
          </div>
          <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
            <dt className="font-medium text-slate-500">Provinsi</dt>
            <dd className="text-slate-800">{profile.defaultState ?? "-"}</dd>
          </div>
          <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
            <dt className="font-medium text-slate-500">Kode Pos</dt>
            <dd className="text-slate-800">{profile.defaultZip ?? "-"}</dd>
          </div>
        </dl>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Nama
            <input
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Telepon
            <input
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Kota
            <input
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={defaultCity}
              onChange={(event) => setDefaultCity(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Provinsi
            <input
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={defaultState}
              onChange={(event) => setDefaultState(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Kode Pos
            <input
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={defaultZip}
              onChange={(event) => setDefaultZip(event.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      )}
    </section>
  );
};
