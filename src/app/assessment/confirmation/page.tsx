"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconCircleCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate, formatPercent } from "@/lib/utils";

interface ConfirmationData {
  studentName: string;
  examTitle: string;
  percentage: number;
  submittedAt: string;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [data, setData] = useState<ConfirmationData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("teacheros_confirmation");
    if (!raw) {
      router.replace("/assessment");
      return;
    }
    setData(JSON.parse(raw));
  }, [router]);

  if (!data) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center" padding="lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-bg">
          <IconCircleCheck className="h-8 w-8 text-success" aria-hidden="true" />
        </div>

        <h1 className="text-xl font-medium tracking-tight">Submission Confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your assessment has been successfully submitted.
        </p>

        <dl className="mt-6 space-y-3 text-left text-sm">
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <dt className="text-muted-foreground">Student</dt>
            <dd className="font-medium">{data.studentName}</dd>
          </div>
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <dt className="text-muted-foreground">Examination</dt>
            <dd className="font-medium">{data.examTitle}</dd>
          </div>
          <div className="flex justify-between border-b border-border-subtle pb-2">
            <dt className="text-muted-foreground">Score</dt>
            <dd className="font-medium">{formatPercent(data.percentage)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Submitted</dt>
            <dd className="font-medium">{formatDate(data.submittedAt)}</dd>
          </div>
        </dl>

        <Link href="/" className="mt-8 block">
          <Button className="w-full">Return to Home</Button>
        </Link>
      </Card>
    </div>
  );
}
