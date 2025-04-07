"use client"

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
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ReportedItem {
  id: number
  user: {
    name: string
    email: string
    avatar: string
    xp: string
  }
  content: string
  stats?: {
    coins: number
    qe: number
  }
  votes: number
  tags?: string[]
}

export default function ReportsPage() {
  const [reportedUsers] = useState<ReportedItem[]>([
    {
      id: 1,
      user: {
        name: "Darron Handler",
        email: "Darron@gmail.com",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "8,450 xp",
      },
      content: "",
      stats: {
        coins: 5450,
        qe: 720,
      },
      votes: 3,
    },
    {
      id: 2,
      user: {
        name: "Darron Handler",
        email: "Darron@gmail.com",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "8,450 xp",
      },
      content: "",
      stats: {
        coins: 5450,
        qe: 720,
      },
      votes: 3,
    },
  ])

  const [reportedQuestions] = useState<ReportedItem[]>([
    {
      id: 1,
      user: {
        name: "Adhnan P",
        email: "XP 3000",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "XP 3000",
      },
      content: "The full Executive Order is out! ⚠️ This is the biggest executive",
      votes: 3,
      tags: ["tag"],
    },
    {
      id: 2,
      user: {
        name: "Adhnan P",
        email: "XP 3000",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "XP 3000",
      },
      content: "The full Executive Order is out! ⚠️ This is the biggest executive",
      votes: 3,
      tags: ["tag"],
    },
    {
      id: 3,
      user: {
        name: "Adhnan P",
        email: "XP 3000",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "XP 3000",
      },
      content: "The full Executive Order is out! ⚠️ This is the biggest executive",
      votes: 3,
      tags: ["tag"],
    },
  ])

  const [reportedAnswers] = useState<ReportedItem[]>([
    {
      id: 1,
      user: {
        name: "Adhnan P",
        email: "XP 3000",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "XP 3000",
      },
      content: "This is a simple answe headding only or simple first line or some thing like that a",
      votes: 3,
    },
    {
      id: 2,
      user: {
        name: "Adhnan P",
        email: "XP 3000",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "XP 3000",
      },
      content: "This is a simple answe headding only or simple first line or some thing like that a",
      votes: 3,
    },
  ])

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      {/* Sidebar - Same as previous implementation */}
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
            <NavItem icon={<Users className="h-5 w-5" />} label="Users" />
            <NavItem icon={<HelpCircle className="h-5 w-5" />} label="Questions" />
            <NavItem icon={<Tag className="h-5 w-5" />} label="Manage Coupons" />
            <NavItem icon={<Gift className="h-5 w-5" />} label="Manage Rewards" />
            <NavItem icon={<Coins className="h-5 w-5" />} label="Manage GlowCoin" />
            <NavItem icon={<MessageSquare className="h-5 w-5" />} label="Message" />
            <NavItem icon={<BarChart2 className="h-5 w-5" />} label="Reports" active />
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
          <h1 className="text-xl font-semibold">Reports</h1>

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
            <h2 className="text-xl font-semibold mb-6">Reported Items</h2>

            <Tabs defaultValue="users" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:border-[#FF4747] data-[state=active]:text-[#FF4747] border-b-2 border-transparent rounded-none"
                >
                  Users <Badge className="ml-2 bg-gray-200 text-gray-700">2</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="questions"
                  className="data-[state=active]:border-[#47B5FF] data-[state=active]:text-[#47B5FF] border-b-2 border-transparent rounded-none"
                >
                  Questions <Badge className="ml-2 bg-gray-200 text-gray-700">3</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="answers"
                  className="data-[state=active]:border-[#A47AFF] data-[state=active]:text-[#A47AFF] border-b-2 border-transparent rounded-none"
                >
                  Answers <Badge className="ml-2 bg-gray-200 text-gray-700">2</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-6 space-y-4">
                {reportedUsers.map((item) => (
                  <ReportedUserCard key={item.id} item={item} />
                ))}
              </TabsContent>

              <TabsContent value="questions" className="mt-6 space-y-4">
                {reportedQuestions.map((item) => (
                  <ReportedQuestionCard key={item.id} item={item} />
                ))}
              </TabsContent>

              <TabsContent value="answers" className="mt-6 space-y-4">
                {reportedAnswers.map((item) => (
                  <ReportedAnswerCard key={item.id} item={item} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

// Reusable NavItem component from previous implementation
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
        active ? "bg-[#FF9838] bg-opacity-10 text-[#ffffff] font-bold " : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </a>
  )
}

// Card components for each type of reported item
function ReportedUserCard({ item }: { item: ReportedItem }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={item.user.avatar} />
            <AvatarFallback>{item.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{item.user.name}</h3>
            <p className="text-sm text-gray-500">{item.user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            <span>{item.stats?.coins}</span>
            <span className="ml-1">coins</span>
          </div>
          <div className="text-sm text-gray-500">
            <span>{item.stats?.qe}</span>
            <span className="ml-1">QE</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-1">
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          <span className="text-sm">{item.votes}</span>
        </div>
        <Button variant="destructive" size="sm">
          Ban
        </Button>
      </div>
    </div>
  )
}

function ReportedQuestionCard({ item }: { item: ReportedItem }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{item.content}</h3>
        {item.tags?.map((tag, index) => (
          <Badge key={index} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={item.user.avatar} />
            <AvatarFallback>{item.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-gray-500">{item.user.xp}</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span className="text-sm">{item.votes}</span>
          </div>
          <Button variant="secondary" size="sm">
            Unlist
          </Button>
        </div>
      </div>
    </div>
  )
}

function ReportedAnswerCard({ item }: { item: ReportedItem }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-3">{item.content}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={item.user.avatar} />
            <AvatarFallback>{item.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-gray-500">{item.user.xp}</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span className="text-sm">{item.votes}</span>
          </div>
          <Button variant="secondary" size="sm">
            Unlist
          </Button>
        </div>
      </div>
    </div>
  )
}