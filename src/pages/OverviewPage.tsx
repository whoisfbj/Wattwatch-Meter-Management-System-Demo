import { useState } from "react";
import {
  Activity,
  ChevronRight,
  CreditCard,
  Download,
  Gauge,
  ShieldCheck,
  Wifi,
  WifiOff,
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
import { MeterTable } from "@/components/meters/MeterTable";
import { ActivityItem } from "@/components/shared/ActivityItem";
import { HealthRow } from "@/components/shared/HealthRow";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { consumptionByPeriod} from "@/data/mockData";
import { money } from "@/lib/format";
import { getMeterStats } from "@/lib/stats";
import type { DemoCommand, Meter, Page, Period, Transaction } from "@/types";
import { getGreeting } from "@/lib/greeting";

export function OverviewPage({
  meters,
  commandLogs,
  transactions,
  onNavigate,
  onExport,
  onRunCommand,
  onRequestReset,
}: {
  meters: Meter[];
  commandLogs: DemoCommand[];
  transactions: Transaction[];
  onNavigate: (page: Page) => void;
  onExport: () => void;
  onRunCommand: (meter: Meter, action: string) => void;
  onRequestReset: (meter: Meter) => void;
}) {

const [period, setPeriod] = useState<Period>("7 days");
const { online, offline, warning, onlinePercentage } = getMeterStats(meters);

const chartData = consumptionByPeriod[period];
const totalEnergy = chartData.reduce((sum, point) => sum + point.usage, 0);

const lastUsage = chartData[chartData.length - 1].usage;
const previousUsage = chartData[chartData.length - 2].usage;
const energyTrend = ((lastUsage - previousUsage) / previousUsage) * 100;

const successfulTransactions = transactions.filter(
  (transaction) => transaction.status === "Successful",
);
  const pendingCount = transactions.filter(
    (transaction) => transaction.status === "Pending",
  ).length;
const revenue = successfulTransactions.reduce(
  (sum, transaction) => sum + transaction.amount,
  0,
);
const successRate = Math.round(
  (successfulTransactions.length / transactions.length) * 100,
);

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            Here's what's happening across your meter network.
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
           {getGreeting()}, Admin <span>👋</span>
          </h2>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport} className="gap-2 bg-white">
            <Download size={16} /> Export
          </Button>
          <Button
            onClick={() => onNavigate("Meters")}
            className="gap-2 bg-slate-900 text-white hover:bg-slate-800"
          >
            <Gauge size={16} /> View meters
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
       <MetricCard
  title="Total meters"
  value={meters.length.toLocaleString()}
  note="Registered in demo"
  icon={Gauge}
  change={`${offline + warning} need attention`}
  positive={offline + warning === 0}
/>
<MetricCard
  title="Online meters"
  value={`${online}`}
  note="of demo fleet"
  icon={Wifi}
  change={`${onlinePercentage}%`}
  positive={onlinePercentage >= 60}
/>
<MetricCard
  title="Energy consumed"
  value={`${totalEnergy.toLocaleString()} kWh`}
  note={`Last ${period}`}
  icon={Activity}
  change={`${energyTrend >= 0 ? "+" : ""}${energyTrend.toFixed(1)}%`}
  positive={energyTrend >= 0}
/>
<MetricCard
  title="Vending revenue"
  value={money(revenue)}
  note={`${pendingCount} pending`}
  icon={CreditCard}
  change={`${successRate}% successful`}
  positive={successRate >= 75}
/>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Energy consumption</CardTitle>
              <CardDescription className="mt-1">
                Daily usage across the demo network
              </CardDescription>
            </div>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <option>7 days</option>
              <option>30 days</option>
              <option>90 days</option>
            </select>
          </CardHeader>

          <CardContent>
            <div className="mt-3 h-67.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 12, right: 6, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="usageFill"
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
                    fill="url(#usageFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Demo usage data
              <span className="ml-auto">Period: {period}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Meter health</CardTitle>
            <CardDescription>Connectivity across the demo fleet</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div
                className="relative flex h-29.5 w-29.5 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#10b981 0 ${onlinePercentage}%, #e2e8f0 ${onlinePercentage}% 100%)`,
                }}
              >
                <div className="flex h-22 w-22 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-2xl font-semibold">
                    {onlinePercentage}%
                  </span>
                  <span className="text-[10px] text-slate-400">Online</span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <HealthRow label="Online" value={online} color="bg-emerald-500" />
                <HealthRow label="Offline" value={offline} color="bg-slate-300" />
                <HealthRow label="Warning" value={warning} color="bg-amber-400" />
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <WifiOff size={18} className="mt-0.5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Attention needed
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    {offline + warning} demo meters may need inspection.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("Meters")}
                className="mt-3 border-amber-200 bg-white text-amber-900 hover:bg-amber-100"
              >
                Review meters <ChevronRight size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent transactions</CardTitle>
              <CardDescription className="mt-1">
                Latest demo electricity purchases
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Meter</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.slice(0, 4).map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => onNavigate("Transactions")}
                  >
                    <TableCell>
                      <p className="font-medium text-slate-800">
                        {transaction.customer}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {transaction.date}
                      </p>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {transaction.meter}
                    </TableCell>
                    <TableCell className="font-medium">
                      {money(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Network activity</CardTitle>
            <CardDescription>Recent demo events</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {commandLogs.length === 0 ? (
              <div className="py-8 text-center">
                <Activity size={28} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  No recent activity
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Meter activities will appear here.
                </p>
              </div>
            ) : (
              commandLogs.slice(0, 4).map((command) => {
  const isReset = command.action === "Reset meter";
  const isRefresh = command.action === "Refresh meter";
  const isOutage = command.action === "Simulate outage";

  return (
    <ActivityItem
      key={command.id}
      icon={
        isReset ? ShieldCheck : isRefresh ? Wifi : isOutage ? WifiOff : Activity
      }
      color={
        isReset
          ? "bg-violet-50 text-violet-600"
          : isRefresh
            ? "bg-blue-50 text-blue-600"
            : isOutage
              ? "bg-rose-50 text-rose-600"
              : "bg-emerald-50 text-emerald-600"
      }
      title={command.action}
      detail={`${command.meterId} · ${command.status}`}
      time={command.time}
    />
  );
})
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Meter overview</CardTitle>
            <CardDescription className="mt-1">
              A quick look at your demo meters
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("Meters")}
            className="text-emerald-700"
          >
            Manage meters <ChevronRight size={15} />
          </Button>
        </CardHeader>

        <CardContent>
          <MeterTable
            meters={meters}
            onRunCommand={onRunCommand}
            onRequestReset={onRequestReset}
          />
        </CardContent>
      </Card>
    </>
  );
}