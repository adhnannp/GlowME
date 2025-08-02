import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IOrderFull, OrderStatus } from "@/interfaces/user.order.interface";
import { memo, useRef } from "react";

interface StatusDropdownProps {
  order: IOrderFull;
  onStatusClick: (order: IOrderFull, status: OrderStatus) => void;
}

export const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  packed: "bg-yellow-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
  shipped: "bg-blue-100 text-blue-800",
};

export function getNextStatusOptions(currentStatus: OrderStatus): OrderStatus[] {
  switch (currentStatus) {
    case "pending":
      return ["packed", "shipped", "delivered"];
    case "packed":
      return ["shipped", "delivered"];
    case "shipped":
      return ["delivered"];
    default:
      return [];
  }
}

export const StatusDropdown = memo(({ order, onStatusClick }: StatusDropdownProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {getNextStatusOptions(order.status).length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge
              ref={triggerRef}
              className={`${statusColors[order.status]} cursor-pointer`}
            >
              {order.status.toUpperCase()}
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {getNextStatusOptions(order.status).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => {
                  onStatusClick(order, status);
                  triggerRef.current?.focus();
                }}
              >
                {status.toUpperCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Badge className={statusColors[order.status]}>
          {order.status.toUpperCase()}
        </Badge>
      )}
    </>
  );
});