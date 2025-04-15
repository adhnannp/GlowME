import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { User } from "@/interfaces/auth.interface"

interface UnbanUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (userId: string) => void
  user: User | null
}

export default function UnbanUserModal({ isOpen, onClose, onConfirm, user }: UnbanUserModalProps) {
  const handleConfirm = () => {
    if (user) {
      onConfirm(user._id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unban User</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to unban <span className="font-semibold">{user?.username || "this user"}</span>?
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-[#FF9838] hover:bg-[#e67f26]">
            Unban User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
