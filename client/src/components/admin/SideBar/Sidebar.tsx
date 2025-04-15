import { NavLink } from "react-router-dom";
import { Home, Users, HelpCircle, Tag, Gift, Coins, MessageSquare, BarChart2, ShoppingBag, Tags, Award } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-[220px] bg-white flex flex-col">
      <div className="p-6">
        <div className="flex items-center">
          <NavLink to="/admin/users" className="flex items-center">
            <div className="mr-2 h-8 w-8 p-1 rounded-full bg-[#FF9838]">
              <img src="/browserIcons/g384.png" className="h-6 w-6" alt="icon" />
            </div>
            <span className="text-lg font-bold">GlowME</span>
          </NavLink>
        </div>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Home className="h-5 w-5" />
            <span className="ml-2">Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Users className="h-5 w-5" />
            <span className="ml-2">Users</span>
          </NavLink>
          <NavLink
            to="/admin/badges"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Award className="h-5 w-5" />
            <span className="ml-2">Badges</span>
          </NavLink>
          <NavLink
            to="/admin/questions"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <HelpCircle className="h-5 w-5" />
            <span className="ml-2">Questions</span>
          </NavLink>
          <NavLink
            to="/admin/coupons"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Tag className="h-5 w-5" />
            <span className="ml-2">Manage Coupons</span>
          </NavLink>
          <NavLink
            to="/admin/rewards"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Gift className="h-5 w-5" />
            <span className="ml-2">Manage Rewards</span>
          </NavLink>
          <NavLink
            to="/admin/coins"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Coins className="h-5 w-5" />
            <span className="ml-2">Manage GlowCoin</span>
          </NavLink>
          <NavLink
            to="/admin/messages"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <MessageSquare className="h-5 w-5" />
            <span className="ml-2">Messages</span>
          </NavLink>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <BarChart2 className="h-5 w-5" />
            <span className="ml-2">Reports</span>
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="ml-2">Orders</span>
          </NavLink>
          <NavLink
            to="/admin/tags"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-md ${isActive ? 'bg-[#FF9838] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <Tags className="h-5 w-5" />
            <span className="ml-2">Tags</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
