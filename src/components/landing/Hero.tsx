import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:px-10 md:py-24">
      <div>
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[11.5px] uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_6px] shadow-success/40" />
          Built for modern education
        </div>

        <h1 className="mb-5 text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.04em] text-foreground">
          Simple Online Assessments
          <br />
          <span className="text-muted">For Modern Classrooms</span>
        </h1>

        <p className="mb-9 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          Create tests, monitor student performance, and prevent duplicate submissions with ease.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/assessment">
            <Button variant="hero-primary" size="lg">
              Start Assessment →
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="hero-secondary" size="lg">
              Admin Login
            </Button>
          </Link>
        </div>

        <p className="mt-5 text-xs text-muted">
          No account setup required for students — just a test password.
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-lg">
        <Image
          src="/landing/hero-illustration.svg"
          alt="Student completing an online assessment on a laptop"
          width={560}
          height={420}
          priority
          className="w-full rounded-2xl border border-border-subtle shadow-sm"
        />
      </div>
    </section>
  );
}
