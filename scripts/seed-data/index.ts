export { buildAdmin } from "./admin";
export {
  EXAM_ID as HTML_EXAM_ID,
  htmlStructureExam,
  htmlStructureQuestions,
} from "./html-structure";
export {
  GRAPHIC_DESIGN_EXAM_ID,
  graphicDesignExam,
  graphicDesignQuestions,
} from "./graphic-design";

import { htmlStructureExam, htmlStructureQuestions } from "./html-structure";
import { graphicDesignExam, graphicDesignQuestions } from "./graphic-design";
import type { Exam, Question } from "../../src/types";

export const seedExams: Exam[] = [htmlStructureExam, graphicDesignExam];
export const seedQuestions: Question[] = [
  ...htmlStructureQuestions,
  ...graphicDesignQuestions,
];
