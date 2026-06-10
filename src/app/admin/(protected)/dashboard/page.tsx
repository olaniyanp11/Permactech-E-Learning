"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconDownload } from "@tabler/icons-react";
import { ScoreChart } from "@/components/admin/ScoreChart";
import { StatsCards } from "@/components/admin/StatsCards";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DashboardStats, Submission } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scoreDistribution, setScoreDistribution] = useState<{ range: string; count: number }[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [ranks, setRanks] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setScoreDistribution(data.scoreDistribution);
        setRecentSubmissions(data.recentSubmissions);
        setRanks(data.ranks);
      });
  }, []);

  function handleExport() {
    window.location.href = "/api/submissions/export";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor submissions, scores, and assessment activity.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleExport}>
          <IconDownload className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {stats && <StatsCards stats={stats} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg">
          <h2 className="mb-4 text-sm font-medium">Score Distribution</h2>
          <ScoreChart data={scoreDistribution} />
        </Card>
        <Card padding="lg">
          <h2 className="mb-4 text-sm font-medium">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/exams/new">
              <Button variant="solid" className="w-full">Create New Exam</Button>
            </Link>
            <Link href="/admin/exams">
              <Button variant="ghost" className="w-full">Manage Exams</Button>
            </Link>
            <Link href="/admin/submissions">
              <Button variant="ghost" className="w-full">View All Submissions</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium">Recent Submissions</h2>
        <SubmissionsTable submissions={recentSubmissions} ranks={ranks} />
      </div>
    </div>
  );
}
