import { money } from "@/lib/format";
import { LOW_BALANCE_THRESHOLD } from "@/lib/purchase";
import type { Meter, Transaction } from "@/types";

export type AlertSeverity = "critical" | "warning" | "info" | "success";

export type Alert = {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  time: string;
};

const severityOrder: Record<AlertSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
  success: 3,
};

export function getCustomerAlerts(
  meter: Meter,
  transactions: Transaction[],
): Alert[] {
  const alerts: Alert[] = [];
  const statusTime = meter.lastChecked ?? "Current status";

  if (meter.status === "Offline") {
    alerts.push({
      id: "meter-offline",
      severity: "critical",
      title: "Meter offline",
      message:
        "Your meter is not communicating. Purchases are disabled until it is back online.",
      time: statusTime,
    });
  }

  if (meter.status === "Warning") {
    alerts.push({
      id: "meter-warning",
      severity: "warning",
      title: "Meter needs attention",
      message:
        "Your meter reported a warning. If it persists, contact support.",
      time: statusTime,
    });
  }

  if (meter.balance === 0) {
    alerts.push({
      id: "balance-empty",
      severity: "critical",
      title: "No credit remaining",
      message: "Your balance is empty. Buy electricity to restore supply.",
      time: statusTime,
    });
  } else if (meter.balance < LOW_BALANCE_THRESHOLD) {
    alerts.push({
      id: "balance-low",
      severity: "warning",
      title: "Low balance",
      message: `Your balance is ${money(meter.balance)}. Top up soon to avoid an interruption.`,
      time: statusTime,
    });
  }

  const mine = transactions.filter(
    (transaction) => transaction.meter === meter.id,
  );

  mine
    .filter((transaction) => transaction.status === "Pending")
    .forEach((transaction) => {
      alerts.push({
        id: `pending-${transaction.id}`,
        severity: "info",
        title: "Payment pending",
        message: `${transaction.id} for ${money(transaction.amount)} is awaiting confirmation.`,
        time: transaction.date,
      });
    });

    mine
  .filter((transaction) => transaction.status === "Rejected")
  .forEach((transaction) => {
    alerts.push({
      id: `rejected-${transaction.id}`,
      severity: "warning",
      title: "Payment rejected",
      message: `${transaction.id} for ${money(transaction.amount)} was not approved, so no credit was added. Contact support if you think this is a mistake.`,
      time: transaction.date,
    });
  });

  if (meter.lastReset) {
    alerts.push({
      id: "meter-reset",
      severity: "info",
      title: "Meter reset",
      message: "Your meter was reset and is back online.",
      time: meter.lastReset,
    });
  }

  mine
    .filter((transaction) => transaction.status === "Successful")
    .slice(0, 3)
    .forEach((transaction) => {
      const units =
        transaction.units !== undefined ? ` (${transaction.units} kWh)` : "";

      alerts.push({
        id: `purchase-${transaction.id}`,
        severity: "success",
        title: "Purchase confirmed",
        message: `${money(transaction.amount)}${units} was added to your meter.`,
        time: transaction.date,
      });
    });

  return alerts.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
}