import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, History } from "lucide-react";
import { AppShell } from "@/components/gd/AppShell";
import { PageHeader, ProfileButton } from "@/components/gd/PageHeader";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useGD } from "@/hooks/use-gd";
import { ensureAppData, type SessionRow } from "@/lib/data";
import { LETTERS, PHASES, WORKOUTS, type WorkoutLetter } from "@/lib/program-data";
import { fromISODate } from "@/lib/schedule";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/historico")({
  head: () => ({
    meta: [
      { title: "Histórico — GDshape" },
      { name: "description", content: "Todos os treinos concluídos, organizados por mês e filtráveis por treino." },
      { property: "og:title", content: "Histórico — GDshape" },
      { property: "og:description", content: "Todos os treinos concluídos, organizados por mês." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => ensureAppData(context.queryClient),
  component: () => (
    <AppShell>
      <HistoryPage />
    </AppShell>
  ),
});

function HistoryPage() {
  const { sessions, profile } = useGD();
  const [filter, setFilter] = useState<WorkoutLetter | "all">("all");
  const [open, setOpen] = useState<SessionRow | null>(null);

  const groups = useMemo(() => {
    const done = sessions
      .filter((s) => s.status === "completed" && (filter === "all" || s.workout_letter === filter))
      .sort((a, b) => b.session_date.localeCompare(a.session_date));
    const map = new Map<string, SessionRow[]>();
    for (const s of done) {
      const k = s.session_date.slice(0, 7);
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    return [...map.entries()];
  }, [sessions, filter]);

  return (
    <div>
      <PageHeader eyebrow="Registros permanentes" title="Histórico" right={<ProfileButton name={profile?.display_name} />} />
      <div className="-mx-5 mb-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {(["all", ...LETTERS] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
              filter === f ? "border-primary bg-primary text-primary-foreground glow-sm" : "border-border bg-card text-muted-foreground",
            )}
          >
            {f === "all" ? "Todos" : `Treino ${f}`}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-10 text-center">
          <History className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhum treino concluído {filter !== "all" && `do Treino ${filter} `}ainda.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(([month, rows]) => (
            <section key={month}>
              <div className="mb-2 flex items-baseline justify-between px-1">
                <h2 className="font-display text-xl font-bold uppercase">{format(fromISODate(month + "-01"), "MMMM yyyy", { locale: ptBR })}</h2>
                <span className="text-xs font-semibold text-muted-foreground">{rows.length} treinos</span>
              </div>
              <ul className="space-y-2">
                {rows.map((s) => {
                  const l = s.workout_letter as WorkoutLetter;
                  return (
                    <li key={s.id}>
                      <button onClick={() => setOpen(s)} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left hover:bg-surface-raised">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 font-display text-2xl font-extrabold italic text-primary">{l}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{WORKOUTS[l].muscles}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(fromISODate(s.session_date), "EEE, dd/MM", { locale: ptBR })} · Semana {s.week_number} · Fase {s.phase_number}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">{s.completed_at ? format(new Date(s.completed_at), "HH:mm") : ""}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <Drawer open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DrawerContent className="border-border bg-card">
          {open && (
            <div className="mx-auto w-full max-w-md px-5 pb-8 safe-bottom">
              <DrawerHeader className="px-0 text-left">
                <DrawerDescription className="eyebrow">{format(fromISODate(open.session_date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}</DrawerDescription>
                <DrawerTitle className="font-display text-4xl font-extrabold uppercase italic leading-none">Treino {open.workout_letter}</DrawerTitle>
              </DrawerHeader>
              <dl className="space-y-2 text-sm">
                <Row k="Grupo muscular" v={WORKOUTS[open.workout_letter as WorkoutLetter].muscles} />
                <Row k="Semana do programa" v={`Semana ${open.week_number} de 16`} />
                <Row k="Fase" v={`Fase ${open.phase_number} · ${PHASES[open.phase_number - 1]?.name ?? ""}`} />
                {open.started_at && <Row k="Início" v={format(new Date(open.started_at), "HH:mm")} />}
                {open.completed_at && <Row k="Conclusão" v={format(new Date(open.completed_at), "HH:mm 'de' dd/MM/yyyy")} />}
              </dl>
              <p className="mt-4 flex items-center gap-2 text-xs text-primary"><CheckCircle2 className="h-4 w-4" /> Registro confirmado</p>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-surface-raised px-4 py-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
