import type { Meter } from "@/types";

export function exportMetersCsv(meters: Meter[]) {
  const header =
    "Meter ID,Customer,Location,Serial,Consumption (kWh),Balance (NGN),Status";

  const rows = meters.map((meter) =>
    [
      meter.id,
      meter.customer,
      meter.location,
      meter.serial,
      meter.consumption,
      meter.balance,
      meter.status,
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );

  const blob = new Blob([[header, ...rows].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "wattwatch-meters-demo.csv";
  link.click();

  URL.revokeObjectURL(url);
}