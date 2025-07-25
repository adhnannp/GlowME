import { Coins, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CoinCardProps {
  name: string;
  coins: number;
  image?: string;
  id: string;
}

export default function RewardCard({ id, name, image, coins }: CoinCardProps) {
  const navigate = useNavigate();
  const handleBuyClick = async () => {
      navigate(`/redeem/${id}`)
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-200 p-2 flex justify-center items-center">
      {image ? (
        <img
          src={image}
          alt="Reward"
          className="w-[200px] h-[200px] object-contain"
        />
      ) : (
        <Gift className="text-yellow-500 w-[200px] h-[200px]" />
      )}
      </div>
      <div className="p-3 flex justify-between items-center">
        <div className="text-sm text-gray-600">{name}</div>
        <button
          className="bg-black text-white text-xs px-2 py-1 rounded disabled:opacity-50 cursor-pointer"
          onClick={handleBuyClick}
        >
          <div className="flex items-center  text-s">
            <Coins className="text-yellow-500 w-[15px] h-[15px]" />
            {coins}
          </div>
        </button>
      </div>
    </div>
  );
}