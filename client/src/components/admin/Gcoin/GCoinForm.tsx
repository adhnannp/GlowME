import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { GCoin } from '@/pages/admin/GCoin/GCoinDashboard';
import { createCoinPlan, updateCoinPlan, CoinPlanData } from '@/services/admin/admin.coinPlan.service';

interface GCoinFormProps {
  gcoin?: GCoin | null;
  onCancel: () => void;
  setGCoins: React.Dispatch<React.SetStateAction<GCoin[]>>;
}

export default function GCoinForm({ gcoin, onCancel, setGCoins }: GCoinFormProps) {
  const [title, setTitle] = useState(gcoin?.title || '');
  const [coins, setCoins] = useState(gcoin?.coins || 0);
  const [price, setPrice] = useState(gcoin?.price || 0);

  const handleSubmit = async () => {
    if (!title || coins <= 0 || price <= 0) {
      toast.error('Please fill all fields correctly');
      return;
    }

    const planData: CoinPlanData = { title, coins, price };

    try {
      if (gcoin) {
        const updatedPlan = await updateCoinPlan(gcoin._id, planData);
        setGCoins((prev) =>
          prev.map((p) => (p._id === gcoin._id ? updatedPlan : p))
        );
      } else {
        const createdPlan = await createCoinPlan(planData);
        setGCoins((prev) => [...prev, createdPlan]);
      }
      onCancel();
    } catch (err) {
        console.error(err)
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{gcoin ? 'Edit GCoin' : 'Add GCoin'}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
            placeholder="Enter GCoin title"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="coins" className="text-right">
            Coins
          </Label>
          <Input
            id="coins"
            type="number"
            value={coins}
            onChange={(e) => setCoins(Number(e.target.value))}
            className="col-span-3"
            placeholder="Enter coins amount"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price (₹)
          </Label>
          <Input
            id="price"
            type="number"
            step="1"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="col-span-3"
            placeholder="Enter price"
          />
        </div>
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
    </>
  );
}