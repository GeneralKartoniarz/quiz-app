import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import styles from "./SetTittle.module.css";
import { QuizCard } from "../../QuizCard/QuizCard";
import { getStoredToken, getProfile } from "../../../api/auth";

export interface SetTittleProps {
  questionsCount?: number;
  title?: string;
  tags?: string[];
  isPublic?: boolean;
  thumbnailUrl?: string | null;
  initialTitle?: string;
  initialTags?: string[];
  initialThumbnail?: string;
  onTitleChange?: (title: string) => void;
  onTagsChange?: (tags: string[]) => void;
  onVisibilityChange?: (isPublic: boolean) => void;
  onThumbnailChange?: (thumbnailUrl: string | null) => void;
}

export const SetTittle = ({
  questionsCount = 1,
  title: propTitle,
  tags: propTags,
  isPublic: propIsPublic,
  thumbnailUrl: propThumbnailUrl,
  initialTitle = "",
  initialTags = [],
  initialThumbnail,
  onTitleChange,
  onTagsChange,
  onVisibilityChange,
  onThumbnailChange,
}: SetTittleProps) => {
  const [internalTitle, setInternalTitle] = useState<string>(initialTitle);
  const [internalTags, setInternalTags] = useState<string[]>(initialTags);
  const [internalIsPublic, setInternalIsPublic] = useState<boolean>(true);
  const [internalThumbnailUrl, setInternalThumbnailUrl] = useState<string | null>(
    initialThumbnail ?? null,
  );
  const [tagInput, setTagInput] = useState<string>("");
  const [author, setAuthor] = useState<string>("Ty");

  const title = propTitle !== undefined ? propTitle : internalTitle;
  const tags = propTags !== undefined ? propTags : internalTags;
  const isPublic = propIsPublic !== undefined ? propIsPublic : internalIsPublic;
  const thumbnailUrl =
    propThumbnailUrl !== undefined ? propThumbnailUrl : internalThumbnailUrl;

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (getStoredToken()) {
      getProfile()
        .then((profile) => {
          if (profile?.username) {
            setAuthor(profile.username);
          }
        })
        .catch(() => {
          // Pozostaw domyślnego autora "Ty"
        });
    }
  }, []);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalTitle(val);
    onTitleChange?.(val);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const updated = [...tags, trimmed];
      setInternalTags(updated);
      onTagsChange?.(updated);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = tags.filter((t) => t !== tagToRemove);
    setInternalTags(updated);
    onTagsChange?.(updated);
  };

  const handleVisibilityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const isPub = e.target.value === "public";
    setInternalIsPublic(isPub);
    onVisibilityChange?.(isPub);
  };

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setInternalThumbnailUrl(result);
      onThumbnailChange?.(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setInternalThumbnailUrl(null);
    onThumbnailChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Podczas wpisywania tagu podgląd wyświetla dodane tagi oraz aktualnie wpisywany tag
  const currentTag = tagInput.trim();
  const previewTagsList =
    currentTag && !tags.includes(currentTag) ? [...tags, currentTag] : tags;
  const displayTags =
    previewTagsList.length > 0 ? previewTagsList : ["Brak tagów"];
  const displayTitle = title.trim() || "Tytuł talii";

  return (
    <div className={styles.wrapper}>
      <div className={styles.formSection}>
        <h3>Wprowadź nazwę talii:</h3>
        <input
          type="text"
          className={styles.input}
          placeholder="Tytuł"
          value={title}
          onChange={handleTitleChange}
        />

        <h3>Dodaj tagi</h3>
        <div className={styles.tagRow}>
          <input
            type="text"
            className={`${styles.input} ${styles.tagInput}`}
            placeholder="Wpisz tag i naciśnij Enter lub Dodaj"
            value={tagInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTagInput(e.target.value)
            }
            onKeyDown={handleTagKeyDown}
          />
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleAddTag}
          >
            Dodaj
          </button>
        </div>

        {tags.length > 0 && (
          <div className={styles.tagsContainer}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tagPill}>
                #{tag}
                <button
                  type="button"
                  className={styles.tagRemoveBtn}
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Usuń tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className={styles.bottom}>
          <h3>Ustawienia prywatności</h3>
          <select
            name="Widoczność"
            id=""
            className={styles.select}
            value={isPublic ? "public" : "private"}
            onChange={handleVisibilityChange}
          >
            <option value="public">Publiczne</option>
            <option value="private">Prywatne</option>
          </select>
        </div>
      </div>

      <div className={styles.previewSection}>
        <div className={styles.previewHeaderRow}>
          <h3 className={styles.previewHeading}>Podgląd miniatury</h3>
          {thumbnailUrl && (
            <button
              type="button"
              className={styles.removeThumbnailBtn}
              onClick={handleRemoveThumbnail}
              title="Usuń wybrane zdjęcie"
            >
              Usuń zdjęcie
            </button>
          )}
        </div>

        {/* Niewidoczne pole wyboru pliku aktywowane kliknięciem w podgląd miniatury */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        <div className={styles.previewCardWrapper}>
          <QuizCard
            title={displayTitle}
            questionsCount={questionsCount}
            tags={displayTags}
            author={author}
            thumbnailUrl={thumbnailUrl ?? undefined}
            onClickThumbnail={handleThumbnailClick}
            onClick={handleThumbnailClick}
            isEditable
          />
        </div>
        <p className={styles.previewHint}>
          💡 Kliknij w podgląd lub miniaturę, aby wgrać własne zdjęcie
        </p>
      </div>
    </div>
  );
};

export default SetTittle;
