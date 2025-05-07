import { useState, useEffect } from "react";
import api from "@/utils/axios";
import Sidebar from "@/components/admin/SideBar/Sidebar";
import UserTable from "@/components/admin/users/UserTable";
import SearchBar from "@/components/admin/users/SearchBar";
import UserHeader from "@/components/admin/users/UserHeader";
import Pagination from "@/components/admin/users/Pagination";
import BanUserModal from "@/components/admin/users/BanUserModal";
import UnbanUserModal from "@/components/admin/users/UnbanUserModal";
import type { User } from "@/interfaces/auth.interface";

export interface ApiResponse {
  message: string;
  users: User[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    perPage: number;
  };
}

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageFromUrl = params.get("page");
    const page = pageFromUrl ? parseInt(pageFromUrl) : 1;
    if (!isNaN(page) && page >= 1) {
      setCurrentPage(page);
    }
  }, []);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "";
      const response = await api.get(`/admin/users?page=${page}${searchQuery}`);
      const data: ApiResponse = response.data;

      setUsers(data.users);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setTotalUsers(data.pagination.totalItems);
      setItemsPerPage(data.pagination.perPage);
      setError(null);

      const params = new URLSearchParams(window.location.search);
      params.set("page", data.pagination.currentPage.toString());
      window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchTerm]);

  const handleBanUser = (user: User) => {
    setSelectedUser(user);
    setIsBanModalOpen(true);
  };

  const handleUnbanUser = (user: User) => {
    setSelectedUser(user);
    setIsUnbanModalOpen(true);
  };

  const confirmBanUser = async (userId: string, duration: string) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/ban`, { duration });
      if (!response) {
        throw new Error("Failed to ban user");
      }
      setUsers(users.map((user) => (user._id === userId ? { ...user, isBlock: true } : user)));
    } catch (err) {
      console.error(`Error banning user: ${err}`);
      setError(err instanceof Error ? err.message : "Failed to ban user");
    }
  };

  const confirmUnbanUser = async (userId: string) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/unban`);
      if (!response) {
        throw new Error("Failed to unban user");
      }
      setUsers(users.map((user) => (user._id === userId ? { ...user, isBlock: false } : user)));
    } catch (err) {
      console.error(`Error unbanning user: ${err}`);
      setError(err instanceof Error ? err.message : "Failed to unban user");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">User tables</h1>
          <div className="flex items-center space-x-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <UserHeader />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Users</h2>
                <p className="text-gray-500 text-sm mt-1">
                  All the users that are registered on your store are displayed in data tables with some of their basic
                  information and history.
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            <div className="rounded-lg border overflow-hidden">
              <UserTable
                users={users}
                loading={loading}
                onBanUser={handleBanUser}
                onUnbanUser={handleUnbanUser}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalUsers}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>

      <BanUserModal
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        onConfirm={confirmBanUser}
        user={selectedUser}
      />

      <UnbanUserModal
        isOpen={isUnbanModalOpen}
        onClose={() => setIsUnbanModalOpen(false)}
        onConfirm={confirmUnbanUser}
        user={selectedUser}
      />
    </div>
  );
}