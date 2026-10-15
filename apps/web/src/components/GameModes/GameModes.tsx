/* src/components/GameModes/GameModes.module.css */
import styles from "./GameModes.module.css";
import { AiMode } from "./AiMode/AiMode.tsx";
import { StoryMode } from "./StoryMode/StoryMode.tsx";

export const GameModes = () => {
  return (
    <div className={styles.body}>
      <AiMode />
      <StoryMode />
    </div>
  );
};
