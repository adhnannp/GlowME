export default function TransactionHistorySection() {
    const transactions = [
      {
        type: "Question asked",
        gcoin: "-5 Gcoin",
        currency: "nil",
        gcoinClass: "text-red-500",
      },
      {
        type: "Question answered",
        gcoin: "+1 Gcoin",
        currency: "nil",
        gcoinClass: "text-green-500",
      },
      {
        type: "Bought Gcoin",
        gcoin: "+1500 Gcoin",
        currency: "$100",
        gcoinClass: "text-green-500",
      },
    ];
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Coin Transaction</h2>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left border-r">Transaction Type</th>
                <th className="py-3 px-4 text-center border-r">Gcoin</th>
                <th className="py-3 px-4 text-center">Currency Spend</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-t">
                  <td className="py-3 px-4 border-r">{transaction.type}</td>
                  <td
                    className={`py-3 px-4 text-center border-r ${transaction.gcoinClass}`}
                  >
                    {transaction.gcoin}
                  </td>
                  <td className="py-3 px-4 text-center">{transaction.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div id="transaction-history" className="bg-gray-50 py-3 px-4 text-right border-t">
            <span className="font-medium">Total Spend: </span>
            <span>$100</span>
          </div>
        </div>
      </div>
    );
  }