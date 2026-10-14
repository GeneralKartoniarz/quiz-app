import { useState } from "react";
import styles from "./Hero.module.css";

export interface HeroProps {
  onJoinArena?: (pin: string) => void;
}

export const Hero = ({ onJoinArena }: HeroProps) => {
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);

  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Automatyczny skok do następnego pola
    if (value && index < 5) {
      const nextInput = document.getElementById(
        `pin-input-${index + 1}`,
      ) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    //moving to the previous pin box when pressing backspace
    if (e.key === "Backspace" && index > 0) {
      e.preventDefault();

      if (pin[index]) {
        const newPin = [...pin];
        newPin[index] = "";
        setPin(newPin);
      }
      const prevInput = document.getElementById(
        `pin-input-${index - 1}`,
      ) as HTMLInputElement | null;

      prevInput?.focus();
    }

    //moving to the left pin box
    if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(
        `pin-input-${index - 1}`,
      ) as HTMLInputElement | null;

      prevInput?.focus();
    }
    //moving right
    if (e.key === "ArrowRight" && index < 5) {
      const nextInput = document.getElementById(
        `pin-input-${index + 1}`,
      ) as HTMLInputElement | null;

      nextInput?.focus();
    }
  };

  return (
    <section className={styles.heroContainer}>
      <div className={styles.leftContent}>
        <div className={styles.accentLine}></div>
        <h1 className={styles.title}>
          Dołącz do areny, zmierz się ze znajomymi i sprawdź swoją wiedzę!
        </h1>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.pinSection}>
        <label className={styles.pinLabel}>WPISZ PIN</label>
        <div className={styles.pinInputs}>
          {pin.map((digit, idx) => (
            <input
              key={idx}
              id={`pin-input-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={styles.pinBox}
              placeholder="—"
            />
          ))}
        </div>
        <button
          className={`${styles.arenaBtn} animate__animated`}
          onClick={() => onJoinArena?.(pin.join(""))}
        >
          PRZEJDŹ DO ARENY <span>→</span>
        </button>
      </div>
    </section>
  );
};
