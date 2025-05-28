import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BountyFieldProps {
  isBounty: boolean;
  bountyCoins: number;
  onBountyToggle: (checked: boolean) => void;
  onBountyCoinsChange: (value: number) => void;
  error?: string;
}

export function BountyField({
  isBounty,
  bountyCoins,
  onBountyToggle,
  onBountyCoinsChange,
  error,
}: BountyFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="bounty-toggle"
          checked={isBounty}
          onChange={(e) => onBountyToggle(e.target.checked)}
          className="h-4 w-4"
        />
        <Label htmlFor="bounty-toggle" className="text-lg font-semibold">
          Make this a bounty question
        </Label>
      </div>
      {isBounty && (
        <div className="space-y-2 pl-6">
          <Label htmlFor="bounty-coins" className="text-base font-medium">
            Bounty Coins (minimum 10)
          </Label>
          <Input
            id="bounty-coins"
            type="number"
            min="10"
            value={bountyCoins}
            onChange={(e) => onBountyCoinsChange(parseInt(e.target.value) || 0)}
            placeholder="Enter bounty coins"
            className="w-32"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}