"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { fromDatetimeLocalValue } from "@/lib/utils";

export default function NewExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    instructions: "",
    password: "",
    durationMinutes: "45",
    isActive: true,
    startsAt: "",
    endsAt: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        instructions: form.instructions,
        password: form.password,
        durationMinutes: Number(form.durationMinutes),
        isActive: form.isActive,
        startsAt: fromDatetimeLocalValue(form.startsAt),
        endsAt: fromDatetimeLocalValue(form.endsAt),
      }),
    });

    if (!res.ok) {
      setError("Failed to create exam");
      setLoading(false);
      return;
    }

    const exam = await res.json();
    router.push(`/admin/exams/${exam.id}`);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Create Exam</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set up a new examination for your students.
        </p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Exam Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Instructions</label>
            <textarea
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Input
            label="Examination Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="new-password"
          />
          <Input
            label="Duration (minutes)"
            type="number"
            min={1}
            value={form.durationMinutes}
            onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Opens at (optional)"
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            />
            <Input
              label="Closes at (optional)"
              type="datetime-local"
              value={form.endsAt}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Leave blank to allow access anytime while the exam is active.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Active (students can access)
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Exam"}
            </Button>
            <Link href="/admin/exams">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
