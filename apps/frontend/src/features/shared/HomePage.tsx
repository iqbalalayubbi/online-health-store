import { CatalogView } from '../catalog/components/CatalogView';

export const HomePage = () => {
  return (
    <div className="grid gap-6">
      <section className="space-y-4 rounded-2xl bg-white p-8 shadow-lg shadow-slate-200">
        <h2 className="text-2xl font-semibold text-slate-800">Toko Alat Kesehatan Online</h2>
        <p className="text-slate-600">
          Platform yang menghubungkan admin, penjual, dan pelanggan untuk menjual dan membeli alat
          kesehatan dengan mudah.
        </p>
      </section>
      <CatalogView />
    </div>
  );
};

