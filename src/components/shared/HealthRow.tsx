export function HealthRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-slate-500">{label}</span>
      <span className="ml-auto font-semibold">{value}</span>
    </div>
  );
}