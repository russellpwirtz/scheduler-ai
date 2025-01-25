import styles from '../app/styles.module.css';

export function MessageBubble({
  message,
  isUser
}: {
  message: { content: string; timestamp: Date; error?: string };
  isUser: boolean;
}) {
  if (!message.content) {
    return (
      <div className={`${styles.messageBubble} bg-yellow-100 border-yellow-400`}>
        ⚠️ Message content unavailable
        {message.error && <div className="text-sm mt-2">{message.error}</div>}
      </div>
    );
  }

  return (
    <div className={`${styles.messageBubble} ${
      isUser ? styles.userMessage : styles.botMessage
    }`}>
      <p 
        className={styles.messageText}
        data-testid="message-content"
      >
        {message.content.replace(
          /!schedule\([^)]+\)/g, 
          '[BOOKING SCHEDULED]'
        )}
      </p>
      <div className={styles.messageTimestamp}>
        {message.timestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );
} 