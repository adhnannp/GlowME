import { useState, useEffect } from 'react';
import { fetchOrders } from '@/services/admin/admin.order.service';
import { PaginatedOrders } from '@/services/admin/admin.order.service';

export const useOrders = (initialPage = 1, initialLimit = 10) => {
  const [orders, setOrders] = useState<PaginatedOrders | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const loadOrders = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders(page, limit);
      setOrders(data);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(currentPage);
  }, []);

  const goToPage = (page: number) => {
    if (page >= 1 && (!orders || page <= orders.total)) {
      loadOrders(page);
    }
  };

  const nextPage = () => {
    if (orders && currentPage < orders.total) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const refresh = () => {
    loadOrders(currentPage);
  };

  return {
    orders,
    loading,
    error,
    currentPage,
    totalPages: orders?.total || 0,
    goToPage,
    nextPage,
    prevPage,
    refresh,
    canGoNext: orders ? currentPage < orders.total : false,
    canGoPrev: currentPage > 1
  };
};