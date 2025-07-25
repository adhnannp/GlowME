import { useEffect, useState } from "react"
import { fetchUserAddresses } from "@/services/user/user.address.service"
import type IUserAddress from "@/interfaces/user.address.interface"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Props {
  selectedId: string | null
  onSelect: (addr: IUserAddress | null) => void
}

export default function AddressSelector({ selectedId, onSelect }: Props) {
  const [addresses, setAddresses] = useState<IUserAddress[]>([])

  useEffect(() => {
    fetchUserAddresses().then(setAddresses)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      {addresses.map((address) => (
        <div
          key={address._id}
          className={cn(
            "border p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm",
            selectedId === address._id
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-gray-200 hover:border-gray-300",
          )}
          onClick={() => onSelect(address)}
        >
          <p className="font-medium text-sm">{address.name}</p>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {address.address}, {address.state}, {address.pincode}
          </p>
        </div>
      ))}
      <Button
        variant="outline"
        className="h-16 border-dashed border-2 border-gray-300 hover:border-gray-400 text-sm bg-transparent"
        onClick={() => onSelect(null)}
      >
        + Add New Address
      </Button>
    </div>
  )
}
