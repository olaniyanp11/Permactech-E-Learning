# TeacherOS Assessment Portal

A modern web-based examination platform for schools and training centers.

## Features

- **Admin Dashboard** — Create exams, manage questions, view submissions, export CSV
- **Student Portal** — Password-based access, timed exams, auto-save
- **Anti-Cheat** — Device fingerprinting, duplicate submission prevention
- **Question Types** — MCQ, True/False, Short Answer
- **Dark Mode** — Light (blue/white) and dark themes

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials

- **Email:** admin@teacheros.edu
- **Password:** admin123

### Demo Exam Password

- **Password:** WEBDEV2026

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Recharts
- Tabler Icons

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```
JWT_SECRET=your-secret-key-here
```

## Project Structure

```
src/
├── app/              # Pages and API routes
├── components/       # UI, landing, admin, exam components
├── lib/              # Auth, database, scoring, fingerprint
└── types/            # TypeScript interfaces
data/
└── db.json           # JSON file storage
```
