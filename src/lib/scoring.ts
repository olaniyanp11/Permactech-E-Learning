import type { Answer, Question, Submission } from "@/types";

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

function scoreQuestion(question: Question, answer: string): number {
  const normalized = normalizeAnswer(answer);
  const correct = normalizeAnswer(question.correctAnswer);

  if (question.type === "short_answer") {
    if (!normalized) return 0;
    if (normalized === correct) return question.points;
    if (correct.includes(normalized) || normalized.includes(correct)) {
      return Math.ceil(question.points * 0.5);
    }
    return 0;
  }

  return normalized === correct ? question.points : 0;
}

export function calculateScore(
  questions: Question[],
  answers: Answer[]
): Pick<Submission, "score" | "maxScore" | "percentage"> {
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
  let score = 0;

  for (const question of questions) {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer) {
      score += scoreQuestion(question, answer.value);
    }
  }

  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return { score, maxScore, percentage };
}

export function rankSubmissions(
  submissions: Submission[]
): (Submission & { rank: number })[] {
  const submitted = submissions
    .filter((s) => s.status === "submitted")
    .sort((a, b) => b.percentage - a.percentage || a.submittedAt.localeCompare(b.submittedAt));

  return submitted.map((s, index) => ({ ...s, rank: index + 1 }));
}
