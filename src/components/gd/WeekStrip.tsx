import { Check, Moon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { SessionRow } from "@/lib/data";
import type { ProgramDay } from "@/lib/schedule";
import { cn } from "@/lib/utils";

const WD = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

export type DayState = "completed" | "in_progress" | "pending" | "missed" | "rest" | "outside";

export function dayState(day: ProgramDay, session: SessionRow | undefined, today: string): DayState {
  if (day.kind === "outside") return "outside";
  if (day.kind === "rest") return "rest";
  if (session?.status === "completed") return "completed";
  if (session?.status === "in_progress") return "in_progress";
  return day.date < today ? "missed" : "pending";
}

export const STATE_LABEL: Record<DayState, string> = {
  completed: "Concluído",
  in_progress: "Em andamento",
  pending: "Pendente",
  missed: "Não registrado",
  rest: "Descanso",
  outside: "Fora do programa",
};

export function WeekStrip({
  days,
  sessionFor,
  today,
  showWeekend = false,
}: {
  days: ProgramDay[];
  sessionFor: (d: string) => SessionRow | undefined;
  today: string;
  showWeekend?: boolean;
}) {
  const list = showWeekend ? days : days.slice(0, 5);
  return (
    <div className={cn("grid gap-2", showWeekend ? "grid-cols-7" : "grid-cols-5")}>
      {list.map((d) => {
        const st = dayState(d, sessionFor(d.date), today);
        const isToday = d.date === today;
        const content = (
          <>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground">{WD[d.weekday]}</span>
            <span
              className={cn(
                "flex h-12 w-full items-center justify-center rounded-xl border font-display text-2xl font-extrabold transition-all",
                st === "completed" && "border-primary bg-primary text-primary-foreground glow-sm",
                st === "in_progress" && "border-primary/70 bg-primary/15 text-primary animate-pulse-ring",
                st === "pending" && "border-border bg-surface-raised text-foreground",
                st === "missed" && "border-dashed border-muted-foreground/40 bg-transparent text-muted-foreground",
                (st === "rest" || st === "outside") && "border-transparent bg-surface text-rest",
                isToday && st !== "completed" && "border-primary ring-1 ring-primary",
              )}
            >
              {st === "completed" ? (
                <Check className="h-5 w-5" strokeWidth={3} />
              ) : d.letter ? (
                d.letter
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </span>
            <span className={cn("text-[10px] font-semibold", isToday ? "text-primary" : "text-muted-foreground")}>
              {d.letter ? (st === "completed" ? d.letter : isToday ? "HOJE" : d.date.slice(8)) : "—"}
            </span>
          </>
        );
        return d.kind === "training" ? (
          <Link
            key={d.date}
            to="/treino/$data"
            params={{ data: d.date }}
            className="flex flex-col items-center gap-1.5"
            aria-label={`${WD[d.weekday]} — Treino ${d.letter} — ${STATE_LABEL[st]}`}
          >
            {content}
          </Link>
        ) : (
          <div key={d.date} className="flex flex-col items-center gap-1.5" aria-label={`${WD[d.weekday]} — ${STATE_LABEL[st]}`}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
