import Link from "next/link";
import { IconDownload } from "@tabler/icons-react";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { Button } from "@/components/ui/Button";
import { rankSubmissions } from "@/lib/scoring";
import { getMissingStudentIds } from "@/lib/student-ids";
import type { Exam, Submission } from "@/types";

export interface SubmissionGroup {
  examId: string;
  exam: Exam | undefined;
  submissions: Submission[];
}

interface GroupedSubmissionsProps {
  groups: SubmissionGroup[];
  showDevice?: boolean;
  showRank?: boolean;
}

function sortGroupSubmissions(
  submissions: Submission[],
  showRank: boolean,
  ranks: Record<string, number>
): Submission[] {
  if (showRank) {
    return [...submissions].sort(
      (a, b) => (ranks[a.id] ?? 999) - (ranks[b.id] ?? 999)
    );
  }
  return [...submissions].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export function GroupedSubmissions({
  groups,
  showDevice = false,
  showRank = false,
}: GroupedSubmissionsProps) {
  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No submissions yet.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map(({ examId, exam, submissions }) => {
        const ranks = Object.fromEntries(
          rankSubmissions(submissions).map((s) => [s.id, s.rank])
        );
        const sorted = sortGroupSubmissions(submissions, showRank, ranks);
        const submittedIds = submissions
          .filter((s) => s.status === "submitted")
          .map((s) => s.studentId);
        const missingIds =
          exam?.allowedStudentIds?.length
            ? getMissingStudentIds(exam.allowedStudentIds, submittedIds)
            : [];

        return (
          <section key={examId} className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-medium">{exam?.title ?? "Unknown exam"}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {submissions.length} submission{submissions.length === 1 ? "" : "s"}
                  {exam?.allowedStudentIds?.length
                    ? ` · ${submittedIds.length} / ${exam.allowedStudentIds.length} on allowlist`
                    : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {exam && (
                  <Link href={`/admin/exams/${examId}`}>
                    <Button variant="ghost" size="sm">
                      View exam
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.location.href = `/api/submissions/export?examId=${examId}`;
                  }}
                >
                  <IconDownload className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            {missingIds.length > 0 && (
              <div className="rounded-xl border border-warning/30 bg-warning/5 px-4 py-3">
                <p className="text-xs font-medium text-warning">
                  {missingIds.length} student{missingIds.length === 1 ? "" : "s"} not yet submitted
                </p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {missingIds.join(", ")}
                </p>
              </div>
            )}
            <SubmissionsTable
              submissions={sorted}
              showDevice={showDevice}
              showRank={showRank}
              ranks={ranks}
            />
          </section>
        );
      })}
    </div>
  );
}

export function buildSubmissionGroups(
  submissions: Submission[],
  exams: Exam[],
  examIdFilter?: string | null
): SubmissionGroup[] {
  const examsById = Object.fromEntries(exams.map((e) => [e.id, e]));
  const map = new Map<string, Submission[]>();

  for (const submission of submissions) {
    if (examIdFilter && submission.examId !== examIdFilter) continue;
    const list = map.get(submission.examId) ?? [];
    list.push(submission);
    map.set(submission.examId, list);
  }

  return [...map.entries()]
    .sort((a, b) =>
      (examsById[a[0]]?.title ?? "").localeCompare(examsById[b[0]]?.title ?? "", undefined, {
        sensitivity: "base",
      })
    )
    .map(([examId, groupSubmissions]) => ({
      examId,
      exam: examsById[examId],
      submissions: groupSubmissions,
    }));
}
