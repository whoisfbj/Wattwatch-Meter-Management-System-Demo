import type { LucideIcon } from "lucide-react";

export function ActivityItem({
  icon: Icon,
  color,
  title,
  detail,
  time,
}: {
  icon: LucideIcon;
  color: string;
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-1">
          <p className="text-sm font-medium">{title}</p>
          <span className="text-[10px] text-slate-400">{time}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}