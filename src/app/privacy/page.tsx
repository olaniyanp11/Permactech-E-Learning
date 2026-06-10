import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <h1 className="text-3xl font-medium tracking-tight">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            TeacherOS collects student names, IDs, class information, assessment responses,
            and device metadata solely for examination administration and integrity monitoring.
          </p>
          <p>
            Each Student ID may only be used once per examination. Device metadata is
            recorded for administration purposes. IP addresses are logged when available.
          </p>
          <p>
            Data is stored securely and accessible only to authorized administrators.
            We do not sell or share student data with third parties.
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
