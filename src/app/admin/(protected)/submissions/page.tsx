"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconDownload } from "@tabler/icons-react";
import {
  buildSubmissionGroups,
  GroupedSubmissions,
} from "@/components/admin/GroupedSubmissions";
import { Button } from "@/components/ui/Button";
import type { Exam, Submission } from "@/types";

function SubmissionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRankings = searchParams.get("tab") === "rankings";
  const examIdFilter = searchParams.get("examId");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    Promise.all([fetch("/api/submissions").then((r) => r.json()), fetch("/api/exams").then((r) => r.json())])
      .then(([submissionData, examData]) => {
        setSubmissions(submissionData.submissions);
        setExams(examData);
      });
  }, []);

  const groups = useMemo(
    () => buildSubmissionGroups(submissions, exams, examIdFilter),
    [submissions, exams, examIdFilter]
  );

  function setExamFilter(examId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (examId === "all") {
      params.delete("examId");
    } else {
      params.set("examId", examId);
    }
    router.push(`/admin/submissions?${params.toString()}`);
  }

  const exportUrl = examIdFilter
    ? `/api/submissions/export?examId=${examIdFilter}`
    : "/api/submissions/export";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            {isRankings ? "Rankings" : "Submissions"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRankings
              ? "Student scores ranked within each examination."
              : "Submissions grouped by examination."}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { window.location.href = exportUrl; }}>
          <IconDownload className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="exam-filter" className="text-sm text-muted-foreground">
          Filter by exam
        </label>
        <select
          id="exam-filter"
          value={examIdFilter ?? "all"}
          onChange={(e) => setExamFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="all">All exams</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
      </div>

      <GroupedSubmissions
        groups={groups}
        showDevice={!isRankings}
        showRank={isRankings}
      />
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
      <SubmissionsContent />
    </Suspense>
  );
}
