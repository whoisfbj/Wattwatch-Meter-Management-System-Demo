import type { Meter } from "@/types";

export function getMeterStats(meters: Meter[]) {
  const total = meters.length;
  const online = meters.filter((meter) => meter.status === "Online").length;
  const offline = meters.filter((meter) => meter.status === "Offline").length;
  const warning = meters.filter((meter) => meter.status === "Warning").length;
  const onlinePercentage = total > 0 ? Math.round((online / total) * 100) : 0;

  return { total, online, offline, warning, onlinePercentage };
}