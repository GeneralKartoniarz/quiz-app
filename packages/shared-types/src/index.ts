export interface UserProfile {
  id: string;
  username: string;
  email: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  timeLimitSeconds: number;
}