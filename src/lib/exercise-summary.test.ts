import { describe, expect, it } from "vitest";
import { formatSetSummary } from "./exercise-summary";

describe("resumo de séries do exercício", () => {
  it("conta todas as séries e usa as repetições do Working Set (Mesa Flexora)", () => {
    expect(
      formatSetSummary([
        "Feeder Set 1 · 5 a 6 reps",
        "Working Set 1 · 10 a 12 reps",
        "Working Set 2 · 10 a 12 reps",
        "Working Set 3 · 10 a 12 reps",
      ]),
    ).toBe("4 séries • 10 a 12 repetições");
  });

  it("lê o bloco único '4x 15 a 20 reps'", () => {
    expect(formatSetSummary(["4x 15 a 20 reps"])).toBe("4 séries • 15 a 20 repetições");
  });

  it("não inventa repetições quando não há prescrição", () => {
    expect(formatSetSummary(["PENDENTE DE CONFIRMAÇÃO"])).toBe("1 série");
  });
});
