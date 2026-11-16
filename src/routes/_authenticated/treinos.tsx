import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/gd/AppShell";
import { PageHeader, ProfileButton } from "@/components/gd/PageHeader";
import { useGD } from "@/hooks/use-gd";
import { ensureAppData } from "@/lib/data";
import { LETTERS, PHASES, WORKOUTS, getExercises } from "@/lib/program-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/treinos")({
  head: () => ({
    meta: [
      { title: "Treinos — GDshape" },
      { name: "description", content: "Os cinco treinos A, B, C, D e E de cada fase do programa." },
      { property: "og:title", content: "Treinos — GDshape" },
      { property: "og:description", content: "Os cinco treinos de cada fase do programa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => ensureAppData(context.queryClient),
  component: () => (
    <AppShell>
      <Workouts />
    </AppShell>
  ),
});

function Workouts() {
  const { phase, profile, todayDay } = useGD();
  const [sel, setSel] = useState(phase);
  const ph = PHASES[sel - 1];
  return (
    <div>
      <PageHeader eyebrow="Divisão A–E" title="Treinos" right={<ProfileButton name={profile?.display_name} />} />
      <div className="grid grid-cols-4 gap-1 rounded-2xl border border-border bg-card p-1">
        {PHASES.map((p) => (
          <button
            key={p.number}
            onClick={() => setSel(p.number)}
            className={cn(
              "relative rounded-xl py-2 text-center transition-all",
              sel === p.number ? "bg-primary text-primary-foreground glow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="block font-display text-lg font-bold leading-none">F{p.number}</span>
            <span className="text-[10px] font-semibold">
              Sem {p.weeks[0]}–{p.weeks[1]}
            </span>
            {p.number === phase && sel !== p.number && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>
      <p className="mt-3 px-1 text-xs text-muted-foreground">
        <strong className="text-foreground">{ph.name}.</strong> {sel === phase ? "Fase atual." : "Visualizando outra fase — o treino do dia sempre usa a fase atual."}
      </p>

      <ul className="mt-5 space-y-3">
        {LETTERS.map((l) => {
          const ex = getExercises(sel, l);
          const isToday = sel === phase && todayDay?.letter === l;
          return (
            <li key={l}>
              <Link
                to="/ficha/$fase/$letra"
                params={{ fase: String(sel), letra: l }}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:bg-surface-raised",
                  isToday ? "border-primary/60 glow-sm" : "border-border",
                )}
              >
                <span
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-4xl font-extrabold italic",
                    isToday ? "bg-primary text-primary-foreground" : "bg-surface-raised text-primary",
                  )}
                >
                  {l}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl font-bold uppercase leading-tight">{WORKOUTS[l].muscles}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {ex.length} exercícios · {ex[0]?.name}
                  </p>
                  {isToday && <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-primary">Treino de hoje</p>}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to="/programa" className="mt-5 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4">
        <div>
          <p className="eyebrow">Periodização e recomendações</p>
          <p className="font-display text-xl font-bold uppercase">Meu programa</p>
        </div>
        <ChevronRight className="h-5 w-5 text-primary" />
      </Link>
    </div>
  );
}
