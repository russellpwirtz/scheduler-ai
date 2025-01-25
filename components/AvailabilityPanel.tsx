import styles from '../app/styles.module.css';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { AvailabilityWindow } from '../types';

export function AvailabilityPanel({
  name,
  availability
}: {
  name: string;
  availability: AvailabilityWindow[];
}) {
  return (
    <div className={styles.calendarItem}>
      <AvailabilityCalendar
        availability={availability}
        title={`${name.charAt(0).toUpperCase() + name.slice(1)}'s Schedule`}
      />
    </div>
  );
} 