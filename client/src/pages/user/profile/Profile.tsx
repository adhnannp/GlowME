import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Home,
  HelpCircle,
  Bell,
  Users,
  MessageSquare,
  Bookmark,
  PlusCircle,
  User,
  InfoIcon as About,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CommunityItem from "@/components/user/Profile/CommunityItem"
import SidebarItem from "@/components/user/Profile/SideBarItem"
import BadgeCard from "@/components/user/Profile/BadgeCard"

export default function ProfilePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div
        className={`${sidebarExpanded ? "w-[186px]" : "w-[60px]"} border-r flex flex-col transition-all duration-300 ease-in-out relative`}
      >
        <div className="p-5 flex items-center justify-between">
          <h1 className={`text-xl font-bold ${sidebarExpanded ? "block" : "hidden"}`}>GlowME</h1>
          <button
            onClick={toggleSidebar}
            className={`absolute ${sidebarExpanded ? "right-2" : "right-1/2 translate-x-1/2"} top-5 p-1 rounded-full hover:bg-gray-100`}
          >
            {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex-1">
          <nav className="space-y-1 py-2">
            <SidebarItem icon={<Home className="h-5 w-5" />} label="Home" active={false} expanded={sidebarExpanded} />
            <SidebarItem icon={<HelpCircle className="h-5 w-5" />} label="Questions" active={false} expanded={sidebarExpanded} />
            <SidebarItem icon={<Bell className="h-5 w-5" />} label="Notifications" active={false} expanded={sidebarExpanded} />
            <SidebarItem icon={<Users className="h-5 w-5" />} label="Connect" active={false} expanded={sidebarExpanded} />
            <SidebarItem icon={<MessageSquare className="h-5 w-5" />} label="Social" active={false} expanded={sidebarExpanded} />
            <SidebarItem icon={<Bookmark className="h-5 w-5" />} label="saved" active={false} expanded={sidebarExpanded} />
            <SidebarItem icon={<PlusCircle className="h-5 w-5" />} label="Ask Question" active={false} expanded={sidebarExpanded} />
          </nav>
        </div>

        <div className="mt-auto border-t">
          <SidebarItem icon={<User className="h-5 w-5" />} label="Profile" active expanded={sidebarExpanded} />
          <SidebarItem icon={<About className="h-5 w-5" />} label="About" active={false} expanded={sidebarExpanded} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b p-3 flex items-center">
          <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <input type="text" placeholder="Search..." className="w-full border rounded-md px-3 py-2" />
          </div>
          <div className="ml-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600"></div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-6">
            {/* Profile Header */}
            <div className="flex items-start mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mr-6"></div>
              <div className="flex-1 pt-4">
                <h1 className="text-3xl font-bold">Adhnan P</h1>
                <div className="flex items-center text-gray-500 mt-1">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                    Member for 6 months
                  </span>
                  <span className="mx-2">•</span>
                  <span>66 connection</span>
                </div>
              </div>
              <button className="flex items-center border rounded-md px-3 py-1.5 text-sm">
                <Edit3 className="h-4 w-4 mr-1" />
                Edit Profile
              </button>
            </div>

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
                          <div className="text-xl">8,450</div>
                          <div className="flex items-center text-green-500">
                          <img src="/simple_icons/trouphy.png" alt="Trophy Icon" className="w-5 h-5 mr-1" />
                            XP
                          </div>
                        </div>
                        <div>
                          <div className="text-xl">5,450</div>
                          <div className="flex items-center text-yellow-500">
                          <img src="/simple_icons/coin.png" alt="Trophy Icon" className="w-5 h-5 mr-1" />
                            Coins
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xl">720</div>
                          <div className="flex items-center text-blue-500">
                          <img src="/simple_icons/brain.png" alt="Trophy Icon" className="w-5 h-5 mr-1" />
                            QE
                          </div>
                        </div>
                        <div>
                          <div className="text-xl">12</div>
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
                        acquired={false}
                      />
                      <BadgeCard
                        title="Master"
                        imageUrl="/badges/level 7.png"
                        color="from-purple-500 to-violet-600"
                        required="2000 required"
                        requiredColor="text-green-500"
                        current={false}
                        acquired={false}
                      />
                      <BadgeCard
                        title="Skilled"
                        imageUrl="/badges/level 4.png"
                        color="from-cyan-400 to-blue-500"
                        required=""
                        requiredColor=""
                        current={true}
                        acquired={false}
                      />
                      <BadgeCard
                        title="Beginner"
                        imageUrl="/badges/level 2.png"
                        color="from-lime-400 to-green-500"
                        required=""
                        requiredColor=""
                        current={false}
                        acquired={true}
                      />
                      <BadgeCard
                        title="Bot"
                        imageUrl="/badges/level 1.png"
                        color="from-yellow-300 to-amber-400"
                        required=""
                        requiredColor=""
                        current={false}
                        acquired={true}
                      />
                    </div>
                  </div>
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
  )
}






