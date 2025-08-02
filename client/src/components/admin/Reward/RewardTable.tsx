import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { listReward, unlistReward } from "@/services/admin/admin.reward.service";
import { useState } from "react";
import ConfirmationModal from "./ConfirmListUnlistReward";

export interface Reward {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  isListed: boolean;
  coin: number;
  created_at: string;
  updated_at: string;
}

interface RewardsTableProps {
  rewards: Reward[];
  loading?: boolean;
  onEdit: (reward: Reward) => void;
  onUpdateRewardStatus: (rewardId: string, shouldList: boolean) => void;
}

export default function RewardsTable({
  rewards,
  loading = false,
  onEdit,
  onUpdateRewardStatus
}: RewardsTableProps) {

    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [action, setAction] = useState<"list" | "unlist">("list");

    const handleListUnlist = (reward: Reward) => {
      setSelectedReward(reward);
      setAction(reward.isListed ? "unlist" : "list");
      setIsConfirmationOpen(true);
    };

    const handleConfirm = async () => {
      if (!selectedReward) return;
      try {
        if (action === "list") {
          await listReward(selectedReward._id);
        } else {
          await unlistReward(selectedReward._id);
        }

        onUpdateRewardStatus(selectedReward._id, action === "list");
      } catch (error) {
        console.error(error);
      } finally {
        setIsConfirmationOpen(false);
        setSelectedReward(null);
      }
    };

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow className="border-b">
          <TableHead className="w-[300px] py-4 px-6 text-left font-medium">
            Product
          </TableHead>
          <TableHead className="py-4 px-6 text-left font-medium">Coin</TableHead>
          <TableHead className="py-4 px-6 text-right font-medium">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-6">
              Loading rewards...
            </TableCell>
          </TableRow>
        ) : rewards.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-6 text-gray-500">
              No rewards found.
            </TableCell>
          </TableRow>
        ) : (
          rewards.map((reward) => (
            <TableRow key={reward._id} className="border-b hover:bg-gray-50">
              <TableCell className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={reward.coverImage || "/placeholder.svg"}
                      alt={reward.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{reward.name}</div>
                    <div className="text-sm text-gray-500">{reward.description}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4 px-6 text-gray-600">{reward.coin}</TableCell>
              <TableCell className="py-4 px-6 text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`px-4 py-1 rounded text-white border-0 ${
                      reward.isListed
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() => handleListUnlist(reward)}
                  >
                    {reward.isListed ? "Unlist" : "List"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-4 py-1 rounded"
                    onClick={() => onEdit(reward)}
                  >
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
    {selectedReward && (
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirm}
        rewardName={selectedReward.name}
        action={action}
      />
    )}
    </>
  );
}
