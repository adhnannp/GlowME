// src/components/ReportUserModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import api from "@/utils/axios";
import { handleApiError } from "@/utils/errorHandling";
import { AxiosError } from "axios";

interface ReportUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const ReportUserModal = ({ open, onClose, userId }: ReportUserModalProps) => {
  const [reportReason, setReportReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleReportSubmit = async () => {
    if (!reportReason) {
      toast.error("Please select a report reason");
      return;
    }

    setLoading(true);
    try {
      await api.post("/report", {
        userId: userId,
        reason: reportReason,
      });
      toast.success("User reported successfully");
      handleClose();
    } catch (error) {
      const err = handleApiError(error as AxiosError | Error, 'Failed to report user');
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReportReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to report this user?</p>

          {/* Radio buttons for report reasons */}
          <div className="space-y-2">
            {[
              "Harassment",
              "Sexual Abuse",
              "Content Violation",
              "Spam",
              "Impersonation",
              "Other",
            ].map((reason) => (
              <label key={reason} className="flex items-center">
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={reportReason === reason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mr-2"
                  disabled={loading}
                />
                {reason}
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300"
              onClick={handleReportSubmit}
              disabled={!reportReason || loading}
            >
              {loading ? "Reporting..." : "Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUserModal;