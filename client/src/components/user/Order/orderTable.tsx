import { useState } from "react";
import IOrder from "@/interfaces/user.order.interface";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/interfaces/orderStatus.type";

interface Props {
  orders: IOrder[];
  onCancel: (orderId: string) => void;
  onViewAddress: (order: IOrder) => void;
  onViewProduct: (orderId: string) => void;
}

export default function OrderTable({ orders, onCancel, onViewAddress,onViewProduct }: Props) {
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending": return "text-orange-500";
      case "packed": return "text-blue-500";
      case "shipped": return "text-purple-500";
      case "delivered": return "text-green-600";
      case "canceled": return "text-red-600";
      default: return "text-gray-700";
    }
  };

  const canCancel = (status: OrderStatus) =>
    status === "pending" || status === "packed";

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Paid Coins</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Reward</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="px-4 py-2">{order.orderId}</td>
                <td className="px-4 py-2">{order.paid_coin}</td>
                <td className={`px-4 py-2 font-semibold ${getStatusColor(order.status as OrderStatus)}`}>
                  {order.status}
                </td>
                <td className="px-4 py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 underline"
                    onClick={() => onViewAddress(order)}
                  >
                    View
                  </button>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="text-blue-500 underline"
                    onClick={() => onViewProduct(order.orderId)}
                  >
                    View
                  </button>

                  {canCancel(order.status as OrderStatus) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="text-red-600 underline"
                          onClick={() => setConfirmOrderId(order.orderId)}
                        >
                          Cancel
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Order</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel order <strong>{order.orderId}</strong>?
                            <br />
                            {order.status === "packed" && (
                              <span className="text-sm text-red-500">
                                Note: Orders that are already shipped refund only partial coins.
                              </span>
                            )}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                          <DialogClose asChild>
                            <Button variant="outline">No</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                onCancel( confirmOrderId || order.orderId);
                                setConfirmOrderId(null);
                              }}
                            >
                              Yes, Cancel
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
