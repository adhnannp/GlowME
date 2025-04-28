import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import Sidebar from "@/components/admin/SideBar/Sidebar";
import UserHeader from "@/components/admin/users/UserHeader";
import Pagination from "@/components/admin/users/Pagination";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GCoin {
  _id: string;
  name: string;
  gcoin: number;
  price: number;
  boughtCount: number;
  isListed: boolean;
}

export default function GCoinDashboard() {
  const [gcoins, setGCoins] = useState<GCoin[]>([
    { _id: "1", name: "Starter Pack", gcoin: 100, price: 1.99, boughtCount: 150, isListed: true },
    { _id: "2", name: "Pro Pack", gcoin: 500, price: 9.99, boughtCount: 75, isListed: true },
    { _id: "3", name: "Elite Pack", gcoin: 1000, price: 19.99, boughtCount: 30, isListed: false },
    { _id: "4", name: "Mega Pack", gcoin: 2500, price: 49.99, boughtCount: 10, isListed: true },
  ]);
  const [filteredGCoins, setFilteredGCoins] = useState<GCoin[]>(gcoins);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedGCoin, setSelectedGCoin] = useState<GCoin | null>(null);
  const [action, setAction] = useState<"list" | "unlist">("list");

  const itemsPerPage = 8;

  const handleAddGCoin = (newGCoin: Omit<GCoin, "_id" | "boughtCount" | "isListed">) => {
    const gcoin: GCoin = {
      _id: (gcoins.length + 1).toString(),
      ...newGCoin,
      boughtCount: 0,
      isListed: true,
    };
    setGCoins((prev) => [...prev, gcoin]);
    setFilteredGCoins((prev) => [...prev, gcoin]);
    toast.success("GCoin added successfully");
    setIsAddModalOpen(false);
  };

  const handleUpdateGCoin = (updatedGCoin: GCoin) => {
    setGCoins((prev) =>
      prev.map((gcoin) => (gcoin._id === updatedGCoin._id ? updatedGCoin : gcoin))
    );
    setFilteredGCoins((prev) =>
      prev.map((gcoin) => (gcoin._id === updatedGCoin._id ? updatedGCoin : gcoin))
    );
    toast.success("GCoin updated successfully");
    setIsEditModalOpen(false);
  };

  const handleListUnlist = (gcoin: GCoin) => {
    setSelectedGCoin(gcoin);
    setAction(gcoin.isListed ? "unlist" : "list");
    setIsConfirmationOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedGCoin) return;
    setGCoins((prev) =>
      prev.map((gcoin) =>
        gcoin._id === selectedGCoin._id ? { ...gcoin, isListed: !gcoin.isListed } : gcoin
      )
    );
    setFilteredGCoins((prev) =>
      prev.map((gcoin) =>
        gcoin._id === selectedGCoin._id ? { ...gcoin, isListed: !gcoin.isListed } : gcoin
      )
    );
    toast.success(`GCoin ${selectedGCoin.isListed ? "unlisted" : "listed"} successfully`);
    setIsConfirmationOpen(false);
  };

  const handleEdit = (gcoin: GCoin) => {
    setSelectedGCoin(gcoin);
    setIsEditModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGCoins = filteredGCoins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGCoins.length / itemsPerPage);

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
              <Button
                className="bg-[#FF9838] hover:bg-[#e67f26]"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add GCoin
              </Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">GCoin</TableHead>
                    <TableHead>Bought Count</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentGCoins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No GCoins found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentGCoins.map((gcoin) => (
                      <TableRow key={gcoin._id}>
                        <TableCell>
                          {gcoin.name} ({gcoin.gcoin} GCoins)
                        </TableCell>
                        <TableCell>{gcoin.boughtCount}</TableCell>
                        <TableCell>${gcoin.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            onClick={() => handleListUnlist(gcoin)}
                            variant={gcoin.isListed ? "destructive" : "success"}
                            size="sm"
                          >
                            {gcoin.isListed ? "Unlist" : "List"}
                          </Button>
                          <Button
                            onClick={() => handleEdit(gcoin)}
                            className="bg-[#FF9838] hover:bg-[#e67f26]"
                            size="sm"
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredGCoins.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      {/* Add GCoin Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add GCoin</DialogTitle>
          </DialogHeader>
          <GCoinForm
            onSave={handleAddGCoin}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit GCoin Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit GCoin</DialogTitle>
          </DialogHeader>
          <GCoinForm
            gcoin={selectedGCoin}
            onSave={handleUpdateGCoin}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm {action === "list" ? "Listing" : "Unlisting"}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to {action} the GCoin "{selectedGCoin?.name}"?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#FF9838] hover:bg-[#e67f26]" 
              onClick={handleConfirm}
            >
              Confirm {action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface GCoinFormProps {
  gcoin?: GCoin | null;
  onSave: (gcoin: any) => void;
  onCancel: () => void;
}

function GCoinForm({ gcoin, onSave, onCancel }: GCoinFormProps) {
  const [name, setName] = useState(gcoin?.name || "");
  const [gcoinAmount, setGCoinAmount] = useState(gcoin?.gcoin || 0);
  const [price, setPrice] = useState(gcoin?.price || 0);

  const handleSubmit = () => {
    if (!name || gcoinAmount <= 0 || price <= 0) {
      toast.error("Please fill all fields correctly");
      return;
    }
    const newGCoin = gcoin
      ? { ...gcoin, name, gcoin: gcoinAmount, price }
      : { name, gcoin: gcoinAmount, price };
    onSave(newGCoin);
    setName("");
    setGCoinAmount(0);
    setPrice(0);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-3"
          placeholder="Enter GCoin name"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="gcoin" className="text-right">
          GCoin Quantity
        </Label>
        <Input
          id="gcoin"
          type="number"
          value={gcoinAmount}
          onChange={(e) => setGCoinAmount(Number(e.target.value))}
          className="col-span-3"
          placeholder="Enter GCoin quantity"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">
          Price ($)
        </Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="col-span-3"
          placeholder="Enter price"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          className="bg-[#FF9838] hover:bg-[#e67f26]" 
          onClick={handleSubmit}
        >
          Save
        </Button>
      </DialogFooter>
    </div>
  );
}