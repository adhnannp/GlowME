import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QualityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedQuality: 'good' | 'correct' | null;
  onConfirm: () => void;
  loading: boolean;
}

export default function QualityDialog({
  open,
  onOpenChange,
  selectedQuality,
  onConfirm,
  loading,
}: QualityDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#191c24] rounded-2xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl relative">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-2">Confirm Answer Quality Update</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to mark this answer as "
          <span className="font-medium">{selectedQuality}</span>"? You cannot downgrade this later.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-black hover:bg-gray-700 text-white"
          >
            {loading ? 'Updating...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
