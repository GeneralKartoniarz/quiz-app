import type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  UserProfile,
} from "@quiz-app/shared-types";

export interface ExtendedUserProfile extends UserProfile {
  role?: string;
  createdAt?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const TOKEN_KEY = "accessToken";

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message || "Błąd podczas rejestracji";
    throw new Error(errorMessage);
  }

  const data: AuthResponse = await response.json();
  if (data.accessToken) {
    setStoredToken(data.accessToken);
  }
  return data;
}

export async function loginUser(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message || "Błąd podczas logowania";
    throw new Error(errorMessage);
  }

  const data: AuthResponse = await response.json();
  if (data.accessToken) {
    setStoredToken(data.accessToken);
  }
  return data;
}

export async function getProfile(): Promise<ExtendedUserProfile> {
  const token = getStoredToken();
  if (!token) {
    throw new Error("Brak zapisanego tokena sesji");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken();
    }
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(", ")
      : errorData.message || "Błąd podczas pobierania profilu";
    throw new Error(errorMessage);
  }

  return response.json();
}

