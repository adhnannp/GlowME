import { Coins, Gift, Send } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="bg-black text-white py-16 mb-8 text-center rounded-lg">
      <h1 className="text-6xl font-bold mb-12">GlowME</h1>

      <div className="flex justify-center gap-4 mt-8">
        <button className="flex items-center gap-2 bg-white border border-white hover:bg-gray-900 text-white px-4 py-2 rounded-full">
          <Gift size={18} className="text-black" />
          <span className="text-black">Redeem</span>
        </button>

        <button className="flex items-center gap-2 bg-black border border-white hover:bg-gray-900 text-white px-4 py-2 rounded-full">
          <Coins size={18} />
          <span>Earn LeetCoin</span>
        </button>

        <button className="flex items-center gap-2 bg-black border border-white hover:bg-gray-900 text-white px-4 py-2 rounded-full">
          <Send size={18} />
          <span>View Orders</span>
        </button>
      </div>
    </div>
  );
}