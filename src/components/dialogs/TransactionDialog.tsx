import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { money } from "@/lib/format";
import type { Transaction } from "@/types";

export function TransactionDialog({
  transaction,
  onClose,
  title = "Transaction Details",
  description = "View the details of this electricity transaction.",
}: {
  transaction: Transaction | null;
  onClose: () => void;
  title?: string;
  description?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToken = async () => {
    if (!transaction?.token) return;

    try {
      await navigator.clipboard.writeText(transaction.token);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable; the token is still visible to copy by hand.
    }
  };

  return (
    <Dialog
      open={transaction !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {transaction && (
          <div className="space-y-4">
            {transaction.token && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs text-emerald-800">Electricity token</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="font-mono text-lg font-semibold tracking-wider text-emerald-900">

                    {transaction.status === "Pending" && (
  <div className="rounded-xl bg-amber-50 p-4">
    <p className="text-sm font-medium text-amber-900">
      Awaiting confirmation
    </p>
    <p className="mt-1 text-xs leading-5 text-amber-800">
      The token and units are issued once the payment is confirmed.
    </p>
  </div>
)}

                    {transaction.token}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={copyToken}
                    className="gap-1.5 bg-white"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-slate-500">Transaction ID</p>
              <p className="font-medium">{transaction.id}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Customer</p>
              <p className="font-medium">{transaction.customer}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Meter ID</p>
              <p className="font-medium">{transaction.meter}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Amount</p>
              <p className="text-lg font-semibold">
                {money(transaction.amount)}
              </p>
            </div>

            {transaction.units !== undefined && (
              <div>
                <p className="text-sm text-slate-500">Units purchased</p>
                <p className="font-medium">{transaction.units} kWh</p>
              </div>
            )}

            {transaction.method && (
              <div>
                <p className="text-sm text-slate-500">Payment method</p>
                <p className="font-medium">{transaction.method}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-medium">{transaction.date}</p>
            </div>

            {transaction.confirmedAt && (
  <div>
    <p className="text-sm text-slate-500">Confirmed</p>
    <p className="font-medium">{transaction.confirmedAt}</p>
  </div>
)}

            <div>
              <p className="text-sm text-slate-500">Payment Status</p>
              <StatusBadge status={transaction.status} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}