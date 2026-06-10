import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <h1 className="text-3xl font-medium tracking-tight">Contact</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          For support, partnership inquiries, or demo requests, reach out to our team.
        </p>
        <div className="mt-8 space-y-3 text-sm">
          <p>
            <span className="text-muted-foreground">Email: </span>
            <a href="mailto:support@teacheros.edu" className="text-primary hover:underline">
              support@teacheros.edu
            </a>
          </p>
          <p>
            <span className="text-muted-foreground">Phone: </span>
            +1 (555) 123-4567
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
