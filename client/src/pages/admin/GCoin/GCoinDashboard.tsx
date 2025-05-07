import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Sidebar from '@/components/admin/SideBar/Sidebar';
import UserHeader from '@/components/admin/users/UserHeader';
import GCoinTable from '@/components/admin/Gcoin/GCoinTable';
import GCoinForm from '@/components/admin/Gcoin/GCoinForm';
import ConfirmationDialog from '@/components/admin/Gcoin/ConfirmationDialog';
import Pagination from '@/components/admin/users/Pagination';
import { getAllCoinPlans, listCoinPlan, unlistCoinPlan } from '@/services/admin/admin.coinPlan.service';

export interface GCoin {
  _id: string;
  title: string;
  coins: number;
  price: number;
  isListed: boolean;
  created_at?: Date;
  edited_at?: Date;
}

export default function GCoinDashboard() {
  const [gcoins, setGCoins] = useState<GCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedGCoin, setSelectedGCoin] = useState<GCoin | null>(null);
  const [action, setAction] = useState<'list' | 'unlist'>('list');

  const itemsPerPage = 8;
  const totalPages = gcoins.length > 0 ? Math.ceil(gcoins.length / itemsPerPage) : 1;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageFromUrl = params.get('page');
    const page = pageFromUrl ? parseInt(pageFromUrl) : 1;
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      params.set('page', '1');
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
      setCurrentPage(1);
    }
  }, [totalPages]);

  useEffect(() => {
    const fetchGCoins = async () => {
      setLoading(true);
      try {
        const response = await getAllCoinPlans();
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid API response: data is not an array');
        }
        setGCoins(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GCoins');
        console.error('Fetch GCoins error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGCoins();
  }, []);

  const handleListUnlist = (gcoin: GCoin) => {
    setSelectedGCoin(gcoin);
    setAction(gcoin.isListed ? 'unlist' : 'list');
    setIsConfirmationOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedGCoin) return;
    try {
      if (action === 'list') {
        await listCoinPlan(selectedGCoin._id);
        setGCoins((prev) =>
          prev.map((gcoin) =>
            gcoin._id === selectedGCoin._id ? { ...gcoin, isListed: true } : gcoin
          )
        );
      } else {
        await unlistCoinPlan(selectedGCoin._id);
        setGCoins((prev) =>
          prev.map((gcoin) =>
            gcoin._id === selectedGCoin._id ? { ...gcoin, isListed: false } : gcoin
          )
        );
      }
      setIsConfirmationOpen(false);
    } catch (err) {
      console.error(`Error ${action}ing GCoin:`, err);
    }
  };

  const handleEdit = (gcoin: GCoin) => {
    setSelectedGCoin(gcoin);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      const params = new URLSearchParams(window.location.search);
      params.set('page', page.toString());
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">GCoin Management</h1>
          <div className="flex items-center space-x-4">
            <UserHeader />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">GCoins</h2>
                <p className="text-gray-500 text-sm mt-1">
                  All the GCoins with their prices and quantities used in the system.
                </p>
              </div>
              <button
                className="bg-[#FF9838] hover:bg-[#e67f26] text-white px-4 py-2 rounded"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add GCoin
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="rounded-lg border overflow-hidden">
              <GCoinTable
                gcoins={gcoins}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                loading={loading}
                onEdit={handleEdit}
                onListUnlist={handleListUnlist}
              />
            </div>

            {!loading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={gcoins.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <GCoinForm onCancel={() => setIsAddModalOpen(false)} setGCoins={setGCoins} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <GCoinForm
            gcoin={selectedGCoin}
            onCancel={() => setIsEditModalOpen(false)}
            setGCoins={setGCoins}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        action={action}
        gcoinTitle={selectedGCoin?.title || ''}
        onConfirm={handleConfirm}
      />
    </div>
  );
}