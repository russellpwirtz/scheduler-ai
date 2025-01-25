import styles from '../app/styles.module.css';

export function MessageBubble({
  message,
  isUser
}: {
  message: { content: string; timestamp: Date };
  isUser: boolean;
}) {
  return (
    <div className={`${styles.messageBubble} ${
      isUser ? styles.userMessage : styles.botMessage
    }`}>
      <p className={styles.messageText}>{message.content}</p>
      <div className={styles.messageTimestamp}>
        {message.timestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );
} 