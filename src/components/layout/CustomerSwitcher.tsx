import type { Meter } from "@/types";

export function CustomerSwitcher({
  meters,
  customerId,
  onChange,
}: {
  meters: Meter[];
  customerId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        Demo mode: pick which customer account to preview.
      </p>

      <label className="flex items-center gap-2 text-xs text-slate-500">
        Viewing as
        <select
          value={customerId}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-300"
        >
          {meters.map((meter) => (
            <option key={meter.id} value={meter.id}>
              {meter.customer} ({meter.id})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}