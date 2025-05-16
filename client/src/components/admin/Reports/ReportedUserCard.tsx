import { MessageCircleWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReportedUser } from "@/interfaces/admin.report.interface";

interface ReportedUserCardProps {
  item: ReportedUser;
  onBan: (userId: string) => void;
  onViewReports: (user: ReportedUser) => void;
}

export default function ReportedUserCard({ item, onBan, onViewReports }: ReportedUserCardProps) {
  const { reportedUser } = item;
  const reportCount = item.reports.length;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={reportedUser.profile_image} />
            <AvatarFallback>{reportedUser.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{reportedUser.username}</h3>
            <p className="text-sm text-gray-500">{reportedUser.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            <span>{reportedUser.coin_balance}</span>
            <span className="ml-1">coins</span>
          </div>
          <div className="text-sm text-gray-500">
            <span>{reportedUser.questions_explored}</span>
            <span className="ml-1">QE</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-1">
          <MessageCircleWarning className="h-4 w-4 text-orange-500 " />
          <span className="text-sm">{reportCount}</span>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewReports(item)}
          >
            View Reports
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBan(reportedUser._id)}
          >
            Ban
          </Button>
        </div>
      </div>
    </div>
  );
}