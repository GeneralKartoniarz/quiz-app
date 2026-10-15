import styles from "./StoryMode.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAmericas,
  faEarthEurope,
  faGlobe,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

export const StoryMode = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Przygodowa nauka
        <FontAwesomeIcon icon={faEarthAmericas} className={styles.robot} />
      </h1>
      <div className={styles.content}>
        <p className={styles.text}>
          Szukasz zaplanowanej nauki? Progresywny tryb gry jest właśnie dla
          ciebie!
        </p>
        <button className={styles.button}>GRAJ W TRYB NAUKI</button>
      </div>
    </div>
  );
};
