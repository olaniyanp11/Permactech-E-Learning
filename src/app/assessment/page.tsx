"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconClipboardCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { APP_SHORT_NAME } from "@/lib/constants";

export default function AssessmentEntryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    studentId: "",
    studentClass: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const verifyRes = await fetch("/api/exams/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: form.password }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setError(verifyData.error ?? "Invalid examination password. Please check with your instructor.");
        setLoading(false);
        return;
      }

      const { exam } = verifyData;

      sessionStorage.setItem(
        "teacheros_session",
        JSON.stringify({
          examId: exam.id,
          examTitle: exam.title,
          fullName: form.fullName,
          studentId: form.studentId.trim(),
          studentClass: form.studentClass,
          password: form.password,
          durationMinutes: exam.durationMinutes,
          instructions: exam.instructions,
          startedAt: new Date().toISOString(),
        })
      );

      router.push(`/assessment/${exam.id}/take`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-[15px] font-medium">
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary">
            <IconClipboardCheck className="h-[17px] w-[17px] text-primary-foreground" />
          </div>
          {APP_SHORT_NAME}
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-md px-6 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium tracking-tight">Start Assessment</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your details and examination password to begin.
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              autoComplete="name"
            />
            <Input
              label="Student ID"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              required
              placeholder="e.g. UPS2026001"
            />
            <Input
              label="Class"
              value={form.studentClass}
              onChange={(e) => setForm({ ...form, studentClass: e.target.value })}
              required
              placeholder="e.g. SS2"
            />
            <Input
              label="Examination Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Start Examination →"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Only one submission counts per Student ID (e.g. UPS2026001–UPS2026025).
        </p>
      </main>
    </div>
  );
}
