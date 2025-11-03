import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const MainLayout = () => {
  const { user, clearAuth } = useAuthStore();

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-800">Online Health Store</h1>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link className="transition-colors hover:text-blue-600" to="/">
            Beranda
          </Link>
          <Link className="transition-colors hover:text-blue-600" to="/catalog">
            Katalog
          </Link>
          {user ? (
            <>
              <Link className="transition-colors hover:text-blue-600" to="/dashboard">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={clearAuth}
                className="rounded-md bg-rose-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="transition-colors hover:text-blue-600" to="/login">
                Login
              </Link>
              <Link className="transition-colors hover:text-blue-600" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Online Health Store
      </footer>
    </div>
  );
};

