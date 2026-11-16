import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, CircleDot, Circle, Flame, Info, Repeat } from "lucide-react";
import { AppShell } from "@/components/gd/AppShell";
import { PageHeader } from "@/components/gd/PageHeader";
import { useGD } from "@/hooks/use-gd";
import { ensureAppData } from "@/lib/data";
import { FINAL_NOTES, GENERAL_GUIDELINES, PHASES, ROTATION_NOTE, TECHNIQUES } from "@/lib/program-data";
import { fromISODate } from "@/lib/schedule";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/programa")({
  head: () => ({
    meta: [
      { title: "Meu programa — GDshape" },
      { name: "description", content: "As quatro fases das 16 semanas, objetivos e recomendações técnicas." },
      { property: "og:title", content: "Meu programa — GDshape" },
      { property: "og:description", content: "As quatro fases das 16 semanas e recomendações técnicas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => ensureAppData(context.queryClient),
  component: () => (
    <AppShell>
      <ProgramPage />
    </AppShell>
  ),
});

function ProgramPage() {
  const { program, week } = useGD();
  if (!program) return null;
  return (
    <div className="space-y-6">
      <PageHeader back eyebrow="16 semanas · 4 fases" title="Meu programa" />
      <section className="rounded-2xl border border-border bg-card p-4 text-sm">
        <p className="eyebrow mb-1">{program.name}</p>
        <p className="text-muted-foreground">
          Início em <strong className="text-foreground">{format(fromISODate(program.start_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</strong>
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">{GENERAL_GUIDELINES}</p>
      </section>

      <ol className="relative space-y-3">
        {PHASES.map((p) => {
          const status = week > p.weeks[1] ? "done" : week >= p.weeks[0] ? "current" : "next";
          const Icon = status === "done" ? CheckCircle2 : status === "current" ? CircleDot : Circle;
          return (
            <li
              key={p.number}
              className={cn(
                "rounded-2xl border bg-card p-5",
                status === "current" ? "border-primary/60 glow-md" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">Semanas {p.weeks[0]}–{p.weeks[1]}</p>
                  <h2 className="font-display text-2xl font-extrabold uppercase italic leading-tight">
                    Fase {p.number} · {p.name}
                  </h2>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                    status === "current" ? "bg-primary text-primary-foreground" : status === "done" ? "bg-primary/15 text-primary" : "bg-surface-raised text-muted-foreground",
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {status === "current" ? "Em andamento" : status === "done" ? "Concluída" : "Próxima"}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold">Objetivo: <span className="font-normal text-muted-foreground">{p.goal}</span></p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </li>
          );
        })}
      </ol>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-display text-xl font-bold uppercase"><Repeat className="h-5 w-5 text-primary" /> Sistema de rotação</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ROTATION_NOTE}</p>
        <div className="mt-4 grid grid-cols-6 gap-1 text-center text-xs font-bold">
          <span />
          {["SEG", "TER", "QUA", "QUI", "SEX"].map((d) => <span key={d} className="text-muted-foreground">{d}</span>)}
          {["ABCDE", "BCDEA", "CDEAB", "DEABC"].map((row, i) => (
            <Row key={row} label={`S${i + 1}`} row={row} />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Sábado e domingo: descanso. A sequência se repete a cada 4 semanas.</p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-display text-xl font-bold uppercase"><Flame className="h-5 w-5 text-primary" /> Técnicas avançadas</h3>
        <ul className="mt-3 space-y-3">
          {TECHNIQUES.map((t) => (
            <li key={t.name} className="text-sm">
              <strong className="text-primary">{t.name}:</strong> <span className="text-muted-foreground">{t.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-display text-xl font-bold uppercase"><Info className="h-5 w-5 text-primary" /> Observações finais</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {FINAL_NOTES.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </section>
    </div>
  );
}

function Row({ label, row }: { label: string; row: string }) {
  return (
    <>
      <span className="py-1.5 text-muted-foreground">{label}</span>
      {row.split("").map((l, i) => (
        <span key={i} className={cn("rounded-md py-1.5 font-display text-base", l === "A" ? "bg-primary/20 text-primary" : "bg-surface-raised")}>{l}</span>
      ))}
    </>
  );
}
