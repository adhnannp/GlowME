import { useEffect, useState } from "react";
import { fetchUserOrders, cancelOrder, fetchOrderById } from "@/services/user/user.order.service";
import { IOrderWithProduct } from "@/interfaces/user.order.interface";
import IOrder from "@/interfaces/user.order.interface";
import OrderTable from "./orderTable";
import AddressModal from "./addressModal";
import ProductModal from "./productModal";

export default function OrdersSection() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IOrder | null>(null);
  const [selectedProductOrder, setSelectedProductOrder] = useState<IOrderWithProduct | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchUserOrders(page, limit);
      setOrders(data.orders);
      setTotal(data.total);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      loadOrders();
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  const handleViewProduct = async (orderId: string) => {
    try {
      const order = await fetchOrderById(orderId);
      setSelectedProductOrder(order);
    } catch (err) {
      console.error("Failed to fetch product info", err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {loading ? (
        <div className="text-center">Loading orders...</div>
      ) : (
        <>
          <OrderTable
            orders={orders}
            onCancel={handleCancel}
            onViewAddress={(order) => setSelectedAddress(order)}
            onViewProduct={handleViewProduct}
          />

          <div className="flex justify-center mt-4 space-x-2 items-center">
            {page > 1 && (
              <button onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
                Previous
              </button>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${
                  page === p ? "bg-gray-200" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {p}
              </button>
            ))}
            {page < totalPages && (
              <button onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
                Next
              </button>
            )}
          </div>
        </>
      )}

      {selectedAddress && (
        <AddressModal order={selectedAddress} onClose={() => setSelectedAddress(null)} />
      )}

      {selectedProductOrder && (
        <ProductModal order={selectedProductOrder} onClose={() => setSelectedProductOrder(null)} />
      )}
    </div>
  );
}
