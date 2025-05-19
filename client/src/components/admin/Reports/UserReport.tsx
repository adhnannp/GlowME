import { useState, useEffect } from "react";
import ConfirmationModal from "./ReportConfirmationModal";
import ReportedUserCard from "./ReportedUserCard";
import ReportsModal from "./UserReportsModal";
import { ReportedUser } from "@/interfaces/admin.report.interface";
import { fetchReports, banUser, rejectReport, sendWarning, rejectAllReports } from "@/services/admin/admin.userReport.service";
import BanUserModal from "../users/BanUserModal";

export default function UsersReport() {
  const [reportedUsers, setReportedUsers] = useState<ReportedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ReportedUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banUserTarget, setBanUserTarget] = useState<ReportedUser | null>(null);
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmButtonColor?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await fetchReports();
        setReportedUsers(response.reports);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleBanUser = async (userId: string, duration: string) => {
    await banUser(userId, duration);
    setReportedUsers((prev) =>
      prev.filter((user) => user.reportedUser._id !== userId)
    );
  };


  const handleRejectReport = async (reportId: string) => {
    await rejectReport(reportId);
    setSelectedUser((prev) =>
      prev
        ? {
            ...prev,
            reports: prev.reports.map((report) =>
              report._id === reportId ? { ...report, status: "rejected" } : report
            ),
          }
        : prev
    );
  };

  const handleSendWarning = async (reportId: string) => {
    await sendWarning(reportId);
  };

  const handleRejectAll = async () => {
    if (!selectedUser) return;
    await rejectAllReports(selectedUser.reportedUser._id);
    setSelectedUser((prev) =>
      prev
        ? {
            ...prev,
            reports: prev.reports.map((report) =>
              report.status === "pending" ? { ...report, status: "rejected" } : report
            ),
          }
        : prev
    );
  };

  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmButtonColor?: string
  ) => {
    setConfirmation({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmation((prev) => ({ ...prev, isOpen: false }));
      },
      confirmButtonColor,
    });
  };

  const confirmBanUser = (userId: string) => {
    const user = reportedUsers.find((u) => u.reportedUser._id === userId);
    if (user) {
      setBanUserTarget(user);
      setIsBanModalOpen(true);
    }
  };


  const confirmRejectReport = (reportId: string) => {
    showConfirmation(
      "Reject Report",
      "Are you sure you want to reject this report?",
      () => handleRejectReport(reportId),
      "bg-[#FF9838]"
    );
  };

  const confirmSendWarning = (reportId: string) => {
    showConfirmation(
      "Send Warning",
      "Are you sure you want to send a warning for this report?",
      () => handleSendWarning(reportId),
      "bg-[#FFC107]"
    );
  };

  const confirmRejectAll = () => {
    showConfirmation(
      "Reject All Reports",
      `Are you sure you want to reject all pending reports for ${selectedUser?.reportedUser.username}?`,
      handleRejectAll,
      "bg-[#FF9838]"
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (reportedUsers.length === 0) {
    return <div>No reported users found.</div>;
  }

  return (
    <div className="space-y-4">
      {reportedUsers.map((item) => (
        <ReportedUserCard
          key={item.reportedUser._id}
          item={item}
          onBan={confirmBanUser}
          onViewReports={() => {
            setSelectedUser(item);
            setIsModalOpen(true);
          }}
        />
      ))}
      {selectedUser && (
        <ReportsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onReject={confirmRejectReport}
          onSendWarning={confirmSendWarning}
          onRejectAll={confirmRejectAll}
        />
      )}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmButtonColor={confirmation.confirmButtonColor}
      />
      {banUserTarget && (
        <BanUserModal
          isOpen={isBanModalOpen}
          onClose={() => {
            setIsBanModalOpen(false);
            setBanUserTarget(null);
          }}
          onConfirm={handleBanUser}
          user={banUserTarget.reportedUser}
        />
      )}
    </div>
  );
}