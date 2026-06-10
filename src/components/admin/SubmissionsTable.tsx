import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPercent } from "@/lib/utils";
import type { Submission } from "@/types";

interface SubmissionsTableProps {
  submissions: Submission[];
  showDevice?: boolean;
  showRank?: boolean;
  ranks?: Record<string, number>;
}

export function SubmissionsTable({
  submissions,
  showDevice = false,
  showRank = false,
  ranks = {},
}: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No submissions yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            {showRank && <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Rank</th>}
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Student</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">ID</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Class</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Score</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Submitted</th>
            {showDevice && (
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Device</th>
            )}
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id} className="border-b border-border-subtle last:border-0">
              {showRank && (
                <td className="px-4 py-3 text-muted-foreground">{ranks[s.id] ?? "—"}</td>
              )}
              <td className="px-4 py-3 font-medium text-foreground">{s.studentName}</td>
              <td className="px-4 py-3 text-muted-foreground">{s.studentId}</td>
              <td className="px-4 py-3 text-muted-foreground">{s.studentClass}</td>
              <td className="px-4 py-3 text-foreground">
                {s.status === "submitted" ? formatPercent(s.percentage) : "—"}
              </td>
              <td className="px-4 py-3">
                <Badge variant={s.status === "submitted" ? "success" : "warning"}>
                  {s.status === "submitted" ? "Submitted" : "In Progress"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {s.status === "submitted" ? formatDate(s.submittedAt) : "—"}
              </td>
              {showDevice && (
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {s.deviceInfo.browser} · {s.deviceInfo.platform}
                </td>
              )}
              <td className="px-4 py-3">
                <Link
                  href={`/admin/submissions/${s.id}`}
                  className="text-xs text-primary hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
