// Sidebar.tsx
import React, { useEffect } from "react";
import {
  Home,
  HelpCircle,
  Bell,
  Users,
  MessageSquare,
  Bookmark,
  PlusCircle,
  User,
  Info,
} from "lucide-react";
import SidebarItem from "./SideBarItem";
import { Link } from "react-router-dom";
import NotificationsPanel from "./NotificationPanel";

interface SidebarProps {
  sidebarExpanded: boolean;
  activePage: string;
  setSidebarExpanded: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarExpanded, activePage ,setSidebarExpanded }) => {
  const [showNotifications, setShowNotifications] = React.useState(false);

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
    }
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
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
          <Link to="/">
            <SidebarItem
              icon={<Home className="h-5 w-5" />}
              label="Home"
              active={activePage === "Home"}
              expanded={sidebarExpanded}
            />
          </Link>
          <Link to="/questions">
            <SidebarItem
              icon={<HelpCircle className="h-5 w-5" />}
              label="Questions"
              active={activePage === "Questions"}
              expanded={sidebarExpanded}
            />
          </Link>
          <Link to="#"> 
            <SidebarItem
              icon={<Bell className="w-5 h-5" />}
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
        <Link to="/more">
          <SidebarItem
            icon={<Info className="h-5 w-5" />}
            label="More"
            active={activePage === "More"}
            expanded={sidebarExpanded}
          />
        </Link>
      </div>

      {showNotifications && (
        <div className="notifications-panel">
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;