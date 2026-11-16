import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, CheckCircle2, Moon, Play, Quote, Trophy } from "lucide-react";
import { AppShell } from "@/components/gd/AppShell";
import { Wordmark } from "@/components/gd/Logo";
import { ProfileButton } from "@/components/gd/PageHeader";
import { ProgressRing } from "@/components/gd/ProgressRing";
import { WeekStrip } from "@/components/gd/WeekStrip";
import { Button } from "@/components/ui/button";
import { useGD } from "@/hooks/use-gd";
import { ensureAppData } from "@/lib/data";
import { motivationFor } from "@/lib/motivation";
import { PHASES, WORKOUTS } from "@/lib/program-data";
import { completionPercent, fromISODate, getProgramDay, getWeekDays, TOTAL_TRAINING_DAYS } from "@/lib/schedule";
import { addDays } from "date-fns";

export const Route = createFileRoute("/_authenticated/inicio")({
  head: () => ({
    meta: [
      { title: "Início — GDshape" },
      { name: "description", content: "Seu treino de hoje, a semana atual e o progresso das 16 semanas." },
      { property: "og:title", content: "Início — GDshape" },
      { property: "og:description", content: "Seu treino de hoje e o progresso das 16 semanas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => ensureAppData(context.queryClient),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function nextTrainingDay(start: string, from: string) {
  let d = fromISODate(from);
  for (let i = 1; i <= 7; i++) {
    d = addDays(d, 1);
    const pd = getProgramDay(start, d);
    if (pd.kind === "training") return pd;
    if (pd.kind === "outside" && pd.date > start) return null;
  }
  return null;
}

function Dashboard() {
  const gd = useGD();
  const { program, profile, todayDay, today, week, weekClamped, phase, completed, sessionFor, prefs } = gd;
  if (!program || !todayDay) return null;

  const firstName = (profile?.display_name ?? "").split(" ")[0] || "atleta";
  const pct = completionPercent(completed.length);
  const days = getWeekDays(program.start_date, weekClamped);
  const remaining = days.filter((d) => d.kind === "training" && d.date >= today && sessionFor(d.date)?.status !== "completed").length;
  const todaySession = sessionFor(today);
  const phaseInfo = PHASES[phase - 1];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between pt-2">
        <Wordmark size="sm" />
        <ProfileButton name={profile?.display_name} />
      </header>

      <section>
        <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
        <h1 className="font-display text-3xl font-bold uppercase leading-tight">
          Olá, <span className="text-primary">{firstName}</span>
        </h1>
        {week >= 1 && week <= 16 && (
          <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary glow-sm" />
            Semana {week} de 16 · Fase {phase}
          </span>
        )}
      </section>

      <TodayCard />

      <section className="grid grid-cols-3 gap-3">
        <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-3">
          <ProgressRing value={pct} size={84} label="Programa" />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-3">
          <Stat label="Concluídos" value={`${completed.length}`} sub={`de ${TOTAL_TRAINING_DAYS}`} />
          <Stat label="Restam na semana" value={`${remaining}`} sub={remaining === 1 ? "treino" : "treinos"} />
          <Link to="/programa" className="col-span-2 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
            <div>
              <p className="eyebrow">Fase {phase} · Semanas {phaseInfo.weeks[0]}–{phaseInfo.weeks[1]}</p>
              <p className="font-display text-xl font-bold uppercase">{phaseInfo.name}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary" />
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow">Progresso semanal</p>
          <p className="text-xs font-semibold text-muted-foreground">Semana {weekClamped}</p>
        </div>
        <WeekStrip days={days} sessionFor={sessionFor} today={today} />
      </section>

      {prefs.showMotivation && (
        <p className="flex items-start gap-2 px-1 text-sm italic text-muted-foreground">
          <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {motivationFor(today)}
        </p>
      )}
      {todaySession?.status === "completed" && <span className="sr-only">Treino de hoje concluído</span>}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <p className="eyebrow">{label}</p>
      <p className="font-display text-3xl font-extrabold leading-none">
        {value} {sub && <span className="text-sm font-semibold text-muted-foreground">{sub}</span>}
      </p>
    </div>
  );
}

function TodayCard() {
  const { program, todayDay, today, week, sessionFor, completed } = useGD();
  if (!program || !todayDay) return null;
  const session = sessionFor(today);

  if (todayDay.kind === "outside") {
    const before = week === 0;
    return (
      <section className="relative overflow-hidden rounded-3xl border border-border bg-hero p-6">
        {before ? (
          <>
            <p className="eyebrow">Contagem regressiva</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold uppercase italic leading-none">Programa começa</h2>
            <p className="mt-2 text-lg font-semibold text-primary">
              {format(fromISODate(program.start_date), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </>
        ) : (
          <>
            <Trophy className="h-10 w-10 text-primary" />
            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase italic leading-none">16 semanas completas</h2>
            <p className="mt-2 text-sm text-muted-foreground">Você concluiu {completed.length} de 80 treinos. Inicie um novo ciclo no seu perfil.</p>
          </>
        )}
      </section>
    );
  }

  if (todayDay.kind === "rest") {
    const next = nextTrainingDay(program.start_date, today);
    return (
      <section className="relative overflow-hidden rounded-3xl border border-border bg-hero p-6">
        <Moon className="h-9 w-9 text-muted-foreground" />
        <p className="eyebrow mt-4">Hoje</p>
        <h2 className="font-display text-5xl font-extrabold uppercase italic leading-none">Descanso</h2>
        <p className="mt-2 text-sm text-muted-foreground">Recuperação também é treino. Durma bem e alimente-se.</p>
        {next?.letter && (
          <p className="mt-4 text-sm">
            Próximo: <strong className="text-primary">Treino {next.letter}</strong> · {WORKOUTS[next.letter].muscles} ·{" "}
            {format(fromISODate(next.date), "EEEE", { locale: ptBR })}
          </p>
        )}
      </section>
    );
  }

  const letter = todayDay.letter!;
  const done = session?.status === "completed";
  const inProgress = session?.status === "in_progress";
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/40 bg-hero p-6 glow-lg">
      <span className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[12rem] font-extrabold italic leading-none text-primary/10">
        {letter}
      </span>
      <div className="neon-line absolute inset-x-0 top-0" />
      <p className="eyebrow relative text-primary">{done ? "Treino de hoje concluído" : inProgress ? "Treino em andamento" : "Hoje é dia de treino"}</p>
      <h2 className="relative mt-3 font-display text-6xl font-extrabold uppercase italic leading-[0.85]">
        Treino <span className="text-primary text-glow">{letter}</span>
      </h2>
      <p className="relative mt-2 font-display text-2xl font-bold uppercase tracking-wide text-foreground/90">{WORKOUTS[letter].muscles}</p>
      <div className="relative mt-6">
        {done ? (
          <Button asChild variant="surface" size="xl" className="w-full">
            <Link to="/treino/$data" params={{ data: today }}>
              <CheckCircle2 className="!h-5 !w-5 text-primary" /> Concluído · ver treino
            </Link>
          </Button>
        ) : (
          <Button asChild variant="hero" size="xl" className="w-full">
            <Link to="/treino/$data" params={{ data: today }}>
              <Play className="!h-5 !w-5 fill-current" /> {inProgress ? "Continuar treino" : "Iniciar treino"}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}
