import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <p className="text-sm font-medium text-foreground">{APP_NAME}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Simple online assessments for modern classrooms.
          </p>
        </div>
        <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
          <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
      <div className="border-t border-border-subtle px-6 py-5 md:px-10">
        <p className="text-center text-xs text-muted-foreground md:text-left">
          {APP_NAME} — Built with Next.js · Tailwind CSS · TypeScript
        </p>
      </div>
    </footer>
  );
}
