import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <h1 className="text-3xl font-medium tracking-tight">About TeacherOS</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          TeacherOS Assessment Portal is a web-based examination platform designed for schools
          and training centers. It empowers instructors to create secure online tests while
          giving students a frictionless assessment experience.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Built with modern web technologies, TeacherOS prioritizes accessibility, security,
          and ease of use for both educators and learners.
        </p>
        <Link href="/" className="mt-8 inline-block text-sm text-primary hover:underline">
          ← Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
