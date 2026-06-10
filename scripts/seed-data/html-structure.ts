import type { Exam, Question } from "../../src/types";

const EXAM_ID = "exam-html-structure";

export const htmlStructureExam: Exam = {
  id: EXAM_ID,
  title: "HTML Elements & Document Structure",
  instructions:
    "This assessment covers HTML tags, elements, and basic document structure. " +
    "Read each question carefully. You have 30 minutes. " +
    "Multiple choice and true/false questions are auto-graded.",
  password: "HTML2026",
  durationMinutes: 30,
  isActive: true,
  startsAt: "2026-06-11T11:00:00.000Z", // Thu 12:00 PM (WAT)
  endsAt: "2026-06-12T23:00:00.000Z", // Sat 12:00 AM midnight (WAT)
  createdAt: "2026-06-01T08:00:00.000Z",
  updatedAt: "2026-06-01T08:00:00.000Z",
};

export { EXAM_ID };

type RawQuestion = Omit<Question, "examId" | "type"> & {
  type: Question["type"] | "fill_blank";
};

const rawQuestions: RawQuestion[] = [

  // ── TRUE / FALSE (1 mark each × 10 = 10 marks) ──────────────────────

  {
    id: "html-q-tf-01",
    type: "true_false",
    text: "Every HTML5 page should start with <!DOCTYPE html>.",
    correctAnswer: "true",
    points: 1,
    order: 1,
  },
  {
    id: "html-q-tf-02",
    type: "true_false",
    text: "Anything inside the <head> tag is shown on the web page.",
    correctAnswer: "false",
    points: 1,
    order: 2,
  },
  {
    id: "html-q-tf-03",
    type: "true_false",
    text: "The <img> tag does not need a closing tag.",
    correctAnswer: "true",
    points: 1,
    order: 3,
  },
  {
    id: "html-q-tf-04",
    type: "true_false",
    text: "<span> wraps text without pushing it onto a new line.",
    correctAnswer: "true",
    points: 1,
    order: 4,
  },
  {
    id: "html-q-tf-05",
    type: "true_false",
    text: "In HTML5, your page will break if you don't write tags in lowercase.",
    correctAnswer: "false",
    points: 1,
    order: 5,
  },
  {
    id: "html-q-tf-06",
    type: "true_false",
    text: "The <p> tag is used to write a paragraph of text.",
    correctAnswer: "true",
    points: 1,
    order: 6,
  },
  {
    id: "html-q-tf-07",
    type: "true_false",
    text: "The <ol> tag creates a bulleted list.",
    correctAnswer: "false",
    points: 1,
    order: 7,
  },
  {
    id: "html-q-tf-08",
    type: "true_false",
    text: "The <br> tag adds a line break.",
    correctAnswer: "true",
    points: 1,
    order: 8,
  },
  {
    id: "html-q-tf-09",
    type: "true_false",
    text: "The <title> tag sets the text shown on the browser tab.",
    correctAnswer: "true",
    points: 1,
    order: 9,
  },
  {
    id: "html-q-tf-10",
    type: "true_false",
    text: "A <div> tag has a special meaning that tells the browser what kind of content is inside.",
    correctAnswer: "false",
    points: 1,
    order: 10,
  },

  // ── MCQ (2 marks each × 10 = 20 marks) ──────────────────────────────

  {
    id: "html-q-mcq-01",
    type: "mcq",
    text: "Which tag is the main wrapper for the whole HTML page?",
    options: ["<body>", "<html>", "<head>", "<document>"],
    correctAnswer: "<html>",
    points: 2,
    order: 11,
  },
  {
    id: "html-q-mcq-02",
    type: "mcq",
    text: "Which tag wraps everything that shows up on the screen?",
    options: ["<main>", "<section>", "<body>", "<content>"],
    correctAnswer: "<body>",
    points: 2,
    order: 12,
  },
  {
    id: "html-q-mcq-03",
    type: "mcq",
    text: "Which tag gives you the biggest heading on a page?",
    options: ["<h6>", "<h3>", "<h1>", "<heading>"],
    correctAnswer: "<h1>",
    points: 2,
    order: 13,
  },
  {
    id: "html-q-mcq-04",
    type: "mcq",
    text: "Which tag makes a clickable link to another page?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: "<a>",
    points: 2,
    order: 14,
  },
  {
    id: "html-q-mcq-05",
    type: "mcq",
    text: "Which tag puts an image on a page?",
    options: ["<picture>", "<image>", "<src>", "<img>"],
    correctAnswer: "<img>",
    points: 2,
    order: 15,
  },
  {
    id: "html-q-mcq-06",
    type: "mcq",
    text: "Which tag creates a numbered list?",
    options: ["<ul>", "<li>", "<ol>", "<list>"],
    correctAnswer: "<ol>",
    points: 2,
    order: 16,
  },
  {
    id: "html-q-mcq-07",
    type: "mcq",
    text: "Which tag holds a single item inside a list?",
    options: ["<ul>", "<item>", "<dt>", "<li>"],
    correctAnswer: "<li>",
    points: 2,
    order: 17,
  },
  {
    id: "html-q-mcq-08",
    type: "mcq",
    text: "Which tag is used to hold a group of navigation links?",
    options: ["<menu>", "<links>", "<header>", "<nav>"],
    correctAnswer: "<nav>",
    points: 2,
    order: 18,
  },
  {
    id: "html-q-mcq-09",
    type: "mcq",
    text: "Which tag usually goes at the top of a page and holds the site logo or intro?",
    options: ["<top>", "<banner>", "<head>", "<header>"],
    correctAnswer: "<header>",
    points: 2,
    order: 19,
  },
  {
    id: "html-q-mcq-10",
    type: "mcq",
    text: "Which tag draws a horizontal line across the page?",
    options: ["<br>", "<line>", "<hr>", "<rule>"],
    correctAnswer: "<hr>",
    points: 2,
    order: 20,
  },

  // ── FILL IN THE BLANK (1 mark each × 5 = 5 marks) ───────────────────

  {
    id: "html-q-fill-01",
    type: "fill_blank",
    text: "The tag used to write a paragraph is <___>.",
    correctAnswer: "p",
    points: 1,
    order: 21,
  },
  {
    id: "html-q-fill-02",
    type: "fill_blank",
    text: "To add an image, you use the <___> tag.",
    correctAnswer: "img",
    points: 1,
    order: 22,
  },
  {
    id: "html-q-fill-03",
    type: "fill_blank",
    text: "The <___> tag wraps all the content you can see on the page.",
    correctAnswer: "body",
    points: 1,
    order: 23,
  },
  {
    id: "html-q-fill-04",
    type: "fill_blank",
    text: "Navigation links are usually placed inside a <___> tag.",
    correctAnswer: "nav",
    points: 1,
    order: 24,
  },
  {
    id: "html-q-fill-05",
    type: "fill_blank",
    text: "A bulleted list uses the <___> tag.",
    correctAnswer: "ul",
    points: 1,
    order: 25,
  },

  // ── SHORT ANSWER (mixed marks = 5 marks) ─────────────────────────────

  {
    id: "html-q-sa-01",
    type: "short_answer",
    text: "What does HTML stand for?",
    correctAnswer: "HyperText Markup Language",
    points: 2,
    order: 26,
  },
  {
    id: "html-q-sa-02",
    type: "short_answer",
    text: "What attribute on an <a> tag tells the browser where the link goes?",
    correctAnswer: "href",
    points: 1,
    order: 27,
  },
  {
    id: "html-q-sa-03",
    type: "short_answer",
    text: "What attribute on an <img> tag describes the image for people who can't see it?",
    correctAnswer: "alt",
    points: 2,
    order: 28,
  },
];

export const htmlStructureQuestions: Question[] = rawQuestions.map((q) => ({
  ...q,
  examId: EXAM_ID,
  type: q.type === "fill_blank" ? "short_answer" : q.type,
}));