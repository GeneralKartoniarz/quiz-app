import { useState, useEffect, type FormEvent } from "react";
import {
  loginUser,
  registerUser,
  getProfile,
  clearStoredToken,
  getStoredToken,
  type ExtendedUserProfile,
} from "../../api/auth";
import styles from "./Profile.module.css";

type AuthMode = "login" | "register";

export const Profile = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<ExtendedUserProfile | null>(null);

  // Formularz
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Statusy
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(() => Boolean(getStoredToken()));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sprawdzenie sesji po załadowaniu komponentu (GET /auth/me) jeśli token istnieje
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      return;
    }

    let isMounted = true;

    getProfile()
      .then((profile) => {
        if (isMounted) {
          setUser(profile);
        }
      })
      .catch((err) => {
        console.error("Sesja wygasła lub błąd pobierania profilu:", err);
        clearStoredToken();
      })
      .finally(() => {
        if (isMounted) {
          setInitialLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      setSuccess(`Zalogowano pomyślnie jako ${response.user.username}!`);
      // Pobieramy pełne dane z /auth/me
      const profile = await getProfile();
      setUser(profile);
      setPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd logowania");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await registerUser({ email, username, password });
      setSuccess(`Konto zostało pomyślnie utworzone! Witaj, ${response.user.username}.`);
      // Po rejestracji użytkownik od razu otrzymuje accessToken i jest zalogowany
      const profile = await getProfile();
      setUser(profile);
      setPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd rejestracji");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    setUser(null);
    setSuccess("Zostałeś pomyślnie wylogowany.");
    setError(null);
    setPassword("");
  };

  const handleRefreshProfile = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const profile = await getProfile();
      setUser(profile);
      setSuccess("Dane profilu zostały pomyślnie odświeżone z /auth/me.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Błąd podczas odświeżania profilu");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loadingSpinner}>
            <p>Sprawdzanie aktywnej sesji...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {user ? "Twój Profil" : "Autoryzacja"}
          </h1>
          <p className={styles.subtitle}>
            {user
              ? "Zarządzaj swoim kontem i sprawdzaj status sesji"
              : "Zaloguj się lub utwórz nowe konto, aby kontynuować"}
          </p>
        </div>

        {error && <div className={styles.alertError}>⚠️ {error}</div>}
        {success && <div className={styles.alertSuccess}>✓ {success}</div>}

        {user ? (
          /* Widok zalogowanego użytkownika (sprawdzenie GET /auth/me) */
          <div className={styles.profileDetails}>
            <div className={styles.avatarHeader}>
              <div className={styles.avatarCircle}>
                {user.username.charAt(0)}
              </div>
              <div className={styles.profileHeaderText}>
                <h2>{user.username}</h2>
                <p>{user.email}</p>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ID Użytkownika</span>
                <span className={styles.infoValue}>{user.id}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Rola</span>
                <span className={styles.badge}>{user.role || "USER"}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Adres E-mail</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Data utworzenia</span>
                <span className={styles.infoValue}>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString("pl-PL")
                    : "Brak danych"}
                </span>
              </div>
            </div>

            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.refreshBtn}
                onClick={handleRefreshProfile}
                disabled={loading}
              >
                {loading ? "Odświeżanie..." : "Odśwież (GET /auth/me)"}
              </button>

              <button
                type="button"
                className={styles.logoutBtn}
                onClick={handleLogout}
              >
                Wyloguj się
              </button>
            </div>
          </div>
        ) : (
          /* Formularz logowania i rejestracji */
          <>
            <div className={styles.tabs}>
              <button
                type="button"
                className={`${styles.tabBtn} ${
                  mode === "login" ? styles.tabBtnActive : ""
                }`}
                onClick={() => handleTabChange("login")}
              >
                Logowanie
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${
                  mode === "register" ? styles.tabBtnActive : ""
                }`}
                onClick={() => handleTabChange("register")}
              >
                Rejestracja
              </button>
            </div>

            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="login-email" className={styles.label}>
                    Adres e-mail
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="np. jan.kowalski@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    autoComplete="email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="login-password" className={styles.label}>
                    Hasło
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Wprowadź hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  {loading ? "Logowanie..." : "Zaloguj się"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-email" className={styles.label}>
                    Adres e-mail
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="np. jan.kowalski@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    autoComplete="email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reg-username" className={styles.label}>
                    Nazwa użytkownika
                  </label>
                  <input
                    id="reg-username"
                    type="text"
                    required
                    minLength={3}
                    placeholder="Minimum 3 znaki (np. janek)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                    autoComplete="username"
                  />
                  <span className={styles.hint}>
                    Minimum 3 znaki, unikalna nazwa użytkownika
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reg-password" className={styles.label}>
                    Hasło
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Minimum 8 znaków"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    autoComplete="new-password"
                  />
                  <span className={styles.hint}>
                    Hasło musi składać się z minimum 8 znaków
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  {loading ? "Rejestrowanie..." : "Utwórz konto"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
