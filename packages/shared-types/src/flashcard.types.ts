export interface FlashcardResponse {
  id: string;
  frontText: string;
  backText: string;
  hint: string | null;
  deckId: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreateFlashcardPayload {
  frontText: string;
  backText: string;
  hint?: string;
}

export interface UpdateFlashcardPayload {
  frontText?: string;
  backText?: string;
  hint?: string;
}