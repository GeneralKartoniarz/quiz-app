import { useState, useEffect } from "react";
import styles from "./Flashcard.module.css";

export interface FlashcardProps {
  frontText: string;
  backText: string;
  hint?: string | null;
  isFlipped: boolean;
  onFlip: () => void;
}

export const Flashcard = ({
  frontText,
  backText,
  hint,
  isFlipped,
  onFlip,
}: FlashcardProps) => {
  const [showHint, setShowHint] = useState<boolean>(false);

  // Zresetuj widoczność podpowiedzi przy zmianie fiszki
  useEffect(() => {
    setShowHint(false);
  }, [frontText, backText]);

  const handleHintClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHint((prev) => !prev);
  };

  const handleCardClick = () => {
    onFlip();
  };

  return (
    <div
      className={styles.perspectiveContainer}
      onClick={handleCardClick}
      title="Kliknij, aby odwrócić kartę"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ""}`}>
        {/* Przód karty: Pytanie */}
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          <div className={styles.header}>
            <span className={styles.state}>PYTANIE</span>
            <span className={styles.flipBadge}>
              Kliknij, aby sprawdzić odpowiedź 🔄
            </span>
          </div>

          <div className={styles.body}>
            <h1 className={styles.content}>{frontText}</h1>
          </div>

          {hint ? (
            <div
              className={styles.hintContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.hintBtn}
                onClick={handleHintClick}
              >
                {showHint ? "💡 Ukryj podpowiedź" : "💡 Pokaż podpowiedź"}
              </button>
              {showHint && <p className={styles.hintText}>{hint}</p>}
            </div>
          ) : (
            <div className={styles.hintPlaceholder} />
          )}
        </div>

        {/* Tył karty: Odpowiedź */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <div className={styles.header}>
            <span className={`${styles.state} ${styles.stateAnswer}`}>
              ODPOWIEDŹ
            </span>
            <span className={styles.flipBadge}>
              Kliknij, aby wrócić do pytania 🔄
            </span>
          </div>

          <div className={styles.body}>
            <h1 className={styles.content}>{backText}</h1>
          </div>

          {hint ? (
            <div
              className={styles.hintContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={styles.hintBadge}>💡 Podpowiedź: {hint}</span>
            </div>
          ) : (
            <div className={styles.hintPlaceholder} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
