import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, Flame, Percent, Target } from "lucide-react";
import { AppShell } from "@/components/gd/AppShell";
import { PageHeader, ProfileButton } from "@/components/gd/PageHeader";
import { ProgressRing } from "@/components/gd/ProgressRing";
import { useGD } from "@/hooks/use-gd";
import { ensureAppData } from "@/lib/data";
import { LETTERS } from "@/lib/program-data";
import { completionPercent, fromISODate, scheduledTrainingDaysUntil, TOTAL_TRAINING_DAYS, trainingStreak } from "@/lib/schedule";

export const Route = createFileRoute("/_authenticated/evolucao")({
  head: () => ({
    meta: [
      { title: "Evolução — GDshape" },
      { name: "description", content: "Treinos concluídos, frequência, sequência e distribuição dos treinos A a E." },
      { property: "og:title", content: "Evolução — GDshape" },
      { property: "og:description", content: "Sua consistência ao longo das 16 semanas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => ensureAppData(context.queryClient),
  component: () => (
    <AppShell>
      <EvolutionPage />
    </AppShell>
  ),
});

const tooltipStyle = {
  contentStyle: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)", fontSize: 12 },
  cursor: { fill: "color-mix(in oklab, var(--primary) 10%, transparent)" },
};

function EvolutionPage() {
  const { program, completed, completedDates, week, profile } = useGD();

  const data = useMemo(() => {
    if (!program) return null;
    const now = new Date();
    const scheduled = scheduledTrainingDaysUntil(program.start_date, now, program.total_weeks);
    const weeksElapsed = Math.min(16, Math.max(0, week));
    const perWeek = Array.from({ length: Math.max(1, weeksElapsed) }, (_, i) => ({
      name: `S${i + 1}`,
      treinos: completed.filter((s) => s.week_number === i + 1).length,
    }));
    const monthMap = new Map<string, number>();
    for (const s of completed) monthMap.set(s.session_date.slice(0, 7), (monthMap.get(s.session_date.slice(0, 7)) ?? 0) + 1);
    const perMonth = [...monthMap.entries()].sort().map(([m, n]) => ({ name: format(fromISODate(m + "-01"), "MMM", { locale: ptBR }), treinos: n }));
    const dist = LETTERS.map((l) => ({ name: l, treinos: completed.filter((s) => s.workout_letter === l).length }));
    const freq = scheduled.length ? Math.round((completed.filter((s) => scheduled.some((d) => d.date === s.session_date)).length / scheduled.length) * 100) : 0;
    return {
      scheduledCount: scheduled.length,
      weeksElapsed,
      perWeek,
      perMonth,
      dist,
      freq,
      streak: trainingStreak(program.start_date, now, completedDates),
    };
  }, [program, completed, completedDates, week]);

  if (!program || !data) return null;
  const pct = completionPercent(completed.length);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Consistência" title="Evolução" right={<ProfileButton name={profile?.display_name} />} />

      <section className="flex items-center gap-5 rounded-3xl border border-primary/40 bg-hero p-5 glow-lg">
        <ProgressRing value={pct} size={110} stroke={10} label="concluído" />
        <div>
          <p className="eyebrow">Programa de 16 semanas</p>
          <p className="font-display text-5xl font-extrabold leading-none">
            {completed.length}
            <span className="text-xl text-muted-foreground">/{TOTAL_TRAINING_DAYS}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">treinos concluídos · descansos não contam</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Kpi icon={CalendarCheck} label="Semanas percorridas" value={`${data.weeksElapsed}`} sub="de 16" />
        <Kpi icon={Percent} label="Frequência" value={`${data.freq}%`} sub={`de ${data.scheduledCount} programados até hoje`} />
        <Kpi icon={Flame} label="Sequência atual" value={`${data.streak}`} sub={data.streak === 1 ? "treino seguido" : "treinos seguidos"} />
        <Kpi icon={Target} label="Faltam" value={`${TOTAL_TRAINING_DAYS - completed.length}`} sub="treinos para 100%" />
      </section>

      <ChartCard title="Treinos por semana" subtitle="Máximo de 5 por semana">
        <BarChart data={data.perWeek} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
          <YAxis domain={[0, 5]} ticks={[0, 5]} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="treinos" radius={[6, 6, 0, 0]} fill="var(--primary)" />
        </BarChart>
      </ChartCard>

      <ChartCard title="Frequência mensal" subtitle="Treinos concluídos por mês" empty={!data.perMonth.length}>
          <BarChart data={data.perMonth} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="treinos" radius={[6, 6, 0, 0]} fill="var(--primary-glow)" />
          </BarChart>
      </ChartCard>

      <ChartCard title="Distribuição A–E" subtitle="Quantas vezes cada treino foi concluído">
        <BarChart data={data.dist} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--foreground)", fontSize: 13, fontWeight: 700 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="treinos" radius={[6, 6, 0, 0]}>
            {data.dist.map((d, i) => (
              <Cell key={d.name} fill={i % 2 ? "var(--primary-glow)" : "var(--primary)"} />
            ))}
          </Bar>
        </BarChart>
      </ChartCard>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub }: { icon: typeof Flame; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 font-display text-4xl font-extrabold leading-none">{value}</p>
      <p className="mt-1 text-xs font-semibold">{label}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children, empty }: { title: string; subtitle: string; children: React.ReactElement; empty?: boolean }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-4">
      <p className="font-display text-xl font-bold uppercase">{title}</p>
      <p className="mb-3 text-xs text-muted-foreground">{subtitle}</p>
      <div className="h-44">
        {empty ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

function Empty() {
  return <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Sem treinos concluídos ainda.</div>;
}
