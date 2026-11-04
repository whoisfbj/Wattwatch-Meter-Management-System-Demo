import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MeterTable } from "@/components/meters/MeterTable";
import { exportMetersCsv } from "@/lib/exportMeters";
import type { Meter, MeterStatus } from "@/types";

export function MetersPage({
  meters,
  onRunCommand,
  onRequestReset,
}: {
  meters: Meter[];
  onRunCommand: (meter: Meter, action: string) => void;
  onRequestReset: (meter: Meter) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | MeterStatus>("All");

  const filteredMeters = useMemo(() => {
    const query = search.toLowerCase().trim();

    return meters.filter((meter) => {
      const matchesSearch = [
        meter.id,
        meter.customer,
        meter.serial,
        meter.location,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || meter.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [meters, search, statusFilter]);

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <CardTitle>All meters</CardTitle>
          <CardDescription className="mt-1">
            Manage and inspect the demo meter fleet.
          </CardDescription>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex w-full gap-2 sm:w-auto">
            <div className="relative min-w-0 flex-1 sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search meters..."
                className="pl-9"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => exportMetersCsv(filteredMeters)}
              className="gap-2"
            >
              <Download size={15} /> Export
            </Button>
          </div>

          <div
            className="flex flex-wrap gap-2"
            aria-label="Filter meters by status"
          >
            {(["All", "Online", "Offline", "Warning"] as const).map((status) => (
              <Button
                key={status}
                type="button"
                size="sm"
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => setStatusFilter(status)}
                className={
                  statusFilter === status
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-white"
                }
                aria-pressed={statusFilter === status}
              >
                {status}
                {status === "All"
                  ? ` (${meters.length})`
                  : ` (${meters.filter((meter) => meter.status === status).length})`}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="mb-3 text-sm text-slate-500">
          Showing {filteredMeters.length} of {meters.length} meters
        </p>
        <MeterTable
          meters={filteredMeters}
          onRunCommand={onRunCommand}
          onRequestReset={onRequestReset}
        />
      </CardContent>
    </Card>
  );
}