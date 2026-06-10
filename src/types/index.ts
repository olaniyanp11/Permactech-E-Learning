export type QuestionType = "mcq" | "true_false" | "short_answer";

export interface Question {
  id: string;
  examId: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  order: number;
}

export interface Exam {
  id: string;
  title: string;
  instructions: string;
  password: string;
  durationMinutes: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  allowedStudentIds: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceInfo {
  fingerprint: string;
  userAgent: string;
  browser: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  language: string;
  ipAddress?: string;
}

export interface Answer {
  questionId: string;
  value: string;
}

export interface Submission {
  id: string;
  examId: string;
  studentName: string;
  studentId: string;
  studentClass: string;
  answers: Answer[];
  score: number;
  maxScore: number;
  percentage: number;
  deviceInfo: DeviceInfo;
  submittedAt: string;
  startedAt: string;
  status: "submitted" | "in_progress";
}

export interface Admin {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
}

export interface Database {
  admins: Admin[];
  exams: Exam[];
  questions: Question[];
  submissions: Submission[];
}

export interface DashboardStats {
  totalStudents: number;
  totalSubmissions: number;
  activeTests: number;
  averageScore: number;
  duplicateAttemptsBlocked: number;
}
