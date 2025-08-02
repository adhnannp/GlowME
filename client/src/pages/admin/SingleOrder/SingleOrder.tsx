import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/admin/SideBar/Sidebar";
import UserHeader from "@/components/admin/users/UserHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { fetchOneOrder, changeOrderStatus } from "@/services/admin/admin.order.service";
import { IOrderFull, OrderStatus } from "@/interfaces/user.order.interface";
import toast from "react-hot-toast";
import OrderDetails from "@/components/admin/singleOrder/StatusChange";
import OrderTimeline from "@/components/admin/singleOrder/OrderTimeline";
import ProductDetail from "@/components/admin/singleOrder/ProductDetails";
import UserDetails from "@/components/admin/singleOrder/UserDtails";
import BillingInformation from "@/components/admin/singleOrder/BillingInfo";
import { StatusChangeDialog } from "@/components/admin/Order/StatusChangeDialog";

export default function OrderDetailPage() {
  const { OrderId } = useParams<{ OrderId: string }>();
  const [order, setOrder] = useState<IOrderFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrderFull | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleStatusClick = useCallback((order: IOrderFull, status: OrderStatus) => {
    setTimeout(() => {
      setSelectedOrder(order);
      setNextStatus(status);
      setDialogOpen(true);
    }, 0);
  }, []);

  const confirmStatusChange = useCallback(() => {
    if (selectedOrder && nextStatus) {
      setLoading(true);
      changeOrderStatus(selectedOrder.orderId, nextStatus)
        .then((updatedOrder) => {
          setOrder((prevOrder) =>
            prevOrder ? { ...prevOrder, status: updatedOrder.status, edited_at: new Date() } : prevOrder
          );
          toast.success(`Order status changed to ${updatedOrder.status.toUpperCase()}`);
          setDialogOpen(false);
          setSelectedOrder(null);
          setNextStatus(null);
        })
        .catch((error) => {
          toast.error((error as Error).message || "Failed to update status");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedOrder, nextStatus]);

  const handleBack = () => {
    window.location.href = "/admin/orders";
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
            <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg font-medium">
                {error || "No Order Found."}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
            <OrderDetails order={order} onStatusClick={handleStatusClick} />
            <OrderTimeline order={order} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <ProductDetail order={order} />
                <UserDetails order={order} />
              </div>
              <BillingInformation order={order} />
            </div>
          </div>
        </main>
        <StatusChangeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          nextStatus={nextStatus}
          onConfirm={confirmStatusChange}
          loading={loading}
        />
      </div>
    </div>
  );
}