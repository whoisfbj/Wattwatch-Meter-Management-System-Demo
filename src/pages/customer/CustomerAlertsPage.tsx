import { AlertTriangle, CheckCircle2, Info, type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Alert, AlertSeverity } from "@/lib/alerts";
import type { Meter } from "@/types";

const severityStyles: Record<
  AlertSeverity,
  { icon: LucideIcon; wrap: string; label: string }
> = {
  critical: {
    icon: AlertTriangle,
    wrap: "bg-rose-50 text-rose-600",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    wrap: "bg-amber-50 text-amber-600",
    label: "Warning",
  },
  info: {
    icon: Info,
    wrap: "bg-blue-50 text-blue-600",
    label: "Update",
  },
  success: {
    icon: CheckCircle2,
    wrap: "bg-emerald-50 text-emerald-600",
    label: "Confirmed",
  },
};

export function CustomerAlertsPage({
  customer,
  alerts,
}: {
  customer: Meter;
  alerts: Alert[];
}) {
  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle>Alerts and updates</CardTitle>
        <CardDescription>
          Meter alerts and purchase updates for {customer.id}.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={25} />
            </div>
            <h3 className="mt-4 font-semibold">You're all caught up</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              There are no alerts for your meter right now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const style = severityStyles[alert.severity];
              const Icon = style.icon;

              return (
                <div
                  key={alert.id}
                  className="flex gap-3 rounded-xl border border-slate-200/80 p-4"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.wrap}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <span className="text-xs text-slate-400">
                        {alert.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {alert.message}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-medium ${style.wrap}`}
                    >
                      {style.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}