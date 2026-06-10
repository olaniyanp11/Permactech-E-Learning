import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="border-t border-border-subtle px-6 py-20 text-center md:px-10">
      <h2 className="mb-3 text-[2rem] font-medium tracking-[-0.04em] text-foreground">
        Ready to run your first test?
      </h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Set up a test in minutes. Students just need a password to get started.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/admin/login">
          <Button variant="hero-primary" size="lg">
            Go to Admin Dashboard →
          </Button>
        </Link>
        <Link href="/assessment">
          <Button variant="hero-secondary" size="lg">
            Student Portal
          </Button>
        </Link>
      </div>
    </section>
  );
}
