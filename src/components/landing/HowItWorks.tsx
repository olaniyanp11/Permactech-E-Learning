const steps = [
  {
    step: "01",
    title: "Teacher creates a test",
    description: "Set title, instructions, duration, and add questions of any type.",
  },
  {
    step: "02",
    title: "Students enter their details",
    description: "Name, student ID, class, and examination password to authenticate.",
  },
  {
    step: "03",
    title: "Students complete assessment",
    description: "Timed exam with navigation, auto-save, and progress tracking.",
  },
  {
    step: "04",
    title: "Results are automatically recorded",
    description: "Scores calculated instantly with full submission metadata stored.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border-subtle px-6 py-12 md:px-10">
      <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-muted">How it works</p>
      <h2 className="mb-8 text-[1.6rem] font-medium tracking-[-0.03em] text-foreground">
        From setup to results in four steps
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ step, title, description }) => (
          <div
            key={step}
            className="rounded-xl border border-border bg-card p-6"
          >
            <span className="text-2xl font-medium tracking-tight text-muted">{step}</span>
            <h3 className="mt-3 text-sm font-medium text-foreground">{title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
