import { useEffect, useState } from "react";
import { Edit3, Coins, Brain, Trophy, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/user/Header/Header";
import CommunityItem from "@/components/user/Profile/CommunityItem";
import Sidebar from "@/components/user/SideBar/SideBar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import api from "@/utils/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import UserBadges from "@/components/user/Profile/UserBadge";
import { User } from "@/interfaces/auth.interface";

interface Connection {
  _id: string;
  created_at: string;
  follower?: User; // For followers endpoint
  following?: User; // For following endpoint
  __v: number;
}

export default function ProfilePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followers, setFollowers] = useState<Connection[]>([]);
  const [following, setFollowing] = useState<Connection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);
  const navigate = useNavigate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  let memberSince = "N/A";
  if (user?.created_at) {
    const date = new Date(user.created_at);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    memberSince = `${year} ${month}`;
  }

  useEffect(() => {
    if (!user?._id) return;

    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${user._id}`);
        setFollowerCount(response.data?.followerCount || 0);
        setFollowingCount(response.data?.followingCount || 0);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [user?._id]);

  const handleOpenModal = async (type: "followers" | "following") => {
    if (type === "followers" && followerCount === 0) return;
    if (type === "following" && followingCount === 0) return;

    setModalType(type);
    setIsModalOpen(true);

    try {
      const response = await api.get(`/${type}`);
      console.log(response.data.data);
      if (type === "followers") {
        setFollowers(response.data.data || []);
      } else {
        setFollowing(response.data.data || []);
      }
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
    }
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  if (!user?._id) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        activePage="Profile"
        setSidebarExpanded={setSidebarExpanded}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          sidebarExpanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-start mb-6">
              <img
                src={user.profile_image || "/browserIcons/person_icon.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mr-6 border border-gray-300"
              />
              <div className="flex-1 pt-4">
                <h1 className="text-3xl font-bold">{user.username || "Anonymous"}</h1>
                <div className="flex items-center text-gray-500 mt-1">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-gray-500" />
                    Member since {memberSince}
                  </span>
                  <span className="mx-2">•</span>
                  <span
                    className={followerCount > 0 ? "cursor-pointer hover:underline" : ""}
                    onClick={() => handleOpenModal("followers")}
                  >
                    {followerCount} Followers
                  </span>
                  <span className="mx-2">•</span>
                  <span
                    className={followingCount > 0 ? "cursor-pointer hover:underline" : ""}
                    onClick={() => handleOpenModal("following")}
                  >
                    {followingCount} Following
                  </span>
                </div>
              </div>
              <button className="flex items-center border rounded-md px-3 py-1.5 text-sm">
                <Edit3 className="h-4 w-4 mr-1" />
                Edit Profile
              </button>
            </div>

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{modalType === "followers" ? "Followers" : "Following"}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto">
                  {modalType === "followers" && followers.length > 0 ? (
                    followers.map((connection) => (
                      <div
                        key={connection._id}
                        className="flex items-center p-2 border-b"
                        onClick={() => navigate(`/user/${connection.follower?._id}`)}
                      >
                        <img
                          src={connection.follower?.profile_image || "/browserIcons/person_icon.png"}
                          alt={connection.follower?.username}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <span>{connection.follower?.username || "Unknown"}</span>
                      </div>
                    ))
                  ) : modalType === "following" && following.length > 0 ? (
                    following.map((connection) => (
                      <div
                        key={connection._id}
                        className="flex items-center p-2 border-b"
                        onClick={() => navigate(`/user/${connection.following?._id}`)}
                      >
                        <img
                          src={connection.following?.profile_image || "/browserIcons/person_icon.png"}
                          alt={connection.following?.username}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <span>{connection.following?.username || "Unknown"}</span>
                      </div>
                    ))
                  ) : (
                    <p>No {modalType} found.</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Tabs */}
            <Tabs defaultValue="profile" className="mb-6">
              <TabsList className="bg-transparent w-1/3 justify-start rounded-none p-0 h-auto gap-3">
                <TabsTrigger
                  value="profile"
                  className="px-6 py-1.5 rounded-full data-[state=active]:bg-black data-[state=active]:text-white transition"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="px-6 py-1.5 rounded-full data-[state=active]:bg-black data-[state=active]:text-white transition"
                >
                  Activity
                </TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stats & Communities Section - 1/3 */}
                  <div className="md:col-span-1">
                    {/* Stats Section */}
                    <h2 className="text-xl font-semibold mb-4">Stats</h2>
                    <div className="border rounded-md p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xl">{user.xp}</div>
                          <div className="flex items-center text-green-500">
                            <Trophy className="w-5 h-5 mr-1" />
                            XP
                          </div>
                        </div>
                        <div>
                          <div className="text-xl">0</div>
                          <div className="flex items-center text-yellow-500">
                            <Coins className="w-5 h-5 mr-1" />
                            Coins
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xl">{user.questions_explored}</div>
                          <div className="flex items-center text-blue-500">
                            <Brain className="w-5 h-5 mr-1" />
                            QE
                          </div>
                        </div>
                        <div>
                          <div className="text-xl">0</div>
                          <div className="text-gray-500">Questions</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span>Sorcerer</span>
                          <span>1%</span>
                        </div>
                        <Progress value={1} className="h-2" />
                      </div>
                    </div>

                    {/* Communities Section */}
                    <h2 className="text-xl font-semibold mt-6 mb-4">Communities</h2>
                    <div className="space-y-3">
                      <CommunityItem />
                      <CommunityItem />
                      <CommunityItem />
                    </div>
                  </div>

                  {/* Badges Section - 2/3 */}
                  <UserBadges userId={user._id} />
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <div className="py-8 text-center text-gray-500">Activity content would go here</div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}