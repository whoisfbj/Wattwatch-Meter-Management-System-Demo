import {
    Bell,
  Command,
  CreditCard,
  Gauge,
  LayoutDashboard,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CustomerPage, Page } from "@/types";

export const navigation: { label: Page; icon: LucideIcon }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Meters", icon: Gauge },
  { label: "Customers", icon: Users },
  { label: "Transactions", icon: CreditCard },
  { label: "Command log", icon: Command },
];

export const pageTitles: Record<Page, string> = {
  Overview: "Overview",
  Meters: "Meter management",
  Customers: "Customers",
  Transactions: "Transactions",
  "Command log": "Command log",
};

export const customerNavigation: { label: CustomerPage; icon: LucideIcon }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Buy electricity", icon: Zap },
  { label: "Transactions", icon: CreditCard },
  { label: "Alerts", icon: Bell },
];

export const customerPageTitles: Record<CustomerPage, string> = {
  Dashboard: "My dashboard",
  "Buy electricity": "Buy electricity",
  Transactions: "My transactions",
  Alerts: "Alerts",
};