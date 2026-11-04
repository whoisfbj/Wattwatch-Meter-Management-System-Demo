import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PaymentReviewDialog,
  type PaymentReview,
} from "@/components/dialogs/PaymentReviewDialog";
import { TransactionDialog } from "@/components/dialogs/TransactionDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { money } from "@/lib/format";
import type { Meter, PaymentStatus, Transaction } from "@/types";

const filters = ["All", "Pending", "Successful", "Rejected"] as const;

export function TransactionsPage({
  transactions,
  meters,
  onConfirmPayment,
  onRejectPayment,
}: {
  transactions: Transaction[];
  meters: Meter[];
  onConfirmPayment: (transaction: Transaction) => void;
  onRejectPayment: (transaction: Transaction) => void;
}) {
  const [filter, setFilter] = useState<"All" | PaymentStatus>("All");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [review, setReview] = useState<PaymentReview | null>(null);

  const pendingCount = transactions.filter(
    (transaction) => transaction.status === "Pending",
  ).length;

  const visible =
    filter === "All"
      ? transactions
      : transactions.filter((transaction) => transaction.status === filter);

  const reviewMeter = review
    ? meters.find((meter) => meter.id === review.transaction.meter)
    : undefined;

  const handleReviewConfirm = () => {
    if (!review) return;

    if (review.mode === "confirm") {
      onConfirmPayment(review.transaction);
    } else {
      onRejectPayment(review.transaction);
    }

    setReview(null);
  };

  return (
    <>
      {pendingCount > 0 && (
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            {pendingCount} payment{pendingCount === 1 ? "" : "s"} awaiting
            confirmation
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            Confirm a payment to disburse credit to the customer's meter.
          </p>
        </div>
      )}

      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription className="mt-1">
              Review customer payments and disburse credit. Demo only, no real
              payments are processed.
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Filter by status">
            {filters.map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={filter === option ? "default" : "outline"}
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={
                  filter === option
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-white"
                }
              >
                {option}
                {` (${
                  option === "All"
                    ? transactions.length
                    : transactions.filter(
                        (transaction) => transaction.status === option,
                      ).length
                })`}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Meter</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visible.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{transaction.meter}</TableCell>
                  <TableCell className="font-medium">
                    {money(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {transaction.date}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={transaction.status} />
                  </TableCell>
                  <TableCell>
                    {transaction.status === "Pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={(event) => {
                            event.stopPropagation();
                            setReview({ transaction, mode: "confirm" });
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            setReview({ transaction, mode: "reject" });
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {visible.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-slate-500"
                  >
                    No transactions match this filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TransactionDialog
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      <PaymentReviewDialog
        review={review}
        meter={reviewMeter}
        onCancel={() => setReview(null)}
        onConfirm={handleReviewConfirm}
      />
    </>
  );
}