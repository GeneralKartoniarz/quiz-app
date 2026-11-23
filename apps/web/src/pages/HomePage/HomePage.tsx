import { useState, useMemo, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Hero } from "../../components/Hero/Hero";
import { QuizGrid, type QuizItem } from "../../components/QuizGrid/QuizGrid";
import { GameModes } from "../../components/GameModes/GameModes";
import type { LayoutContextType } from "../../components/Layout/Layout";
import { getPublicDecks, getMyDecks } from "../../api/decks";
import { getStoredToken } from "../../api/auth";
import type { DeckListItemResponse } from "@quiz-app/shared-types";

export const HomePage = () => {
  const layoutContext = useOutletContext<LayoutContextType | undefined>();
  const [localSearchQuery] = useState("");
  const searchQuery = layoutContext?.searchQuery ?? localSearchQuery;
  const [sortBy, setSortBy] = useState("popular"); // 'popular' | 'title' | 'questions'

  const [decks, setDecks] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDecks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Pobieramy publiczne zestawy fiszek z bazy danych
      const publicDecks = await getPublicDecks();
      let allDecks: DeckListItemResponse[] = [...publicDecks];

      // Jeśli użytkownik jest zalogowany, pobieramy także jego prywatne zestawy
      if (getStoredToken()) {
        try {
          const myDecks = await getMyDecks();
          const existingIds = new Set(allDecks.map((d) => d.id));
          for (const myDeck of myDecks) {
            if (!existingIds.has(myDeck.id)) {
              allDecks.push(myDeck);
            }
          }
        } catch {
          // Kontynuuj z zestawami publicznymi
        }
      }

      // Mapowanie danych z bazy na format kafelka QuizItem
      const mappedQuizzes: QuizItem[] = allDecks.map((deck) => {
        const parsedTags = deck.description
          ? deck.description
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];

        return {
          id: deck.id,
          title: deck.title,
          questionsCount: deck._count?.flashcards ?? 0,
          tags: parsedTags.length > 0 ? parsedTags : ["Fiszki"],
          author: deck.author?.username ?? "Użytkownik",
        };
      });

      setDecks(mappedQuizzes);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się pobrać zestawów fiszek z bazy danych.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // Filtrowanie i sortowanie listy fiszek z bazy danych
  const filteredQuizzes = useMemo(() => {
    return decks
      .filter((quiz) => {
        const query = searchQuery.toLowerCase();
        return (
          quiz.title.toLowerCase().includes(query) ||
          quiz.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          quiz.author.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "questions") return b.questionsCount - a.questionsCount;
        return String(a.id).localeCompare(String(b.id)); // Domyślnie wg id / popularności
      });
  }, [decks, searchQuery, sortBy]);

  const handleJoinArena = (pin: string) => {
    if (pin.length < 6) {
      alert("Wprowadź pełny 6-cyfrowy kod PIN!");
      return;
    }
    alert(`Dołączanie do areny z kodem: ${pin}`);
  };

  return (
    <>
      <Hero onJoinArena={handleJoinArena} />
      <GameModes />
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem",
            color: "var(--color-text-muted)",
          }}
        >
          <p>Wczytywanie zestawów fiszek z bazy danych...</p>
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem",
            color: "var(--color-text-muted)",
          }}
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={fetchDecks}
            style={{
              marginTop: "0.75rem",
              padding: "0.5rem 1.25rem",
              background: "var(--color-primary)",
              color: "var(--color-primary-contrast)",
              border: "none",
              borderRadius: "4px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Spróbuj ponownie
          </button>
        </div>
      ) : (
        <QuizGrid
          quizList={filteredQuizzes}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      )}
    </>
  );
};

export default HomePage;
