import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'list' | 'unlist';
  gcoinTitle: string;
  onConfirm: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  onOpenChange,
  action,
  gcoinTitle,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm {action === 'list' ? 'Listing' : 'Unlisting'}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to {action} the GCoin "{gcoinTitle}"?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#FF9838] hover:bg-[#e67f26]"
            onClick={onConfirm}
          >
            Confirm {action}
          </Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>
  );
}