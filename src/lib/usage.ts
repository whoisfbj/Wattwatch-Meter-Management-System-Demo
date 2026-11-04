import type { Meter } from "@/types";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Multipliers average to 1, so the daily average stays true to the meter.
const weeklyShape = [0.85, 1.0, 0.9, 1.15, 1.0, 1.1, 1.0];

export function getMeterUsage(meter: Meter) {
  const dailyAverage = meter.consumption / 30;
  const offset = Number(meter.id.replace(/\D/g, "")) % 7;

  return days.map((label, index) => ({
    label,
    usage: Number(
      (dailyAverage * weeklyShape[(index + offset) % 7]).toFixed(1),
    ),
  }));
}