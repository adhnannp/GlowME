interface RedeemCodeSectionProps {
    redeemCode: string;
    setRedeemCode: (code: string) => void;
  }
  
  export default function RedeemCodeSection({
    redeemCode,
    setRedeemCode,
  }: RedeemCodeSectionProps) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium text-center mb-2">Redeem With Code</h3>
        <div className="flex justify-center">
          <div className="flex w-full max-w-md">
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              className="flex-1 border rounded-l-md px-4 py-2"
              placeholder="Enter code"
            />
            <button className="bg-black text-white px-4 py-2 rounded-r-md">
              Redeem
            </button>
          </div>
        </div>
      </div>
    );
  }