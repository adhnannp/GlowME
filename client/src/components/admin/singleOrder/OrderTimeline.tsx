import { IOrderFull } from "@/interfaces/user.order.interface";

interface OrderTimelineProps {
  order: IOrderFull;
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
  const formatDate = (date: Date | undefined) => {
    return date ? new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "";
  };

  const isStatusActive = (status: string) => {
    if (status === "received") return true;
    if (order.status === "canceled") return status === "canceled";
    if (order.status === "delivered") return ["pending", "packed", "shipped", "delivered"].includes(status);
    if (order.status === "shipped") return ["pending", "packed", "shipped"].includes(status);
    if (order.status === "packed") return ["pending", "packed"].includes(status);
    if (order.status === "pending") return ["pending"].includes(status);
    return false;
  };

  const getStatusDate = (status: string) => {
    if (status === "received") return formatDate(order.created_at);
    if (status === order.status) return formatDate(order.edited_at);
    return "";
  };

  return (
    <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between text-white">
        <div className="flex flex-col items-center">
          <div
            className={`w-4 h-4 rounded-full mb-2 ${isStatusActive("received") ? "bg-white" : "border border-gray-300"}`}
          ></div>
          <div className="text-center">
            <div className={`font-medium ${isStatusActive("received") ? "text-white" : "text-gray-300"}`}>
              Order received
            </div>
            <div className="text-sm opacity-90">{getStatusDate("received")}</div>
          </div>
        </div>

        {order.status === "canceled" ? (
          <>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mb-2"></div>
              <div className="text-center">
                <div className="font-medium text-red-200">Order Canceled</div>
                <div className="text-sm opacity-90">{getStatusDate("canceled")}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className={`flex-1 h-0.5 mx-4 ${isStatusActive("pending") ? "bg-white" : "bg-gray-300"}`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 ${isStatusActive("pending") ? "bg-white" : "border border-gray-300"}`}
              ></div>
              <div className="text-center">
                <div
                  className={`font-medium ${isStatusActive("pending") ? "text-white" : "text-gray-300"}`}
                >
                  Pending
                </div>
                <div className="text-sm opacity-90">{getStatusDate("pending")}</div>
              </div>
            </div>
            <div
              className={`flex-1 h-0.5 mx-4 ${isStatusActive("packed") ? "bg-white" : "bg-gray-300"}`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 ${isStatusActive("packed") ? "bg-white" : "border border-gray-300"}`}
              ></div>
              <div className="text-center">
                <div
                  className={`font-medium ${isStatusActive("packed") ? "text-white" : "text-gray-300"}`}
                >
                  Packed
                </div>
                <div className="text-sm opacity-90">{getStatusDate("packed")}</div>
              </div>
            </div>
            <div
              className={`flex-1 h-0.5 mx-4 ${isStatusActive("shipped") ? "bg-white" : "bg-gray-300"}`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 ${isStatusActive("shipped") ? "bg-white" : "border border-gray-300"}`}
              ></div>
              <div className="text-center">
                <div
                  className={`font-medium ${isStatusActive("shipped") ? "text-white" : "text-gray-300"}`}
                >
                  Shipped
                </div>
                <div className="text-sm opacity-90">{getStatusDate("shipped")}</div>
              </div>
            </div>
            <div
              className={`flex-1 h-0.5 mx-4 ${isStatusActive("delivered") ? "bg-white" : "bg-gray-300"}`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 ${isStatusActive("delivered") ? "bg-white" : "border border-gray-300"}`}
              ></div>
              <div className="text-center">
                <div
                  className={`font-medium ${isStatusActive("delivered") ? "text-white" : "text-gray-300"}`}
                >
                  Delivered
                </div>
                <div className="text-sm opacity-90">{getStatusDate("delivered")}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}