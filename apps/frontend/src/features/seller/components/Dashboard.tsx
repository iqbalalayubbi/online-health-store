import { ProductManager } from './ProductManager';
import { SellerOrders } from './SellerOrders';
import { ShopRequestForm } from './ShopRequestForm';

export const SellerDashboard = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ShopRequestForm />
      <ProductManager />
      <SellerOrders />
    </div>
  );
};

