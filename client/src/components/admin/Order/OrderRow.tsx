import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { memo } from "react";
import IOrder, { OrderStatus } from "@/interfaces/user.order.interface";
import { StatusDropdown } from "./StatusDropdown";

interface OrderRowProps {
  order: IOrder;
  onViewOrder: (orderId: string) => void;
  onStatusClick: (order: IOrder, status: OrderStatus) => void;
}

export const OrderRow = memo(({ order, onViewOrder, onStatusClick }: OrderRowProps) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderId}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-900">
          <Coins className="h-4 w-4 text-yellow-500 mr-1" />
          {order.paid_coin ?? 0}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(order.created_at).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusDropdown order={order} onStatusClick={onStatusClick} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button
          onClick={() => onViewOrder(order.orderId)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          View
        </Button>
      </td>
    </tr>
  );
});