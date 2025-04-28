import { useState, useEffect } from "react"
import { Coins, Brain, Trophy, Star, Grid2x2Plus, AlertTriangle, Grid2x2X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/user/Header/Header"
import CommunityItem from "@/components/user/Profile/CommunityItem"
import Sidebar from "@/components/user/SideBar/SideBar"
import { useParams } from "react-router-dom"
import { UserWithBadge } from "@/interfaces/auth.interface"
import api from "@/utils/axios"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';
import OtherUserBadges from "@/components/user/OtherProfile/OtherUserBadge"
import DefaultUser from "@/components/user/Default/DefaultUser"
import ReportUserModal from "@/components/user/OtherProfile/ReportUserModal"

export default function OtherUserProfile() {
  const navigate = useNavigate()
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [userData, setUserData] = useState<UserWithBadge | null>(null)
  const [followerCount, setFollowerCount] = useState<number>(0); 
  const [followingCount, setFollowingCount] = useState<number>(0); 
  const [isFollowing,setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const { id } = useParams() 
  if(id==currentUser?._id){
    navigate("/profile")
  }
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/users/${id}`)
        setUserData(response.data?.user);
        setFollowerCount(response.data?.followerCount || 0);
        setFollowingCount(response.data?.followingCount || 0)
        setIsFollowing(response.data.isFollowing)
        setError(null)
      } catch (err) {
        setError("Failed to fetch user data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  const handleConnect = async () => {
    try {
      if (!id) {
        toast.error("invalid request");
      }
      const response = await api.post('/follow', { followingId: id });
      console.log(response)
      toast.success(response.data.message ||"Successfully connected!");
      setFollowerCount((prev) => prev + 1);
      setIsFollowing(true);
    } catch (err: any) {
        console.log(err)
      toast.error(err.message || "Failed to connect");
      console.error(err);
    }
};

const handleDisconnect = async () => {
    try {
      if (!id) {
        toast.error("Invalid request");
        return;
      }
      const response = await api.post('/unfollow', { followingId: id });
      toast.success(response.data.message || "Successfully disconnected!");
      setFollowerCount((prev) => prev - 1);
      setIsFollowing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to disconnect");
      console.error(err);
    }
  };

  let memberSince = "N/A"
  if (userData?.created_at) {
    const date = new Date(userData.created_at)
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    memberSince = `${year} ${month}`
  }

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (error||!userData || !userData?._id) {
    return (
      <DefaultUser/>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        activePage="Connect"
        setSidebarExpanded={setSidebarExpanded}
      />
      <div className="flex-1 flex flex-col">
        <Header
          sidebarExpanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-start mb-6">
              <img
                src={userData?.profile_image || "/browserIcons/person_icon.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mr-6 border border-gray-300"
              />
              <div className="flex-1 pt-4">
                <h1 className="text-3xl font-bold">{userData?.username || "Anonymous"}</h1>
                <div className="flex items-center text-gray-500 mt-1">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-gray-500" />
                    Member since {memberSince}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{followerCount} Followers</span>
                  <span className="mx-2">•</span>
                  <span>{followingCount} Following</span>
                </div>
              </div>
              <button
                className="flex items-center border rounded-md px-3 py-1.5 text-sm mr-1"
                onClick={isFollowing ? handleDisconnect : handleConnect}
                disabled={loading}
                >
                    {isFollowing ? (
                    <>
                        <Grid2x2X className="h-4 w-4 mr-1 text-gray-800" />
                        Unfollow
                    </>
                    ) : (
                    <>
                        <Grid2x2Plus className="h-4 w-4 mr-1 text-gray-800" />
                        Follow
                    </>
                    )}
              </button>
              <button
                className="flex items-center border rounded-md px-3 py-1.5 text-sm"
                onClick={() => setIsReportModalOpen(true)}
                disabled={loading}
                >
                <AlertTriangle className="h-4 w-4 mr-1 text-gray-800"/>
                Report
              </button>
              <ReportUserModal
                open={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                userId={id || ""}
              />
            </div>
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
                  <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Stats</h2>
                    <div className="border rounded-md p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xl">{userData?.xp || 0}</div>
                          <div className="flex items-center text-green-500">
                            <Trophy className="w-5 h-5 mr-1" />
                            XP
                          </div>
                        </div>
                        {/* Coins isn't in the User interface */}
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
                          <div className="text-xl">{userData?.questions_explored || 0}</div>
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
                    </div>

                    <h2 className="text-xl font-semibold mt-6 mb-4">Communities</h2>
                    <div className="space-y-3">
                      <CommunityItem />
                      <CommunityItem />
                      <CommunityItem />
                    </div>
                  </div>

                  <OtherUserBadges userId={userData?._id}/>
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <div className="py-8 text-center text-gray-500">
                  {userData?.username || "This user"}'s activity would go here
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}