import { Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../features/shared/HomePage";
import { CatalogView } from "../features/catalog/components/CatalogView";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { ProfilePage } from "../pages/ProfilePage";
import { OrdersPage } from "../pages/OrdersPage";
import { OrderDetailPage } from "../pages/OrderDetailPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

// Admin pages
import {
  AdminDashboardPage,
  AdminCustomersPage,
  AdminGuestbookPage,
  AdminCategoriesPage,
  AdminShopRequestsPage,
  AdminShippingPage,
} from "../features/admin/pages";

// Seller pages
import {
  SellerShopSetupPage,
  SellerProductsPage,
  SellerOrdersPage,
} from "../features/seller/pages";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="catalog" element={<CatalogView />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="orders/:orderId" element={<OrderDetailPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      {/* Admin Routes */}
      <Route
        path="admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/customers"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminCustomersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/guestbook"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminGuestbookPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/categories"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminCategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/shop-requests"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminShopRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/shipping"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminShippingPage />
          </ProtectedRoute>
        }
      />

      {/* Seller Routes */}
      <Route
        path="seller"
        element={
          <ProtectedRoute requiredRole="SELLER">
            <SellerShopSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="seller/shop"
        element={
          <ProtectedRoute requiredRole="SELLER">
            <SellerShopSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="seller/products"
        element={
          <ProtectedRoute requiredRole="SELLER">
            <SellerProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="seller/orders"
        element={
          <ProtectedRoute requiredRole="SELLER">
            <SellerOrdersPage />
          </ProtectedRoute>
        }
      />
    </Route>
  </Routes>
);
