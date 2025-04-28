"use client"

import { useState } from "react"
import { Coins, Gift, Send } from "lucide-react"
import Header from "@/components/user/Header/Header"
import Sidebar from "@/components/user/SideBar/SideBar"

export default function GCoinPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [redeemCode, setRedeemCode] = useState("")

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar sidebarExpanded={sidebarExpanded} activePage="GCoin" setSidebarExpanded={setSidebarExpanded} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="bg-black text-white py-16 mb-8 text-center rounded-lg">
              <h1 className="text-6xl font-bold mb-12">GlowME</h1>

              <div className="flex justify-center gap-4 mt-8">
                <button className="flex items-center gap-2 bg-white border border-white hover:bg-gray-900 text-white px-4 py-2 rounded-full">
                  <Gift size={18} className="text-black"/>
                  <span className="text-black">Redeem</span>
                </button>

                <button className="flex items-center gap-2 bg-black border border-white hover:bg-gray-900 text-white px-4 py-2 rounded-full">
                  <Coins size={18} />
                  <span>Earn LeetCoin</span>
                </button>

                <button className="flex items-center gap-2 bg-black border border-white hover:bg-gray-900 text-white px-4 py-2 rounded-full">
                  <Send size={18} />
                  <span>View Orders</span>
                </button>
              </div>
            </div>

            {/* Regular Coins Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">By Glow Coins</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CoinCard amount={100} price={10} />
                <CoinCard amount={250} price={20} />
                <CoinCard amount={600} price={50} />
                <CoinCard amount={750} price={60} />
                <CoinCard amount={800} price={65} />
                <CoinCard amount={1500} price={100} />
              </div>
            </div>

            {/* Redeem With Code Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-center mb-2">Redeem With Code</h3>
              <div className="flex justify-center">
                <div className="flex w-full max-w-md">
                  <input
                    type="text"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    className="flex-1 border rounded-l-md px-4 py-2"
                    placeholder="Enter code"
                  />
                  <button className="bg-black text-white px-4 py-2 rounded-r-md">Redeem</button>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <h2 className="text-2xl font-bold mb-4">coin transaction</h2>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left border-r">transaction type</th>
                      <th className="py-3 px-4 text-center border-r">Gcoin</th>
                      <th className="py-3 px-4 text-center">Currency spend</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-3 px-4 border-r">Question asked</td>
                      <td className="py-3 px-4 text-center border-r text-red-500">-5 Gcoin</td>
                      <td className="py-3 px-4 text-center">nil</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 px-4 border-r">Question answered</td>
                      <td className="py-3 px-4 text-center border-r text-green-500">+1 Gcoin</td>
                      <td className="py-3 px-4 text-center">nil</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 px-4 border-r">Bought Gcoin</td>
                      <td className="py-3 px-4 text-center border-r text-green-500">+1500 Gcoin</td>
                      <td className="py-3 px-4 text-center">$100</td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-gray-50 py-3 px-4 text-right border-t">
                  <span className="font-medium">Total Spend: </span>
                  <span>$100</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function CoinCard({ amount, price }: { amount: number; price: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-800 p-6 flex flex-col justify-center items-center">
        <Coins className="text-yellow-500 w-[80px] h-[80px]" />
        <div className="text-yellow-500 text-2xl font-bold">{amount}</div>
      </div>
      <div className="p-3 flex justify-between items-center">
        <div className="text-sm text-gray-600">{amount} glow coin</div>
        <button className="bg-black text-white text-xs px-2 py-1 rounded">{`PAY ₹${price}`}</button>
      </div>
    </div>
  )
}
