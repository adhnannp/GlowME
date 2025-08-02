import { useState } from "react"
import type IUserAddress from "@/interfaces/user.address.interface"
import ShippingAddressForm from "./shipping-address-form"
import AddressSelector from "./AddressSelector"
import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import { buyReward } from "@/services/user/user.reward.service"
import toast from "react-hot-toast"

export default function OrderForm() {
  const [selectedAddress, setSelectedAddress] = useState<IUserAddress | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()
  const { rewardId } = useParams()
  const [loading, setLoading] = useState(false)

  const refreshAddresses = () => setRefreshTrigger(!refreshTrigger)

  const handleBuy = async () => {
    if (!rewardId || !selectedAddress || isEditing || !selectedAddress._id) return
    setLoading(true)
    try {
      await buyReward(rewardId, selectedAddress._id)
      toast.success("Purchase completed!")
      navigate(`/order`)
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lg:w-1/2 p-4">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete your order</h1>

        <AddressSelector
          key={refreshTrigger.toString()}
          selectedId={selectedAddress?._id || null}
          onSelect={(addr) => {
            setSelectedAddress(addr)
            setIsEditing(addr ? false : true)
          }}
        />

        <ShippingAddressForm
          selectedAddress={selectedAddress}
          refreshAddresses={refreshAddresses}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />

        <div className="space-y-3">
          {!selectedAddress && (
            <p className="text-sm text-red-500">Please select or add an address before proceeding</p>
          )}
          {selectedAddress && isEditing && (
            <p className="text-sm text-amber-600">Please save the address before completing your order</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 h-10 text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-10 bg-black hover:bg-gray-800 text-white disabled:opacity-50"
              disabled={!selectedAddress || isEditing || loading}
              onClick={handleBuy}
            >
              {loading ? "Processing..." : "Complete Purchase"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
