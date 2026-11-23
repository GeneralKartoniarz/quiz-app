import type { MouseEvent } from "react";
import styles from "./QuizCard.module.css";
import { Link } from "react-router-dom";

export interface QuizCardProps {
  id?: string | number;
  title: string;
  questionsCount: number;
  tags: string[];
  author: string;
  thumbnailUrl?: string;
  onClickThumbnail?: () => void;
  onClick?: () => void;
  isEditable?: boolean;
  linkTo?: string;
}

export const QuizCard = ({
  id,
  title,
  questionsCount,
  tags,
  author,
  thumbnailUrl,
  onClickThumbnail,
  onClick,
  isEditable,
  linkTo,
}: QuizCardProps) => {
  const showOverlay = Boolean(isEditable || onClickThumbnail);

  const handleThumbnailClick = (e: MouseEvent<HTMLDivElement>) => {
    if (onClickThumbnail) {
      e.stopPropagation();
      onClickThumbnail();
    }
  };

  const cardElement = (
    <div className={styles.card} onClick={onClick}>
      <div
        className={`${styles.thumbnail} ${showOverlay ? styles.thumbnailClickable : ""}`}
        onClick={handleThumbnailClick}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title || "Miniatura talii"}
            className={styles.thumbnailImage}
          />
        ) : (
          <span>Miniatura 16:9</span>
        )}

        {showOverlay && (
          <div className={styles.thumbnailOverlay}>
            <span className={styles.overlayIcon}>📷</span>
            <span>
              {thumbnailUrl ? "Zmień zdjęcie" : "Wgraj własne zdjęcie"}
            </span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.meta}>{questionsCount} pytań/fiszek</p>
        <p className={styles.tags}>{tags.join(", ")}</p>
        <p className={styles.author}>{author}</p>
      </div>
    </div>
  );

  // Jeśli karta jest w trybie edycji (np. w formularzu tworzenia), nie używamy Linka
  if (isEditable) {
    return cardElement;
  }

  // Cel nawigacji: konkretna talia po jej unikalnym ID
  const destination =
    linkTo ?? (id ? `/Deck/FlashcardsLearn/${id}` : "/Deck/FlashcardsLearn");

  return (
    <Link to={destination} className={styles.Link}>
      {cardElement}
    </Link>
  );
};

export default QuizCard;
