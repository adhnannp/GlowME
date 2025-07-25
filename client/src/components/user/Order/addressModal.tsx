import IOrder from "@/interfaces/user.order.interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  order: IOrder;
  onClose: () => void;
}

export default function AddressModal({ order, onClose }: Props) {
  const { address } = order;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Address for Order: {order.orderId}</DialogTitle>
          <DialogDescription className="mt-2">
            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Name:</strong> {address.name}</p>
              <p><strong>Phone:</strong> {address.phone}</p>
              <p><strong>Pincode:</strong> {address.pincode}</p>
              <p><strong>Address:</strong> {address.address}</p>
              {address.landmark && <p><strong>Landmark:</strong> {address.landmark}</p>}
              {address.state && <p><strong>State:</strong> {address.state}</p>}
              <p><strong>Country:</strong> {address.country}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogClose
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
