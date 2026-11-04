import { useState } from "react";
import { Command } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DemoCommand, Meter } from "@/types";

export function CommandLogPage({
  meters,
  commandLogs,
}: {
  meters: Meter[];
  commandLogs: DemoCommand[];
}) {
  const [meterFilter, setMeterFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");

  const filteredCommands = commandLogs.filter((command) => {
    const matchesMeter = meterFilter === "All" || command.meterId === meterFilter;
    const matchesAction =
      actionFilter === "All" || command.action === actionFilter;

    return matchesMeter && matchesAction;
  });

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle>Command log</CardTitle>
        <CardDescription>
          Simulated command history. No commands are sent to physical meters.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <select
            value={meterFilter}
            onChange={(event) => setMeterFilter(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300 sm:w-50"
          >
            <option value="All">All meters</option>
            {meters.map((meter) => (
              <option key={meter.id} value={meter.id}>
                {meter.id}
              </option>
            ))}
          </select>

          <select
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300 sm:w-50"
          >
            <option value="All">All actions</option>
            <option value="Reset meter">Reset meter</option>
            <option value="Refresh meter">Refresh meter</option>
            <option value="Run diagnostics">Run diagnostics</option>
            <option value="Disburse credit">Disburse credit</option>
            <option value="Simulate outage">Simulate outage</option>
          </select>
        </div>

        {filteredCommands.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Command className="text-slate-500" size={25} />
            </div>

            <h3 className="mt-4 font-semibold">
              {commandLogs.length === 0
                ? "No demo commands yet"
                : "No matching commands"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {commandLogs.length === 0
                ? "Command history will appear here when you run simulated meter actions."
                : "Try changing your filters to see other commands."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Command ID</TableHead>
                  <TableHead>Meter</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCommands.map((command) => (
                  <TableRow key={command.id}>
                    <TableCell className="font-mono text-xs">
                      {command.id}
                    </TableCell>
                    <TableCell>{command.meterId}</TableCell>
                    <TableCell>{command.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{command.status}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {command.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}