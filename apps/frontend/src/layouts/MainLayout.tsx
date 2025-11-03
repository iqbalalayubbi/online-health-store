import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { CartIcon } from "../components/CartIcon";
import { UserMenu } from "../components/UserMenu";

export const MainLayout = () => {
  const { user } = useAuthStore();
  const isCustomer = !user || user.role === "CUSTOMER";
  const isDashboardUser = user && (user.role === "ADMIN" || user.role === "SELLER");

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-800">Online Health Store</h1>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          {/* Show customer menu only for customers */}
          {isCustomer && (
            <>
              <Link className="transition-colors hover:text-blue-600" to="/">
                Beranda
              </Link>
              <Link className="transition-colors hover:text-blue-600" to="/catalog">
                Katalog
              </Link>
              {user && <CartIcon />}
            </>
          )}

          {/* Show dashboard link for admin and seller */}
          {isDashboardUser && (
            <Link
              className="rounded-md px-3 py-2 font-semibold text-white transition bg-blue-600 hover:bg-blue-700"
              to={user.role === "ADMIN" ? "/admin" : "/seller"}
            >
              📊 Dashboard
            </Link>
          )}

          {user ? (
            <>
              <UserMenu />
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
