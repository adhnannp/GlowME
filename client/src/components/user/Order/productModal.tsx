import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IOrderWithProduct } from "@/interfaces/user.order.interface";

interface Props {
  order: IOrderWithProduct | null;
  onClose: () => void;
}

export default function ProductModal({ order, onClose }: Props) {
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Order ID: <strong>{order.orderId}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Image Section */}
          {order.reward_id.coverImage && (
            <img
              src={order.reward_id.coverImage}
              alt={order.reward_id.name}
              className="w-full max-h-64 object-contain rounded shadow"
            />
          )}

          <div className="space-y-2">
            <p><strong>Product:</strong> {order.reward_id.name}</p>
            <p><strong>Description:</strong> {order.reward_id.description}</p>
            <p><strong>Coins Paid:</strong> {order.paid_coin}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
