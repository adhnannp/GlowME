import { useState } from "react";
import Header from "@/components/user/Header/Header";
import Sidebar from "@/components/user/SideBar/SideBar";
import HeroSection from "@/components/user/Gcoin/HeroSection";
import RegularRewardSection from "@/components/user/Reward/RegularRewardSection";

export default function RewardPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        activePage="GCoin"
        setSidebarExpanded={setSidebarExpanded}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarExpanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto">
            <HeroSection currentPage='reward'/>
            <RegularRewardSection />
          </div>
        </main>
      </div>
    </div>
  );
}