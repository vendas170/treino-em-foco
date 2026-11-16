import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/gd/AppShell";
import { ExerciseCard } from "@/components/gd/ExerciseCard";
import { PageHeader } from "@/components/gd/PageHeader";
import { WorkoutHeader } from "@/components/gd/WorkoutHeader";
import { Button } from "@/components/ui/button";
import { useGD } from "@/hooks/use-gd";
import { ensureAppData } from "@/lib/data";
import { LETTERS, PHASES, getExercises, type WorkoutLetter } from "@/lib/program-data";

export const Route = createFileRoute("/_authenticated/ficha/$fase/$letra")({
  head: () => ({
    meta: [
      { title: "Ficha de treino — GDshape" },
      { name: "description", content: "Exercícios, séries, técnicas e vídeos de um treino do programa." },
      { property: "og:title", content: "Ficha de treino — GDshape" },
      { property: "og:description", content: "Exercícios, séries e vídeos de um treino do programa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => ensureAppData(context.queryClient),
  component: () => (
    <AppShell>
      <Sheet />
    </AppShell>
  ),
});

function Sheet() {
  const { fase, letra } = Route.useParams();
  const { prefs, todayDay, phase: currentPhase, today } = useGD();
  const phase = Number(fase);
  const letter = letra.toUpperCase() as WorkoutLetter;
  if (!PHASES[phase - 1] || !LETTERS.includes(letter)) {
    return (
      <div>
        <PageHeader back title="Treino não encontrado" />
        <Button asChild variant="surface"><Link to="/treinos">Ver treinos</Link></Button>
      </div>
    );
  }
  const exercises = getExercises(phase, letter);
  const isToday = todayDay?.letter === letter && phase === currentPhase;
  return (
    <div>
      <PageHeader back eyebrow={`Fase ${phase} · Semanas ${PHASES[phase - 1].weeks.join("–")}`} title={`Treino ${letter}`} />
      <WorkoutHeader letter={letter} phase={phase} count={exercises.length} />
      {isToday && (
        <Button asChild variant="hero" size="xl" className="mt-4 w-full">
          <Link to="/treino/$data" params={{ data: today }}>Abrir treino de hoje</Link>
        </Button>
      )}
      <div className="mt-6 space-y-3">
        {exercises.map((ex, i) => (
          <ExerciseCard key={i} ex={ex} index={i} compact={prefs.compactExercises} />
        ))}
      </div>
    </div>
  );
}
