import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rewardName: string;
  action: "list" | "unlist";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  rewardName,
  action,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm {action === "list" ? "List" : "Unlist"} Reward</DialogTitle>
          <DialogDescription>
            Are you sure you want to {action} the reward "{rewardName}"?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={action === "list" ? "success" : "destructive"}
            onClick={onConfirm}
          >
            {action === "list" ? "List" : "Unlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}