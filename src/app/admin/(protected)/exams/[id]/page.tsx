"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { formatStudentIdList, parseStudentIdList } from "@/lib/student-ids";
import { formatDate, toDatetimeLocalValue } from "@/lib/utils";
import type { Exam, Question, QuestionType } from "@/types";

export default function EditExamPage() {
  const { id } = useParams<{ id: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [allowedIdsText, setAllowedIdsText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [qForm, setQForm] = useState({
    type: "mcq" as QuestionType,
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: "1",
  });

  useEffect(() => {
    fetch(`/api/exams/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setExam(data.exam);
        setAllowedIdsText(formatStudentIdList(data.exam.allowedStudentIds));
        setQuestions(data.questions);
      });
  }, [id]);

  async function saveExam(updates: Partial<Exam>) {
    setSaving(true);
    const res = await fetch(`/api/exams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setExam(updated);
    setSaving(false);
  }

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      type: qForm.type,
      text: qForm.text,
      options: qForm.type === "mcq" ? qForm.options.filter(Boolean) : undefined,
      correctAnswer: qForm.correctAnswer,
      points: Number(qForm.points),
    };

    const res = await fetch(`/api/exams/${id}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const question = await res.json();
    setQuestions((prev) => [...prev, question]);
    setShowQuestionForm(false);
    setQForm({ type: "mcq", text: "", options: ["", "", "", ""], correctAnswer: "", points: "1" });
  }

  async function deleteQuestion(questionId: string) {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/exams/${id}/questions/${questionId}`, { method: "DELETE" });
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  }

  if (!exam) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/exams" className="text-xs text-primary hover:underline">
            ← Back to exams
          </Link>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">{exam.title}</h1>
        </div>
        <Badge variant={exam.isActive ? "success" : "neutral"}>
          {exam.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Card padding="lg">
        <h2 className="mb-4 text-sm font-medium">Exam Settings</h2>
        <div className="space-y-4">
          <Input
            label="Title"
            value={exam.title}
            onChange={(e) => setExam({ ...exam, title: e.target.value })}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Instructions</label>
            <textarea
              value={exam.instructions}
              onChange={(e) => setExam({ ...exam, instructions: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Password"
              type="password"
              value={exam.password}
              onChange={(e) => setExam({ ...exam, password: e.target.value })}
              autoComplete="new-password"
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={exam.durationMinutes}
              onChange={(e) => setExam({ ...exam, durationMinutes: Number(e.target.value) })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Opens at (optional)"
              type="datetime-local"
              value={toDatetimeLocalValue(exam.startsAt)}
              onChange={(e) =>
                setExam({
                  ...exam,
                  startsAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                })
              }
            />
            <Input
              label="Closes at (optional)"
              type="datetime-local"
              value={toDatetimeLocalValue(exam.endsAt)}
              onChange={(e) =>
                setExam({
                  ...exam,
                  endsAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                })
              }
            />
          </div>
          {(exam.startsAt || exam.endsAt) && (
            <p className="text-xs text-muted-foreground">
              {exam.startsAt && <>Opens {formatDate(exam.startsAt)}</>}
              {exam.startsAt && exam.endsAt && " · "}
              {exam.endsAt && <>Closes {formatDate(exam.endsAt)}</>}
            </p>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Allowed Student IDs (optional)
            </label>
            <textarea
              value={allowedIdsText}
              onChange={(e) => setAllowedIdsText(e.target.value)}
              rows={8}
              placeholder={"UPS2026001\nUPS2026002\nUPS2026003"}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              One ID per line. Leave empty to allow any Student ID.
              {allowedIdsText.trim() && (
                <> · {parseStudentIdList(allowedIdsText).length} ID(s) listed</>
              )}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={exam.isActive}
              onChange={(e) => setExam({ ...exam, isActive: e.target.checked })}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Active
          </label>
          <Button
            onClick={() => {
              const allowedStudentIds = parseStudentIdList(allowedIdsText);
              saveExam({
                ...exam,
                allowedStudentIds: allowedStudentIds.length ? allowedStudentIds : null,
              });
            }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium">Questions ({questions.length})</h2>
          <Button size="sm" onClick={() => setShowQuestionForm(!showQuestionForm)}>
            <IconPlus className="h-4 w-4" />
            Add Question
          </Button>
        </div>

        {showQuestionForm && (
          <Card className="mb-4" padding="lg">
            <form onSubmit={addQuestion} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Type</label>
                <select
                  value={qForm.type}
                  onChange={(e) => setQForm({ ...qForm, type: e.target.value as QuestionType })}
                  className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>
              <Input
                label="Question Text"
                value={qForm.text}
                onChange={(e) => setQForm({ ...qForm, text: e.target.value })}
                required
              />
              {qForm.type === "mcq" &&
                qForm.options.map((opt, i) => (
                  <Input
                    key={i}
                    label={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const options = [...qForm.options];
                      options[i] = e.target.value;
                      setQForm({ ...qForm, options });
                    }}
                  />
                ))}
              {qForm.type === "true_false" ? (
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Correct Answer</label>
                  <select
                    value={qForm.correctAnswer}
                    onChange={(e) => setQForm({ ...qForm, correctAnswer: e.target.value })}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              ) : (
                <Input
                  label="Correct Answer"
                  value={qForm.correctAnswer}
                  onChange={(e) => setQForm({ ...qForm, correctAnswer: e.target.value })}
                  required
                />
              )}
              <Input
                label="Points"
                type="number"
                min={1}
                value={qForm.points}
                onChange={(e) => setQForm({ ...qForm, points: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit">Add Question</Button>
                <Button variant="ghost" type="button" onClick={() => setShowQuestionForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card key={q.id} padding="md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">
                    Q{i + 1} · {q.type.replace("_", " ")} · {q.points} pts
                  </span>
                  <p className="mt-1 text-sm">{q.text}</p>
                  {q.options && (
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {q.options.map((o) => (
                        <li key={o} className={o === q.correctAnswer ? "text-success" : ""}>
                          {o}{o === q.correctAnswer ? " ✓" : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                  {q.type !== "mcq" && (
                    <p className="mt-1 text-xs text-success">Answer: {q.correctAnswer}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteQuestion(q.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Delete question"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
