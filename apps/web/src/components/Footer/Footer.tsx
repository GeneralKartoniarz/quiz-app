import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.col}>
          <h4>O projekcie</h4>
          <a href="https://github.com/GeneralKartoniarz/quiz-app">
            Repozytorium
          </a>
          <a href="#">Tutaj znowu carch phrase</a>
          <a href="#">Logo</a>
        </div>
        <div className={styles.col}>
          <h4>Nawigacja</h4>
          <a href="#">Fiszki</a>
          <a href="#">Areny</a>
          <a href="#">Kreator</a>
        </div>
        <div className={styles.col}>
          <h4>Pomoc i społeczność</h4>
          <a href="#">Jak korzystać?</a>
          <a href="#">Zgłoś błąd / sugestie</a>
          <a href="#">FAQ</a>
        </div>
        <div className={styles.col}>
          <h4>Kwestie prawne</h4>
          <a href="#">Regulamin serwisu</a>
          <a href="#">Polityka prywatności</a>
          <a href="#">Polityka cookies</a>
        </div>
      </div>
    </footer>
  );
};
