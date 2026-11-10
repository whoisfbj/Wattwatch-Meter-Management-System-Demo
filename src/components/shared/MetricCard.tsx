import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  note,
  icon: Icon,
  change,
  positive,
}: {
  title: string;
  value: string;
  note: string;
  icon: LucideIcon;
  change: string;
  positive: boolean;
}) {
  return (
    <Card className="border-slate-200/80 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {value}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Icon size={20} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`flex items-center gap-1 rounded-md px-1.5 py-1 font-medium ${positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
              }`}
          >
            {positive ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}
            {change}
          </span>
        </div>
        <span className="text-slate-400 text-xs">{note}</span>
      </CardContent>
    </Card>
  );
}