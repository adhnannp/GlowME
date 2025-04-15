import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { User } from "@/interfaces/auth.interface"

interface BanUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (userId: string, duration: string) => void
  user: User | null
}

export default function BanUserModal({ isOpen, onClose, onConfirm, user }: BanUserModalProps) {
  const [duration, setDuration] = useState<string>("one_day")

  const handleConfirm = () => {
    if (user) {
      onConfirm(user._id, duration)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            Are you sure you want to ban <span className="font-semibold">{user?.username || "this user"}</span>?
          </p>
          <div className="space-y-2">
            <Label>Select ban duration:</Label>
            <RadioGroup value={duration} onValueChange={setDuration} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one_day" id="one_day" />
                <Label htmlFor="one_day">One day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one_week" id="one_week" />
                <Label htmlFor="one_week">One week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one_month" id="one_month" />
                <Label htmlFor="one_month">One month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one_year" id="one_year" />
                <Label htmlFor="one_year">One year</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="permanent" id="permanent" />
                <Label htmlFor="permanent">Permanent ban</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Ban User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
