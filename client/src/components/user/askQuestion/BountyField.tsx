import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // Assuming Shadcn/UI's class utility

interface BountyFieldProps {
  isBounty: boolean;
  bountyCoins: number;
  onBountyToggle: (checked: boolean) => void;
  onBountyCoinsChange: (value: number) => void;
  error?: string;
  disabled?: boolean; 
  className?: string;
}

export function BountyField({
  isBounty,
  bountyCoins,
  onBountyToggle,
  onBountyCoinsChange,
  error,
  disabled,
  className,
}: BountyFieldProps) {
  return (
    <div className={cn("space-y-2", className, disabled && "opacity-50")}>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="bounty-toggle"
          checked={isBounty}
          onChange={(e) => !disabled && onBountyToggle(e.target.checked)} 
          className={cn("h-4 w-4", disabled && "cursor-not-allowed")}
          disabled={disabled} 
        />
        <Label
          htmlFor="bounty-toggle"
          className={cn("text-lg font-semibold", disabled && "text-gray-400")}
        >
          Make this a bounty question
        </Label>
      </div>
      {isBounty && (
        <div className="space-y-2 pl-6">
          <Label
            htmlFor="bounty-coins"
            className={cn("text-base font-medium", disabled && "text-gray-400")}
          >
            Bounty Coins (minimum 10)
          </Label>
          <Input
            id="bounty-coins"
            type="number"
            min="10"
            value={bountyCoins}
            onChange={(e) => !disabled && onBountyCoinsChange(parseInt(e.target.value) || 0)}
            placeholder="Enter bounty coins"
            className={cn("w-32", disabled && "cursor-not-allowed")}
            disabled={disabled}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}