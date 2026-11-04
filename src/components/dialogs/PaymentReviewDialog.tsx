import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { money } from "@/lib/format";
import { calculateUnits } from "@/lib/purchase";
import type { Meter, Transaction } from "@/types";

export type PaymentReview = {
  transaction: Transaction;
  mode: "confirm" | "reject";
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function PaymentReviewDialog({
  review,
  meter,
  onCancel,
  onConfirm,
}: {
  review: PaymentReview | null;
  meter: Meter | undefined;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const transaction = review?.transaction;
  const isConfirm = review?.mode === "confirm";
  const meterOffline = meter?.status === "Offline";
  const blocked = isConfirm && (!meter || meterOffline);

  return (
    <Dialog
      open={review !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isConfirm ? "Confirm payment?" : "Reject payment?"}
          </DialogTitle>
          <DialogDescription>
            {isConfirm
              ? "Verify the payment, then disburse the credit to the customer's meter."
              : "No credit will be disbursed for this payment."}
          </DialogDescription>
        </DialogHeader>

        {transaction && (
          <div className="space-y-4">
            <div className="space-y-3 rounded-xl bg-slate-50 p-4">
              <Row label="Transaction" value={transaction.id} />
              <Row label="Customer" value={transaction.customer} />
              <Row label="Meter" value={transaction.meter} />
              <Row label="Payment method" value={transaction.method ?? "—"} />
              <Row label="Amount paid" value={money(transaction.amount)} />
            </div>

            {isConfirm && (
              <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-medium text-emerald-800">
                  Credit to disburse
                </p>
                <Row label="Credit" value={money(transaction.amount)} />
                <Row
                  label="Units"
                  value={`${calculateUnits(transaction.amount)} kWh`}
                />
                <Row
                  label="Balance after"
                  value={meter ? money(meter.balance + transaction.amount) : "—"}
                />
              </div>
            )}

            {isConfirm && meterOffline && (
              <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-3">
                <AlertTriangle size={16} className="mt-0.5 text-amber-600" />
                <p className="text-xs leading-5 text-amber-800">
                  This meter is offline, so credit can't be disbursed. Reset the
                  meter from the Meters page, then confirm the payment.
                </p>
              </div>
            )}

            {!isConfirm && (
              <p className="text-xs leading-5 text-slate-500">
                The payment will be marked as rejected and the customer will see
                an alert.
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            variant={isConfirm ? "default" : "destructive"}
            onClick={onConfirm}
            disabled={blocked}
            className={
              isConfirm ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""
            }
          >
            {isConfirm ? "Confirm and disburse" : "Reject payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}