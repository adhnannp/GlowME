import { Coins } from "lucide-react"
import type IReward from "@/interfaces/user.reward.interface"

interface ProductShowcaseProps {
  reward: IReward
}

export default function ProductShowcase({ reward }: ProductShowcaseProps) {
  return (
    <div className="lg:w-1/2 p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 order-1 lg:order-2">
          <div className="bg-teal-300 p-4 relative aspect-square flex flex-col justify-center rounded-lg">
            <div className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-medium text-gray-800">
              <Coins className="w-3.5 h-3.5 text-yellow-600" />
              {reward.coin} Glow Coins
            </div>
            <div className="flex justify-center items-center">
              <img
                src={reward.coverImage || "/placeholder.png"}
                alt={reward.name}
                className="w-48 h-48 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
