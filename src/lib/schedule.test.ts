import { describe, expect, it } from "vitest";
import {
  TOTAL_TRAINING_DAYS,
  completionPercent,
  currentWeek,
  getProgramDay,
  getWeekDays,
  normalizeStartDate,
  scheduledTrainingDaysUntil,
  trainingStreak,
} from "./schedule";

const START = "2026-11-16"; // segunda-feira

const lettersOfWeek = (w: number) => getWeekDays(START, w).map((d) => d.letter ?? "-").join("");

describe("rotação semanal", () => {
  it("semana 1 é A-B-C-D-E com sábado e domingo de descanso", () => {
    expect(lettersOfWeek(1)).toBe("ABCDE--");
  });
  it("semana 2 é B-C-D-E-A", () => expect(lettersOfWeek(2)).toBe("BCDEA--"));
  it("semana 3 é C-D-E-A-B", () => expect(lettersOfWeek(3)).toBe("CDEAB--"));
  it("semana 4 é D-E-A-B-C", () => expect(lettersOfWeek(4)).toBe("DEABC--"));
  it("a rotação de 4 semanas se repete (semana 5 = semana 1, semana 16 = semana 4)", () => {
    expect(lettersOfWeek(5)).toBe("ABCDE--");
    expect(lettersOfWeek(16)).toBe("DEABC--");
  });
  it("o treino A não fica fixo na segunda-feira", () => {
    expect(getProgramDay(START, "2026-11-23").letter).toBe("B");
  });
});

describe("fases", () => {
  it("muda de fase nas semanas 5, 9 e 13", () => {
    expect(getProgramDay(START, "2026-12-13").phase).toBe(1); // domingo da semana 4
    expect(getProgramDay(START, "2026-12-14").phase).toBe(2); // segunda da semana 5
    expect(getWeekDays(START, 9)[0].phase).toBe(3);
    expect(getWeekDays(START, 13)[0].phase).toBe(4);
    expect(getWeekDays(START, 16)[4].phase).toBe(4);
  });
  it("datas fora das 16 semanas não têm treino", () => {
    expect(getProgramDay(START, "2026-11-15").kind).toBe("outside");
    expect(getProgramDay(START, "2027-03-08").kind).toBe("outside");
  });
});

describe("programa", () => {
  it("tem 80 dias de treino nas 16 semanas", () => {
    expect(TOTAL_TRAINING_DAYS).toBe(80);
    expect(scheduledTrainingDaysUntil(START, new Date(2030, 0, 1))).toHaveLength(80);
  });
  it("percentual considera 80 dias", () => {
    expect(completionPercent(40)).toBe(50);
    expect(completionPercent(80)).toBe(100);
  });
  it("início é ajustado para a segunda-feira da semana escolhida", () => {
    expect(normalizeStartDate(new Date(2026, 10, 19))).toBe("2026-11-16");
  });
  it("semana atual é calculada a partir do início", () => {
    expect(currentWeek(START, new Date(2026, 10, 16))).toBe(1);
    expect(currentWeek(START, new Date(2026, 10, 30))).toBe(3);
  });
  it("descansos não quebram a sequência de treinos", () => {
    const done = new Set(["2026-11-19", "2026-11-20", "2026-11-23"]);
    // segunda 23 (hoje registrado), descanso 21-22 ignorado
    expect(trainingStreak(START, new Date(2026, 10, 23), done)).toBe(3);
    // terça 24 ainda sem registro não quebra
    expect(trainingStreak(START, new Date(2026, 10, 24), done)).toBe(3);
  });
});
