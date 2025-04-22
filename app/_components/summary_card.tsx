import { cn } from "@/lib/utils";

export function SummaryCard({
  title,
  value,
  color = "primary",
}: {
  title: string;
  value: string;
  color?: "primary" | "success" | "danger";
}) {
  const colorMap = {
    primary: "bg-indigo-100 text-indigo-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <div className={cn("rounded-lg p-4", colorMap[color])}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
