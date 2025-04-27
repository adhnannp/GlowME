import { useState, useEffect } from "react";
import api from "@/utils/axios";
import Sidebar from "@/components/admin/SideBar/Sidebar";
import BadgeTable, { type Badge } from "@/components/admin/badges/BadgeTable";
import SearchBar from "@/components/admin/users/SearchBar";
import UserHeader from "@/components/admin/users/UserHeader";
import Pagination from "@/components/admin/users/Pagination";
import BadgeAddModal from "@/components/admin/badges/BadgeAddModal";
import BadgeEditModal from "@/components/admin/badges/BadgeEditModal";
import dataURLtoFile from "@/lib/dataURLtoFile";
import toast from "react-hot-toast";
import { ADMIN_API } from "@/config/adminApi";

export default function BadgeDashboard() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [filteredBadges, setFilteredBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const itemsPerPage = 8;

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/badges`);
      const data = response.data;

      setBadges(data.badges);
      setFilteredBadges(data.badges);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Failed to fetch badges:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBadge = async (updatedBadge: Badge) => {
    try {
      setLoading(true);
  
      const formData = new FormData();
      formData.append("name", updatedBadge.name);
      formData.append("requiredXp", updatedBadge.requiredXp.toString());
      if (typeof updatedBadge.image === "string" && updatedBadge.image.startsWith("data:")) {
        const file = dataURLtoFile(updatedBadge.image, "badge.jpg");
        formData.append("image", file);
      } else if (typeof updatedBadge.image === "string") {
        formData.append("imageUrl", updatedBadge.image);
      }
      const response = await api.patch(`${ADMIN_API.EDIT_BADGE}${updatedBadge._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const badgeFromServer = response.data.badge;
      setBadges((prev) =>
        prev.map((badge) => (badge._id === badgeFromServer._id ? badgeFromServer : badge))
      );
      toast.success("Badge updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update badge");
      console.error("Failed to update badge:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleBadgeUpdate = (updatedBadge: Badge) => {
    setBadges((prev) =>
      prev.map((badge) => (badge._id === updatedBadge._id ? updatedBadge : badge))
    );
    setFilteredBadges((prev) =>
      prev.map((badge) => (badge._id === updatedBadge._id ? updatedBadge : badge))
    );
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = badges.filter((badge) => badge.name.toLowerCase().includes(lowerSearch));
    setFilteredBadges(filtered);
    setCurrentPage(1);
  }, [searchTerm, badges]);

  const handleEdit = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsEditModalOpen(true);
  };

  const handleAddBadge = async (newBadge: Omit<Badge, "_id" | "created_at" | "updated_at" | "isListed">) => {
    try {
      setLoading(true);
  
      const formData = new FormData();
      formData.append("name", newBadge.name);
      formData.append("requiredXp", newBadge.requiredXp.toString());

      if (typeof newBadge.image === "string" && newBadge.image.startsWith("data:")) {
        const file = dataURLtoFile(newBadge.image, "badge.jpg");
        formData.append("image", file);
      } else {
        throw new Error("Invalid image format");
      }
  
      const response = await api.post(ADMIN_API.ADD_BADGE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const createdBadge = response.data.badge;
      setBadges((prev) => [...prev, createdBadge]);
      toast.success("Badge added successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add badge");
      console.error("Failed to add badge:", err);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBadges = filteredBadges.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBadges.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Badge Management</h1>
          <div className="flex items-center space-x-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <UserHeader />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Badges</h2>
                <p className="text-gray-500 text-sm mt-1">
                  All the badges with XP requirements and images used in the system.
                </p>
              </div>
              <button
                className="bg-[#FF9838] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#e67f26] transition"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Badge
              </button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <BadgeTable
                badges={currentBadges}
                loading={loading}
                onEdit={handleEdit}
                onUpdateBadge={handleBadgeUpdate}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredBadges.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      <BadgeAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBadge}
      />

      <BadgeEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateBadge}
        badge={selectedBadge}
      />
    </div>
  );
}