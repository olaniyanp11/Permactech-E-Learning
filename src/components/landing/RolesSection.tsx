import Image from "next/image";
import { IconChevronRight } from "@tabler/icons-react";

const studentItems = [
  "Enter name, student ID, and class",
  "Authenticate with examination password",
  "Answer MCQ, True/False, and short answer questions",
  "Submit and download your result instantly",
  "One attempt per student, no retakes",
];

const adminItems = [
  "Create and manage tests",
  "Add, edit, or remove questions",
  "View all student submissions and scores",
  "Monitor device and submission metadata",
  "Export results for grading",
];

export function RolesSection() {
  return (
    <section id="roles" className="grid gap-8 border-t border-border-subtle px-6 py-12 md:grid-cols-2 md:px-10">
      <RoleCard
        tag="Student"
        title="Simple, guided experience"
        items={studentItems}
        imageSrc="/landing/student-role.svg"
        imageAlt="Student completing an online assessment"
      />
      <RoleCard
        tag="Administrator"
        title="Full control for instructors"
        items={adminItems}
        imageSrc="/landing/admin-role.svg"
        imageAlt="Administrator reviewing exam results"
      />
    </section>
  );
}

function RoleCard({
  tag,
  title,
  items,
  imageSrc,
  imageAlt,
}: {
  tag: string;
  title: string;
  items: string[];
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={320}
        height={240}
        className="h-40 w-full object-cover object-center"
      />
      <div className="p-7">
        <span className="inline-block rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-muted">
          {tag}
        </span>
        <h3 className="mt-4 text-lg font-medium tracking-tight text-foreground">{title}</h3>
        <ul className="mt-4 space-y-0">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 border-b border-border-subtle py-2.5 text-[13px] text-muted-foreground last:border-0"
            >
              <IconChevronRight className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
