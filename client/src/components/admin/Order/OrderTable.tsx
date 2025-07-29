import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

interface Order {
  id: string;
  orderId: string;
  productImage?: string;
  orderedDate: string;
  coins:number
  status: "pending" | "delivered" | "returned" | "shipped";
}

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  delivered: "bg-green-100 text-green-800",
  returned: "bg-red-100 text-red-800",
  shipped: "bg-blue-100 text-blue-800",
};

export function OrdersTable({ orders, onViewOrder }: OrdersTableProps) {
  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coins</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderId}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                  {order.coins ?? 0}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderedDate}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={statusColors[order.status]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}