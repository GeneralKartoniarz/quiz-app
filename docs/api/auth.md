## Konfiguracja bazowa
- **Adres serwera:** `http://localhost:3000`
- **Format danych:** `application/json`
- **Współdzielone typy:** Paczka `@quiz-app/shared-types`
- **Format tokena:** JSON Web Token 

- **Importy**:
```typescript
import {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  UserProfile,
} from '@quiz-app/shared-types';
```

## Endpointy

| Metoda | Endpoint | Wymaga Auth | Opis | Status sukcesu |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/auth/register` | Nie | Rejestracja nowego konta | `201 Created` |
| `POST` | `/auth/login` | Nie | Logowanie do konta | `200 OK` |
| `GET` | `/auth/me` | **Tak** | Pobranie profilu zalogowanego użytkownika | `200 OK` |

## 1. POST /auth/register

### RegisterPayload
```json
{
  "email": "kochamJamniki@gmail.com",
  "username": "janek",
  "password": "wchodze123"
}
```

### Walidacja
- `email`: poprawny format adresu poczty elektronicznej
- `username`: ciąg znaków, minimum 3 znaki
- `password`: ciąg znaków, minimum 8 znaków można potem dodać inne wymogi

### `201 Created` – `AuthResponse`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMmUzNGU1Ni03OGFiLTkwY2QtZWZhYi0xMjM0NTY3ODkwYWIiLCJlbWFpbCI6Imphbi5rb3dhbHNraUBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiamFuZWsiLCJpYXQiOjE2NzAwMDAwMDAsImV4cCI6MTY3MDYwNDgwMH0.xyz",
  "user": {
    "id": "12e34e56-78ab-90cd-efab-1234567890ab",
    "email": "kochamJamniki@gmail.com",
    "username": "janek"
  }
}
```

## 2. Logowanie – `POST /auth/login`

### LoginPayload
```json
{
  "email": "kochamJamniki@gmail.com",
  "password": "wchodze123"
}
```

## 3. Weryfikacja sesji – `GET /auth/me`

### Wymagany nagłówek
```http
Authorization: Bearer <accessToken>
```

```json
{
  "id": "12e34e56-78ab-90cd-efab-1234567890ab",
  "email": "kochamJamniki@gmail.com",
  "username": "janek",
  "role": "USER",
  "createdAt": "2026-10-13T18:00:00.000Z"
}
```

## Przykładowy react

```typescript
import type { AuthResponse, LoginPayload } from '@quiz-app/shared-types';

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Blad logowania');
  }

  const data: AuthResponse = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data;
}

export async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`http://localhost:3000${endpoint}`, {
    ...options,
    headers,
  });
}
```