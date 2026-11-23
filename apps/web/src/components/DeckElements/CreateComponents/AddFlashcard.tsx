import styles from "./AddFlashcard.module.css";
import { useState, type ChangeEvent } from "react";

export interface FlashcardData {
  id: string | number;
  frontText: string;
  backText: string;
  hint?: string;
}

export interface AddFlashcardProps {
  id: number;
  flashcard?: FlashcardData;
  onChange?: (field: "frontText" | "backText" | "hint", value: string) => void;
  onDelete: () => void;
}

export const AddFlashcard = ({
  id,
  flashcard,
  onChange,
  onDelete,
}: AddFlashcardProps) => {
  const [showHint, setShowHint] = useState<boolean>(Boolean(flashcard?.hint));

  const handleHintChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowHint(checked);
    if (!checked) {
      onChange?.("hint", "");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h3>Fiszka {id}</h3>
      <div className={styles.inputsWrapper}>
        <div className={styles.box}>
          <p>Pytanie</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Wpisz treść pytania"
            value={flashcard?.frontText ?? ""}
            onChange={(e) => onChange?.("frontText", e.target.value)}
          />
        </div>
        <div className={styles.box}>
          <p>Odpowiedź</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Wpisz odpowiedź"
            value={flashcard?.backText ?? ""}
            onChange={(e) => onChange?.("backText", e.target.value)}
          />
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.hintBox}>
          <p>
            Podpowiedź{" "}
            <input
              type="checkbox"
              className={styles.hint}
              checked={showHint}
              onChange={handleHintChange}
            />
          </p>
          {showHint && (
            <input
              type="text"
              className={styles.input}
              placeholder="Wpisz podpowiedź"
              value={flashcard?.hint ?? ""}
              onChange={(e) => onChange?.("hint", e.target.value)}
            />
          )}
        </div>
        <button type="button" className={styles.submitBtn} onClick={onDelete}>
          X Usuń fiszkę
        </button>
      </div>
    </div>
  );
};

export default AddFlashcard;
