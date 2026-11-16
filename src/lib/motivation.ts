const MESSAGES = [
  "Disciplina é fazer o que precisa ser feito, mesmo sem vontade.",
  "Consistência vence intensidade ocasional.",
  "Cada treino concluído é um tijolo a mais.",
  "O corpo alcança o que a mente sustenta.",
  "Execução perfeita, carga progressiva.",
  "Hoje conta. Amanhã agradece.",
  "Sem atalhos. Só trabalho.",
];
export function motivationFor(date: string) {
  const n = date.split("-").reduce((a, b) => a + Number(b), 0);
  return MESSAGES[n % MESSAGES.length];
}
