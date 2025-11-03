import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { HomePage } from '../features/shared/HomePage';
import { CatalogView } from '../features/catalog/components/CatalogView';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { DashboardPage } from '../features/shared/DashboardPage';

export const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path='catalog' element={<CatalogView />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='register' element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path='dashboard' element={<DashboardPage />} />
      </Route>
    </Route>
  </Routes>
);

