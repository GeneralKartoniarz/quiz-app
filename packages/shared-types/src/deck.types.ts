import { CreateFlashcardPayload, FlashcardResponse } from './flashcard.types';

export interface DeckDetailsResponse {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  flashcards: FlashcardResponse[];
}

export interface DeckListItemResponse {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    flashcards: number;
  };
}

export interface CreateDeckPayload {
  title: string;
  description?: string;
  isPublic?: boolean;
  authorId: string;
  flashcards?: CreateFlashcardPayload[];
}

export interface UpdateDeckPayload {
  title?: string;
  description?: string;
  isPublic?: boolean;
}