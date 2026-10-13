## Konfiguracja bazowa
### Adres serwera: http://localhost:3000
### CORS: Włączony dla http://localhost:5173 lub http://localhost:8081 dla Expo (mobilka)
### Format danych: application/json
### Współdzielone typy: Paczka @quiz-app/shared-types
### Import:

```typescript
import {
  CreateDeckPayload,
  DeckDetailsResponse,
  DeckListItemResponse,
  UpdateDeckPayload,
} from '@quiz-app/shared-types';
```

| Metoda | Endpoint | Opis | Zwracany status |
| :--- | :--- | :--- | :--- |
| `GET` | `/decks` | Pobiera listę wszystkich talii | `200 OK` |
| `GET` | `/decks/:id` | Pobiera pełne szczegóły talii wraz z wszystkimi fiszkami | `200 OK` / `404 Not Found` |
| `POST` | `/decks` | Tworzy nową talię (opcjonalnie od razu z fiszkami) | `201 Created` / `400 Bad Request` |
| `PATCH` | `/decks/:id` | Aktualizuje metadane talii (`title`, `description`, `isPublic`) | `200 OK` / `404 Not Found` |
| `DELETE` | `/decks/:id` | Usuwa talię oraz wszystkie fiszki | `204 No Content` / `404 Not Found` |

### 1. Pobranie listy talii – `GET /decks` DO EKRANU GŁÓWNEGO
Zamiast pobierać całą treść fiszek, zwraca pole `_count.flashcards` oraz podstawowe dane autora.

```json
[
  {
    "id": "e4b6c318-7b89-498b-967b-1cb81c0cb1f2",
    "title": "Inżynieria Oprogramowania",
    "description": "Fiszki do kolokwium z wzorców projektowych",
    "isPublic": true,
    "authorId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2026-10-13T16:30:00.000Z",
    "updatedAt": "2026-10-13T16:30:00.000Z",
    "author": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "username": "jan_kowalski"
    },
    "_count": {
      "flashcards": 12
    }
  }
]
```

---

### 2. Pobranie szczegółów talii – `GET /decks/:id`
Wykorzystywany w widoku nauki lub pełnego podglądu talii. Zwraca wszystkie fiszki przypisane do talii.

```json
{
  "id": "e4b6c318-7b89-498b-967b-1cb81c0cb1f2",
  "title": "Inżynieria Oprogramowania",
  "description": "Fiszki do kolokwium z wzorców projektowych",
  "isPublic": true,
  "authorId": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2026-10-13T16:30:00.000Z",
  "updatedAt": "2026-10-13T16:30:00.000Z",
  "author": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "jan_kowalski"
  },
  "flashcards": [
    {
      "id": "76fa93e2-6db2-4d2a-89a3-559db2340b12",
      "frontText": "Co to jest Wzorzec Fabryki Abstrakcyjnej?",
      "backText": "Wzorzec kreacyjny pozwalający tworzyć rodziny powiązanych obiektów bez wnikania w ich konkretne klasy.",
      "hint": "Kreacyjne wzorce GoF",
      "deckId": "e4b6c318-7b89-498b-967b-1cb81c0cb1f2",
      "createdAt": "2026-10-13T16:32:00.000Z",
      "updatedAt": "2026-10-13T16:32:00.000Z"
    }
  ]
}
```

---

### 3. Tworzenie nowej talii – `POST /decks`
Pozwala utworzyć talię oraz od razu dodać do niej listę fiszek w jednej transakcji bazodanowej.

```json
{
  "title": "Sieci Komputerowe",
  "description": "Model ISO/OSI oraz protokoły TCP/UDP",
  "isPublic": true,
  "authorId": "TUTAJ_ID_ISTNIEJACEGO_USERA",
  "flashcards": [
    {
      "frontText": "Na której warstwie modelu OSI działa protokół IP?",
      "backText": "Na warstwie sieciowej (warstwa 3).",
      "hint": "Warstwa odpowiedzialna za routing"
    },
    {
      "frontText": "Jaki protokół zapewnia niezawodną transmisję strumieniową?",
      "backText": "TCP (Transmission Control Protocol).",
      "hint": "Protokół połączeniowy z potwierdzeniami ACK"
    }
  ]
}
```

**Odpowiedź (`201 Created`):** Zwraca utworzoną talię wraz z wygenerowanymi identyfikatorami fiszek.

---

### 4. Aktualizacja talii – `PATCH /decks/:id`
Modyfikuje metadane talii. Wszystkie pola są opcjonalne.

```json
{
  "title": "Nowy zaktualizowany tytuł",
  "isPublic": false
}
```

**Odpowiedź (`200 OK`):** Zwraca zaktualizowany obiekt talii.

### 5. Usunięcie talii – `DELETE /decks/:id`
Usuwa wskazaną talię oraz powiązane z nią fiszki (kaskadowo).

**Odpowiedź (`204 No Content`):** Pusta odpowiedź potwierdzająca usunięcie.

### Przykład
```typescript
import { useQuery } from '@tanstack/react-query';
import type { DeckListItemResponse } from '@quiz-app/shared-types';

async function fetchDecks(): Promise<DeckListItemResponse[]> {
  const response = await fetch('http://localhost:3000/decks');
  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy talii');
  }
  return response.json();
}

export function DeckList() {
  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: fetchDecks,
  });

  if (isLoading) return <div>Wczytywanie talii...</div>;
  if (error) return <div>Błąd: {(error as Error).message}</div>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {decks?.map((deck) => (
        <article key={deck.id} className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold">{deck.title}</h2>
          <p className="text-gray-600">{deck.description}</p>
          <div className="mt-3 flex justify-between text-sm">
            <span>Autor: {deck.author.username}</span>
            <span>Fiszki: {deck._count.flashcards}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
```