import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <h1 className="text-3xl font-medium tracking-tight">Terms of Service</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            By using TeacherOS Assessment Portal, students agree to complete assessments
            independently and submit only one attempt per examination.
          </p>
          <p>
            Administrators are responsible for safeguarding examination passwords and
            ensuring fair use of the platform.
          </p>
          <p>
            Attempts to circumvent anti-cheat measures, including duplicate submissions
            from multiple devices, may result in disqualification at the instructor&apos;s discretion.
          </p>
        </div>
        <Link href="/" className="mt-8 inline-block text-sm text-primary hover:underline">
          ← Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
