import { useState, useCallback } from "react";
import IOrder, { OrderStatus } from "@/interfaces/user.order.interface";
import { TableHeader } from "./TableHeader";
import { OrderRow } from "./OrderRow";
import { StatusChangeDialog } from "./StatusChangeDialog";

interface OrdersTableProps {
  orders: IOrder[];
  onViewOrder: (orderId: string) => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  loading: boolean;
}

export function OrdersTable({ orders, onViewOrder, onStatusChange, loading }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStatusClick = useCallback((order: IOrder, status: OrderStatus) => {
    setTimeout(() => {
      setSelectedOrder(order);
      setNextStatus(status);
      setDialogOpen(true);
    }, 0);
  }, []);

  const confirmStatusChange = useCallback(() => {
    if (selectedOrder && nextStatus) {
      onStatusChange(selectedOrder.orderId, nextStatus);
      setDialogOpen(false);
      setSelectedOrder(null);
      setNextStatus(null);
    }
  }, [selectedOrder, nextStatus, onStatusChange]);

  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <TableHeader />
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onViewOrder={onViewOrder}
              onStatusClick={handleStatusClick}
            />
          ))}
        </tbody>
      </table>
      <StatusChangeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nextStatus={nextStatus}
        onConfirm={confirmStatusChange}
        loading={loading}
      />
    </div>
  );
}