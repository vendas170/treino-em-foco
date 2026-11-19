// Resumo "N séries • X a Y repetições" a partir das prescrições cadastradas (sem alterar os dados).
const REPS = /(\d+)(?:\s*a\s*(\d+))?\s*reps\b/i;

function repsOf(set: string): string | null {
  const m = set.match(REPS);
  if (!m) return null;
  return m[2] ? `${m[1]} a ${m[2]}` : m[1];
}

export function summarizeSets(sets: string[]): { count: number; reps: string | null } {
  // Bloco único no formato "4x 15 a 20 reps".
  if (sets.length === 1) {
    const m = sets[0].match(/^(\d+)x\s/i);
    if (m) return { count: Number(m[1]), reps: repsOf(sets[0]) };
  }
  // Prescrição principal: primeiro Working Set com repetições; senão, qualquer série que não seja Feeder.
  const main =
    sets.find((s) => /working/i.test(s) && repsOf(s)) ??
    sets.find((s) => !/feeder/i.test(s) && repsOf(s));
  return { count: sets.length, reps: main ? repsOf(main) : null };
}

export function formatSetSummary(sets: string[]): string {
  const { count, reps } = summarizeSets(sets);
  const s = `${count} ${count === 1 ? "série" : "séries"}`;
  return reps ? `${s} • ${reps} repetições` : s;
}
