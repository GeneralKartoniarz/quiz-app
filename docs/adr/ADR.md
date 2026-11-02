# Architecture Decision Records (ADR) - Quizinger

## ADR 1: Wybór stosu technologicznego (Node.js, Express, React, PostgreSQL)
- *Status:* Zaakceptowano
- *Kontekst:* Projekt wymagał wyboru sprawdzonego i wydajnego zestawu technologii do stworzenia aplikacji webowej i mobilnej do nauki z fiszkami.
- *Decyzja:* Zastosowano środowisko Node.js z frameworkiem Express.js na backendzie, bibliotekę React w języku TypeScript na frontendzie oraz relacyjną bazę danych PostgreSQL.
- *Konsekwencje:* Spójne środowisko programistyczne (TypeScript) po obu stronach aplikacji, sprawniejszy proces pisania kodu oraz pewność spójności przechowywanych danych.

## ADR 2: Konteneryzacja środowiska (Docker & Docker Compose)
- *Status:* Zaakceptowano
- *Kontekst:* Potrzeba zapewnienia takiego samego środowiska pracy dla każdego w zespole oraz ułatwienie uruchamiania projektu.
- *Decyzja:* Użycie narzędzia Docker Compose do uruchamiania w osobnych kontenerach frontendu, backendu i bazy danych PostgreSQL.
- *Konsekwencje:* Brak problemów z różnicami w konfiguracji komputerów w zespole oraz możliwość uruchomienia całej aplikacji jednym poleceniem.

## ADR 3: Użycie narzędzia ORM (Prisma ORM)
- *Status:* Zaakceptowano
- *Kontekst:* Potrzeba wygodnej i bezpiecznej obsługi bazy danych z poziomu kodu bez konieczności ręcznego pisania zapytań SQL.
- *Decyzja:* Wykorzystanie Prisma ORM jako warstwy łączącej aplikację Express.js z bazą PostgreSQL.
- *Konsekwencje:* Spójne typy danych w całym kodzie, szybkie wprowadzanie zmian w bazie i łatwiejsze pisanie bezbłędnych zapytań.
 