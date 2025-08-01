import { useState, useEffect } from "react";
import { ChevronDown, RefreshCcw } from "lucide-react";
import { OrdersTable } from "@/components/admin/Order/OrderTable";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Sidebar from "@/components/admin/SideBar/Sidebar";
import UserHeader from "@/components/admin/users/UserHeader";
import Pagination from "@/components/admin/users/Pagination";
import { fetchOrders, PaginatedOrders } from "@/services/admin/admin.order.service";
import IOrder from "@/interfaces/user.order.interface";

export default function OrdersPage() {
  const [filter, setFilter] = useState("ALL");
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response: PaginatedOrders = await fetchOrders(currentPage, itemsPerPage,filter);
      const mappedOrders = response.orders
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

  useEffect(() => {
    loadOrders();
  }, [currentPage, filter, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    setFilter("all");
    loadOrders();
  };

  const handleFilterChange = (status: string) => {
    setCurrentPage(1);
    setFilter(status);
  };


  const handleViewOrder = (orderId: string) => {
    window.location.href = `/admin/orders/${orderId}`;
  };

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
              <div className="flex gap-2 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="text-orange-500 border-orange-500 bg-transparent">
                      {filter.toLocaleUpperCase()} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleFilterChange("all")}>ALL</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterChange("pending")}>PENDING</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterChange("packed")}>PACKED</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterChange("delivered")}>DELIVERED</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterChange("shipped")}>SHIPPED</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterChange("canceled")}>CANCELED</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="text-orange-500 border-orange-500 bg-transparent" onClick={handleRefresh}>
                  <RefreshCcw/>Refresh
                </Button>
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden">
              {loading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">No Order Found</div>
              ) : (
                <OrdersTable orders={orders} setOrders={setOrders} onViewOrder={handleViewOrder} />
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