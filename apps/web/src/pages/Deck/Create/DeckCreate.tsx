import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./DeckCreate.module.css";
import { SetTittle } from "../../../components/DeckElements/CreateComponents/SetTittle";
import {
  AddFlashcard,
  type FlashcardData,
} from "../../../components/DeckElements/CreateComponents/AddFlashcard";
import { createDeck } from "../../../api/decks";
import { getStoredToken } from "../../../api/auth";

export const DeckCreate = () => {
  const navigate = useNavigate();

  // Stan ustawień talii
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Stan fiszek
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([
    { id: 1, frontText: "", backText: "", hint: "" },
  ]);

  // Stan komunikacji z API
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddFlashcard = () => {
    const newCard: FlashcardData = {
      id: Date.now(),
      frontText: "",
      backText: "",
      hint: "",
    };
    setFlashcards((prev) => [...prev, newCard]);
  };

  const handleRemoveFlashcard = (id: string | number) => {
    if (flashcards.length <= 1) {
      setFlashcards([{ id: Date.now(), frontText: "", backText: "", hint: "" }]);
      return;
    }
    setFlashcards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleFlashcardChange = (
    id: string | number,
    field: "frontText" | "backText" | "hint",
    value: string,
  ) => {
    setFlashcards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, [field]: value } : card)),
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    // 1. Sprawdzenie uwierzytelnienia użytkownika
    const token = getStoredToken();
    if (!token) {
      setError(
        "Musisz być zalogowany, aby móc zapisać talię fiszek w bazie danych.",
      );
      return;
    }

    // 2. Walidacja tytułu talii
    if (!title.trim()) {
      setError("Podaj tytuł talii przed zapisaniem.");
      return;
    }

    // 3. Walidacja fiszek
    const validCards = flashcards.filter(
      (f) => f.frontText.trim() && f.backText.trim(),
    );

    if (validCards.length === 0) {
      setError("Dodaj co najmniej jedną fiszkę z uzupełnionym pytaniem i odpowiedzią.");
      return;
    }

    // Sprawdzenie, czy użytkownik nie zostawił częściowo wypełnionej fiszki
    const hasIncompleteCard = flashcards.some(
      (f) =>
        (f.frontText.trim() && !f.backText.trim()) ||
        (!f.frontText.trim() && f.backText.trim()),
    );

    if (hasIncompleteCard) {
      setError(
        "Upewnij się, że każda rozpoczęta fiszka ma uzupełnione zarówno pytanie, jak i odpowiedź.",
      );
      return;
    }

    setLoading(true);

    try {
      const createdDeck = await createDeck({
        title: title.trim(),
        description: tags.length > 0 ? tags.join(", ") : undefined,
        isPublic: isPublic,
        flashcards: validCards.map((c) => ({
          frontText: c.frontText.trim(),
          backText: c.backText.trim(),
          hint: c.hint?.trim() || undefined,
        })),
      });

      setSuccess(
        `Talia "${createdDeck.title}" z ${validCards.length} fiszkami została pomyślnie zapisana w bazie danych!`,
      );

      // Po krótkiej chwili przekieruj na stronę główną lub do profilu
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Wystąpił nieoczekiwany błąd podczas zapisywania talii.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h1>Stwórz swoją talię fiszek</h1>

      {error && (
        <div className={styles.alertError}>
          <span>{error}</span>
          {!getStoredToken() && (
            <Link to="/profile">Zaloguj się tutaj →</Link>
          )}
        </div>
      )}

      {success && <div className={styles.alertSuccess}>{success}</div>}

      <SetTittle
        questionsCount={flashcards.length}
        title={title}
        tags={tags}
        isPublic={isPublic}
        thumbnailUrl={thumbnailUrl}
        onTitleChange={setTitle}
        onTagsChange={setTags}
        onVisibilityChange={setIsPublic}
        onThumbnailChange={setThumbnailUrl}
      />

      {flashcards.map((card, index) => (
        <AddFlashcard
          key={card.id}
          id={index + 1}
          flashcard={card}
          onChange={(field, value) =>
            handleFlashcardChange(card.id, field, value)
          }
          onDelete={() => handleRemoveFlashcard(card.id)}
        />
      ))}

      <div className={styles.buttonRow}>
        <button
          type="button"
          className={styles.addFlashcard}
          onClick={handleAddFlashcard}
          disabled={loading}
        >
          + Dodaj fiszkę
        </button>

        <button
          type="button"
          className={styles.createDeck}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "⏳ Zapisywanie w bazie danych..." : "✔ Zatwierdź talię fiszek"}
        </button>
      </div>
    </div>
  );
};

export default DeckCreate;
