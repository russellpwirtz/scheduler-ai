import styles from '../app/styles.module.css';

export function MessageInputForm({
  input,
  isLoading,
  hasAvailability,
  onInputChange,
  onSubmit
}: {
  input: string;
  isLoading: boolean;
  hasAvailability: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className={styles.formContainer}>
      <form onSubmit={onSubmit} className={styles.form}>
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          className={styles.inputField}
          disabled={isLoading || !hasAvailability}
        />
        <button
          type="submit"
          disabled={isLoading || !hasAvailability}
          className={styles.submitButton}
        >
          {isLoading ? (
            <div className={styles.spinner} />
          ) : 'Send Message'}
        </button>
      </form>
    </div>
  );
} 