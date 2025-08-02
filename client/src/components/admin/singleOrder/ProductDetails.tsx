import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IOrderFull } from "@/interfaces/user.order.interface";

interface ProductDetailProps {
  order: IOrderFull;
}

export default function ProductDetail({ order }: ProductDetailProps) {
  const formatDate = (date: Date | undefined) => {
    return date ? new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "";
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Product Detail</h3>
      <div className="flex items-center space-x-4 p-4 border rounded-lg">
        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
          <Avatar>
            <AvatarImage
              src={order.reward_id.coverImage || "/placeholder.svg?height=40&width=40"}
            />
            <AvatarFallback>
              {order.reward_id.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{order.reward_id.name}</h4>
              <p className="text-sm text-gray-500">GCoin {order.paid_coin}</p>
              <p className="text-sm text-gray-500">
                Order was {order.status === "delivered" ? "delivered" : order.status} on{" "}
                {formatDate(order.edited_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}