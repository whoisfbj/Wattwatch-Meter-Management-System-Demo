import { Check, ChevronDown, ChevronRight, Menu } from "lucide-react";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppNotification } from "@/lib/notifications";
import type { Role } from "@/types";

const roleOptions: { role: Role; description: string }[] = [
  { role: "Admin", description: "Manage all meters and customers" },
  { role: "Customer", description: "View a customer's own account" },
];

export function Header({
  activePage,
  title,
  role,
  onRoleChange,
  user,
  notifications,
  readIds,
  onNotificationSelect,
  onMarkAllRead,
  onOpenMenu,
}: {
  activePage: string;
  title: string;
  role: Role;
  onRoleChange: (role: Role) => void;
  user: { name: string; subtitle: string; initials: string };
  notifications: AppNotification[];
  readIds: Set<string>;
  onNotificationSelect: (notification: AppNotification) => void;
  onMarkAllRead: () => void;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-19 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMenu}
        >
          <Menu size={20} />
        </Button>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Workspace</span>
            <ChevronRight size={13} />
            <span className="text-slate-600">{activePage}</span>
          </div>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Badge
          variant="outline"
          className="hidden border-emerald-200 bg-emerald-50 text-emerald-700 sm:inline-flex"
        >
          DEMO
        </Badge>

        <NotificationBell
          notifications={notifications}
          readIds={readIds}
          onSelect={onNotificationSelect}
          onMarkAllRead={onMarkAllRead}
        />

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open account menu"
            className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {user.initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-400">{user.subtitle}</p>
            </div>
            <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <div className="px-2 py-1.5 text-xs text-slate-500">
              Demo: switch role
            </div>
            <DropdownMenuSeparator />

            {roleOptions.map((option) => (
              <DropdownMenuItem
                key={option.role}
                onClick={() => onRoleChange(option.role)}
                className="cursor-pointer items-start gap-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{option.role}</p>
                  <p className="text-xs text-slate-500">{option.description}</p>
                </div>
                {role === option.role && (
                  <Check size={16} className="mt-0.5 text-emerald-600" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}