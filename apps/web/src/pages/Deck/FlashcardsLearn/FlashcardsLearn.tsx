import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams, Link, useLocation } from "react-router-dom";
import styles from "./FlashcardsLearn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { Flashcard } from "../../../components/DeckElements/Learn/Flashcard";
import { getDeckById, getPublicDecks, getMyDecks } from "../../../api/decks";
import { getStoredToken } from "../../../api/auth";
import type {
  DeckDetailsResponse,
  FlashcardResponse,
} from "@quiz-app/shared-types";

export const FlashcardsLearn = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const deckIdFromQuery = searchParams.get("id");
  const targetDeckId = paramId || deckIdFromQuery;

  const [deck, setDeck] = useState<DeckDetailsResponse | null>(null);
  const [allCards, setAllCards] = useState<FlashcardResponse[]>([]);
  const [queue, setQueue] = useState<FlashcardResponse[]>([]);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Załaduj talię fiszek przy zmianie targetDeckId lub trasy
  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      setDeck(null);
      setAllCards([]);
      setQueue([]);
      setIsFlipped(false);
      setIsCompleted(false);

      try {
        let activeId = targetDeckId;

        // Jeśli ID talii nie zostało podane w URL, pobieramy pierwszą dostępną talię
        if (!activeId) {
          let availableDecks = await getPublicDecks();
          if (availableDecks.length === 0 && getStoredToken()) {
            availableDecks = await getMyDecks();
          }

          if (availableDecks.length === 0) {
            if (!isCancelled) {
              setError(
                "W bazie danych nie znaleziono żadnych talii fiszek do nauki.",
              );
              setLoading(false);
            }
            return;
          }

          activeId = availableDecks[0].id;
        }

        const fetchedDeck = await getDeckById(activeId);
        if (isCancelled) return;

        setDeck(fetchedDeck);
        const cards = fetchedDeck.flashcards ?? [];
        setAllCards(cards);
        setQueue(cards);
        setIsFlipped(false);
        setIsCompleted(cards.length === 0);
      } catch (err: unknown) {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Nie udało się pobrać talii fiszek z bazy danych.",
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [targetDeckId, location.pathname]);

  // Odwrócenie aktualnej karty
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // "Powtórz" – karta pozostaje w obiegu do dalszej nauki (przesunięcie na koniec kolejki)
  const handleRepeat = useCallback(() => {
    if (queue.length === 0) return;

    if (queue.length > 1) {
      const current = queue[0];
      setQueue((prevQueue) => [...prevQueue.slice(1), current]);
    }
    // Zresetuj stronę na pytanie dla nowej/następnej karty
    setIsFlipped(false);
  }, [queue]);

  // "Pamiętam" – karta zostaje wyrzucona z obiegu
  const handleGood = useCallback(() => {
    if (queue.length === 0) return;

    const remainingQueue = queue.slice(1);
    setQueue(remainingQueue);
    setIsFlipped(false);

    if (remainingQueue.length === 0) {
      setIsCompleted(true);
    }
  }, [queue]);

  // Ponowna nauka tej samej talii
  const handleRestart = () => {
    setQueue([...allCards]);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  // Obsługa skrótów klawiszowych: Spacja (odwróć), Strzałka w lewo (powtórz), Strzałka w prawo (pamiętam)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorujemy skróty jeśli użytkownik pisze w polach formularza
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea") return;

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowLeft" || e.key === "1") {
        e.preventDefault();
        handleRepeat();
      } else if (e.code === "ArrowRight" || e.key === "2") {
        e.preventDefault();
        handleGood();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleRepeat, handleGood]);

  const totalCount = allCards.length;
  const masteredCount = totalCount - queue.length;
  const currentCard = queue[0];

  const tags = useMemo(() => {
    if (!deck?.description) return [];
    return deck.description
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [deck?.description]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Wczytywanie fiszek z bazy danych...</p>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className={styles.errorWrapper}>
        <h3>Błąd wczytywania talii</h3>
        <p>{error ?? "Nie znaleziono żądanej talii."}</p>
        <div className={styles.completedActions}>
          <button
            type="button"
            className={styles.restartBtn}
            onClick={() => {
              setLoading(true);
              setError(null);
              // Trigger reload
              const activeId = targetDeckId;
              if (activeId) {
                getDeckById(activeId)
                  .then((d) => {
                    setDeck(d);
                    const cards = d.flashcards ?? [];
                    setAllCards(cards);
                    setQueue(cards);
                    setIsFlipped(false);
                    setIsCompleted(cards.length === 0);
                  })
                  .catch((e) => setError(e?.message ?? "Błąd wczytywania."))
                  .finally(() => setLoading(false));
              }
            }}
          >
            Spróbuj ponownie
          </button>
          <Link to="/fiszki" className={styles.backBtn}>
            Wróć do listy fiszek
          </Link>
        </div>
      </div>
    );
  }

  if (allCards.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <h2>Talia "{deck.title}" jest pusta</h2>
        <p>Ta talia nie zawiera jeszcze żadnych fiszek do nauki.</p>
        <Link to="/fiszki" className={styles.backBtn}>
          Wróć do listy fiszek
        </Link>
      </div>
    );
  }

  // Widok po opanowaniu wszystkich fiszek
  if (isCompleted || queue.length === 0) {
    return (
      <div className={styles.completedWrapper}>
        <div className={styles.completedIcon}>🎉</div>
        <h2 className={styles.completedTitle}>Gratulacje!</h2>
        <p className={styles.completedDesc}>
          Opanowałeś wszystkie <strong>{totalCount}</strong> fiszki z talii{" "}
          <strong>"{deck.title}"</strong>! Każda karta została oznaczona jako
          zapamiętana.
        </p>
        <div className={styles.completedActions}>
          <button
            type="button"
            className={styles.restartBtn}
            onClick={handleRestart}
          >
            Ucz się ponownie
          </button>
          <Link to="/fiszki" className={styles.backBtn}>
            Wróć do listy fiszek
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent =
    totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        {/* Tytuł fiszki */}
        <div className={styles.title}>
          <h3>{deck.title}</h3>
        </div>
        {/* Liczba pytań i postęp */}
        <div className={styles.questionsCount}>
          <p>
            Opanowano: <strong>{masteredCount}</strong> / {totalCount} (Do
            powtórzenia: <strong>{queue.length}</strong>)
          </p>
        </div>

        {/* Pasek postępu */}
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {tags.length > 0 && (
          <div className={styles.tags}>
            <p>Tagi: {tags.join(", ")}</p>
          </div>
        )}
      </div>

      <div className={styles.FlashcardBody}>
        {/* Klucz unikalny dla danej karty (currentCard.id) gwarantuje świeży montaż bez wstecznego obracania */}
        <Flashcard
          key={currentCard.id}
          frontText={currentCard.frontText}
          backText={currentCard.backText}
          hint={currentCard.hint}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      <div className={styles.bottom}>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.flip}
            onClick={handleFlip}
          >
            <FontAwesomeIcon
              icon={faArrowRotateLeft}
              className={styles.flipIcon}
            />
            {isFlipped ? "Pokaż pytanie" : "Odwróć kartę"}
          </button>
          <hr />
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.repeat}
              onClick={handleRepeat}
              title="Karta zostanie na końcu kolejki do ponownego powtórzenia"
            >
              Powtórz (←)
            </button>
            <button
              type="button"
              className={styles.good}
              onClick={handleGood}
              title="Karta zostanie trwale usunięta z obiegu w tej sesji"
            >
              Pamiętam (→)
            </button>
          </div>
        </div>
        <p className={styles.keyboardHints}>
          💡 Skróty klawiszowe: <strong>Spacja</strong> (odwróć),{" "}
          <strong>←</strong> (powtórz), <strong>→</strong> (pamiętam)
        </p>
      </div>
    </div>
  );
};

export default FlashcardsLearn;
