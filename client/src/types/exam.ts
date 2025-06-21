import { Exercise } from "./excercise";

export interface ExamExercise {
  exerciseId: string | Exercise;
  order: number;
  points: number;
}

export interface Exam {
  _id?: string;
  examCode: string;
  title: string;
  grade: number;
  subject: string;
  duration: number;
  totalPoints: number;
  exercises: ExamExercise[];
  instructions: string;
  createdAt?: string;
  updatedAt?: string;
} 