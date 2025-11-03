import { AdminOrders } from './AdminOrders';
import { CategoryManager } from './CategoryManager';
import { CustomerTable } from './CustomerTable';
import { GuestBookList } from './GuestBookList';
import { ShopRequests } from './ShopRequests';

export const AdminDashboard = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CustomerTable />
      <GuestBookList />
      <CategoryManager />
      <ShopRequests />
      <AdminOrders />
    </div>
  );
};

