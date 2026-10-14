import styles from './QuizCard.module.css';

export interface QuizCardProps {
  title: string;
  questionsCount: number;
  tags: string[];
  author: string;
}

export const QuizCard = ({ title, questionsCount, tags, author }: QuizCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <span>Miniatura 16:9</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.meta}>{questionsCount} pytań/fiszek</p>
        <p className={styles.tags}>{tags.join(', ')}</p>
        <p className={styles.author}>{author}</p>
      </div>
    </div>
  );
};

