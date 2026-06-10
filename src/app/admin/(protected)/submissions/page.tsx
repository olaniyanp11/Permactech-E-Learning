"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconDownload } from "@tabler/icons-react";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { Button } from "@/components/ui/Button";
import type { Submission } from "@/types";

function SubmissionsContent() {
  const searchParams = useSearchParams();
  const isRankings = searchParams.get("tab") === "rankings";
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [ranked, setRanked] = useState<(Submission & { rank: number })[]>([]);
  const [ranks, setRanks] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((data) => {
        setSubmissions(data.submissions);
        setRanked(data.ranked);
        setRanks(data.ranks);
      });
  }, []);

  const displaySubmissions = isRankings
    ? ranked
    : submissions.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            {isRankings ? "Rankings" : "Submissions"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRankings
              ? "Student scores ranked by performance."
              : "All student submissions with device information."}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { window.location.href = "/api/submissions/export"; }}>
          <IconDownload className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <SubmissionsTable
        submissions={displaySubmissions}
        showDevice={!isRankings}
        showRank={isRankings}
        ranks={ranks}
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
