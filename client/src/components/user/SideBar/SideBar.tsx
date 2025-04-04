import React from "react";
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

interface SidebarProps {
  sidebarExpanded: boolean;
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarExpanded, activePage }) => {
  return (
    <div
      className={`${
        sidebarExpanded ? "w-[186px]" : "w-[60px]"
      } border-r flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      <div className="p-5 flex items-center justify-between">
        <h1 className={`font-bold transition-all duration-200 ${sidebarExpanded ? "text-xl" : "text-2xl"}`}>
            {sidebarExpanded ? "GlowME" : "G"}
        </h1>
      </div>

      <div className="flex-1">
        <nav className="space-y-1 py-2">
          <Link to="/">
            <SidebarItem icon={<Home className="h-5 w-5" />} label="Home" active={activePage === "Home"} expanded={sidebarExpanded} />
          </Link>
          <Link to="/questions">
            <SidebarItem icon={<HelpCircle className="h-5 w-5" />} label="Questions" active={activePage === "Questions"} expanded={sidebarExpanded} />
          </Link>
          <Link to="/notifications">
            <SidebarItem icon={<Bell className="h-5 w-5" />} label="Notifications" active={activePage === "Notifications"} expanded={sidebarExpanded} />
          </Link>
          <Link to="/connect">
            <SidebarItem icon={<Users className="h-5 w-5" />} label="Connect" active={activePage === "Connect"} expanded={sidebarExpanded} />
          </Link>
          <Link to="/social">
            <SidebarItem icon={<MessageSquare className="h-5 w-5" />} label="Social" active={activePage === "Social"} expanded={sidebarExpanded} />
          </Link>
          <Link to="/saved">
            <SidebarItem icon={<Bookmark className="h-5 w-5" />} label="Saved" active={activePage === "Saved"} expanded={sidebarExpanded} />
          </Link>
          <Link to="/ask-question">
            <SidebarItem icon={<PlusCircle className="h-5 w-5" />} label="Ask Question" active={activePage === "Ask Question"} expanded={sidebarExpanded} />
          </Link>
        </nav>
      </div>

      <div className="mt-auto border-t">
        <Link to="/profile">
          <SidebarItem icon={<User className="h-5 w-5" />} label="Profile" active={activePage === "Profile"} expanded={sidebarExpanded} />
        </Link>
        <Link to="/more">
          <SidebarItem icon={<Info className="h-5 w-5" />} label="More" active={activePage === "More"} expanded={sidebarExpanded} />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
