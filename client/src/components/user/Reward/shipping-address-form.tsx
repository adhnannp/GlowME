import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type IUserAddress from "@/interfaces/user.address.interface"
import { useEffect, useState } from "react"
import { createAddress, updateAddress } from "@/services/user/user.address.service"
import { addressSchema } from "@/validations/address/addressSchema"

interface Props {
  selectedAddress: IUserAddress | null
  refreshAddresses: () => void
  isEditing: boolean
  setIsEditing: (val: boolean) => void
}

export default function ShippingAddressForm({
  selectedAddress,
  refreshAddresses,
  setIsEditing,
  isEditing,
}: Props) {
  const [address, setAddress] = useState<IUserAddress>({
    name: "",
    phone: "",
    pincode: "",
    landmark: "",
    state: "",
    country: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IUserAddress, string>>>({});

  useEffect(() => {
    if (selectedAddress) {
      setAddress(selectedAddress);
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setAddress({
        name: "",
        phone: "",
        pincode: "",
        landmark: "",
        state: "",
        country: "",
        address: "",
      });
    }
    setErrors({});
  }, [selectedAddress]);

  const handleChange = (field: keyof IUserAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const handlePincodeLookup = async (pin: string) => {
    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
          const office = data[0].PostOffice[0];
          setAddress((prev) => ({
            ...prev,
            state: office.State,
            country: office.Country,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch pincode info:", err);
      }
    }
  };

  const handleSave = async () => {
    const result = addressSchema.safeParse(address);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof IUserAddress, string>> = {};
      result.error.errors.forEach((e) => {
        const path = e.path[0] as keyof IUserAddress;
        fieldErrors[path] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (selectedAddress?._id) {
      await updateAddress(selectedAddress._id, result.data);
    } else {
      await createAddress(result.data);
    }

    refreshAddresses();
    setIsEditing(false);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-600">Shipping Address</h2>
        {!isEditing && (
          <button className="text-sm text-blue-500 hover:text-blue-700 underline" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { id: "name", label: "Name" },
          { id: "phone", label: "Phone" },
        ].map((field) => (
          <div key={field.id}>
            <Label htmlFor={field.id} className="text-sm text-gray-700 block mb-1">
              {field.label}
            </Label>
            <Input
              id={field.id}
              value={address[field.id as keyof IUserAddress] ?? ""}
              disabled={!isEditing}
              onChange={(e) => handleChange(field.id as keyof IUserAddress, e.target.value)}
              className="h-9"
            />
            {errors[field.id as keyof IUserAddress] && (
              <p className="text-xs text-red-500 mt-1">{errors[field.id as keyof IUserAddress]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <Label htmlFor="address" className="text-sm text-gray-700 block mb-1">
          Address line 1
        </Label>
        <Input
          id="address"
          value={address.address ?? ""}
          disabled={!isEditing}
          onChange={(e) => handleChange("address", e.target.value)}
          className="h-9"
        />
        {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        {[
          { id: "landmark", label: "Landmark" },
          { id: "state", label: "State" },
          { id: "pincode", label: "Postal Code" },
        ].map((field) => (
          <div key={field.id}>
            <Label htmlFor={field.id} className="text-sm text-gray-700 block mb-1">
              {field.label}
            </Label>
            <Input
              id={field.id}
              value={address[field.id as keyof IUserAddress] ?? ""}
              disabled={!isEditing}
              onChange={(e) => {
                handleChange(field.id as keyof IUserAddress, e.target.value);
                if (field.id === "pincode") handlePincodeLookup(e.target.value);
              }}
              className="h-9"
            />
            {errors[field.id as keyof IUserAddress] && (
              <p className="text-xs text-red-500 mt-1">{errors[field.id as keyof IUserAddress]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <Label htmlFor="country" className="text-sm text-gray-700 block mb-1">
          Country
        </Label>
        <Input
          id="country"
          value={address.country ?? ""}
          disabled={!isEditing}
          onChange={(e) => handleChange("country", e.target.value)}
          className="h-9"
        />
        {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
      </div>

      {isEditing && (
        <button
          className="mt-4 bg-black text-white py-2 px-4 rounded text-sm hover:bg-gray-800 transition-colors"
          onClick={handleSave}
        >
          Save Address
        </button>
      )}
    </div>
  );
}
