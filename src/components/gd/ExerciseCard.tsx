import { AlertTriangle, Flame, PlayCircle } from "lucide-react";
import type { Exercise } from "@/lib/program-data";
import { formatSetSummary } from "@/lib/exercise-summary";
import { cn } from "@/lib/utils";

const TECHNIQUE = /drop|rest pause|cluster/i;

// `compact` mantido por compatibilidade: o cartão agora é sempre resumido.
export function ExerciseCard({ ex, index }: { ex: Exercise; index: number; compact?: boolean }) {
  const techniques = Array.from(
    new Set(ex.sets.flatMap((s) => s.split(" · ").filter((p) => TECHNIQUE.test(p)))),
  );
  return (
    <article className={cn("overflow-hidden rounded-2xl border bg-card p-4", ex.pending ? "border-primary/30" : "border-border")}>
      <div className="flex items-start gap-3">
        <span className="font-display text-3xl font-extrabold italic leading-none text-primary/90 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={cn("font-semibold uppercase leading-snug", ex.pending && "text-primary")}>{ex.name}</h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{formatSetSummary(ex.sets)}</p>
          {techniques.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {techniques.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-md bg-primary/12 px-2 py-0.5 text-[11px] font-bold text-primary">
                  <Flame className="h-3 w-3" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {(ex.warmup || ex.note || ex.pending || ex.videos.length > 0) && (
        <div className="mt-3 space-y-3">
          {ex.warmup && (
            <div className="flex items-center justify-between rounded-xl bg-surface-raised px-3 py-2 text-sm">
              <span className="eyebrow">Aquecimento</span>
              <span className="font-semibold">{ex.warmup}</span>
            </div>
          )}
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
