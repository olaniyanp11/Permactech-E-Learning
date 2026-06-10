import {
  IconChartBar,
  IconChevronRight,
  IconFileText,
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/Badge";

const rows = [
  { name: "John Doe", class: "SS2", score: "85%", status: "Submitted" as const },
  { name: "Jane Smith", class: "SS2", score: "92%", status: "Submitted" as const },
  { name: "Ahmed Musa", class: "SS3", score: "—", status: "Pending" as const },
  { name: "Chioma Eze", class: "SS2", score: "78%", status: "Submitted" as const },
];

export function DashboardPreview() {
  return (
    <section className="px-6 py-16 md:px-10">
      <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-muted">Admin dashboard</p>
      <h2 className="mb-2 text-[1.6rem] font-medium tracking-[-0.03em] text-foreground">
        Everything at a glance
      </h2>
      <p className="mb-10 text-sm text-muted-foreground">
        Monitor submissions in real time. See scores, track pending students, and export results.
      </p>

      <div className="overflow-hidden rounded-[14px] border border-border bg-surface">
        <div className="flex items-center gap-2 border-b border-border bg-surface-elevated px-4 py-2.5">
          <div className="h-2 w-2 rounded-full bg-border" />
          <div className="h-2 w-2 rounded-full bg-border" />
          <div className="h-2 w-2 rounded-full bg-border" />
          <span className="ml-1.5 text-xs text-muted">TeacherOS — Admin</span>
        </div>

        <div className="grid min-h-[320px] md:grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-border p-4 md:block">
            {[
              { icon: IconLayoutDashboard, label: "Overview", active: true },
              { icon: IconUsers, label: "Students" },
              { icon: IconFileText, label: "Questions" },
              { icon: IconChartBar, label: "Results" },
              { icon: IconSettings, label: "Settings" },
            ].map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`mb-0.5 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs ${
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </div>
            ))}
          </aside>

          <div className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[13px] font-medium text-accent-foreground">
                WEBDEV2026 — Overview
              </span>
              <span className="rounded-md border border-border bg-accent px-2.5 py-1 text-[11px] text-muted-foreground">
                Export CSV
              </span>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2.5">
              {[
                { val: "120", lbl: "Total students" },
                { val: "95", lbl: "Submitted" },
                { val: "25", lbl: "Pending" },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="rounded-lg border border-border bg-card p-3">
                  <div className="text-xl font-medium tracking-tight text-foreground">{val}</div>
                  <div className="mt-0.5 text-[11px] text-muted">{lbl}</div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <div className="grid grid-cols-4 gap-2 border-b border-border py-2 text-[11px] text-muted">
                <span>Student</span>
                <span>Class</span>
                <span>Score</span>
                <span>Status</span>
              </div>
              {rows.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-4 items-center gap-2 border-b border-border-subtle py-2 text-xs last:border-0"
                >
                  <span className="text-accent-foreground">{row.name}</span>
                  <span className="text-muted-foreground">{row.class}</span>
                  <span className="text-muted-foreground">{row.score}</span>
                  <span>
                    <Badge variant={row.status === "Submitted" ? "success" : "neutral"}>
                      {row.status}
                    </Badge>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
