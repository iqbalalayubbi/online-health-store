import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { AdminDashboard } from '../admin/components/Dashboard';
import { CustomerDashboard } from '../customer/components/Dashboard';
import { SellerDashboard } from '../seller/components/Dashboard';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (user.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (user.role === 'SELLER') {
    return <SellerDashboard />;
  }

  if (user.role === 'CUSTOMER') {
    return <CustomerDashboard />;
  }

  return null;
};

