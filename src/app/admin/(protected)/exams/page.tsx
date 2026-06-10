"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatExamDate } from "@/lib/utils";
import type { Exam } from "@/types";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    fetch("/api/exams")
      .then((r) => r.json())
      .then(setExams);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this exam and all its questions and submissions?")) return;
    await fetch(`/api/exams/${id}`, { method: "DELETE" });
    setExams((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Exams</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage examinations.
          </p>
        </div>
        <Link href="/admin/exams/new">
          <Button>
            <IconPlus className="h-4 w-4" />
            New Exam
          </Button>
        </Link>
      </div>

      {exams.length === 0 ? (
        <Card className="text-center text-sm text-muted-foreground">
          No exams yet. Create your first exam to get started.
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam) => (
            <Card key={exam.id} padding="lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-medium">{exam.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {exam.durationMinutes} min
                    {exam.allowedStudentIds?.length
                      ? ` · ${exam.allowedStudentIds.length} allowed IDs`
                      : ""}
                  </p>
                  {exam.startsAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Opens {formatExamDate(exam.startsAt)}
                      {exam.endsAt ? ` · Closes ${formatExamDate(exam.endsAt)}` : ""}
                    </p>
                  )}
                </div>
                <Badge variant={exam.isActive ? "success" : "neutral"}>
                  {exam.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                {exam.instructions || "No instructions"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/admin/exams/${exam.id}`}>
                  <Button variant="ghost" size="sm">Edit</Button>
                </Link>
                <Link href={`/admin/submissions?examId=${exam.id}`}>
                  <Button variant="ghost" size="sm">Submissions</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(exam.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
