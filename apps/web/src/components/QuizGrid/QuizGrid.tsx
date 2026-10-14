import { QuizCard, type QuizCardProps } from '../QuizCard/QuizCard';
import styles from './QuizGrid.module.css';

export interface QuizItem extends QuizCardProps {
  id: number;
}

export interface QuizGridProps {
  quizList: QuizItem[];
  sortBy?: string;
  setSortBy?: (sort: string) => void;
}

export const QuizGrid = ({ quizList }: QuizGridProps) => {
  return (
    <section className={styles.container}>
      {/* Banner ozdobny ze zdjęcia */}
      <div className={styles.banner}></div>

      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Popularne Quizy i Talie</h2>
        <button className={styles.sortBtn}>
          Sortuj <span>∨</span>
        </button>
      </div>

      <div className={styles.grid}>
        {quizList.map((quiz, index) => (
          <QuizCard key={quiz.id ?? index} {...quiz} />
        ))}
      </div>

      <div className={styles.pagination}>
        <button className={styles.pageBtn}>← Poprzednia</button>
        <button className={styles.moreBtn}>Więcej</button>
        <button className={styles.pageBtn}>Następna →</button>
      </div>
    </section>
  );
};

