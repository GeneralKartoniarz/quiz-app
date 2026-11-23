import type {
  CreateDeckPayload,
  DeckDetailsResponse,
  DeckListItemResponse,
} from "@quiz-app/shared-types";
import { getStoredToken } from "./auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function createDeck(
  payload: CreateDeckPayload,
): Promise<DeckDetailsResponse> {
  const token = getStoredToken();
  if (!token) {
    throw new Error("Musisz być zalogowany, aby zapisać talię fiszek.");
  }

  const response = await fetch(`${API_BASE_URL}/decks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message || "Błąd podczas zapisywania talii.";
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getMyDecks(): Promise<DeckListItemResponse[]> {
  const token = getStoredToken();
  if (!token) {
    throw new Error("Musisz być zalogowany, aby pobrać swoje talie.");
  }

  const response = await fetch(`${API_BASE_URL}/decks/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message || "Błąd podczas pobierania talii.";
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getPublicDecks(): Promise<DeckListItemResponse[]> {
  const response = await fetch(`${API_BASE_URL}/decks`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message || "Błąd podczas pobierania publicznych talii.";
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getDeckById(id: string): Promise<DeckDetailsResponse> {
  const token = getStoredToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/decks/${id}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message || "Błąd podczas pobierania talii.";
    throw new Error(errorMessage);
  }

  return response.json();
}
