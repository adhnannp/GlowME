import { IOrderFull } from "@/interfaces/user.order.interface";

interface BillingInformationProps {
  order: IOrderFull;
}

export default function BillingInformation({ order }: BillingInformationProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">{order.address.name}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email Address:</span>
              <span>{order.user_id.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span>{order.address.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mobile:</span>
              <span>{order.address.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address:</span>
              <span>{order.address.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Landmark:</span>
              <span>{order.address.landmark || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">State:</span>
              <span>{order.address.state || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Country:</span>
              <span>{order.address.country || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pincode:</span>
              <span>{order.address.pincode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}