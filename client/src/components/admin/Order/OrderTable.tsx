import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { changeOrderStatus } from "@/services/admin/admin.order.service";
import toast from "react-hot-toast";
import IOrder from "@/interfaces/user.order.interface";

interface OrdersTableProps {
  orders: IOrder[];
  setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>;
  onViewOrder: (orderId: string) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  packed:"bg-yellow-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
  shipped: "bg-blue-100 text-blue-800",
};

function getNextStatusOptions(currentStatus: IOrder["status"]): IOrder["status"][] {
  switch (currentStatus) {
    case "pending":
      return ["packed", "shipped", "delivered"];
    case "packed":
      return ["shipped", "delivered"];
    case "shipped":
      return ["delivered"];
    default:
      return [];
  }
}

export function OrdersTable({ orders,setOrders,onViewOrder }: OrdersTableProps) {

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [nextStatus, setNextStatus] = useState<IOrder["status"] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStatusClick = (order: IOrder, status: IOrder["status"]) => {
    setSelectedOrder(order);
    setNextStatus(status);
    setDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (selectedOrder && nextStatus) {
      try {
        const updatedOrder = await changeOrderStatus(selectedOrder.orderId, nextStatus);
        
        setDialogOpen(false);
        setSelectedOrder(null);
        setNextStatus(null);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, status: nextStatus }
              : order
          )
        );
        toast.success(`Order status changed to ${updatedOrder.status.toUpperCase()}`);
      } catch (error) {
        setDialogOpen(false);
        setSelectedOrder(null);
        setNextStatus(null);
        toast.error("Failed to update order status");
      }
    }
  };

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
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderId}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                  {order.paid_coin ?? 0}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getNextStatusOptions(order.status).length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge className={`${statusColors[order.status]} cursor-pointer`}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {getNextStatusOptions(order.status).map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusClick(order, status)}
                        >
                          {status.toUpperCase()}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Badge className={statusColors[order.status]}>
                    {order.status.toUpperCase()}
                  </Badge>
                )}
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the order status to{" "}
              <span className="font-semibold">{nextStatus?.toUpperCase()}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange} className="bg-orange-600 hover:bg-orange-500 text-white">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}