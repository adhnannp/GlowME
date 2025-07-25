import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/user/Reward/Header";
import ProductShowcase from "@/components/user/Reward/product-showcase";
import OrderForm from "@/components/user/Reward/order-form";
import { fetchRewardById } from "@/services/user/user.reward.service"; 
import IReward from "@/interfaces/user.reward.interface"; 

export default function CheckoutPage() {
  const { rewardId } = useParams();
  const [reward, setReward] = useState<IReward | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (rewardId) {
      fetchRewardById(rewardId)
        .then(setReward)
        .catch(() => setReward(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [rewardId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen">
      <Header />
      {reward ? (
        <div className="flex flex-col lg:flex-row">
          <ProductShowcase reward={reward} />
          <OrderForm />
        </div>
      ) : (
        <div className="text-center mt-10 text-xl text-red-500">
          No reward found.
        </div>
      )}
    </div>
  );
}
