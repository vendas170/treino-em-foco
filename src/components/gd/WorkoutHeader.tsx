import { Dumbbell, Layers, Timer } from "lucide-react";
import { PHASES, WORKOUTS, type WorkoutLetter } from "@/lib/program-data";

export function WorkoutHeader({ letter, phase, week, count }: { letter: WorkoutLetter; phase: number; week?: number | null; count: number }) {
  const ph = PHASES[phase - 1];
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-hero p-5">
      <span className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[10rem] font-extrabold italic leading-none text-primary/10">
        {letter}
      </span>
      <p className="eyebrow relative text-primary">{WORKOUTS[letter].title}</p>
      <h2 className="relative font-display text-4xl font-extrabold uppercase italic leading-none">{WORKOUTS[letter].muscles}</h2>
      <div className="relative mt-4 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5">
          <Dumbbell className="h-3.5 w-3.5 text-primary" /> {count} exercícios
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5">
          <Layers className="h-3.5 w-3.5 text-primary" /> Fase {phase} · {ph.name}
        </span>
        {week ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5">
            <Timer className="h-3.5 w-3.5 text-primary" /> Semana {week}
          </span>
        ) : null}
      </div>
      <p className="relative mt-4 text-xs leading-relaxed text-muted-foreground">{ph.description}</p>
    </section>
  );
}
