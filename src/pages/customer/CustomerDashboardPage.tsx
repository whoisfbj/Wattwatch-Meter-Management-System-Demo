import { useState } from "react";
import {
  Activity,
  ChevronRight,
  CreditCard,
  Wallet,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
import { TransactionDialog } from "@/components/dialogs/TransactionDialog";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { money } from "@/lib/format";
import { getMeterUsage } from "@/lib/usage";
import type { CustomerPage, Meter, Transaction } from "@/types";
import { LOW_BALANCE_THRESHOLD } from "@/lib/purchase";
import { getGreeting } from "@/lib/greeting";

export function CustomerDashboardPage({
  customer,
  transactions,
  onNavigate,
}: {
  customer: Meter;
  transactions: Transaction[];
  onNavigate: (page: CustomerPage) => void;
}) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const customerTransactions = transactions.filter(
    (transaction) => transaction.meter === customer.id,
  );
  const successful = customerTransactions.filter(
    (transaction) => transaction.status === "Successful",
  );
    const pendingCount = customerTransactions.filter(
    (transaction) => transaction.status === "Pending",
  ).length;
  const totalPurchased = successful.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  const usage = getMeterUsage(customer);
  const weeklyTotal = usage.reduce((sum, point) => sum + point.usage, 0);
  const lowBalance = customer.balance < LOW_BALANCE_THRESHOLD;
  const StatusIcon = customer.status === "Offline" ? WifiOff : Wifi;

  return (
    <>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
  <div>
    <p className="text-sm text-slate-500">
      Here's an overview of your electricity meter.
    </p>
    <h2 className="mt-1 text-2xl font-semibold tracking-tight">
      {getGreeting()}, {customer.customer.split(" ")[0]} <span>👋</span>
    </h2>
  </div>

  <Button
    onClick={() => onNavigate("Buy electricity")}
    className="gap-2 bg-slate-900 text-white hover:bg-slate-800"
  >
    <Zap size={16} /> Buy electricity
  </Button>
</div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Meter balance"
          value={money(customer.balance)}
          note="Available credit"
          icon={Wallet}
          change={lowBalance ? "Low balance" : "Healthy"}
          positive={!lowBalance}
        />
        <MetricCard
          title="Usage (7 days)"
          value={`${weeklyTotal.toFixed(1)} kWh`}
          note="This week"
          icon={Activity}
          change={`${(weeklyTotal / 7).toFixed(1)} kWh/day`}
          positive
        />
        <MetricCard
          title="Meter status"
          value={customer.status}
          note={customer.serial}
          icon={StatusIcon}
          change={
            customer.status === "Online"
              ? "Connected"
              : customer.status === "Warning"
                ? "Needs attention"
                : "Disconnected"
          }
          positive={customer.status === "Online"}
        />
        <MetricCard
          title="Total purchased"
          value={money(totalPurchased)}
          note={`${successful.length} successful`}
          icon={CreditCard}
          change={`${pendingCount} pending`}
          positive={pendingCount === 0}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">My consumption</CardTitle>
            <CardDescription>
              Daily usage for meter {customer.id}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mt-3 h-67.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={usage}
                  margin={{ top: 12, right: 6, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="customerUsageFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#10b981"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor="#10b981"
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#edf0f4" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "#e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    name="Usage (kWh)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#customerUsageFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {customer.consumption === 0
                ? "No usage recorded for this meter"
                : "Demo usage data"}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">My meter</CardTitle>
            <CardDescription>Details for your registered meter</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
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
              <p className="text-xs text-slate-500">Connection status</p>
              <div className="mt-1">
                <StatusBadge status={customer.status} />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500">Last checked</p>
              <p className="mt-1 font-medium">
                {customer.lastChecked ?? "Not checked yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent transactions</CardTitle>
            <CardDescription className="mt-1">
              Your latest electricity purchases
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("Transactions")}
            className="text-emerald-700"
          >
            View all <ChevronRight size={15} />
          </Button>
        </CardHeader>

        <CardContent>
          {customerTransactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
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
                {customerTransactions.slice(0, 4).map((transaction) => (
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