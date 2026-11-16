import { addDays, differenceInCalendarDays, format, parseISO, startOfWeek } from "date-fns";
import { LETTERS, type WorkoutLetter } from "./program-data";

export const TOTAL_WEEKS = 16;
export const TRAINING_DAYS_PER_WEEK = 5;
export const TOTAL_TRAINING_DAYS = TOTAL_WEEKS * TRAINING_DAYS_PER_WEEK; // 80

export type DayKind = "training" | "rest" | "outside";

export interface ProgramDay {
  date: string; // yyyy-MM-dd
  kind: DayKind;
  week: number | null; // 1..16
  phase: number | null; // 1..4
  weekday: number; // 0 = segunda ... 6 = domingo
  letter: WorkoutLetter | null;
}

export function toISODate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function fromISODate(s: string): Date {
  return parseISO(s);
}

/** O programa começa sempre na segunda-feira da semana escolhida. */
export function normalizeStartDate(d: Date): string {
  return toISODate(startOfWeek(d, { weekStartsOn: 1 }));
}

/** Rotação original: semana 1 A-B-C-D-E, semana 2 B-C-D-E-A, semana 3 C-D-E-A-B, semana 4 D-E-A-B-C; repete a cada 4 semanas. */
export function letterFor(week: number, weekday: number): WorkoutLetter | null {
  if (weekday > 4) return null;
  const offset = (week - 1) % 4;
  return LETTERS[(offset + weekday) % 5];
}

export function phaseForWeek(week: number): number {
  return Math.min(4, Math.floor((week - 1) / 4) + 1);
}

export function getProgramDay(startDate: string, date: string | Date, totalWeeks = TOTAL_WEEKS): ProgramDay {
  const d = typeof date === "string" ? fromISODate(date) : date;
  const iso = toISODate(d);
  const diff = differenceInCalendarDays(d, fromISODate(startDate));
  const weekday = (d.getDay() + 6) % 7;
  if (diff < 0 || diff >= totalWeeks * 7) {
    return { date: iso, kind: "outside", week: null, phase: null, weekday, letter: null };
  }
  const week = Math.floor(diff / 7) + 1;
  const phase = phaseForWeek(week);
  const letter = letterFor(week, weekday);
  return { date: iso, kind: letter ? "training" : "rest", week, phase, weekday, letter };
}

export function getWeekDays(startDate: string, week: number): ProgramDay[] {
  const monday = addDays(fromISODate(startDate), (week - 1) * 7);
  return Array.from({ length: 7 }, (_, i) => getProgramDay(startDate, addDays(monday, i)));
}

/** Semana atual (1..16), ou 0 antes do início, ou 17 após o término. */
export function currentWeek(startDate: string, today: Date, totalWeeks = TOTAL_WEEKS): number {
  const diff = differenceInCalendarDays(today, fromISODate(startDate));
  if (diff < 0) return 0;
  const w = Math.floor(diff / 7) + 1;
  return w > totalWeeks ? totalWeeks + 1 : w;
}

/** Dias de treino programados de início até a data (inclusive). Descansos não contam. */
export function scheduledTrainingDaysUntil(startDate: string, until: Date, totalWeeks = TOTAL_WEEKS): ProgramDay[] {
  const out: ProgramDay[] = [];
  const start = fromISODate(startDate);
  const total = totalWeeks * 7;
  const last = Math.min(differenceInCalendarDays(until, start), total - 1);
  for (let i = 0; i <= last; i++) {
    const day = getProgramDay(startDate, addDays(start, i), totalWeeks);
    if (day.kind === "training") out.push(day);
  }
  return out;
}

export function completionPercent(completed: number): number {
  return Math.min(100, Math.round((completed / TOTAL_TRAINING_DAYS) * 100));
}

/** Sequência de dias de treino concluídos consecutivos (descansos são ignorados). Hoje sem registro não quebra a sequência. */
export function trainingStreak(startDate: string, today: Date, completedDates: Set<string>): number {
  const days = scheduledTrainingDaysUntil(startDate, today);
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (completedDates.has(d.date)) streak++;
    else if (d.date === toISODate(today)) continue;
    else break;
  }
  return streak;
}
