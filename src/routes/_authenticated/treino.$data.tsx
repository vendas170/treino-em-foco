import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, CheckCircle2, Clock, Moon, Pause, Play, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/gd/AppShell";
import { ConfirmDialog } from "@/components/gd/ConfirmDialog";
import { ExerciseCard } from "@/components/gd/ExerciseCard";
import { PageHeader } from "@/components/gd/PageHeader";
import { WorkoutHeader } from "@/components/gd/WorkoutHeader";
import { Button } from "@/components/ui/button";
import { useGD, useSessionActions } from "@/hooks/use-gd";
import { ensureAppData } from "@/lib/data";
import { getExercises } from "@/lib/program-data";
import { fromISODate, getProgramDay } from "@/lib/schedule";

export const Route = createFileRoute("/_authenticated/treino/$data")({
  head: () => ({
    meta: [
      { title: "Sessão de treino — GDshape" },
      { name: "description", content: "Exercícios, séries e vídeos do treino do dia. Conclua o dia com um toque." },
      { property: "og:title", content: "Sessão de treino — GDshape" },
      { property: "og:description", content: "Exercícios, séries e vídeos do treino do dia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => ensureAppData(context.queryClient),
  component: () => (
    <AppShell hideNav>
      <SessionScreen />
    </AppShell>
  ),
});

function SessionScreen() {
  const { data } = Route.useParams();
  const navigate = useNavigate();
  const { program, today, sessionFor, prefs } = useGD();
  const { run, busy } = useSessionActions();
  const [confirm, setConfirm] = useState(false);
  const [voidOpen, setVoidOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  if (!program) return null;

  const valid = /^\d{4}-\d{2}-\d{2}$/.test(data);
  const day = valid ? getProgramDay(program.start_date, data, program.total_weeks) : null;
  const dateLabel = valid ? format(fromISODate(data), "EEEE, d 'de' MMMM", { locale: ptBR }) : "";

  if (!day || day.kind !== "training" || !day.letter || !day.phase) {
    return (
      <div>
        <PageHeader back eyebrow={dateLabel} title={day?.kind === "rest" ? "Descanso" : "Sem treino"} />
        <div className="rounded-3xl border border-border bg-card p-6 text-center">
          <Moon className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {day?.kind === "rest" ? "Dia de descanso programado. Nenhum treino a registrar." : "Esta data está fora das 16 semanas do programa."}
          </p>
          <Button asChild variant="surface" className="mt-5">
            <Link to="/inicio">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    );
  }

  const session = sessionFor(day.date);
  const exercises = getExercises(day.phase, day.letter);
  const isFuture = day.date > today;
  const isToday = day.date === today;
  const status = session?.status;

  const complete = async () => {
    const ok = await run("complete", day, session);
    if (ok) setCelebrate(true);
  };

  return (
    <div className="pb-40">
      <PageHeader back eyebrow={dateLabel} title={`Treino ${day.letter}`} />
      <WorkoutHeader letter={day.letter} phase={day.phase} week={day.week} count={exercises.length} />

      {status === "completed" && session?.completed_at && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span>
            Concluído às <strong>{format(new Date(session.completed_at), "HH:mm")}</strong>
            {!isToday && ` em ${format(new Date(session.completed_at), "dd/MM")}`}
          </span>
        </div>
      )}
      {status === "in_progress" && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm">
          <Clock className="h-5 w-5 text-primary" />
          <span>
            Em andamento desde <strong>{session?.started_at ? format(new Date(session.started_at), "HH:mm") : "—"}</strong>
          </span>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <p className="eyebrow">Exercícios na ordem original</p>
        {exercises.map((ex, i) => (
          <ExerciseCard key={i} ex={ex} index={i} compact={prefs.compactExercises} />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl safe-bottom">
        <div className="mx-auto max-w-md space-y-2 px-5 pt-3">
          {isFuture ? (
            <p className="py-3 text-center text-sm text-muted-foreground">Treino programado para {dateLabel}.</p>
          ) : status === "completed" ? (
            <div className="flex gap-2">
              <Button variant="surface" size="xl" className="flex-1" onClick={() => setVoidOpen(true)} disabled={busy}>
                <RotateCcw /> Corrigir registro
              </Button>
              <Button asChild variant="outline-neon" size="xl" className="flex-1">
                <Link to="/inicio">Início</Link>
              </Button>
            </div>
          ) : status === "in_progress" ? (
            <div className="flex gap-2">
              <Button variant="surface" size="xl" className="w-28" onClick={() => navigate({ to: "/inicio" })}>
                <Pause /> Pausar
              </Button>
              <Button variant="hero" size="xl" className="flex-1" onClick={() => setConfirm(true)} disabled={busy}>
                <Check className="!h-5 !w-5" strokeWidth={3} /> Concluir treino
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="hero" size="xl" className="flex-1" onClick={() => run("start", day)} disabled={busy}>
                <Play className="!h-5 !w-5 fill-current" /> Iniciar treino
              </Button>
              <Button variant="surface" size="xl" className="w-32" onClick={() => setConfirm(true)} disabled={busy}>
                <Check /> Concluir
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={isToday ? "Você concluiu o treino de hoje?" : "Você concluiu este treino?"}
        description={`Treino ${day.letter} · Semana ${day.week} · Fase ${day.phase}`}
        confirmLabel="Confirmar conclusão"
        onConfirm={complete}
      />
      <ConfirmDialog
        open={voidOpen}
        onOpenChange={setVoidOpen}
        title="Corrigir registro?"
        description="A conclusão deste dia será anulada e deixará de contar no progresso. O registro anulado fica guardado para manter o histórico íntegro. Você poderá registrar o dia novamente."
        confirmLabel="Anular conclusão"
        onConfirm={() => run("void", day, session)}
        destructive
      />

      {celebrate && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 px-8 text-center backdrop-blur-md" role="status">
          <div className="animate-pop flex h-28 w-28 items-center justify-center rounded-full bg-primary glow-lg">
            <Check className="h-14 w-14 text-primary-foreground" strokeWidth={3} />
          </div>
          <h2 className="mt-8 font-display text-6xl font-extrabold uppercase italic leading-none">
            Treino <span className="text-primary text-glow">concluído!</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Treino {day.letter} · {format(new Date(), "HH:mm")} · Semana {day.week}
          </p>
          <Button variant="hero" size="xl" className="mt-10 w-full max-w-xs" onClick={() => navigate({ to: "/inicio" })}>
            Voltar ao início
          </Button>
          <Button variant="link" className="mt-2 text-muted-foreground" onClick={() => setCelebrate(false)}>
            Ver treino
          </Button>
        </div>
      )}
    </div>
  );
}
