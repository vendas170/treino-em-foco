import { useState } from "react";
import { AlertTriangle, ChevronDown, Flame, PlayCircle } from "lucide-react";
import { SET_LABELS, type Exercise } from "@/lib/program-data";
import { cn } from "@/lib/utils";

function setTone(label: string) {
  if (/drop|rest pause|cluster/i.test(label)) return "technique";
  if (/back-off/i.test(label)) return "backoff";
  if (/working/i.test(label)) return "working";
  if (/feeder/i.test(label)) return "feeder";
  return "plain";
}

export function ExerciseCard({ ex, index, compact }: { ex: Exercise; index: number; compact?: boolean }) {
  const [open, setOpen] = useState(!compact);
  const techniques = ex.sets.filter((s) => setTone(s) === "technique");
  return (
    <article className={cn("overflow-hidden rounded-2xl border bg-card", ex.pending ? "border-primary/30" : "border-border")}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-3 p-4 text-left">
        <span className="font-display text-3xl font-extrabold italic leading-none text-primary/90 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={cn("font-semibold leading-snug", ex.pending && "text-primary")}>{ex.name}</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-surface-raised px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
              {ex.sets.length} {ex.sets.length === 1 ? "bloco" : "séries"}
            </span>
            {techniques.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-md bg-primary/12 px-2 py-0.5 text-[11px] font-bold text-primary">
                <Flame className="h-3 w-3" />
                {t.split(" · ").find((p) => /drop|rest pause|cluster/i.test(p))}
              </span>
            ))}
          </div>
        </div>
        <ChevronDown className={cn("mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-3 px-4 pb-4">
          {ex.warmup && (
            <div className="flex items-center justify-between rounded-xl bg-surface-raised px-3 py-2 text-sm">
              <span className="eyebrow">Aquecimento</span>
              <span className="font-semibold">{ex.warmup}</span>
            </div>
          )}
          <ol className="space-y-1.5">
            {ex.sets.map((s, i) => {
              const tone = setTone(s);
              return (
                <li key={i} className="flex gap-3 rounded-xl border border-border bg-background/40 px-3 py-2">
                  <span className="w-14 shrink-0 pt-0.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {ex.sets.length === 1 ? "Séries" : SET_LABELS[i]}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium leading-snug",
                      tone === "working" && "text-foreground",
                      tone === "feeder" && "text-muted-foreground",
                      tone === "technique" && "text-primary-glow",
                      tone === "backoff" && "text-foreground",
                      s.includes("PENDENTE") && "text-primary",
                    )}
                  >
                    {s}
                  </span>
                </li>
              );
            })}
          </ol>
          {ex.note && <p className="text-xs text-muted-foreground">{ex.note}</p>}
          {ex.pending && (
            <p className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/8 px-3 py-2 text-xs text-primary">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                <strong>PENDENTE DE CONFIRMAÇÃO.</strong> {ex.pending}
              </span>
            </p>
          )}
          {ex.videos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ex.videos.map((v, i) => (
                <a
                  key={v + i}
                  href={v}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10"
                >
                  <PlayCircle className="h-4 w-4" />
                  {ex.videos.length > 1 ? `Vídeo ${i + 1}` : "Ver vídeo"}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
