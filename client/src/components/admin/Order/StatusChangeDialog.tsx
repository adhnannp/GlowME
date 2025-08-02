import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderStatus } from "@/interfaces/user.order.interface";

interface StatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextStatus: OrderStatus | null;
  onConfirm: () => void;
  loading: boolean;
}

export function StatusChangeDialog({
  open,
  onOpenChange,
  nextStatus,
  onConfirm,
  loading,
}: StatusChangeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
          <DialogDescription>
            Are you sure you want to change the order status to{" "}
            <span className="font-semibold">{nextStatus?.toUpperCase()}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-orange-600 hover:bg-orange-500 text-white"
            disabled={loading}
          >
            {loading ? "Updating..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}