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
import type { Meter, Transaction } from "@/types";

export function CustomerDialog({
  customer,
  transactions,
  onClose,
}: {
  customer: Meter | null;
  transactions: Transaction[];
  onClose: () => void;
}) {
  const customerTransactions = customer
    ? transactions.filter((transaction) => transaction.meter === customer.id)
    : [];

  return (
    <Dialog
      open={customer !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Customer account and linked meter information.
          </DialogDescription>
        </DialogHeader>

        {customer && (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-slate-500">Customer name</p>
              <p className="mt-1 text-lg font-semibold">{customer.customer}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Meter ID</p>
                <p className="mt-1 font-medium">{customer.id}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Serial number</p>
                <p className="mt-1 font-medium">{customer.serial}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="mt-1 font-medium">{customer.location}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Meter status</p>
                <div className="mt-1">
                  <StatusBadge status={customer.status} />
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500">Current balance</p>
                <p className="mt-1 font-semibold">{money(customer.balance)}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Consumption</p>
                <p className="mt-1 font-semibold">
                  {customer.consumption.toFixed(1)} kWh
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="mb-3 text-sm font-semibold">Transaction history</h3>

              {customerTransactions.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No transactions found for this customer.
                </p>
              ) : (
                <div className="space-y-3">
                  {customerTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{transaction.id}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {transaction.date}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {money(transaction.amount)}
                        </p>
                        <StatusBadge status={transaction.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}