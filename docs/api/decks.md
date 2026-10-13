## Konfiguracja bazowa
- **Adres serwera:** `http://localhost:3000`
- **CORS:** Włączony dla `http://localhost:5173` (Vite) oraz `http://localhost:8081` (Expo)
- **Format danych:** `application/json`
- **Współdzielone typy:** Paczka `@quiz-app/shared-types`
- **Import**:
```typescript
import {
  CreateDeckPayload,
  DeckDetailsResponse,
  DeckListItemResponse,
  UpdateDeckPayload,
} from '@quiz-app/shared-types';
```
 - **Autoryzacja**: HTTP dla chronionych tras: 
   ```http
  Authorization: Bearer <accessToken>
  ```
| Metoda | Endpoint | Wymaga Auth | Opis | Zwracany status |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/decks` | Nie | Pobiera katalog wszystkich publicznych talii | `200 OK` |
| `GET` | `/decks/my` | **Tak** | Pobiera wyłącznie talie zalogowanego użytkownika | `200 OK` / `401 Unauthorized` |
| `GET` | `/decks/:id` | Nie | Pobiera szczegóły talii wraz ze wszystkimi fiszkami | `200 OK` / `404 Not Found` |
| `POST` | `/decks` | **Tak** | Tworzy nową talię (autor pobierany automatycznie z tokena) | `201 Created` / `400 Bad Request` |
| `PATCH` | `/decks/:id` | **Tak** | Aktualizuje metadane talii | `200 OK` / `403 Forbidden` |
| `DELETE` | `/decks/:id` | **Tak** | Usuwa talię i kaskadowo jej fiszki | `204 No Content` / `403 Forbidden` |
| `POST` | `/decks/:id/flashcards` | **Tak** | Dodaje nową fiszkę do istniejącej talii | `201 Created` / `403 Forbidden` |
| `PATCH` | `/decks/:deckId/flashcards/:cardId` | **Tak** | Edytuje treść pojedynczej fiszki | `200 OK` / `403 Forbidden` |
| `DELETE` | `/decks/:deckId/flashcards/:cardId` | **Tak** | Usuwa pojedynczą fiszkę z talii | `204 No Content` / `403 Forbidden` |


## 1. Katalog talii publicznych – `GET /decks`

```json
[
  {
    "id": "e4b6c318-7b89-498b-967b-1cb81c0cb1f2",
    "title": "Wzorce Projektowe",
    "description": "Zestaw fiszek przygotowujący do egzaminu",
    "isPublic": true,
    "authorId": "a1b2c3d4-0000-0000-0000-1234567890ab",
    "createdAt": "2026-10-13T16:30:00.000Z",
    "updatedAt": "2026-10-13T16:30:00.000Z",
    "author": {
      "id": "a1b2c3d4-0000-0000-0000-1234567890ab",
      "username": "anna_dev"
    },
    "_count": {
      "flashcards": 15
    }
  }
]
```

## 2. Moje talie – `GET /decks/my`

## 3. Szczegóły talii i tryb nauki – `GET /decks/:id`

```json
{
  "id": "e4b6c318-7b89-498b-967b-1cb81c0cb1f2",
  "title": "Wzorce Projektowe",
  "description": "Zestaw fiszek przygotowujący do egzaminu",
  "isPublic": true,
  "authorId": "a1b2c3d4-0000-0000-0000-1234567890ab",
  "createdAt": "2026-10-13T16:30:00.000Z",
  "updatedAt": "2026-10-13T16:30:00.000Z",
  "author": {
    "id": "a1b2c3d4-0000-0000-0000-1234567890ab",
    "username": "anna_dev"
  },
  "flashcards": [
    {
      "id": "76fa93e2-6db2-4d2a-89a3-559db2340b12",
      "frontText": "Czym charakteryzuje się wzorzec Singleton?",
      "backText": "Zapewnia istnienie tylko jednej instancji danej klasy w całym systemie.",
      "hint": "Wzorzec kreacyjny z prywatnym konstruktorem",
      "deckId": "e4b6c318-7b89-498b-967b-1cb81c0cb1f2",
      "createdAt": "2026-10-13T16:32:00.000Z",
      "updatedAt": "2026-10-13T16:32:00.000Z"
    }
  ]
}
```

## 4. Tworzenie nowej talii – `POST /decks`

```json
{
  "title": "Sieci Komputerowe",
  "description": "Protokoły warstwy transportowej",
  "isPublic": false,
  "flashcards": [
    {
      "frontText": "Jaki protokół zapewnia niezawodną transmisję?",
      "backText": "TCP",
      "hint": "Posiada mechanizm ACK"
    }
  ]
}
```

## 5. Modyfikacja i usuwanie talii

### Aktualizacja metadanych: `PATCH /decks/:id`

```json
{
  "title": "Nowy zaktualizowany tytuł",
  "isPublic": true
}
```

### Usunięcie talii: `DELETE /decks/:id`

## 6. Zarządzanie pojedynczymi fiszkami

### Dodanie fiszki: `POST /decks/:id/flashcards`
```json
{
  "frontText": "Co to jest DNS?",
  "backText": "System zamieniający nazwy domenowe na adresy IP",
  "hint": "Domain Name System"
}
```

### Edycja fiszki: `PATCH /decks/:deckId/flashcards/:cardId`
```json
{
  "frontText": "Zaktualizowane pytanie",
  "hint": "Nowa podpowiedź"
}
```

### Usunięcie fiszki: `DELETE /decks/:deckId/flashcards/:cardId`