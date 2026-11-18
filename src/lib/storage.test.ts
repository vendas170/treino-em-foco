import { beforeEach, describe, expect, it } from "vitest";
import {
  buildSessionChange,
  exportBackup,
  importBackup,
  loadStore,
  saveSession,
  startProgram,
  LOCAL_USER_ID,
} from "./data";
import { getProgramDay } from "./schedule";

const START = "2026-11-16";
const TODAY = "2026-11-18";

beforeEach(() => localStorage.clear());

function complete(programId: string, date = TODAY) {
  return buildSessionChange("complete", { userId: LOCAL_USER_ID, programId, day: getProgramDay(START, date), today: TODAY });
}

describe("armazenamento sem login", () => {
  it("o registro continua salvo depois de reabrir o app", () => {
    const p = startProgram(START);
    saveSession(complete(p.id));
    const reopened = loadStore();
    expect(reopened.sessions).toHaveLength(1);
    expect(reopened.sessions[0]).toMatchObject({ session_date: TODAY, workout_letter: "C", week_number: 1, phase_number: 1, status: "completed" });
  });

  it("impede dois registros válidos para o mesmo dia e programa", () => {
    const p = startProgram(START);
    saveSession(complete(p.id));
    expect(() => saveSession(complete(p.id))).toThrow("Este dia já possui um registro.");
  });

  it("após anular, o mesmo dia pode ser registrado de novo", () => {
    const p = startProgram(START);
    const first = complete(p.id);
    saveSession(first);
    saveSession({ ...first, status: "voided", voided_at: "x" });
    expect(() => saveSession(complete(p.id))).not.toThrow();
  });

  it("redefinir o programa arquiva o anterior e mantém o histórico", () => {
    const p1 = startProgram(START);
    saveSession(complete(p1.id));
    startProgram("2026-12-07");
    const s = loadStore();
    expect(s.programs.filter((p) => p.status === "active")).toHaveLength(1);
    expect(s.programs.find((p) => p.id === p1.id)?.status).toBe("archived");
    expect(s.sessions).toHaveLength(1);
  });

  it("backup restaura os mesmos treinos", () => {
    const p = startProgram(START);
    saveSession(complete(p.id));
    const file = exportBackup();
    localStorage.clear();
    expect(loadStore().sessions).toHaveLength(0);
    importBackup(file);
    expect(loadStore().sessions).toHaveLength(1);
  });

  it("recusa arquivo de backup inválido", () => {
    expect(() => importBackup("{}")).toThrow();
    expect(() => importBackup("not json")).toThrow();
  });
});
