import type { Alert, AlertSeverity } from "@/lib/alerts";
import { money } from "@/lib/format";
import type { Meter, Transaction } from "@/types";

export type AppNotification = {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  time: string;
  link: "Meters" | "Transactions" | "Alerts";
};

const severityOrder: Record<AlertSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
  success: 3,
};

// Customer notifications are the customer's alerts, with read-state ids.
export function getCustomerNotifications(
  meterId: string,
  alerts: Alert[],
): AppNotification[] {
  return alerts.map(
    (alert): AppNotification => ({
      id: `customer:${meterId}:${alert.id}:${alert.time}`,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      time: alert.time,
      link: "Alerts",
    }),
  );
}

// Admin notifications: meters needing attention and payments to confirm.
export function getAdminNotifications(
  meters: Meter[],
  transactions: Transaction[],
): AppNotification[] {
  const items: AppNotification[] = [];

  transactions
    .filter((transaction) => transaction.status === "Pending")
    .forEach((transaction) => {
      items.push({
        id: `admin:payment:${transaction.id}`,
        severity: "info",
        title: "Payment awaiting confirmation",
        message: `${transaction.customer} paid ${money(transaction.amount)} for ${transaction.meter}. Confirm it to disburse credit.`,
        time: transaction.date,
        link: "Transactions",
      });
    });

  meters
    .filter((meter) => meter.status !== "Online")
    .forEach((meter) => {
      const offline = meter.status === "Offline";

      items.push({
        // lastChecked changes on every outage/refresh/reset, so a new
        // outage creates a fresh unread notification.
        id: `admin:meter:${meter.id}:${meter.status}:${meter.lastChecked ?? "initial"}`,
        severity: offline ? "critical" : "warning",
        title: offline ? "Meter offline" : "Meter needs attention",
        message: offline
          ? `${meter.id} (${meter.customer}, ${meter.location}) is offline.`
          : `${meter.id} (${meter.customer}, ${meter.location}) reported a warning.`,
        time: meter.lastChecked ?? "Current status",
        link: "Meters",
      });
    });

  return items.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
}