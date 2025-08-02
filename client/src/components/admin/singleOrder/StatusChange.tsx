import { IOrderFull, OrderStatus } from "@/interfaces/user.order.interface";
import { StatusDropdown } from "@/components/admin/singleOrder/StatusDropdown";

interface OrderDetailsProps {
  order: IOrderFull;
  onStatusClick: (order: IOrderFull, status: OrderStatus) => void;
}

export default function StatusChange({ order, onStatusClick }: OrderDetailsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">Order ID:</span>
          <span className="font-medium mr-2">{order.orderId || "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-500 mr-2">Order Status:</span>
          <span className="font-medium">
            <StatusDropdown order={order} onStatusClick={onStatusClick} />
          </span>
        </div>
      </div>
    </div>
  );
}