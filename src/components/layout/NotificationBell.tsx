import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AlertSeverity } from "@/lib/alerts";
import type { AppNotification } from "@/lib/notifications";

const severityStyles: Record<
  AlertSeverity,
  { icon: LucideIcon; wrap: string }
> = {
  critical: { icon: AlertTriangle, wrap: "bg-rose-50 text-rose-600" },
  warning: { icon: AlertTriangle, wrap: "bg-amber-50 text-amber-600" },
  info: { icon: Info, wrap: "bg-blue-50 text-blue-600" },
  success: { icon: CheckCircle2, wrap: "bg-emerald-50 text-emerald-600" },
};

export function NotificationBell({
  notifications,
  readIds,
  onSelect,
  onMarkAllRead,
}: {
  notifications: AppNotification[];
  readIds: Set<string>;
  onSelect: (notification: AppNotification) => void;
  onMarkAllRead: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (notification) => !readIds.has(notification.id),
  ).length;

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-slate-500"
        onClick={() => setOpen((previous) => !previous)}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="fixed inset-x-4 top-19 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-slate-500">
                {unreadCount === 0 ? "All caught up" : `${unreadCount} unread`}
              </p>
            </div>

            <button
              type="button"
              onClick={onMarkAllRead}
              disabled={unreadCount === 0}
              className="text-xs font-medium text-emerald-700 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline"
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500">
                No notifications.
              </p>
            ) : (
              notifications.map((notification) => {
                const style = severityStyles[notification.severity];
                const Icon = style.icon;
                const unread = !readIds.has(notification.id);

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => {
                      onSelect(notification);
                      setOpen(false);
                    }}
                    className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${
                      unread ? "bg-emerald-50/40" : ""
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.wrap}`}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm ${
                            unread
                              ? "font-semibold"
                              : "font-medium text-slate-600"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {unread && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {notification.time}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}