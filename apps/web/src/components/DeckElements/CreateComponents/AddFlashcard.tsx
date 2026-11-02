import styles from "./AddFlashcard.module.css";

export const AddFlashcard = () => {
  return (
    <div className={styles.wrapper}>
      <h3>Dodaj fiszkę</h3>
      <div className={styles.inputsWrapper}>
        <div className={styles.box}>
          <p>Pytanie</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Wpisz treść pytania"
          />
        </div>
        <div className={styles.box}>
          <p>Odpowiedź</p>
          <input
            type="text"
            className={styles.input}
            placeholder="Wpisz odpowiedź"
          />
        </div>
      </div>
      Podpowiedź
      <input type="checkbox" className={styles.hint} />
    </div>
  );
};

export default AddFlashcard;
