import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/admin/SideBar/Sidebar";
import UserHeader from "@/components/admin/users/UserHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Coins } from "lucide-react";
import { fetchOneOrder } from "@/services/admin/admin.order.service";
import { IOrderFull } from "@/interfaces/user.order.interface";

export default function OrderDetailPage() {
  const { OrderId } = useParams<{ OrderId: string }>();
  const [order, setOrder] = useState<IOrderFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!OrderId) {
        setError("No Order ID provided");
        setLoading(false);
        return;
      }
      try {
        const orderData = await fetchOneOrder(OrderId);
        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order details");
        setLoading(false);
        console.error(err);
      }
    };
    fetchOrder();
  }, [OrderId]);

  const handleBack = () => {
    window.location.href = "/admin/orders";
  };

  const formatDate = (date: Date | undefined) => {
    return date
      ? new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";
  };

  const getTimelineDates = (
    createdAt: Date | undefined,
    status: string | undefined,
    editedAt: Date | undefined
  ) => {
    if (!createdAt) {
      return {
        received: "N/A",
        pending: "N/A",
        shipped: "N/A",
        delivered: "N/A",
        canceled: "N/A",
      };
    }
    const received = new Date(createdAt);
    const canceled = editedAt
      ? new Date(editedAt)
      : new Date(received.getTime() + 3 * 24 * 60 * 60 * 1000);
    if (status === "canceled") {
      return {
        received: formatDate(received),
        pending: "N/A",
        shipped: "N/A",
        delivered: "N/A",
        canceled: formatDate(canceled),
      };
    }
    const pending = new Date(received.getTime() + 24 * 60 * 60 * 1000);
    const shipped = new Date(pending.getTime() + 2 * 24 * 60 * 60 * 1000);
    const delivered = new Date(shipped.getTime() + 1 * 24 * 60 * 60 * 1000);
    return {
      received: formatDate(received),
      pending:
        status === "pending" ||
        status === "packed" ||
        status === "shipped" ||
        status === "delivered"
          ? formatDate(pending)
          : "N/A",
      shipped:
        status === "shipped" || status === "delivered"
          ? formatDate(shipped)
          : "N/A",
      delivered: status === "delivered" ? formatDate(delivered) : "N/A",
      canceled: "N/A",
    };
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#FFF8F0] items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-screen bg-[#FFF8F0] items-center justify-center">
        <p>{error || "Order not found"}</p>
      </div>
    );
  }

  const timeline = getTimelineDates(
    order.created_at,
    order.status,
    order.edited_at
  );

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
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
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-gray-500">Order ID:</span>
                  <span className="ml-2 font-medium">
                    {order.orderId || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">From:</span>
                  <span className="ml-2 font-medium">
                    {formatDate(order.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between text-white">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full mb-2 ${
                      timeline.received !== "N/A" ? "bg-white" : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="text-center">
                    <div
                      className={`font-medium ${
                        timeline.received !== "N/A"
                          ? "text-white"
                          : "text-gray-300"
                      }`}
                    >
                      Order received
                    </div>
                    <div className="text-sm opacity-90">
                      {timeline.received}
                    </div>
                  </div>
                </div>

                {timeline.canceled !== "N/A" ? (
                  <>
                    <div className="flex-1 h-0.5 bg-white mx-4"></div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mb-2"></div>
                      <div className="text-center">
                        <div className="font-medium text-red-200">
                          Order Canceled
                        </div>
                        <div className="text-sm opacity-90">
                          {timeline.canceled}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        timeline.pending !== "N/A" ? "bg-white" : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full mb-2 ${
                          timeline.pending !== "N/A"
                            ? "bg-white"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="text-center">
                        <div
                          className={`font-medium ${
                            timeline.pending !== "N/A"
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          Pending
                        </div>
                        <div className="text-sm opacity-90">
                          {timeline.pending}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        timeline.shipped !== "N/A" ? "bg-white" : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full mb-2 ${
                          timeline.shipped !== "N/A"
                            ? "bg-white"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="text-center">
                        <div
                          className={`font-medium ${
                            timeline.shipped !== "N/A"
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          Shipped
                        </div>
                        <div className="text-sm opacity-90">
                          {timeline.shipped}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        timeline.delivered !== "N/A"
                          ? "bg-white"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full mb-2 ${
                          timeline.delivered !== "N/A"
                            ? "bg-white"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="text-center">
                        <div
                          className={`font-medium ${
                            timeline.delivered !== "N/A"
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          Delivered
                        </div>
                        <div className="text-sm opacity-90">
                          {timeline.delivered}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product detail</h3>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Avatar>
                        <AvatarImage
                          src={
                            order.reward_id.coverImage ||
                            "/placeholder.svg?height=40&width=40"
                          }
                        />
                        <AvatarFallback>
                          {order.reward_id.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {order.reward_id.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            GCoin {order.paid_coin}
                          </p>
                          <p className="text-sm text-gray-500">
                            Order was{" "}
                            {order.status === "delivered"
                              ? "delivered"
                              : order.status}{" "}
                            on {formatDate(order.edited_at)}
                          </p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800">
                          {order.status?.charAt(0).toUpperCase() +
                            order.status?.slice(1) || "N/A"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">User Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={
                            order.user_id.profile_image ||
                            "/placeholder.svg?height=40&width=40"
                          }
                        />
                        <AvatarFallback>
                          {order.user_id.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {order.user_id.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user_id.email}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-500 min-w-[60px]">
                          GCoin:
                        </span>
                        <div className="flex items-center ml-2">
                          <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{order.user_id.coin_balance ?? 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 min-w-[60px]">XP:</span>
                        <span className="ml-2">{order.user_id.xp ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Billing Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{order.address.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email Address:</span>
                        <span>{order.user_id.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">name:</span>
                        <span>{order.address.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">mobile:</span>
                        <span>{order.address.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Address:</span>
                        <span>{order.address.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">landmark:</span>
                        <span>{order.address.landmark || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">state:</span>
                        <span>{order.address.state || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">contry:</span>
                        <span>{order.address.country || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">pincode:</span>
                        <span>{order.address.pincode}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
