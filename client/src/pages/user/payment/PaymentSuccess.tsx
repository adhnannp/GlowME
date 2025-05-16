import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, Coins } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PaymentSuccessDetails } from "@/services/user/user.coinPlans.service";
import { useDispatch } from "react-redux";
import { updateCoinBalance } from "@/feature/authSlice";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [transactionDetails, setTransactionDetails] = useState<{
    transactionCode: string;
    date: string;
    amount: string;
    coins: number;
    type: string;
    stripePaymentIntentId?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!sessionId) {
        setError("Invalid session ID");
        setLoading(false);
        return;
      }

      try {
        const data = await PaymentSuccessDetails(sessionId);
        dispatch(updateCoinBalance(data.updatedUser.coin_balance));
        setTransactionDetails({
          transactionCode: data.transactionData.transactionCode || "N/A",
          date: data.transactionData.created_at
            ? new Date(data.transactionData.created_at).toLocaleDateString()
            : new Date().toLocaleDateString(),
          amount: `₹${data.amount}`,
          coins: data.transactionData.coins,
          type: data.transactionData.type,
          stripePaymentIntentId: data.transactionData.stripePaymentIntentId || "N/A",
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } catch (err: any) {
        setError(err.message || "Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="border-none shadow-lg max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-700">Transaction Failed</CardTitle>
            <CardDescription className="text-base">{error}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline">
              <Link to="/Gcoin">Return Back</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!transactionDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">No transaction details available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-8 flex flex-col items-center justify-center">
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-4 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
              className="mx-auto mb-4"
            >
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-green-700">Payment Successful!</CardTitle>
            <CardDescription className="text-base">
              {transactionDetails.coins} Gcoins have been added to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-green-50 p-4 rounded-lg"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Transaction ID</span>
                <span className="font-medium">{transactionDetails.transactionCode}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Date</span>
                <span>{transactionDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="font-bold">{transactionDetails.amount}</span>
              </div>
            </motion.div>

            <Separator />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-3"
            >
              <h3 className="font-medium text-gray-700">Transaction Details</h3>
              <div className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4 text-gray-500" />
                <span>{transactionDetails.coins} Gcoins purchased</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-gray-500" />
                <span>Type: {transactionDetails.type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-gray-500" />
                <span>Payment Intent: {transactionDetails.stripePaymentIntentId}</span>
              </div>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link to="/Gcoin#transaction-history">
                View Transaction History
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/Gcoin">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            top: "-10vh",
            left: `${Math.random() * 100}vw`,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            top: "100vh",
            rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            ease: "linear",
            delay: Math.random() * 2,
          }}
          style={{
            width: "8px",
            height: "8px",
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            backgroundColor: [
              "#22c55e",
              "#10b981",
              "#3b82f6",
              "#6366f1",
              "#f59e0b",
              "#ef4444",
            ][Math.floor(Math.random() * 6)],
          }}
        />
      ))}
    </div>
  );
}