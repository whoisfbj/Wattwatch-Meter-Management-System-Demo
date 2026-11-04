import { useState } from "react";
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
import { TransactionDialog } from "@/components/dialogs/TransactionDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { money } from "@/lib/format";
import type { Meter, Transaction } from "@/types";

export function CustomerTransactionsPage({
  customer,
  transactions,
}: {
  customer: Meter;
  transactions: Transaction[];
}) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const customerTransactions = transactions.filter(
    (transaction) => transaction.meter === customer.id,
  );

  return (
    <>
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle>My transactions</CardTitle>
          <CardDescription>
            Electricity purchases for meter {customer.id}. No payments are
            processed in this demo.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {customerTransactions.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              You have no transactions yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {customerTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <TableCell className="font-medium">
                      {transaction.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {money(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {transaction.date}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TransactionDialog
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
  );
}