import { useMemo, useState } from "react";
import { AlertTriangle, Search, Users, Wifi, WifiOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerDialog } from "@/components/dialogs/CustomerDialog";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getMeterStats } from "@/lib/stats";
import type { Meter, Transaction } from "@/types";

export function CustomersPage({
  meters,
  transactions,
}: {
  meters: Meter[];
  transactions: Transaction[];
}) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Meter | null>(null);
  const { online, offline, warning } = getMeterStats(meters);

  const filteredCustomers = useMemo(() => {
    const query = customerSearch.toLowerCase().trim();

    return meters.filter((meter) =>
      [meter.customer, meter.id, meter.location].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [meters, customerSearch]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total customers"
          value={meters.length.toString()}
          note="Registered meter accounts"
          change="All accounts"
          positive={true}
          icon={Users}
        />
        <MetricCard
          title="Online customers"
          value={online.toString()}
          note="Meters currently online"
          change="Connected"
          positive={true}
          icon={Wifi}
        />
        <MetricCard
          title="Offline customers"
          value={offline.toString()}
          note="Meters currently offline"
          change="Disconnected"
          positive={false}
          icon={WifiOff}
        />
        <MetricCard
          title="Warning"
          value={warning.toString()}
          note="Meters needing attention"
          change="Needs attention"
          positive={false}
          icon={AlertTriangle}
        />
      </div>

      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Customers</CardTitle>
            <CardDescription>
              Customer records linked to demo meters.
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
              placeholder="Search customers..."
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          <p className="mb-3 text-sm text-slate-500">
            Showing {filteredCustomers.length} of {meters.length} customers
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Meter ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Meter status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.map((meter) => (
                <TableRow
                  key={meter.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => setSelectedCustomer(meter)}
                >
                  <TableCell className="font-medium">{meter.customer}</TableCell>
                  <TableCell>{meter.id}</TableCell>
                  <TableCell>{meter.location}</TableCell>
                  <TableCell>
                    <StatusBadge status={meter.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CustomerDialog
        customer={selectedCustomer}
        transactions={transactions}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}