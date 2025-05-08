import { Coins } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { createCheckoutSession } from "@/services/user/user.coinPlans.service";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CoinCardProps {
  title: string;
  coins: number;
  price: number;
  id: string;
}

export default function CoinCard({ id, title, coins, price }: CoinCardProps) {
  const [loading, setLoading] = useState(false);

  const handleBuyClick = async () => {
    setLoading(true);
    try {
      const sessionId = await createCheckoutSession(id);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error initiating checkout:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-800 p-6 flex flex-col justify-center items-center">
        <Coins className="text-yellow-500 w-[80px] h-[80px]" />
        <div className="text-yellow-500 text-2xl font-bold">{coins}</div>
      </div>
      <div className="p-3 flex justify-between items-center">
        <div className="text-sm text-gray-600">{title}</div>
        <button
          className="bg-black text-white text-xs px-2 py-1 rounded disabled:opacity-50 cursor-pointer"
          onClick={handleBuyClick}
          disabled={loading}
        >
          {loading ? "Processing..." : `PAY ₹${price}`}
        </button>
      </div>
    </div>
  );
}