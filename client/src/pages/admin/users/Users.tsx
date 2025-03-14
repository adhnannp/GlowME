import type React from "react"
import { useState } from "react"
import {
  Home,
  Users,
  HelpCircle,
  Tag,
  Gift,
  Coins,
  MessageSquare,
  BarChart2,
  ShoppingBag,
  Tags,
  LogOut,
  Search,
  ChevronDown,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  id: number
  name: string
  email: string
  avatar: string
  followers: number
  xp: number
  qe: number
  joiningDate: string
  isBlocked: boolean
}

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Roselle Ehrman",
      email: "roselle@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: 40018,
      xp: 12432,
      qe: 745,
      joiningDate: "15 Dec, 2021",
      isBlocked: false,
    },
    {
      id: 2,
      name: "Andriana",
      email: "andriana@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: 40018,
      xp: 12432,
      qe: 745,
      joiningDate: "5 Oct, 2021",
      isBlocked: true,
    },
    {
      id: 3,
      name: "Vacinzo",
      email: "vacinzo@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: 40018,
      xp: 12432,
      qe: 745,
      joiningDate: "25 Sep, 2021",
      isBlocked: true,
    },
    {
      id: 4,
      name: "Jane Smith",
      email: "jane@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: 40018,
      xp: 12432,
      qe: 745,
      joiningDate: "15 aug, 2021",
      isBlocked: true,
    },
    {
      id: 5,
      name: "Lectrice Kulik",
      email: "kulik@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: 40018,
      xp: 12432,
      qe: 745,
      joiningDate: "5 june, 2020",
      isBlocked: true,
    },
    {
      id: 6,
      name: "Darron Handler",
      email: "darron@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: 40018,
      xp: 12432,
      qe: 745,
      joiningDate: "15 May, 2020",
      isBlocked: true,
    },
    {
      id: 7,
      name: "Vacinzo",
      email: "vacinzo@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: 40018,
      xp: 12432,
      qe: 745,
      joiningDate: "5 April, 2020",
      isBlocked: true,
    },
    {
      id: 8,
      name: "Alvaro",
      email: "Alvaro@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      followers: 40018,
      xp: 12432,
      qe: 745,
      joiningDate: "12 Feb, 2020",
      isBlocked: true,
    },
  ])

  const toggleBlockStatus = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user)))
  }

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      {/* Sidebar */}
      <div className="w-[220px] bg-white flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center">
            <div className="mr-2 h-6 w-6 rounded-full bg-[#FF9838]"></div>
            <span className="text-lg font-bold">Elegent</span>
          </div>
        </div>

        <div className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            <NavItem icon={<Home className="h-5 w-5" />} label="Dashboard" />
            <NavItem icon={<Users className="h-5 w-5" />} label="Users" active />
            <NavItem icon={<HelpCircle className="h-5 w-5" />} label="Questions" />
            <NavItem icon={<Tag className="h-5 w-5" />} label="Manage Coupons" />
            <NavItem icon={<Gift className="h-5 w-5" />} label="Manage Rewards" />
            <NavItem icon={<Coins className="h-5 w-5" />} label="Manage GlowCoin" />
            <NavItem icon={<MessageSquare className="h-5 w-5" />} label="Message" />
            <NavItem icon={<BarChart2 className="h-5 w-5" />} label="Reports" />
            <NavItem icon={<ShoppingBag className="h-5 w-5" />} label="Orders" />
            <NavItem icon={<Tags className="h-5 w-5" />} label="Tags" />
          </nav>
        </div>

        <div className="p-4 border-t">
          <button className="flex items-center text-[#FF9838] w-full">
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">User tables</h1>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-[300px] rounded-full" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                  <span>Aiden Max</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Users</h2>
                <p className="text-gray-500 text-sm mt-1">
                  All the users that are registered on your store are displayed in data tables with some of their basic
                  information and history.
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <span className="mr-2">Followers</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Followers</DropdownMenuItem>
                  <DropdownMenuItem>Date</DropdownMenuItem>
                  <DropdownMenuItem>Name</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">User name</TableHead>
                    <TableHead>Followers</TableHead>
                    <TableHead>Xp</TableHead>
                    <TableHead>QE</TableHead>
                    <TableHead>Joining date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.followers.toLocaleString()}</TableCell>
                      <TableCell>{user.xp.toLocaleString()}</TableCell>
                      <TableCell>{user.qe}</TableCell>
                      <TableCell>{user.joiningDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            onClick={() => toggleBlockStatus(user.id)}
                            className={
                              user.isBlocked
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }
                            size="sm"
                          >
                            {user.isBlocked ? "Block" : "Un Block"}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MessageCircle className="h-5 w-5 text-[#FF9838]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm">
              <div>Showing 8 of 20 users</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8 w-16">
                  Prev
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 bg-[#FF9838] text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-16">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <a
      href="#"
      className={`flex items-center px-4 py-3 text-sm rounded-lg ${
        active ? "bg-[#FF9838] bg-opacity-10 text-[#FF9838] font-medium" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </a>
  )
}

