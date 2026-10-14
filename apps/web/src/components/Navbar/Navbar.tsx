import { useTheme } from "../../hooks/useTheme";
import styles from "./Navbar.module.css";

export interface NavbarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const Navbar = ({ searchQuery, setSearchQuery }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>QUIZZINGER</div>

      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Szukaj fiszek, quizów..."
          className={styles.searchInput}
          value={searchQuery ?? ""}
          onChange={(e) => setSearchQuery?.(e.target.value)}
        />
      </div>

      <nav className={styles.nav}>
        <a href="#fiszki" className={styles.navLink}>
          Fiszki
        </a>
        <a href="#areny" className={styles.navLink}>
          Areny
        </a>
        <a href="#stworz" className={styles.navLink}>
          Stwórz
        </a>
      </nav>

      <div className={styles.actions}>
        <button
          className={styles.themeToggleBtn}
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Włącz tryb jasny" : "Włącz tryb ciemny"}
          title={theme === "dark" ? "Włącz tryb jasny" : "Włącz tryb ciemny"}
        >
          {theme === "dark" ? (
            /* Ikona Słońca w trybie ciemnym */
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Ikona Księżyca w trybie jasnym */
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <button className={styles.profileBtn}>PROFIL</button>
      </div>
    </header>
  );
};
