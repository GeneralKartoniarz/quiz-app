import styles from "./AiMode.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export const AiMode = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Lubisz naukę z AI?{" "}
        <FontAwesomeIcon icon={faRobot} className={styles.robot} />
      </h1>
      <div className={styles.content}>
        <p className={styles.text}>
          Sprawdź swoją wiedzę w trybie, w którym AI tworzy quizy specjalnie dla
          ciebie!
        </p>
        <button className={styles.button}>GRAJ W TRYB AI</button>
      </div>
    </div>
  );
};
