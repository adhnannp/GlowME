import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coins } from "lucide-react";
import { IOrderFull } from "@/interfaces/user.order.interface";

interface UserDetailsProps {
  order: IOrderFull;
}

export default function UserDetails({ order }: UserDetailsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">User Details</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={order.user_id.profile_image || "/placeholder.svg?height=40&width=40"}
            />
            <AvatarFallback>
              {order.user_id.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{order.user_id.username}</div>
            <div className="text-sm text-gray-500">{order.user_id.email}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-gray-500 min-w-[60px]">GCoin:</span>
            <div className="flex items-center ml-2">
              <Coins className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{order.user_id.coin_balance ?? 0}</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 min-w-[60px]">XP:</span>
            <span className="ml-2">{order.user_id.xp ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}