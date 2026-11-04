import { useState, type FormEvent } from "react";
import { AlertTriangle, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TransactionDialog } from "@/components/dialogs/TransactionDialog";
import { money } from "@/lib/format";
import {
  MAX_PURCHASE,
  MIN_PURCHASE,
  TARIFF_PER_KWH,
  calculateUnits,
  paymentMethods,
  quickAmounts,
  type PaymentMethod,
} from "@/lib/purchase";
import type { Meter, Transaction } from "@/types";

export function CustomerBuyPage({
  customer,
  onPurchase,
}: {
  customer: Meter;
  onPurchase: (
    meter: Meter,
    amount: number,
    method: PaymentMethod,
  ) => Transaction;
}) {
  const [amountInput, setAmountInput] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Card");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<Transaction | null>(null);

  const isOffline = customer.status === "Offline";
  const amount = Number(amountInput);
  const hasInput = amountInput.trim() !== "";
  const isValid =
    hasInput &&
    Number.isFinite(amount) &&
    amount >= MIN_PURCHASE &&
    amount <= MAX_PURCHASE;

  const units = isValid ? calculateUnits(amount) : 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid || processing || isOffline) return;

    setProcessing(true);

    // Simulated payment processing.
    window.setTimeout(() => {
      const transaction = onPurchase(customer, amount, method);
      setReceipt(transaction);
      setAmountInput("");
      setProcessing(false);
    }, 1500);
  };

  return (
    <>
      <div>
        <p className="text-sm text-slate-500">
          Top up meter {customer.id} ({customer.serial}).
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Buy electricity
        </h2>
      </div>

      {isOffline && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4">
          <AlertTriangle size={18} className="mt-0.5 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-900">
              Meter is offline
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">
              Purchases are disabled while your meter is offline. Contact
              support or ask an admin to reset the meter.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Purchase details</CardTitle>
           <CardDescription>
                  Demo only. No real payment is taken. An admin confirms each payment before
                  credit is added.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="purchase-amount"
                  className="text-sm font-medium text-slate-700"
                >
                  Amount (NGN)
                </label>
                <Input
                  id="purchase-amount"
                  type="number"
                  inputMode="numeric"
                  min={MIN_PURCHASE}
                  max={MAX_PURCHASE}
                  value={amountInput}
                  onChange={(event) => setAmountInput(event.target.value)}
                  placeholder={`Enter amount (min ${money(MIN_PURCHASE)})`}
                  disabled={isOffline || processing}
                  className="mt-2"
                />
                {hasInput && !isValid && (
                  <p className="mt-2 text-xs text-rose-600">
                    Enter an amount between {money(MIN_PURCHASE)} and{" "}
                    {money(MAX_PURCHASE)}.
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {quickAmounts.map((quick) => (
                    <Button
                      key={quick}
                      type="button"
                      size="sm"
                      variant={amount === quick ? "default" : "outline"}
                      onClick={() => setAmountInput(String(quick))}
                      disabled={isOffline || processing}
                      className={
                        amount === quick
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "bg-white"
                      }
                    >
                      {money(quick)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="purchase-method"
                  className="text-sm font-medium text-slate-700"
                >
                  Payment method
                </label>
                <select
                  id="purchase-method"
                  value={method}
                  onChange={(event) =>
                    setMethod(event.target.value as PaymentMethod)
                  }
                  disabled={isOffline || processing}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  {paymentMethods.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                disabled={!isValid || processing || isOffline}
                className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {processing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing payment...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    {isValid ? `Pay ${money(amount)}` : "Pay now"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Order summary</CardTitle>
            <CardDescription>What you'll get for this purchase</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Meter</span>
              <span className="font-medium">{customer.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Demo rate</span>
              <span className="font-medium">{money(TARIFF_PER_KWH)} / kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount</span>
              <span className="font-medium">
                {isValid ? money(amount) : "—"}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-4">
              <span className="text-slate-500">Units you'll receive</span>
              <span className="text-base font-semibold">
                {isValid ? `${units} kWh` : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Balance once confirmed</span>
              <span className="font-semibold">
                {money(customer.balance + (isValid ? amount : 0))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionDialog
  transaction={receipt}
  onClose={() => setReceipt(null)}
  title="Payment submitted"
  description="Your payment is awaiting admin confirmation. Your token and units will be issued once it is confirmed."
/>
    </>
  );
}