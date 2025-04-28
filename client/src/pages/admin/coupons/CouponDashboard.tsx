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
import { format } from "date-fns";

interface Coupon {
  _id: string;
  code: string;
  gcoinAmount: number;
  expiryDate: Date;
  isListed: boolean;
  createdAt: Date;
}

export default function CouponDashboard() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      _id: "1",
      code: "WELCOME20",
      gcoinAmount: 20,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isListed: true,
      createdAt: new Date(),
    },
    {
      _id: "2",
      code: "SUMMER50",
      gcoinAmount: 50,
      expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      isListed: true,
      createdAt: new Date(),
    },
    {
      _id: "3",
      code: "VIP100",
      gcoinAmount: 100,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isListed: false,
      createdAt: new Date(),
    },
  ]);

  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>(coupons);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [action, setAction] = useState<"list" | "unlist">("list");

  const itemsPerPage = 8;

  const handleAddCoupon = (newCoupon: Omit<Coupon, "_id" | "isListed" | "createdAt">) => {
    const coupon: Coupon = {
      _id: (coupons.length + 1).toString(),
      ...newCoupon,
      isListed: true,
      createdAt: new Date(),
    };
    setCoupons((prev) => [...prev, coupon]);
    setFilteredCoupons((prev) => [...prev, coupon]);
    toast.success("Coupon added successfully");
    setIsAddModalOpen(false);
  };

  const handleUpdateCoupon = (updatedCoupon: Coupon) => {
    setCoupons((prev) =>
      prev.map((coupon) => (coupon._id === updatedCoupon._id ? updatedCoupon : coupon))
    );
    setFilteredCoupons((prev) =>
      prev.map((coupon) => (coupon._id === updatedCoupon._id ? updatedCoupon : coupon))
    );
    toast.success("Coupon updated successfully");
    setIsEditModalOpen(false);
  };

  const handleListUnlist = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setAction(coupon.isListed ? "unlist" : "list");
    setIsConfirmationOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedCoupon) return;
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon._id === selectedCoupon._id ? { ...coupon, isListed: !coupon.isListed } : coupon
      )
    );
    setFilteredCoupons((prev) =>
      prev.map((coupon) =>
        coupon._id === selectedCoupon._id ? { ...coupon, isListed: !coupon.isListed } : coupon
      )
    );
    toast.success(`Coupon ${selectedCoupon.isListed ? "unlisted" : "listed"} successfully`);
    setIsConfirmationOpen(false);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Coupon Management</h1>
          <div className="flex items-center space-x-4">
            <UserHeader />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Coupons</h2>
                <p className="text-gray-500 text-sm mt-1">
                  All the coupons with their GCoin amounts and expiry dates.
                </p>
              </div>
              <Button
                className="bg-[#FF9838] hover:bg-[#e67f26]"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Coupon
              </Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Coupon Code</TableHead>
                    <TableHead>GCoin Amount</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCoupons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No coupons found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentCoupons.map((coupon) => (
                      <TableRow key={coupon._id}>
                        <TableCell className="font-medium">{coupon.code}</TableCell>
                        <TableCell>{coupon.gcoinAmount} GCoins</TableCell>
                        <TableCell>{format(new Date(coupon.expiryDate), "MMM dd, yyyy")}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            onClick={() => handleListUnlist(coupon)}
                            variant={coupon.isListed ? "destructive" : "success"}
                            size="sm"
                          >
                            {coupon.isListed ? "Unlist" : "List"}
                          </Button>
                          <Button
                            onClick={() => handleEdit(coupon)}
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
              totalItems={filteredCoupons.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      {/* Add Coupon Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Coupon</DialogTitle>
          </DialogHeader>
          <CouponForm
            onSave={handleAddCoupon}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Coupon Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          <CouponForm
            coupon={selectedCoupon || undefined}
            onSave={handleUpdateCoupon}
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
            Are you sure you want to {action} the coupon "{selectedCoupon?.code}"?
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

interface CouponFormProps {
  coupon?: Coupon | null;
  onSave: (coupon: Omit<Coupon, "_id" | "isListed" | "createdAt">) => void;
  onCancel: () => void;
}

function CouponForm({ coupon, onSave, onCancel }: CouponFormProps) {
  const [code, setCode] = useState(coupon?.code || "");
  const [gcoinAmount, setGCoinAmount] = useState(coupon?.gcoinAmount || 0);
  const [expiryDate, setExpiryDate] = useState(
    coupon?.expiryDate ? format(new Date(coupon.expiryDate), "yyyy-MM-dd") : ""
  );

  const handleSubmit = () => {
    if (!code || gcoinAmount <= 0 || !expiryDate) {
      toast.error("Please fill all fields correctly");
      return;
    }
    
    const newCoupon = {
      code,
      gcoinAmount,
      expiryDate: new Date(expiryDate),
    };
    
    onSave(newCoupon);
    setCode("");
    setGCoinAmount(0);
    setExpiryDate("");
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="code" className="text-right">
          Coupon Code
        </Label>
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="col-span-3"
          placeholder="Enter coupon code"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="gcoin" className="text-right">
          GCoin Amount
        </Label>
        <Input
          id="gcoin"
          type="number"
          value={gcoinAmount}
          onChange={(e) => setGCoinAmount(Number(e.target.value))}
          className="col-span-3"
          placeholder="Enter GCoin amount"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="expiry" className="text-right">
          Expiry Date
        </Label>
        <Input
          id="expiry"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="col-span-3"
          min={format(new Date(), "yyyy-MM-dd")}
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