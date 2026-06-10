const stats = [
  { value: "500+", label: "Students Assessed" },
  { value: "100+", label: "Tests Created" },
  { value: "98%", label: "Submission Accuracy" },
  { value: "0", label: "Duplicate Attempts Allowed" },
];

export function StatsStrip() {
  return (
    <div className="grid grid-cols-2 border-y border-border-subtle md:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`px-6 py-7 md:px-10 ${i < stats.length - 1 ? "border-r border-border-subtle" : ""}`}
        >
          <div className="text-[1.75rem] font-medium tracking-[-0.04em] text-foreground">
            {stat.value}
          </div>
          <div className="mt-1 text-xs text-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
