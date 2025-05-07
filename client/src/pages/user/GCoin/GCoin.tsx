import { useState } from "react";
import Header from "@/components/user/Header/Header";
import Sidebar from "@/components/user/SideBar/SideBar";
import HeroSection from "@/components/user/Gcoin/HeroSection";
import RegularCoinsSection from "@/components/user/Gcoin/RegularCoinsSection";
import RedeemCodeSection from "@/components/user/Gcoin/RedeemCodeSection";
import TransactionHistorySection from "@/components/user/Gcoin/TransactionHistorySection";

export default function GCoinPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [redeemCode, setRedeemCode] = useState("");

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
            <HeroSection />
            <RegularCoinsSection />
            <RedeemCodeSection
              redeemCode={redeemCode}
              setRedeemCode={setRedeemCode}
            />
            <TransactionHistorySection />
          </div>
        </main>
      </div>
    </div>
  );
}