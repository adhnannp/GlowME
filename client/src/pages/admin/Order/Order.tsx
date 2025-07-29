import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { OrdersTable } from "@/components/admin/Order/OrderTable";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Sidebar from "@/components/admin/SideBar/Sidebar";
import UserHeader from "@/components/admin/users/UserHeader";
import Pagination from "@/components/admin/users/Pagination";
import { fetchOrders, PaginatedOrders } from "@/services/admin/admin.order.service";
import ApiOrder from "@/interfaces/user.order.interface";

interface TableOrder {
  id: string;
  orderId: string;
  orderedDate: string;
  coins:number;
  status: "pending" | "delivered" | "returned" | "shipped";
}

export default function OrdersPage() {
  const [filter, setFilter] = useState("ALL");
  const [orders, setOrders] = useState<TableOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response: PaginatedOrders = await fetchOrders(currentPage, itemsPerPage);
        const mappedOrders: TableOrder[] = response.orders.map((order: ApiOrder) => ({
          id: order._id,
          orderId: order.orderId,
          coins:order.paid_coin,
          orderedDate: new Date(order.created_at).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: order.status as "pending" | "delivered" | "returned" | "shipped",
        }));
        setOrders(mappedOrders);
        setTotalPages(Math.ceil(response.total / response.limit));
        setTotalItems(response.total);
        setCurrentPage(response.page);
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentPage, filter, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewOrder = (orderId: string) => {
    window.location.href = `/admin/orders/${orderId}`;
  };

  const filteredOrders = filter === "ALL" ? orders : orders.filter((order) => order.status.toUpperCase() === filter);

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
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
              {loading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">{error}</div>
              ) : (
                <OrdersTable orders={filteredOrders} onViewOrder={handleViewOrder} />
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
}