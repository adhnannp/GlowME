import { useState, useEffect } from "react";
import { Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Header from "@/components/user/Header/Header";
import Sidebar from "@/components/user/SideBar/SideBar";
import { UserWithBadge } from "@/interfaces/auth.interface";
import api from "@/utils/axios";
import { Link } from "react-router-dom";
import { useDebounce } from "@/components/customHooks/useDebounce";

interface UserProps {
  user: UserWithBadge;
}

const UserCard: React.FC<UserProps> = ({ user }) => {
  return (
    <Link to={`/user/${user._id}`} className="block">
      <Card className="p-4 flex flex-col hover:bg-gray-50 transition-colors">
        <div className="flex items-center">
          <img
            src={user.profile_image || "/browserIcons/person_icon.png"}
            alt={`${user.username}'s avatar`}
            className="w-12 h-12 rounded-full mr-3 flex-shrink-0 object-cover"
          />
          <div className="flex items-center">
            <span className="font-medium mr-2">{user.username}</span>
            {user?.currentBadge?.image && (
              <img
                src={`${import.meta.env.VITE_BASE_URL}${user.currentBadge.image}`}
                alt="Badge"
                className="w-5 h-5"
              />
            )}
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-green-500">★</span>
          <span className="ml-1">XP {user.xp}</span>
        </div>
      </Card>
    </Link>
  );
};

export default function Connect() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [users, setUsers] = useState<UserWithBadge[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const usersPerPage = 12;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const searchQuery = debouncedSearchTerm
        ? `&search=${encodeURIComponent(debouncedSearchTerm)}`
        : "";
      const response = await api.get(`/users?page=${page}&limit=${usersPerPage}${searchQuery}`);
      const data = response.data;

      setUsers(Array.isArray(data.users) ? data.users : []);
      setTotalUsers(data.total || 0);
      setTotalPages(Math.ceil(data.total / usersPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); 
    fetchUsers(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isLastPage = users.length < usersPerPage || currentPage * usersPerPage >= totalUsers;

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        activePage="Connect"
        setSidebarExpanded={setSidebarExpanded}
      />

      <div className="flex-1 flex flex-col">
        <Header sidebarExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-normal">connect to others</h2>
              <Button variant="outline" size="icon" className="rounded-full">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-6">
              <div className="relative w-80 mb-4">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-4 pr-10 py-2 border rounded-md"
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="users">
                <TabsList className="bg-transparent w-1/3 justify-start rounded-none p-0 h-auto gap-3">
                  <TabsTrigger
                    value="users"
                    className="px-6 py-1.5 rounded-full data-[state=active]:bg-black data-[state=active]:text-white transition"
                  >
                    Users
                  </TabsTrigger>
                  <TabsTrigger
                    value="community"
                    className="px-6 py-1.5 rounded-full data-[state=active]:bg-black data-[state=active]:text-white transition"
                  >
                    Community
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="mt-6">
                  {loading ? (
                    <div className="text-center py-12">Loading...</div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No users found</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((user) => (
                          <UserCard key={user._id} user={user} />
                        ))}
                      </div>

                      <div className="flex justify-center mt-8 gap-2">
                        <Button
                          onClick={handlePrevious}
                          disabled={currentPage === 1}
                          variant="outline"
                        >
                          Previous
                        </Button>
                        <span className="px-4 py-2">{currentPage}</span>
                        <Button
                          onClick={handleNext}
                          disabled={isLastPage}
                          variant="outline"
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
                <TabsContent value="community">
                  <div className="text-center py-12 text-gray-500">
                    Community content would appear here
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}