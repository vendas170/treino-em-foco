import { describe, expect, it } from "vitest";
import { activeSessionFor, buildSessionChange, type SessionRow } from "./data";
import { getProgramDay } from "./schedule";

const START = "2026-11-16";
const base = { userId: "u1", programId: "p1", today: "2026-11-18" };

function row(partial: Partial<SessionRow>): SessionRow {
  return {
    id: "s1", user_id: "u1", program_id: "p1", session_date: "2026-11-18", workout_letter: "C",
    week_number: 1, phase_number: 1, status: "completed", started_at: null, completed_at: "x",
    voided_at: null, created_at: "x", updated_at: "x", ...partial,
  };
}

describe("conclusão diária", () => {
  it("salva data, treino, semana e fase do dia", () => {
    const r = buildSessionChange("complete", { ...base, day: getProgramDay(START, "2026-11-18") });
    expect(r).toMatchObject({ session_date: "2026-11-18", workout_letter: "C", week_number: 1, phase_number: 1, status: "completed" });
  });
  it("não permite concluir o mesmo dia duas vezes", () => {
    expect(() =>
      buildSessionChange("complete", { ...base, day: getProgramDay(START, "2026-11-18"), existing: row({}) }),
    ).toThrow();
  });
  it("não registra treinos em dias de descanso nem futuros", () => {
    expect(() => buildSessionChange("complete", { ...base, day: getProgramDay(START, "2026-11-21") })).toThrow();
    expect(() => buildSessionChange("complete", { ...base, day: getProgramDay(START, "2026-11-19") })).toThrow();
  });
  it("concluir uma sessão em andamento reaproveita o mesmo registro", () => {
    const existing = row({ status: "in_progress", completed_at: null });
    const r = buildSessionChange("complete", { ...base, day: getProgramDay(START, "2026-11-18"), existing });
    expect(r.id).toBe("s1");
    expect(r.status).toBe("completed");
  });
  it("corrigir anula o registro sem apagá-lo, liberando o dia", () => {
    const r = buildSessionChange("void", { ...base, day: getProgramDay(START, "2026-11-18"), existing: row({}) });
    expect(r.status).toBe("voided");
    expect(activeSessionFor([{ ...row({}), ...r } as SessionRow], "p1", "2026-11-18")).toBeUndefined();
  });
});
