import styles from "./SetTittle.module.css";

export const SetTittle = () => {
  return (
    <div className={styles.wrapper}>
      <h3>Wprowadź nazwę talii:</h3>
      <input type="text" className={styles.input} placeholder="Tytuł" />
      <h3>Dodaj tagi</h3>
      <input type="text" className={styles.input} placeholder="Tag" />
      <button className={styles.submitBtn}>Dodaj</button>
      <h3>Ustawienia prywatności</h3>
      <select name="Widoczność" id="" className={styles.select}>
        <option value="">Publiczne</option>
        <option value="">Prywatne</option>
      </select>
    </div>
  );
};

export default SetTittle;
