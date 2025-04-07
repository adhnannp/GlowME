import { Home, Users, HelpCircle, Tag, Gift, Coins, MessageSquare, BarChart2, ShoppingBag, Tags, LogOut } from "lucide-react"
import NavItem from "./NavItem"
import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <div className="w-[220px] bg-white flex flex-col">
      <div className="p-6">
        <div className="flex items-center">
            <Link to="/admin/users" className="flex items-center">
                <div className="mr-2 h-8 w-8 p-1 rounded-full bg-[#FF9838]">
                    <img src="/browserIcons/g384.png" className="h-6 w-6" alt="icon" />
                </div>
              <span className="text-lg font-bold">GlowME</span>
            </Link>
        </div>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          <Link to='/admin/dashboard'>
            <NavItem icon={<Home className="h-5 w-5" />} label="Dashboard" />
          </Link>
          <Link to='/admin/users'>
            <NavItem icon={<Users className="h-5 w-5" />} label="Users" active />
          </Link>
          <Link to='/admin/questions'>
            <NavItem icon={<HelpCircle className="h-5 w-5" />} label="Questions" />
          </Link>
          <Link to='/admin/coupons'>
            <NavItem icon={<Tag className="h-5 w-5" />} label="Manage Coupons" />
          </Link>
          <Link to='/admin/rewards'>
            <NavItem icon={<Gift className="h-5 w-5" />} label="Manage Rewards" />
          </Link>
          <Link to='/admin/Dashboard'>
            <NavItem icon={<Coins className="h-5 w-5" />} label="Manage GlowCoin" />
          </Link>
          <Link to='/admin/g-coin'>
            <NavItem icon={<MessageSquare className="h-5 w-5" />} label="Message" />
          </Link>
          <Link to='/admin/reports'>
            <NavItem icon={<BarChart2 className="h-5 w-5" />} label="Reports" />
          </Link>
          <Link to='/admin/orders'>
            <NavItem icon={<ShoppingBag className="h-5 w-5" />} label="Orders" />
          </Link>
          <Link to='/admin/tags'>
            <NavItem icon={<Tags className="h-5 w-5" />} label="Tags" />
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t">
        <button className="flex items-center text-[#FF9838] w-full">
          <LogOut className="h-5 w-5 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}