import styles from '../app/styles.module.css';

export function Header({ title }: { title: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  );
} 