import {
  CircleHelp,
  Settings,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type NavItem<T extends string> = { label: T; icon: LucideIcon };

type SidebarProps<T extends string> = {
  items: NavItem<T>[];
  activePage: T;
  onNavigate: (page: T) => void;
  badges?: Partial<Record<T, number>>;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

type SidebarContentProps<T extends string> = Pick<
  SidebarProps<T>,
  "items" | "activePage" | "onNavigate" | "badges"
>;

function SidebarContent<T extends string>({
  items,
  activePage,
  onNavigate,
  badges,
}: SidebarContentProps<T>) {
  return (
    <>
      <div className="flex h-19 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
          <Zap size={23} fill="currentColor" />
        </div>

        <div>
          <p className="text-lg font-bold tracking-tight text-white">
            WattWatch
          </p>
          <p className="text-xs text-slate-400">Meter management</p>
        </div>
      </div>

      <div className="px-4 pt-8">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>

        <nav className="space-y-1">
          {items.map(({ label, icon: Icon }) => {
            const badge = badges?.[label];

            return (
              <button
                key={label}
                onClick={() => onNavigate(label)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  activePage === label
                    ? "bg-emerald-400/10 font-medium text-emerald-300"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>

                {badge !== undefined && (
                  <span className="ml-auto rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-emerald-300">
            <ShieldCheck size={19} />
          </div>

          <p className="text-sm font-medium text-white">Demo environment</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Sample data only. No live meters or payments are connected.
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Frontend only
          </div>
        </div>

        <button className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
          <Settings size={18} /> Settings
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
          <CircleHelp size={18} /> Help &amp; support
        </button>
      </div>
    </>
  );
}

export function Sidebar<T extends string>({
  items,
  activePage,
  onNavigate,
  badges,
  mobileOpen,
  onMobileClose,
}: SidebarProps<T>) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-62.5 flex-col bg-[#111a2c] lg:flex">
        <SidebarContent
          items={items}
          activePage={activePage}
          onNavigate={onNavigate}
          badges={badges}
        />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          <aside className="absolute inset-y-0 left-0 flex w-67.5 flex-col bg-[#111a2c]">
            <div className="flex justify-end p-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileClose}
                className="text-white"
              >
                ×
              </Button>
            </div>
            <SidebarContent
              items={items}
              activePage={activePage}
              onNavigate={(page) => {
                onNavigate(page);
                onMobileClose();
              }}
              badges={badges}
            />
          </aside>
        </div>
      )}
    </>
  );
}