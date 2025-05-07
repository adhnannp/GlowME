import { useState, useEffect } from "react";
import CoinCard from "./CoinCard";
import { getCoinPlans } from "@/services/user/user.coinPlans.service";

export interface CoinPlan {
    _id: string;
    title: string;
    coins: number;
    price: number;
    isListed: boolean;
    created_at?: Date;
    edited_at?: Date;
}

export default function RegularCoinsSection() {
  const [coinPlans, setCoinPlans] = useState<CoinPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinPlans = async () => {
      try {
        const data = await getCoinPlans();
        setCoinPlans(data);
        setLoading(false);
      } catch (err) {
        const error = err as Error
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCoinPlans();
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Buy Glow Coins</h2>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Buy Glow Coins</h2>
        <div className="text-center">No Coin Plan Found </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Buy Glow Coins</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coinPlans.map((plan) => (
          <CoinCard
            key={plan._id}
            id={plan._id}
            title={plan.title}
            coins={plan.coins}
            price={plan.price}
          />
        ))}
      </div>
    </div>
  );
}