import { X } from "lucide-react";
export function Toast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-100 flex w-[calc(100%-3rem)] max-w-sm items-start gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-xl"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        ✓
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">Action completed</p>
        <p className="mt-1 text-sm leading-5 text-slate-600">{message}</p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-700"
        aria-label="Dismiss notification"
      >
  <X size={16} />
</button>
    </div>
  );
}