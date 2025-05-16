import { useState } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, ArrowLeft, HelpCircle, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PaymentCancelledPage() {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      window.location.href = "/checkout"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="mx-auto mb-4 relative"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, -10, 0],
                  scale: [1, 1.05, 1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  ease: "easeInOut",
                }}
              >
                <AlertCircle className="h-16 w-16 text-amber-500" />
              </motion.div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-800">Payment Cancelled</CardTitle>
            <CardDescription className="text-base">Your payment was not completed</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-amber-50 p-4 rounded-lg"
            >
              <p className="text-gray-700">
                Don't worry! Your payment was not processed and no money was deducted from your account. You can try
                again or choose a different Bank Account.
              </p>
            </motion.div>

            <Separator />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-3"
            >
              <h3 className="font-medium text-gray-700">Common Reasons</h3>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-sm">Insufficient funds</AccordionTrigger>
                  <AccordionContent>
                    Your card may not have enough funds to complete this transaction. Please check your balance or try a
                    different payment method.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-sm">Card verification failed</AccordionTrigger>
                  <AccordionContent>
                    The card verification process failed. Please ensure your card details are correct and try again.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-sm">Connection issues</AccordionTrigger>
                  <AccordionContent>
                    There might have been a connection issue during the payment process. Please check your internet
                    connection and try again.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button onClick={handleRetry} disabled={isRetrying} className="w-full bg-amber-500 hover:bg-amber-600">
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  Try Again
                  <RefreshCw className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Shop
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full text-gray-500">
              <Link to="/support">
                <HelpCircle className="mr-2 h-4 w-4" />
                Need Help?
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}