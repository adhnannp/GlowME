import { useEffect, useState } from "react";
import { transactionHistory } from "@/services/user/user.coinPlans.service";

type CoinTransaction = {
  _id: string;
  type: "purchase" | "reward" | "refund";
  amount: number;
  coins: number;
  transactionCode?: string;
  stripePaymentIntentId?: string;
  created_at: string;
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");
      try {
        const { transactions, pagination } = await transactionHistory(page);
        setTransactions(transactions);
        setTotalPages(pagination.totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [page]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">No transactions found.</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Transaction Code</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Coins</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id} className="border-t">
                  <td className="p-2">{tx.transactionCode || "-"}</td>
                  <td className="p-2">₹{tx.amount}</td>
                  <td className="p-2">{tx.coins}</td>
                  <td className="p-2">{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end item-center gap-2 border-t pt-4">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
