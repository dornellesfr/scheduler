import {
  addDays,
  addMinutes,
  format,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";

const FIRST_SLOT_MINUTES = 8 * 60;
const LAST_SLOT_MINUTES = 17 * 60 + 15;
const SLOT_INTERVAL_MINUTES = 45;
export const APPOINTMENT_DURATION_MINUTES = 45;

export function getScheduleDateRange(): { maxDate: Date; minDate: Date } {
  const minDate: Date = startOfDay(new Date());

  return { maxDate: addDays(minDate, 30), minDate };
}

export function getAvailableScheduleTimes(
  date: Date,
  now: Date = new Date(),
): string[] {
  const slots: string[] = [];

  for (
    let totalMinutes: number = FIRST_SLOT_MINUTES;
    totalMinutes <= LAST_SLOT_MINUTES;
    totalMinutes += SLOT_INTERVAL_MINUTES
  ) {
    const hours: number = Math.floor(totalMinutes / 60);
    const minutes: number = totalMinutes % 60;
    const time: string = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    if (combineLocalDateAndTime(date, time) > now) slots.push(time);
  }

  const lastTime: string = "17:15";
  if (combineLocalDateAndTime(date, lastTime) > now) slots.push(lastTime);

  return slots;
}

export function combineLocalDateAndTime(date: Date, time: string): Date {
  const [hours, minutes]: number[] = time.split(":").map(Number);
  const withHours: Date = setHours(date, hours);
  const withMinutes: Date = setMinutes(withHours, minutes);

  return setSeconds(withMinutes, 0);
}

export function formatScheduledAt(date: Date, time: string): string {
  return format(
    combineLocalDateAndTime(date, time),
    "yyyy-MM-dd'T'HH:mm:ssxxx",
  );
}

export function formatScheduleDate(date: Date): string {
  return format(date, "dd/MM/yyyy");
}

export function getEstimatedEnd(date: Date, time: string): Date {
  return addMinutes(
    combineLocalDateAndTime(date, time),
    APPOINTMENT_DURATION_MINUTES,
  );
}
