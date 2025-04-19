import { useState, useEffect } from "react"
import { Coins, Brain, Trophy, Star, Grid2x2Plus, AlertTriangle, Grid2x2X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/user/Header/Header"
import CommunityItem from "@/components/user/Profile/CommunityItem"
import BadgeCard from "@/components/user/Profile/BadgeCard"
import Sidebar from "@/components/user/SideBar/SideBar"
import { useParams } from "react-router-dom"
import { User } from "@/interfaces/auth.interface"
import api from "@/utils/axios"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';

export default function OtherUserProfile() {
  const navigate = useNavigate()
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)
  const [followerCount, setFollowerCount] = useState<number>(0); 
  const [followingCount, setFollowingCount] = useState<number>(0); 
  const [isFollowing,setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('');

  const { id } = useParams() // Get user ID from URL params
  if(id==currentUser?._id){
    navigate("/profile")
  }
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Fetch user data when component mounts or ID changes
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

  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async () => {
    try {
      if (!id || !reportReason.trim()) {
        toast.error("Please provide a reason for reporting");
        return;
      }
      const response = await api.post('/report', { userId: id, reason: reportReason });
      toast.success(response.data.message || "User reported successfully!");
      setIsReportModalOpen(false);
      setReportReason('');
      navigate('/connect')
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to report user");
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setIsReportModalOpen(false);
    setReportReason('');
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

  if (error) {
    return <div className="flex h-screen items-center justify-center">{error}</div>
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
                onClick={handleReportClick}
                disabled={loading}
                >
                <AlertTriangle className="h-4 w-4 mr-1 text-gray-800"/>
                Report
              </button>
            </div>
            {isReportModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-md w-96">
                <h2 className="text-lg font-semibold mb-4">Report User</h2>
                <p className="mb-4">Are you sure you want to report this user?</p>
                
                {/* Radio buttons for report reasons */}
                <div className="space-y-2 mb-4">
                    {[
                    "Harassment",
                    "Sexual Abuse",
                    "Content Violation",
                    "Spam",
                    "Impersonation",
                    "Other",
                    ].map((reason) => (
                    <label key={reason} className="flex items-center">
                        <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="mr-2"
                        />
                        {reason}
                    </label>
                    ))}
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                    className="px-4 py-2 bg-gray-300 rounded-md"
                    onClick={handleCloseModal}
                    >
                    Cancel
                    </button>
                    <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md disabled:bg-red-300"
                    onClick={handleReportSubmit}
                    disabled={!reportReason}
                    >
                    Report
                    </button>
                </div>
                </div>
            </div>
            )}
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
                        {/* QE isn't in the User interface */}
                        <div>
                          <div className="text-xl">{userData?.questions_explored || 0}</div>
                          <div className="flex items-center text-blue-500">
                            <Brain className="w-5 h-5 mr-1" />
                            QE
                          </div>
                        </div>
                        <div>
                          <div className="text-xl">0</div>
                          <div className="text-gray-500">Questions Explored</div>
                        </div>
                      </div>

                      {/* Rank and rankProgress aren't in the User interface */}
                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span>{userData?.currentBadge || "Beginner"}</span>
                          <span>1%</span>
                        </div>
                        <Progress value={1} className="h-2" />
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold mt-6 mb-4">Communities</h2>
                    <div className="space-y-3">
                      <CommunityItem />
                      <CommunityItem />
                      <CommunityItem />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Badges</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <BadgeCard
                        title="Supreme"
                        imageUrl="/badges/level9.png"
                        color="from-yellow-500 to-amber-600"
                        required="4000 required"
                        requiredColor="text-green-500"
                        current={false}
                        acquired={userData?.badge === "Supreme"}
                      />
                      <BadgeCard
                        title="Master"
                        imageUrl="/badges/level 7.png"
                        color="from-purple-500 to-violet-600"
                        required="2000 required"
                        requiredColor="text-green-500"
                        current={false}
                        acquired={userData?.badge === "Master"}
                      />
                      <BadgeCard
                        title="Skilled"
                        imageUrl="/badges/level 4.png"
                        color="from-cyan-400 to-blue-500"
                        required=""
                        requiredColor=""
                        current={userData?.badge === "Skilled"}
                        acquired={userData?.badge === "Skilled"}
                      />
                      <BadgeCard
                        title="Beginner"
                        imageUrl="/badges/level 2.png"
                        color="from-lime-400 to-green-500"
                        required=""
                        requiredColor=""
                        current={userData?.badge === "Beginner"}
                        acquired={true}
                      />
                      <BadgeCard
                        title="Bot"
                        imageUrl="/badges/level 1.png"
                        color="from-yellow-300 to-amber-400"
                        required=""
                        requiredColor=""
                        current={userData?.badge === "Bot"}
                        acquired={true}
                      />
                    </div>
                  </div>
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