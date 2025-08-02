import { useState, useEffect } from "react";
import RewardCard from "./RewardCard";
import { fetchRewards } from "@/services/user/user.reward.service";
import IReward from "@/interfaces/user.reward.interface";

export default function RegularRewardSection() {
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinPlans = async () => {
      try {
        const data = await fetchRewards();
        setRewards(data);
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
        <h2 className="text-2xl font-bold mb-4">Get Rewards</h2>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Get Rewards</h2>
        <div className="text-center">No Reward Found </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Get Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <RewardCard
            key={reward._id}
            id={reward._id}
            name={reward.name}
            image={reward.coverImage}
            coins={reward.coin}
          />
        ))}
      </div>
    </div>
  );
}