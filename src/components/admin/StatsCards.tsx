import { Card } from "@/components/ui/Card";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: "Total Students", value: stats.totalStudents.toString() },
    { label: "Total Submissions", value: stats.totalSubmissions.toString() },
    { label: "Active Tests", value: stats.activeTests.toString() },
    { label: "Average Score", value: `${Math.round(stats.averageScore)}%` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <div className="text-2xl font-medium tracking-tight text-foreground">
            {card.value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{card.label}</div>
        </Card>
      ))}
    </div>
  );
}
