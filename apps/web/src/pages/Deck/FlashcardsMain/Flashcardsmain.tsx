import styles from "./FlashcardsMain.module.css";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { QuizGrid, type QuizItem } from "../../../components/QuizGrid/QuizGrid";
import type { LayoutContextType } from "../../../components/Layout/Layout";
import { getPublicDecks, getMyDecks } from "../../../api/decks";
import { getStoredToken } from "../../../api/auth";
import type { DeckListItemResponse } from "@quiz-app/shared-types";

export const FlashcardsMain = () => {
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
      // Pobieramy publiczne talie
      const publicDecks = await getPublicDecks();

      let allDecks: DeckListItemResponse[] = [...publicDecks];

      // Jeśli użytkownik jest zalogowany, pobieramy również jego prywatne talie
      if (getStoredToken()) {
        try {
          const myDecks = await getMyDecks();
          // Scalamy i usuwamy duplikaty wg ID
          const existingIds = new Set(allDecks.map((d) => d.id));
          for (const myDeck of myDecks) {
            if (!existingIds.has(myDeck.id)) {
              allDecks.push(myDeck);
            }
          }
        } catch {
          // Jeśli pobieranie moich talii się nie powiedzie, kontynuujemy z publicznymi
        }
      }

      // Mapujemy pobrane talie na format QuizItem
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
          : "Nie udało się pobrać fiszek z bazy danych.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // Filtrowanie i sortowanie listy quizów/fiszek w zależności od stanu
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
        return 0; // domyślna kolejność z bazy danych (najnowsze)
      });
  }, [decks, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Wczytywanie fiszek z bazy danych...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <h3 className={styles.errorTitle}>Błąd połączenia</h3>
        <p className={styles.errorMessage}>{error}</p>
        <button
          type="button"
          className={styles.retryBtn}
          onClick={() => fetchDecks()}
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <h2 className={styles.emptyTitle}>Brak zapisanych talii fiszek</h2>
        <p className={styles.emptySubtitle}>
          W bazie danych nie znaleziono jeszcze żadnych talii. Bądź pierwszym i
          stwórz własną!
        </p>
        <Link to="/Deck/Create" className={styles.createBtn}>
          + Stwórz pierwszą talię
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <QuizGrid
        quizList={filteredQuizzes}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </div>
  );
};

export default FlashcardsMain;
