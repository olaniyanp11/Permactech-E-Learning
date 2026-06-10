import {
  IconChartLine,
  IconClock,
  IconDeviceDesktop,
  IconDownload,
  IconListCheck,
  IconShieldLock,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconListCheck,
    title: "Easy Test Creation",
    description: "Build MCQ, True/False, and short answer assessments in minutes with an intuitive editor.",
  },
  {
    icon: IconDeviceDesktop,
    title: "Student Management",
    description: "Track student details, classes, and submission status from a centralized dashboard.",
  },
  {
    icon: IconShieldLock,
    title: "Secure Assessments",
    description: "Password-protected exams with device fingerprinting and duplicate attempt prevention.",
  },
  {
    icon: IconChartLine,
    title: "Real-Time Results",
    description: "Scores and submission status update live as students complete their assessments.",
  },
  {
    icon: IconClock,
    title: "Device Tracking",
    description: "Every submission records browser info, device fingerprint, IP, and timestamp.",
  },
  {
    icon: IconDownload,
    title: "Result Downloads",
    description: "Students download their score breakdown as CSV. Admins export full class results.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border-subtle px-6 py-12 md:px-10">
      <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-muted">Core features</p>
      <h2 className="mb-8 text-[1.6rem] font-medium tracking-[-0.03em] text-foreground">
        Everything you need to run assessments
      </h2>

      <div className="grid gap-px overflow-hidden rounded-xl border border-border-subtle bg-border-subtle md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-background p-7">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface">
              <Icon className="h-[17px] w-[17px] text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="mb-1.5 text-[13px] font-medium text-accent-foreground">{title}</h3>
            <p className="text-xs leading-relaxed text-muted">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
