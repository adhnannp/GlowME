import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TagConfirmationDialogProps {
  tagName: string;
  action: "list" | "unlist";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TagConfirmationDialog({ tagName, action, onConfirm, onCancel }: TagConfirmationDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Confirm {action === "list" ? "Listing" : "Unlisting"}</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">
        Are you sure you want to {action} the tag "{tagName}"?
      </p>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="bg-[#FF9838] hover:bg-[#e67f26]" onClick={onConfirm}>
          Confirm {action}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}