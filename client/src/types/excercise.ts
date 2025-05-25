export interface Answer {
  text: string;
  correct: boolean;
}

export interface Exercise {
  _id?: string;
  exerciseCode: string;
  grade: number;
  subject: string;
  difficulty: "Dễ" | "Bình thường" | "Khó";
  question: string;
  tags: string[];
  isMultipleChoice: boolean;
  answers?: Answer[];
  createdAt?: string;
  updatedAt?: string;
}
