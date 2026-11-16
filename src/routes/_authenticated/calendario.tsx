import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/gd/AppShell";
import { PageHeader, ProfileButton } from "@/components/gd/PageHeader";
import { STATE_LABEL, dayState, type DayState } from "@/components/gd/WeekStrip";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useGD } from "@/hooks/use-gd";
import { ensureAppData } from "@/lib/data";
import { WORKOUTS } from "@/lib/program-data";
import { fromISODate, getProgramDay, toISODate, type ProgramDay } from "@/lib/schedule";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário — GDshape" },
      { name: "description", content: "Calendário mensal com treinos concluídos, pendentes e descansos." },
      { property: "og:title", content: "Calendário — GDshape" },
      { property: "og:description", content: "Calendário mensal do programa de treino." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => ensureAppData(context.queryClient),
  component: () => (
    <AppShell>
      <CalendarPage />
    </AppShell>
  ),
});

const cellTone: Record<DayState, string> = {
  completed: "bg-primary text-primary-foreground glow-sm border-primary",
  in_progress: "bg-primary/15 text-primary border-primary/60",
  pending: "bg-surface-raised text-foreground border-border",
  missed: "bg-surface text-muted-foreground border-border",
  rest: "bg-rest/25 text-muted-foreground border-transparent",
  outside: "bg-transparent text-muted-foreground/40 border-transparent",
};

function CalendarPage() {
  const { program, profile, today, sessionFor } = useGD();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<ProgramDay | null>(null);
  if (!program) return null;

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });
  const sel = selected ? sessionFor(selected.date) : undefined;
  const selState = selected ? dayState(selected, sel, today) : null;

  return (
    <div>
      <PageHeader eyebrow="16 semanas" title="Calendário" right={<ProfileButton name={profile?.display_name} />} />
      <section className="rounded-3xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <button aria-label="Mês anterior" onClick={() => setMonth((m) => addMonths(m, -1))} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => setMonth(startOfMonth(new Date()))} className="font-display text-2xl font-bold uppercase">
            {format(month, "MMMM yyyy", { locale: ptBR })}
          </button>
          <button aria-label="Próximo mês" onClick={() => setMonth((m) => addMonths(m, 1))} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
            <span key={i} className="pb-1 text-[10px] font-bold text-muted-foreground">{d}</span>
          ))}
          {days.map((d) => {
            const iso = toISODate(d);
            const pd = getProgramDay(program.start_date, iso, program.total_weeks);
            const st = dayState(pd, sessionFor(iso), today);
            const inMonth = isSameMonth(d, month);
            return (
              <button
                key={iso}
                onClick={() => setSelected(pd)}
                aria-label={`${format(d, "d 'de' MMMM", { locale: ptBR })}: ${pd.letter ? `Treino ${pd.letter}, ` : ""}${STATE_LABEL[st]}`}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-xl border text-sm font-semibold transition-transform active:scale-95",
                  cellTone[st],
                  !inMonth && "opacity-30",
                  iso === today && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                )}
              >
                <span className="leading-none">{format(d, "d")}</span>
                {pd.letter && <span className={cn("mt-0.5 font-display text-[11px] font-bold leading-none", st === "completed" ? "" : "text-primary")}>{pd.letter}</span>}
              </button>
            );
          })}
        </div>
      </section>

      <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <Legend tone="bg-primary" label="Treino concluído" />
        <Legend tone="bg-surface-raised border border-border" label="Treino pendente" />
        <Legend tone="bg-rest/40" label="Descanso programado" />
        <Legend tone="ring-2 ring-primary bg-transparent" label="Dia atual" />
      </ul>

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DrawerContent className="border-border bg-card">
          {selected && selState && (
            <div className="mx-auto w-full max-w-md px-5 pb-8 safe-bottom">
              <DrawerHeader className="px-0 text-left">
                <DrawerDescription className="eyebrow">
                  {format(fromISODate(selected.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </DrawerDescription>
                <DrawerTitle className="font-display text-4xl font-extrabold uppercase italic leading-none">
                  {selected.letter ? `Treino ${selected.letter}` : selected.kind === "rest" ? "Descanso" : "Fora do programa"}
                </DrawerTitle>
              </DrawerHeader>
              <dl className="space-y-2 text-sm">
                {selected.letter && <Info label="Grupo muscular" value={WORKOUTS[selected.letter].muscles} />}
                {selected.week && <Info label="Semana · Fase" value={`Semana ${selected.week} · Fase ${selected.phase}`} />}
                <Info label="Situação" value={STATE_LABEL[selState]} highlight={selState === "completed"} />
                {sel?.completed_at && sel.status === "completed" && (
                  <Info label="Concluído às" value={format(new Date(sel.completed_at), "HH:mm 'de' dd/MM")} />
                )}
              </dl>
              {selected.letter && (
                <Button asChild variant={selState === "completed" ? "surface" : "hero"} size="xl" className="mt-6 w-full">
                  <Link to="/treino/$data" params={{ data: selected.date }}>
                    {selState === "completed" ? "Ver treino" : selected.date > today ? "Ver programação" : selState === "missed" ? "Abrir e registrar" : "Abrir treino"}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function Info({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-surface-raised px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-semibold", highlight && "text-primary")}>{value}</dd>
    </div>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={cn("h-4 w-4 rounded-md", tone)} />
      {label}
    </li>
  );
}
