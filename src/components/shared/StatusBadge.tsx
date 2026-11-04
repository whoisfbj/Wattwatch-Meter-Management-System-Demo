import { Badge } from "@/components/ui/badge";
import type { MeterStatus, PaymentStatus } from "@/types";

export function StatusBadge({
  status,
}: {
  status: MeterStatus | PaymentStatus;
}) {
  if (status === "Online" || status === "Successful") {
    return (
      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
        {status}
      </Badge>
    );
  }

  if (status === "Warning" || status === "Pending") {
    return (
      <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
        {status}
      </Badge>
    );
  }

  if (status === "Rejected") {
  return (
    <Badge className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50">
      {status}
    </Badge>
  );
}

  return (
    <Badge
      variant="outline"
      className="border-slate-200 bg-slate-50 text-slate-500"
    >
      {status}
    </Badge>
  );
}