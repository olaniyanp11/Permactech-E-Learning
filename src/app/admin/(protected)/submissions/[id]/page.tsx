"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate, formatPercent } from "@/lib/utils";
import type { Exam, Question, Submission } from "@/types";

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch(`/api/submissions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSubmission(data.submission);
        setExam(data.exam);
        setQuestions(data.questions);
      });
  }, [id]);

  if (!submission) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  const answerMap = Object.fromEntries(
    submission.answers.map((a) => [a.questionId, a.value])
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/submissions" className="text-xs text-primary hover:underline">
        ← Back to submissions
      </Link>

      <div>
        <h1 className="text-2xl font-medium tracking-tight">{submission.studentName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {submission.studentId} · {submission.studentClass}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-xl font-medium">{formatPercent(submission.percentage)}</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </Card>
        <Card>
          <div className="text-xl font-medium">
            {submission.score}/{submission.maxScore}
          </div>
          <div className="text-xs text-muted-foreground">Points</div>
        </Card>
        <Card>
          <Badge variant="success">Submitted</Badge>
          <div className="mt-1 text-xs text-muted-foreground">
            {formatDate(submission.submittedAt)}
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <h2 className="mb-4 text-sm font-medium">Device Information</h2>
        <dl className="grid gap-2 text-xs sm:grid-cols-2">
          <div><dt className="text-muted-foreground">Browser</dt><dd>{submission.deviceInfo.browser}</dd></div>
          <div><dt className="text-muted-foreground">Platform</dt><dd>{submission.deviceInfo.platform}</dd></div>
          <div><dt className="text-muted-foreground">Screen</dt><dd>{submission.deviceInfo.screenResolution}</dd></div>
          <div><dt className="text-muted-foreground">Timezone</dt><dd>{submission.deviceInfo.timezone}</dd></div>
          <div><dt className="text-muted-foreground">Language</dt><dd>{submission.deviceInfo.language}</dd></div>
          <div><dt className="text-muted-foreground">IP Address</dt><dd>{submission.deviceInfo.ipAddress ?? "N/A"}</dd></div>
          <div className="sm:col-span-2"><dt className="text-muted-foreground">Fingerprint</dt><dd className="break-all font-mono text-[10px]">{submission.deviceInfo.fingerprint}</dd></div>
        </dl>
      </Card>

      <div>
        <h2 className="mb-4 text-sm font-medium">Answers — {exam?.title}</h2>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card key={q.id} padding="md">
              <p className="text-xs text-muted-foreground">Q{i + 1}</p>
              <p className="mt-1 text-sm">{q.text}</p>
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">Answer: </span>
                {answerMap[q.id] || "—"}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
