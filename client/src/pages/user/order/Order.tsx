import { useEffect, useState } from "react";
import Header from "@/components/user/Header/Header";
import Sidebar from "@/components/user/SideBar/SideBar";
import HeroSection from "@/components/user/Gcoin/HeroSection";
import { useLocation } from "react-router-dom";
import OrdersSection from "@/components/user/Order/orderSection";

export default function OrderPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [location.hash]);

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
            <HeroSection currentPage='order'/>
            <OrdersSection />
          </div>
        </main>
      </div>
    </div>
  );
}