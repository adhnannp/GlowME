import { Coins } from "lucide-react";

interface CoinCardProps {
  title: string;
  coins: number;
  price: number;
  id:string;
}

export default function CoinCard({ id, title, coins , price }: CoinCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-800 p-6 flex flex-col justify-center items-center">
        <Coins className="text-yellow-500 w-[80px] h-[80px]" />
        <div className="text-yellow-500 text-2xl font-bold">{coins}</div>
      </div>
      <div className="p-3 flex justify-between items-center">
        <div className="text-sm text-gray-600">{title}</div>
        <button className="bg-black text-white text-xs px-2 py-1 rounded">{`PAY ₹${price}`}</button>
      </div>
    </div>
  );
}