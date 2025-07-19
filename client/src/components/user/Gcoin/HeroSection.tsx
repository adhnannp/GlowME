import { Coins, Gift, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  currentPage: "reward" | "gcoin" | "order";
}

export default function HeroSection({ currentPage }: HeroSectionProps) {
  const navigate = useNavigate();

  const buttonClasses = (page: string) =>
    `flex items-center gap-2 border border-white px-4 py-2 rounded-full transition-colors duration-200 cursor-pointer ${
      currentPage === page
        ? "bg-white text-black"
        : "bg-black text-white hover:bg-gray-900"
    }`;

  return (
    <div className="bg-black text-white py-16 mb-8 text-center rounded-lg">
      <h1 className="text-6xl font-bold mb-12">GlowME</h1>

      <div className="flex justify-center gap-4 mt-8">
        <button
          className={buttonClasses("reward")}
          onClick={() => navigate("/redeem")}
        >
          <Gift size={18} />
          <span>Redeem</span>
        </button>

        <button
          className={buttonClasses("gcoin")}
          onClick={() => navigate("/GCoin")}
        >
          <Coins size={18} />
          <span>Earn LeetCoin</span>
        </button>

        <button
          className={buttonClasses("order")}
          onClick={() => navigate("/order")}
        >
          <Send size={18} />
          <span>View Orders</span>
        </button>
      </div>
    </div>
  );
}
