import { AvailabilityWindow } from '../types';
import styles from './AvailabilityCalendar.module.css';

export function AvailabilityCalendar({ availability, title }: { 
  availability: AvailabilityWindow[];
  title: string;
}) {
  return (
    <div className={styles.calendarContainer}>
      <h3 className={styles.calendarTitle}>{title}</h3>
      <div className={styles.timeSlots}>
        {availability.map((slot, index) => (
          <div key={index} className={styles.timeSlot}>
            <div className={styles.timeRange}>
              {new Date(slot.start).toLocaleDateString([], { 
                month: 'short', 
                day: 'numeric' 
              })}
              <br />
              {new Date(slot.start).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })} - 
              {new Date(slot.end).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 