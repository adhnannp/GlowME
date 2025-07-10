import Sidebar from "@/components/admin/SideBar/Sidebar"
import UserHeader from "@/components/admin/users/UserHeader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera } from "lucide-react"

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const handleBack = () => {
    window.location.href = "/orders"
  }

  return (
      <div className="flex h-screen bg-[#FFF8F0]">
        <Sidebar/>
          <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">Order Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <UserHeader />
            </div>
          </header>
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Order details</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-gray-500">Order no:</span>
                    <span className="ml-2 font-medium">EL-5414587</span>
                  </div>
                  <div>
                    <span className="text-gray-500">From:</span>
                    <span className="ml-2 font-medium">25 Dec, 2022</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between text-white">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-white rounded-full mb-2"></div>
                    <div className="text-center">
                      <div className="font-medium">Order received</div>
                      <div className="text-sm opacity-90">25 Dec, 2022</div>
                    </div>
                  </div>
                  <div className="flex-1 h-0.5 bg-white mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-white rounded-full mb-2"></div>
                    <div className="text-center">
                      <div className="font-medium">Pending</div>
                      <div className="text-sm opacity-90">26 Dec, 2022</div>
                    </div>
                  </div>
                  <div className="flex-1 h-0.5 bg-white mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-white rounded-full mb-2"></div>
                    <div className="text-center">
                      <div className="font-medium">Shipped</div>
                      <div className="text-sm opacity-90">28 Dec, 2022</div>
                    </div>
                  </div>
                  <div className="flex-1 h-0.5 bg-white mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-white rounded-full mb-2"></div>
                    <div className="text-center">
                      <div className="font-medium">Delivered</div>
                      <div className="text-sm opacity-90">29 Dec, 2022</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Product detail</h3>
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <Camera className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Camera</h4>
                            <p className="text-sm text-gray-500">GCoin 200</p>
                            <p className="text-sm text-gray-500">Order was delivered 2 days ago</p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800">Delivered</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">User Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Andriana</div>
                          <div className="text-sm text-gray-500">andriana@gmail.com</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Followers:</span>
                          <span className="ml-2">40018</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Xp:</span>
                          <span className="ml-2">40018</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Oliver Liam</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Company Name:</span>
                          <span>Viking Burrito</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email Address:</span>
                          <span>Oliver.viking@burrito.com</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">VAT number:</span>
                          <span>FRB1235476</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">name:</span>
                          <span>adhnan P</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">email:</span>
                          <span>adhnanusmnal234@gmail.com</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Address:</span>
                          <span>poongattayil</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">landmark:</span>
                          <span>kuzhappully</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">city:</span>
                          <span>some city</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">state:</span>
                          <span>some state</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">pincode:</span>
                          <span>679580</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
      </div>
  )
}
