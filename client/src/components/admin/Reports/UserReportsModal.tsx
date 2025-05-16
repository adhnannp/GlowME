import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReportedUser } from "@/interfaces/admin.report.interface";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ReportedUser;
  onReject: (reportId: string) => void;
  onSendWarning: (reportId: string) => void;
  onRejectAll: () => void;
}

export default function ReportsModal({
  isOpen,
  onClose,
  user,
  onReject,
  onSendWarning,
  onRejectAll,
}: ReportsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reports for {user.reportedUser.username}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-4">
          {user.reports.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            user.reports.map((report) => (
              <div key={report._id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={report.reporter.profile_image} />
                    <AvatarFallback>{report.reporter.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{report.reporter.username}</p>
                    <p className="text-sm text-gray-500">{report.reporter.email}</p>
                  </div>
                </div>
                <p>
                  <strong>Reason:</strong> {report.reason}
                </p>
                <p>
                  <strong>Status:</strong> {report.status}
                </p>
                <p>
                  <strong>Reported on:</strong>{" "}
                  {new Date(report.created_at).toLocaleDateString()}
                </p>
                {report.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button
                      className="bg-[#FF9838] text-white hover:bg-[#FF9838]/90"
                      size="sm"
                      onClick={() => onReject(report._id)}
                    >
                      Reject
                    </Button>
                    <Button
                      className="bg-[#FFC107] text-black hover:bg-[#FFC107]/90"
                      size="sm"
                      onClick={() => onSendWarning(report._id)}
                    >
                      Send Warning
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {user.reports.some((report) => report.status === "pending") && (
            <Button
              className="bg-[#FF9838] text-white hover:bg-[#FF9838]/90"
              onClick={onRejectAll}
            >
              Reject All
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}