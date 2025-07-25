import React, { useEffect,useState } from "react";
import {Home,Bell,Users,MessageSquare,Bookmark,PlusCircle,User,Info,ShoppingBag,Coins,Gift,Lock,
} from "lucide-react";
import SidebarItem from "./SideBarItem";
import { Link } from "react-router-dom";
import NotificationsPanel from "./NotificationPanel";
import ChangePasswordModal from "./ChangePasswordModal";
import { HasUnreadNotification } from "@/services/user/user.notification.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearNotifications } from "@/feature/socketSlice";
import { useDispatch } from "react-redux";

interface SidebarProps {
  sidebarExpanded: boolean;
  activePage: string;
  setSidebarExpanded: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarExpanded, activePage, setSidebarExpanded }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [hasUnreadFromApi, setHasUnreadFromApi] = useState(false);
  const socketNotifications = useSelector((state: RootState) => state.socket.notifications);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (showNotifications) {
      try {
        dispatch(clearNotifications()); 
          setHasUnreadFromApi(false);
      } catch (error) {
        console.error("Failed to mark notifications as read", error);
      } 
    }
  }, [showNotifications]);

  useEffect(() => {
    const fetchUnreadStatus = async () => {
      try {
        const res = await HasUnreadNotification();
        setHasUnreadFromApi(res?.hasUnreadNotification || false);
      } catch (error) {
        console.error("Failed to fetch unread notification status", error);
      }
    };

    fetchUnreadStatus();
  }, []);

  const hasUnread = (hasUnreadFromApi || socketNotifications.length > 0) && !showNotifications;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (
        showNotifications &&
        !target.closest(".notifications-panel") &&
        !target.closest(".notification-trigger")
      ) {
        setShowNotifications(false);
      }
      if (
        showMoreMenu &&
        !target.closest(".more-menu") &&
        !target.closest(".more-trigger")
      ) {
        setShowMoreMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications, showMoreMenu]);
  
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (sidebarExpanded) {
      setSidebarExpanded(false);
    }
  };

  const toggleMoreMenu = () => {
    setShowMoreMenu((prev) => !prev);
    if (sidebarExpanded) {
      setSidebarExpanded(false);
    }
  };

  return (
    <div
      className={`${
        sidebarExpanded ? "w-[230px]" : "w-[60px]"
      } border-r flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      <div className="p-5 flex items-center justify-between">
        <h1
          className={`font-bold transition-all duration-200 ${
            sidebarExpanded ? "text-xl" : "text-2xl"
          }`}
        >
          {sidebarExpanded ? "GlowME" : "G"}
        </h1>
      </div>

      <div className="flex-1">
        <nav className="space-y-1 py-2">
          <Link to="/home">
            <SidebarItem
              icon={<Home className="h-5 w-5" />}
              label="Home"
              active={activePage === "Home"}
              expanded={sidebarExpanded}
            />
          </Link>
          <Link to="#">
            <SidebarItem
              icon={
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {hasUnread && (
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
              }
              label="Notifications"
              active={showNotifications}
              onClick={toggleNotifications}
              className="notification-trigger"
              expanded={sidebarExpanded}
            />
          </Link>
          <Link to="/connect">
            <SidebarItem
              icon={<Users className="h-5 w-5" />}
              label="Connect"
              active={activePage === "Connect"}
              expanded={sidebarExpanded}
            />
          </Link>
          <Link to="/social">
            <SidebarItem
              icon={<MessageSquare className="h-5 w-5" />}
              label="Social"
              active={activePage === "Social"}
              expanded={sidebarExpanded}
            />
          </Link>
          <Link to="/saved">
            <SidebarItem
              icon={<Bookmark className="h-5 w-5" />}
              label="Saved"
              active={activePage === "Saved"}
              expanded={sidebarExpanded}
            />
          </Link>
          <Link to="/ask-question">
            <SidebarItem
              icon={<PlusCircle className="h-5 w-5" />}
              label="Ask Question"
              active={activePage === "Ask Question"}
              expanded={sidebarExpanded}
            />
          </Link>
        </nav>
      </div>

      <div className="mt-auto border-t">
        <Link to="/profile">
          <SidebarItem
            icon={<User className="h-5 w-5" />}
            label="Profile"
            active={activePage === "Profile"}
            expanded={sidebarExpanded}
          />
        </Link>
        <div className="relative">
          <SidebarItem
            icon={<Info className="h-5 w-5" />}
            label="More"
            active={activePage==="GCoin" || showMoreMenu || showChangePasswordModal}
            onClick={toggleMoreMenu}
            className="more-trigger"
            expanded={sidebarExpanded}
            aria-label="More options"
          />
          {showMoreMenu && (
            <div
              className={`more-menu absolute ${
                sidebarExpanded ? "left-[230px]" : "left-[60px]"
              } bottom-10 w-48 bg-white border shadow-lg z-10`}
            >
              <Link
                to="/redeem"
                className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-100"
                onClick={() => setShowMoreMenu(false)}
              >
                <Gift className="w-4 h-4 mr-2 text-gray-700" />
                Redeem
              </Link>
              <Link
                to="/gcoin"
                className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-100"
                onClick={() => setShowMoreMenu(false)}
              >
                <Coins className="w-4 h-4 mr-2 text-gray-700" />
                GCoin
              </Link>
              <Link
                to="/order"
                className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-100"
                onClick={() => setShowMoreMenu(false)}
              >
                <ShoppingBag className="w-4 h-4 mr-2 text-gray-700" />
                View-Order
              </Link>
              <div
                className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setShowMoreMenu(false);
                  setShowChangePasswordModal(true);
                }}
              >
                <Lock className="w-4 h-4 mr-2 text-gray-700" />
                Change-Password
              </div>
            </div>
          )}
        </div>
      </div>

      {showNotifications && (
        <div className="notifications-panel">
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        </div>
      )}

      <ChangePasswordModal
        open={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
};

export default Sidebar;