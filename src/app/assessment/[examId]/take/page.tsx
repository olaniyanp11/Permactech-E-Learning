"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconAlertTriangle } from "@tabler/icons-react";
import {
  ExamTimer,
  ProgressIndicator,
  QuestionNavigation,
} from "@/components/exam/ExamUI";
import { QuestionRenderer } from "@/components/exam/QuestionRenderer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import {
  clearAnswersLocally,
  collectDeviceInfo,
  loadAnswersLocally,
  saveAnswersLocally,
} from "@/lib/fingerprint";
import type { Question } from "@/types";

interface ExamSession {
  examId: string;
  examTitle: string;
  fullName: string;
  studentId: string;
  studentClass: string;
  password: string;
  durationMinutes: number;
  instructions: string;
  startedAt: string;
}

export default function TakeExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<ExamSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("teacheros_session");
    if (!raw) {
      router.replace("/assessment");
      return;
    }

    const parsed = JSON.parse(raw) as ExamSession;
    if (parsed.examId !== examId) {
      router.replace("/assessment");
      return;
    }

    setSession(parsed);

    const saved = loadAnswersLocally(examId, parsed.studentId);
    if (saved) setAnswers(saved);

    fetch(`/api/exams/${examId}`)
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions));
  }, [examId, router]);

  const handleAnswerChange = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: value };
        if (session) {
          saveAnswersLocally(examId, session.studentId, next);
        }
        return next;
      });
    },
    [examId, session]
  );

  const handleSubmit = useCallback(async () => {
    if (!session) return;
    setSubmitting(true);
    setError("");

    try {
      const deviceInfo = await collectDeviceInfo();
      const answerList = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      const res = await fetch("/api/submissions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          studentName: session.fullName,
          studentId: session.studentId,
          studentClass: session.studentClass,
          password: session.password,
          answers: answerList,
          deviceInfo,
          startedAt: session.startedAt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.duplicate) {
          setError(data.message);
        } else {
          setError(data.error ?? "Submission failed");
        }
        setSubmitting(false);
        setShowSubmitModal(false);
        return;
      }

      clearAnswersLocally(examId, session.studentId);
      sessionStorage.setItem(
        "teacheros_confirmation",
        JSON.stringify({
          studentName: session.fullName,
          examTitle: session.examTitle,
          percentage: data.submission.percentage,
          submittedAt: data.submission.submittedAt,
        })
      );
      sessionStorage.removeItem("teacheros_session");
      router.push("/assessment/confirmation");
    } catch {
      setError("Network error. Your answers are saved locally.");
      setSubmitting(false);
    }
  }, [session, answers, examId, router]);

  const handleTimeUp = useCallback(() => {
    setShowSubmitModal(true);
  }, []);

  if (!session || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading examination...
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter((q) => answers[q.id]?.trim()).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-[var(--nav-bg)] px-4 py-3 backdrop-blur-md md:px-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-medium">{session.examTitle}</h1>
            <p className="text-xs text-muted-foreground">{session.fullName}</p>
          </div>
          <ExamTimer
            durationMinutes={session.durationMinutes}
            startedAt={session.startedAt}
            onTimeUp={handleTimeUp}
          />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 md:px-6">
        {session.instructions && currentIndex === 0 && (
          <Card className="mb-6 border-primary/20 bg-accent/50" padding="md">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Instructions
            </p>
            <p className="mt-2 text-sm leading-relaxed">{session.instructions}</p>
          </Card>
        )}

        {error && (
          <div
            className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            <IconAlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="mb-6">
          <ProgressIndicator
            current={currentIndex + 1}
            total={questions.length}
            answered={answeredCount}
          />
        </div>

        <Card padding="lg" className="mb-6">
          <QuestionRenderer
            question={currentQuestion}
            value={answers[currentQuestion.id] ?? ""}
            onChange={(v) => handleAnswerChange(currentQuestion.id, v)}
            index={currentIndex}
          />
        </Card>

        <div className="mb-6">
          <QuestionNavigation
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            onNavigate={setCurrentIndex}
          />
        </div>

        <div className="flex justify-between gap-3">
          <Button
            variant="ghost"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            ← Previous
          </Button>
          {currentIndex < questions.length - 1 ? (
            <Button onClick={() => setCurrentIndex((i) => i + 1)}>
              Next →
            </Button>
          ) : (
            <Button onClick={() => setShowSubmitModal(true)}>
              Submit Assessment
            </Button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Answers auto-save as you type
        </p>
      </main>

      <Modal
        open={showSubmitModal}
        onClose={() => !submitting && setShowSubmitModal(false)}
        title="Submit Assessment?"
        confirmLabel={submitting ? "Submitting..." : "Confirm Submit"}
        onConfirm={handleSubmit}
        loading={submitting}
      >
        <p>
          You have answered {answeredCount} of {questions.length} questions.
          Once submitted, you cannot change your answers.
        </p>
        {answeredCount < questions.length && (
          <p className="mt-2 text-warning">
            Warning: {questions.length - answeredCount} question(s) remain unanswered.
          </p>
        )}
      </Modal>
    </div>
  );
}
