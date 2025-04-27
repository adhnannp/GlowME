import { useState } from "react"
import Header from "@/components/user/Header/Header"
import Sidebar from "@/components/user/SideBar/SideBar"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useNavigate } from "react-router-dom"

export default function DefaultUser() {
  const navigate = useNavigate()
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const { id } = useParams()
  if(id==currentUser?._id){
    navigate("/profile")
  }
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
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
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center p-6">
            <img
              src="/browserIcons/person_icon.png"
              alt="Default Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border border-gray-300"
            />
            <h1 className="text-3xl font-bold mb-2">GlowME User</h1>
            <p className="text-gray-500">User not found</p>
          </div>
        </div>
      </div>
    </div>
  );
}