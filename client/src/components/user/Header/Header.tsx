import { useState } from "react"
import { PanelLeftOpen, PanelLeftClose } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { ProfileModal } from "@/components/user/Profile/ProfileModal"

interface HeaderProps {
  sidebarExpanded: boolean
  toggleSidebar: () => void
}

export default function Header({ sidebarExpanded, toggleSidebar }: HeaderProps) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)
  const profileImage = user?.profile_image ? user.profile_image : "/browserIcons/person_icon.png"

  return (
    <header className="border-b p-3 flex items-center relative">
      <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100 mr-2">
        {sidebarExpanded ? (
          <PanelLeftClose className="h-5 w-5 text-gray-600" />
        ) : (
          <PanelLeftOpen className="h-5 w-5 text-gray-600" />
        )}
      </button>
      <div className="flex-1">
        <input type="text" placeholder="Search..." className="w-full border rounded-md px-3 py-2" />
      </div>
      <div className="ml-4 relative">
        <button
          onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
          className="focus:outline-none"
          aria-label="Open profile menu"
        >
          <img
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-gray-300"
          />
        </button>

        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          profileImage={profileImage}
        />
      </div>
    </header>
  )
}
