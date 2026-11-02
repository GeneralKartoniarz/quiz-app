import styles from "./DeckCreate.module.css";
import { SetTittle } from "../../../components/DeckElements/CreateComponents/SetTittle";
import { AddFlashcard } from "../../../components/DeckElements/CreateComponents/AddFlashcard";

export const DeckCreate = () => {
  return (
    <div className={styles.pageWrapper}>
      <h1>Stwórz swoją talię fiszek</h1>
      <SetTittle />
      <AddFlashcard />
    </div>
  );
};

export default DeckCreate;
