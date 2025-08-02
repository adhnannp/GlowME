import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/SideBar/Sidebar";
import RewardsTable ,{Reward} from "@/components/admin/Reward/RewardTable";
import UserHeader from "@/components/admin/users/UserHeader";
import Pagination from "@/components/admin/users/Pagination";
import dataURLtoFile from "@/lib/dataURLtoFile";
import { createReward, getAllRewards, updateReward } from "@/services/admin/admin.reward.service";
import RewardModal from "@/components/admin/Reward/RewardModal";

export default function RewardDashboard() {
  const [filteredRewards, setFilteredRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const itemsPerPage = 10;

  const fetchRewards = async () => {
      setLoading(true);
      try {
        const data = await getAllRewards();
        setFilteredRewards(data.rewards);
      } catch (err) {
        console.error("Failed to fetch rewards:", err);
      } finally {
        setLoading(false);
      }
    };

  const handleUpdateReward = async (updatedReward: Reward) => {
      try {
        setLoading(true);
        const file =
          typeof updatedReward.coverImage === "string" && updatedReward.coverImage.startsWith("data:")
            ? dataURLtoFile(updatedReward.coverImage, "reward.jpg")
            : undefined;

        const updated = await updateReward(updatedReward._id, {
          name: updatedReward.name,
          coin: updatedReward.coin,
          description: updatedReward.description,
          image: file,
        });

        setFilteredRewards((prev) =>
          prev.map((reward) => (reward._id === updated.reward._id ? updated.reward : reward))
        );
      } catch (err) {
        console.error("Failed to update reward:", err);
      } finally {
        setLoading(false);
      }
  };

  const handleEditModalSave = async (data: Omit<Reward, "_id" | "created_at" | "updated_at" | "isListed">) => {
      if (!selectedReward) return;

      const fullReward: Reward = {
        ...data,
        _id: selectedReward._id,
        created_at: selectedReward.created_at,
        updated_at: selectedReward.updated_at,
        isListed: selectedReward.isListed,
      };

      await handleUpdateReward(fullReward);
  };

  const handleRewardStatusUpdate = (rewardId: string, shouldList: boolean) => {
    setFilteredRewards((prev) =>
        prev.map((reward) =>
        reward._id === rewardId ? { ...reward, isListed: shouldList } : reward
        )
    );
  };


  const handleEdit = (reward: Reward) => {
    setSelectedReward(reward);
    setIsEditModalOpen(true);
  };

  const handleAddReward = async (
  newReward: Omit<Reward, "_id" | "created_at" | "updated_at" | "isListed">
  ) => {
  try {
      setLoading(true);  
      if (typeof newReward.coverImage !== "string" || !newReward.coverImage.startsWith("data:")) {
      throw new Error("Invalid image format");
      }  
      const file = dataURLtoFile(newReward.coverImage, "reward.jpg");  
      const data = await createReward({
      name: newReward.name,
      coin: newReward.coin,
      description: newReward.description,
      image: file,
      });  
      setFilteredRewards((prev) => [...prev, data.reward]);
  } catch (err) {
      console.error("Failed to add reward:", err);
  } finally {
      setLoading(false);
  }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRewards = filteredRewards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRewards.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Reward Management</h1>
          <div className="flex items-center space-x-4">
            <UserHeader />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Rewards</h2>
                <p className="text-gray-500 text-sm mt-1">
                  All the rewards with glow coin requirements and images used in the system.
                </p>
              </div>
              <button
                className="bg-[#FF9838] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#e67f26] transition"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Reward
              </button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <RewardsTable
                rewards={currentRewards}
                loading={loading}
                onEdit={handleEdit}
                onUpdateRewardStatus={handleRewardStatusUpdate}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRewards.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />

            <RewardModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSave={handleAddReward}
              title="Add New Reward"
              loading={loading}
            />

            <RewardModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleEditModalSave}
              reward={selectedReward}
              title="Edit Reward"
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}