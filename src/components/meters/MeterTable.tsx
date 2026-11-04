import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { money } from "@/lib/format";
import type { Meter } from "@/types";

export function MeterTable({
  meters,
  onRunCommand,
  onRequestReset,
}: {
  meters: Meter[];
  onRunCommand: (meter: Meter, action: string) => void;
  onRequestReset: (meter: Meter) => void;
}) {
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Meter</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead>Consumption</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
           <TableHead className="w-10">
                <span className="sr-only">Details</span>
            </TableHead>
        <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {meters.map((meter) => (
            <TableRow
              key={meter.id}
              className="cursor-pointer"
              onClick={() => setSelectedMeter(meter)}
            >
              <TableCell>
                <p className="font-medium">{meter.id}</p>
                <p className="mt-1 text-xs text-slate-400">{meter.serial}</p>
              </TableCell>

              <TableCell className="font-medium">{meter.customer}</TableCell>

              <TableCell className="hidden text-slate-500 md:table-cell">
                {meter.location}
              </TableCell>

              <TableCell>{meter.consumption.toFixed(1)} kWh</TableCell>
              <TableCell>{money(meter.balance)}</TableCell>

              <TableCell>
                <StatusBadge status={meter.status} />
              </TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View details for ${meter.id}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedMeter(meter);
                  }}
                >
                  <MoreHorizontal size={17} />
                </Button>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRunCommand(meter, "Run diagnostics");
                    }}
                  >
                    Diagnose
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRunCommand(meter, "Refresh meter");
                    }}
                  >
                    Refresh

                    {meter.status !== "Offline" && (
  <Button
    size="sm"
    variant="outline"
    className="border-amber-200 text-amber-700 hover:bg-amber-50"
    onClick={(event) => {
      event.stopPropagation();
      onRunCommand(meter, "Simulate outage");
    }}
  >
    Take offline
  </Button>
)}

                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRequestReset(meter);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {meters.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-10 text-center text-slate-500"
              >
                No meters match your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={selectedMeter !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMeter(null);
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg">
          {selectedMeter && (
            <div className="w-full space-y-5">
              <DialogHeader>
                <DialogTitle>Meter details</DialogTitle>
                <DialogDescription>
                  Information for meter {selectedMeter.id}. This is
                  demonstration data.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Meter ID</p>
                  <p className="mt-1 wrap-break-word font-medium">
                    {selectedMeter.id}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Serial number</p>
                  <p className="mt-1 wrap-break-word font-medium">
                    {selectedMeter.serial}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="mt-1 wrap-break-word font-medium">
                    {selectedMeter.customer}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="mt-1 wrap-break-word font-medium">
                    {selectedMeter.location}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Consumption</p>
                  <p className="mt-1 font-medium">
                    {selectedMeter.consumption.toFixed(1)} kWh
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="mt-1 font-medium">
                    {money(selectedMeter.balance)}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">
                    Connection status
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={selectedMeter.status} />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Last checked</p>
                  <p className="mt-1 wrap-break-word font-medium">
                    {selectedMeter.lastChecked ?? "Not checked yet"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Last reset</p>
                  <p className="mt-1 wrap-break-word font-medium">
                    {selectedMeter.lastReset ?? "Never reset"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setSelectedMeter(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}