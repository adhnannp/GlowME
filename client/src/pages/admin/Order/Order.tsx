"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { OrdersTable } from "@/components/admin/Order/OrderTable"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Sidebar from "@/components/admin/SideBar/Sidebar"
import UserHeader from "@/components/admin/users/UserHeader"

const sampleOrders = [
  {
    id: "1",
    user: {
      name: "Andriana",
      email: "andriana@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "EL-00552",
    product: "Nike v22",
    orderedDate: "25 Dec, 2022",
    status: "pending" as const,
  },
  {
    id: "2",
    user: {
      name: "Vacinzo",
      email: "vacinzo@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "EL-00551",
    product: "Camera",
    orderedDate: "15 Dec, 2022",
    status: "delivered" as const,
  },
  {
    id: "3",
    user: {
      name: "Jone Smith",
      email: "jone@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "EL-00550",
    product: "Chair",
    orderedDate: "14 Dec, 2022",
    status: "returned" as const,
  },
  {
    id: "4",
    user: {
      name: "Leatrice Kulik",
      email: "kulik@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "EL-00549",
    product: "Laptop",
    orderedDate: "10 Dec, 2022",
    status: "pending" as const,
  },
  {
    id: "5",
    user: {
      name: "Darron Handler",
      email: "Darron@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "EL-00548",
    product: "Watch",
    orderedDate: "02 Dec, 2022",
    status: "delivered" as const,
  },
  {
    id: "6",
    user: {
      name: "Vacinzo",
      email: "vacinzo@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "EL-00547",
    product: "iphone",
    orderedDate: "26 Nov, 2022",
    status: "shipped" as const,
  },
  {
    id: "7",
    user: {
      name: "Alvaro",
      email: "Alvaro@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "EL-00546",
    product: "Perfume",
    orderedDate: "20 Nov, 2022",
    status: "pending" as const,
  },
]

export default function OrdersPage() {
  const [filter, setFilter] = useState("ALL")

  const handleViewOrder = (orderId: string) => {
    window.location.href = `/admin/orders/${orderId}`
  }

  return (
      <div className="flex h-screen bg-[#FFF8F0]">
        <Sidebar />
          <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Order Management</h1>
            <div className="flex items-center space-x-4">
              <UserHeader />
            </div>
          </header>
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Customer Orders</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    All the orders which are placed by different customers are showing below with order no.
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="text-orange-500 border-orange-500 bg-transparent">
                      {filter} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilter("ALL")}>ALL</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("PENDING")}>PENDING</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("DELIVERED")}>DELIVERED</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("SHIPPED")}>SHIPPED</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("RETURNED")}>RETURNED</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <OrdersTable orders={sampleOrders} onViewOrder={handleViewOrder} />
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">Showing 7 of 15 orders</p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Prev
                  </Button>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </main>
      </div>
  )
}
