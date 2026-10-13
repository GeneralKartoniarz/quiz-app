export type ArenaState = 'LOBBY' | 'IN_PROGRESS' | 'FINISHED';

export interface ArenaSessionResponse {
  id: string;
  pinCode: string;
  status: ArenaState;
  hostId: string;
  deckId: string;
  createdAt: string;
}

export interface ArenaLeaderboardEntry {
  nickname: string;
  score: number;
  userId?: string | null;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  timeLimitSeconds: number;
}