import { ProfileCard } from "./ProfileCard";
import { CartView } from "./CartView";
import { CheckoutForm } from "./CheckoutForm";
import { OrdersList } from "./OrdersList";

export const CustomerDashboard = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ProfileCard />
      <CartView />
      <CheckoutForm />
      <OrdersList />
    </div>
  );
};

