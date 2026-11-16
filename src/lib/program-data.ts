// Conteúdo oficial extraído do PDF "Treino Pedro Lucas" (Rotação Semanal — Treino Avançado Masculino).
// Não editar à mão sem conferir o PDF: séries, nomes e vídeos seguem o documento original.
export type WorkoutLetter = "A" | "B" | "C" | "D" | "E";

export interface Exercise {
  name: string;
  warmup?: string;
  sets: string[];
  videos: string[];
  note?: string;
  pending?: string;
}

export const PENDING_LABEL = "PENDENTE DE CONFIRMAÇÃO";

export const WORKOUTS: Record<WorkoutLetter, { title: string; muscles: string }> = {
  A: { title: "Treino A", muscles: "Peito e Tríceps" },
  B: { title: "Treino B", muscles: "Quadríceps e Panturrilha" },
  C: { title: "Treino C", muscles: "Costas e Bíceps" },
  D: { title: "Treino D", muscles: "Posteriores e Glúteo" },
  E: { title: "Treino E", muscles: "Ombros e Braços" },
};

export const LETTERS: WorkoutLetter[] = ["A", "B", "C", "D", "E"];

export interface Phase {
  number: 1 | 2 | 3 | 4;
  name: string;
  weeks: [number, number];
  description: string;
  goal: string;
}

export const PHASES: Phase[] = [
  {
    number: 1,
    name: "Adaptação Técnica",
    weeks: [1, 4],
    description:
      "Concentre-se em dominar a execução técnica de cada exercício. Este microciclo estabelece suas cargas de trabalho base. Não force progressões bruscas.",
    goal: "Dominar a técnica e estabelecer as cargas de trabalho base.",
  },
  {
    number: 2,
    name: "Aumento de Volume",
    weeks: [5, 8],
    description:
      "O volume aumenta significativamente. Técnicas avançadas como drop sets e rest-pause são introduzidas. Mantenha a qualidade de execução mesmo sob fadiga.",
    goal: "Aumentar o volume e introduzir técnicas avançadas.",
  },
  {
    number: 3,
    name: "Pico de Volume",
    weeks: [9, 12],
    description:
      "Pico de volume e máxima aplicação de intensificadores. Este é o período mais exigente — alimentação e sono tornam-se ainda mais determinantes para resultados.",
    goal: "Atingir o pico de volume com intensificadores.",
  },
  {
    number: 4,
    name: "Força e Densidade",
    weeks: [13, 16],
    description:
      "Redução de volume com cargas absolutas mais elevadas. Foco em força e densidade muscular. Menor quantidade de exercícios, maior intensidade por série.",
    goal: "Cargas mais elevadas, foco em força e densidade muscular.",
  },
];

export const GENERAL_GUIDELINES =
  "Este programa foi desenvolvido para praticantes com experiência sólida em treinamento resistido. A rotação de 5 dias consecutivos exige alta capacidade de recuperação e adaptação ao volume acumulado.";

export const ROTATION_NOTE =
  "O treino inicial da semana muda a cada 7 dias. Semana 1 inicia com Treino A, Semana 2 com Treino B, Semana 3 com Treino C, e assim sucessivamente. Esta variação garante que cada grupo muscular seja trabalhado em diferentes estados de fadiga sistêmica ao longo do mês, otimizando o estímulo de crescimento.";

export const TECHNIQUES: { name: string; text: string }[] = [
  {
    name: "Drop Sets",
    text: "Utilize primariamente em exercícios de isolamento nos finais dos treinos. Em exercícios compostos pesados (agachamento livre, supino livre), evite esta técnica devido ao risco de falha técnica sob fadiga extrema.",
  },
  {
    name: "Rest-Pause",
    text: "Ideal para movimentos compostos em máquinas que permitem pausa segura (leg press, supino máquina, remadas). Fragmenta uma série pesada em mini-séries de 15-20 segundos de intervalo.",
  },
  {
    name: "Tempo Sob Tensão",
    text: "A cadência controlada é especialmente importante na fase excêntrica. Mínimo de 2-3 segundos na descida de qualquer exercício, mesmo quando não explicitamente programado.",
  },
];

export const FINAL_NOTES = [
  "Siga a planilha conforme programado. A ordem dos exercícios, número de séries e faixas de repetições foram estruturados estrategicamente. Modificações arbitrárias comprometem a eficácia do programa.",
  "Assista aos vídeos demonstrativos de cada exercício antes de executar. A referência visual é determinante para execução correta.",
];

export const SET_LABELS = ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5"];

type PhaseWorkouts = Record<WorkoutLetter, Exercise[]>;

const RAW: Exercise[][][] = [
  [
    [
      {
        "name": "Supino Inclinado (halter/Smith/máquina)",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 6 a 8 reps",
          "Working Set 2 · Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições com 20seg de intervalo",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=gtc384aM-90&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=30"
        ]
      },
      {
        "name": "Supino Reto (halter/Smith/máquina)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 8 a 10 reps",
          "Working Set 2 · 8 a 10 reps",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=XsgR_hm8AWA&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=28"
        ]
      },
      {
        "name": "Crucifixo Reto (halter/cabo/máquina)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 8 a 10 reps",
          "Working Set 2 · Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=uQIPgsELvgs&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH"
        ]
      },
      {
        "name": "Crossover/Crucifixo Declinado",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=tcwMNq8QkEU&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=53"
        ]
      },
      {
        "name": "Elevações Laterais (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=qIq5thMEws0&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=45"
        ]
      },
      {
        "name": "Tríceps Testa com Barra W",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=ERxhR3rxkns&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=40"
        ]
      },
      {
        "name": "Tríceps Francês (halter/banco)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=MK51n80n-q8&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=41"
        ]
      },
      {
        "name": "Tríceps Corda no Cabo",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=sgs7VfTbhfk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=3"
        ]
      }
    ],
    [
      {
        "name": "Cadeira Abdutora",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=_p2pyypglbU&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=9"
        ]
      },
      {
        "name": "Cadeira Extensora",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=BHxNa16VQ7A&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=49"
        ]
      },
      {
        "name": "Agachamento (Smith/livre/hack)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=7c_xinLJVZM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=5"
        ]
      },
      {
        "name": "Avanço (livre/halter/Smith)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=waPu1q3VhrM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=1"
        ]
      },
      {
        "name": "Leg Press",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=B0swveEoTnU&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=14"
        ]
      },
      {
        "name": "Panturrilha em Pé",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=xU9KCMZkoxo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=67"
        ]
      },
      {
        "name": "Panturrilha no Leg Press ou sentado",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      },
      {
        "name": "Abdominal Crunch",
        "warmup": "Obs: usar peso",
        "sets": [
          "4x 15 a 20 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=27hLFDTivBg&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=73"
        ]
      },
      {
        "name": "PENDENTE DE CONFIRMAÇÃO",
        "sets": [
          "4x 15 a 20 reps"
        ],
        "pending": "Nome do exercício não aparece no PDF",
        "videos": [
          "https://www.youtube.com/watch?v=GQ3sn5J8_9g"
        ]
      }
    ],
    [
      {
        "name": "Puxada Alta Supinada Aberta",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=Uj58KaUkEEQ&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=29"
        ]
      },
      {
        "name": "Puxada Alta com Triângulo",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": [
          "https://www.youtube.com/watch?v=WDwg-G7kY3c&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=28"
        ]
      },
      {
        "name": "Remada Curvada Supinada",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": [
          "https://www.youtube.com/watch?v=DyCqe7vy_b8&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=21"
        ]
      },
      {
        "name": "Remada Baixa com Triângulo",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": [
          "https://www.youtube.com/watch?v=yZtFixy6_ek&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=24"
        ]
      },
      {
        "name": "Pull Down",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=FyDqMjggYMw&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=30"
        ]
      },
      {
        "name": "Crucifixo Inverso (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=7EGNBHUpPyo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=45"
        ]
      },
      {
        "name": "Rosca alternada Banco 45°",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=xcDpo1Ubi5k&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=68"
        ]
      },
      {
        "name": "Rosca Scott",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=08htJeRN7vM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=55"
        ]
      },
      {
        "name": "PENDENTE DE CONFIRMAÇÃO",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "pending": "Nome do exercício não aparece no PDF",
        "videos": [
          "https://www.youtube.com/watch?v=i9ySLhYYdpE"
        ]
      }
    ],
    [
      {
        "name": "Cadeira Flexora",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=Mqe6s-ueopo&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=34"
        ]
      },
      {
        "name": "Mesa Flexora",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=zICWI7KY2tk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=33"
        ]
      },
      {
        "name": "Stiff (barra/halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=u-Ha_ZO4Y_0&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=10"
        ]
      },
      {
        "name": "Agachamento Búlgaro",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=2y6yH4m_nIY&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=2"
        ]
      },
      {
        "name": "Elevações Pélvicas",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições com 20seg de intervalo",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=JSRjx5pB5aM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=11"
        ]
      },
      {
        "name": "Panturrilha no Leg Press",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps",
          "Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      },
      {
        "name": "Abdominal Crunch",
        "warmup": "Obs: usar peso",
        "sets": [
          "4x 15 a 20 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=27hLFDTivBg&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=73"
        ]
      },
      {
        "name": "PENDENTE DE CONFIRMAÇÃO",
        "sets": [
          "4x 15 a 20 reps"
        ],
        "pending": "Nome do exercício não aparece no PDF",
        "videos": [
          "https://www.youtube.com/watch?v=GQ3sn5J8_9g"
        ]
      }
    ],
    [
      {
        "name": "Desenvolvimento (halter)",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 6 a 8 reps",
          "Working Set 2 · Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=bFuat5b4QFA&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=49"
        ]
      },
      {
        "name": "Elevações Laterais (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=nxCKW-unul0&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=64"
        ]
      },
      {
        "name": "Elevações Frontais (banco 75°)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": []
      },
      {
        "name": "Crucifixo Inverso (banco 75°)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=7EGNBHUpPyo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=45"
        ]
      },
      {
        "name": "Tríceps Francês (cabo/halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=4piO_WPmCCE&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=39"
        ]
      },
      {
        "name": "Tríceps Testa (barra W/halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=ERxhR3rxkns&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=40"
        ]
      },
      {
        "name": "Tríceps Corda",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=sgs7VfTbhfk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=3"
        ]
      },
      {
        "name": "Rosca Scott",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=08htJeRN7vM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=55"
        ]
      },
      {
        "name": "Rosca Martelo (corda)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=GJsi_Yw1TPo&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=12"
        ]
      },
      {
        "name": "Panturrilha Leg Press",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps (+ 10 reps parciais em alongamento)",
          "Working Set 2 · 10 a 12 reps (+ 10 reps parciais em alongamento)",
          "Working Set 2 · 10 a 12 reps (+ 10 reps parciais em alongamento)"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      }
    ]
  ],
  [
    [
      {
        "name": "Supino Inclinado (halter/Smith/máquina)",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 6 a 8 reps",
          "Working Set 2 · Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições com 15seg de intervalo",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=gtc384aM-90&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=30"
        ]
      },
      {
        "name": "Supino Reto (halter/Smith/máquina)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 8 a 10 reps",
          "Working Set 2 · 8 a 10 reps",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=XsgR_hm8AWA&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=28"
        ]
      },
      {
        "name": "Crucifixo Reto (halter/cabo/máquina)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 8 a 10 reps",
          "Working Set 2 · Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições com 15seg de intervalo",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=uQIPgsELvgs&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH"
        ]
      },
      {
        "name": "Crossover/Crucifixo Declinado",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=tcwMNq8QkEU&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=53"
        ]
      },
      {
        "name": "Elevações Laterais (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=qIq5thMEws0&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=45"
        ]
      },
      {
        "name": "Tríceps Testa com Barra W",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=ERxhR3rxkns&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=40"
        ]
      },
      {
        "name": "Tríceps Francês (halter/banco)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=MK51n80n-q8&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=41"
        ]
      },
      {
        "name": "Tríceps Corda no Cabo",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=sgs7VfTbhfk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=3"
        ]
      }
    ],
    [
      {
        "name": "Cadeira Abdutora",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=_p2pyypglbU&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=9"
        ]
      },
      {
        "name": "Cadeira Extensora",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=BHxNa16VQ7A&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=49"
        ]
      },
      {
        "name": "Agachamento (Smith/livre/hack)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=7c_xinLJVZM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=5"
        ]
      },
      {
        "name": "Avanço (livre/halter/Smith)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=waPu1q3VhrM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=1"
        ]
      },
      {
        "name": "Leg Press",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=B0swveEoTnU&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=14"
        ]
      },
      {
        "name": "Panturrilha em Pé",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=xU9KCMZkoxo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=67"
        ]
      },
      {
        "name": "Panturrilha no Leg Press ou sentado",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      },
      {
        "name": "Abdominal Crunch",
        "warmup": "Obs: usar peso",
        "sets": [
          "4x 20 a 30 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=27hLFDTivBg&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=73"
        ]
      },
      {
        "name": "Elevação de membros inferiores em suspensão",
        "sets": [
          "4x 20 a 25 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=_p2pyypglbU&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=9"
        ]
      }
    ],
    [
      {
        "name": "Puxada Alta Supinada Aberta",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "videos": []
      },
      {
        "name": "Puxada Alta com Triângulo",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": []
      },
      {
        "name": "Remada Curvada Supinada",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": []
      },
      {
        "name": "Remada Baixa com Triângulo",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": []
      },
      {
        "name": "Pull Down",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": []
      },
      {
        "name": "Crucifixo Inverso (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": []
      },
      {
        "name": "Rosca alternada Banco 45°",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": []
      },
      {
        "name": "Rosca Scott",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": []
      },
      {
        "name": "PENDENTE DE CONFIRMAÇÃO",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "pending": "Nome do exercício não aparece no PDF",
        "videos": []
      }
    ],
    [
      {
        "name": "Cadeira Flexora",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=Mqe6s-ueopo&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=34"
        ]
      },
      {
        "name": "Mesa Flexora",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=zICWI7KY2tk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=33"
        ]
      },
      {
        "name": "Stiff (barra/halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=u-Ha_ZO4Y_0&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=10"
        ]
      },
      {
        "name": "Agachamento Búlgaro",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=2y6yH4m_nIY&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=2"
        ]
      },
      {
        "name": "Elevações Pélvicas",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições com 20seg de intervalo",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=JSRjx5pB5aM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=11"
        ]
      },
      {
        "name": "Panturrilha no Leg Press",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps",
          "Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      },
      {
        "name": "Abdominal Crunch",
        "warmup": "Obs: usar peso",
        "sets": [
          "4x 15 a 20 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=27hLFDTivBg&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=73"
        ]
      },
      {
        "name": "Elevação de membros inferiores em suspensão",
        "sets": [
          "4x 15 a 20 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=GQ3sn5J8_9g"
        ]
      }
    ],
    [
      {
        "name": "Desenvolvimento (halter)",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 6 a 8 reps",
          "Working Set 2 · Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições com 15seg de intervalo",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=bFuat5b4QFA&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=49"
        ]
      },
      {
        "name": "Elevações Laterais (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=nxCKW-unul0&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=64"
        ]
      },
      {
        "name": "Elevações Frontais (banco 75°)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": []
      },
      {
        "name": "Crucifixo Inverso (banco 75°)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=7EGNBHUpPyo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=45"
        ]
      },
      {
        "name": "Tríceps Francês (cabo/halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=4piO_WPmCCE&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=39"
        ]
      },
      {
        "name": "Tríceps Testa (barra W/halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=ERxhR3rxkns&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=40"
        ]
      },
      {
        "name": "Tríceps Corda",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=sgs7VfTbhfk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=3"
        ]
      },
      {
        "name": "Rosca Scott",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=08htJeRN7vM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=55"
        ]
      },
      {
        "name": "Rosca Martelo (corda)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=GJsi_Yw1TPo&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=12"
        ]
      },
      {
        "name": "Panturrilha Leg Press",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps (+ 10 reps parciais em alongamento)",
          "Working Set 2 · 10 a 12 reps (+ 10 reps parciais em alongamento)",
          "Working Set 2 · 10 a 12 reps (+ 10 reps parciais em alongamento)"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      }
    ]
  ],
  [
    [
      {
        "name": "Supino Inclinado (halter/Smith/máquina)",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 6 a 8 reps",
          "Working Set 2 · Rest Pause · 3 blocos de 3 repetições · 5 segundos de pausa em cada bloco",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=HbZoVn_ifgA&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=9"
        ]
      },
      {
        "name": "Supino Reto (halter/Smith/máquina)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 8 a 10 reps",
          "Working Set 2 · Rest Pause · 3 blocos de 3 repetições · 5 segundos de pausa em cada bloco",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=XsgR_hm8AWA&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=28"
        ]
      },
      {
        "name": "Crucifixo Reto (halter/cabo/máquina)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 8 a 10 reps",
          "Working Set 2 · Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=uQIPgsELvgs&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH"
        ]
      },
      {
        "name": "+ Crossover",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps"
        ],
        "pending": "O PDF mostra apenas \"+ Crossover\"; o primeiro exercício da combinação não aparece",
        "videos": [
          "https://www.youtube.com/watch?v=h7gNQHDUr_Y",
          "https://www.youtube.com/watch?v=tcwMNq8QkEU"
        ]
      },
      {
        "name": "Elevações Laterais (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 2 · Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=qIq5thMEws0&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=45"
        ]
      },
      {
        "name": "Tríceps Testa com Barra W",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=ERxhR3rxkns&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=40"
        ]
      },
      {
        "name": "Tríceps Corda no Cabo + Tríceps Mergulho no banco",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=sgs7VfTbhfk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=3",
          "https://www.youtube.com/watch?v=fBUrCui6goI&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=76"
        ]
      }
    ],
    [
      {
        "name": "Cadeira Abdutora",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=_p2pyypglbU&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=9"
        ]
      },
      {
        "name": "Cadeira Extensora",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=BHxNa16VQ7A&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=49"
        ]
      },
      {
        "name": "Agachamento (Smith/livre/hack)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=7c_xinLJVZM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=5"
        ]
      },
      {
        "name": "Leg Press Unilateral",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=RgQKL8EEonQ&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=31"
        ]
      },
      {
        "name": "PENDENTE DE CONFIRMAÇÃO",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps"
        ],
        "pending": "Nome do exercício não aparece no PDF",
        "videos": [
          "https://youtu.be/SQ480aJMCaE"
        ]
      },
      {
        "name": "Panturrilha em Pé + Panturrilha no Leg Press ou sentado",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=xU9KCMZkoxo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=67"
        ]
      },
      {
        "name": "Abdominal Crunch + Elevação de membros inferiores em suspensão",
        "warmup": "Obs: usar peso",
        "sets": [
          "4x 20 a 30 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=27hLFDTivBg&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=73",
          "https://www.youtube.com/watch?v=GQ3sn5J8_9g&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=75"
        ]
      },
      {
        "name": "PENDENTE DE CONFIRMAÇÃO",
        "sets": [
          "4x 20 a 25 reps"
        ],
        "pending": "Nome do exercício não aparece no PDF",
        "videos": [
          "https://www.youtube.com/watch?v=GQ3sn5J8_9g"
        ]
      }
    ],
    [
      {
        "name": "Puxada Alta Supinada Aberta",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=Uj58KaUkEEQ&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=29"
        ]
      },
      {
        "name": "Puxada Alta com Triângulo",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": [
          "https://www.youtube.com/watch?v=WDwg-G7kY3c&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=28"
        ]
      },
      {
        "name": "Remada Curvada Supinada",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": [
          "https://www.youtube.com/watch?v=DyCqe7vy_b8&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=21"
        ]
      },
      {
        "name": "Remada Baixa com Triângulo",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": [
          "https://www.youtube.com/watch?v=yZtFixy6_ek&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=24"
        ]
      },
      {
        "name": "Pull Down",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=FyDqMjggYMw&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=30"
        ]
      },
      {
        "name": "Crucifixo Inverso (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=7EGNBHUpPyo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=45"
        ]
      },
      {
        "name": "Rosca alternada Banco 45°",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=xcDpo1Ubi5k&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=68"
        ]
      },
      {
        "name": "Rosca Scott com W (livre ou máquina) + Rosca Spider",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=rc_7r56M3So",
          "https://www.youtube.com/watch?v=i9ySLhYYdpE"
        ]
      }
    ],
    [
      {
        "name": "Cadeira Flexora",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=Mqe6s-ueopo&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=34"
        ]
      },
      {
        "name": "Mesa Flexora",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=zICWI7KY2tk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=33"
        ]
      },
      {
        "name": "Stiff (barra/halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=u-Ha_ZO4Y_0&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=10"
        ]
      },
      {
        "name": "Agachamento Búlgaro",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=2y6yH4m_nIY&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=2"
        ]
      },
      {
        "name": "Elevações Pélvicas",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições com 15seg de intervalo",
          "Back-off · 12 a 15 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=ecPr0ABLo1c&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=43"
        ]
      },
      {
        "name": "Panturrilha em Pé + Panturrilha no Leg Press ou sentado",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=xU9KCMZkoxo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=67",
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      },
      {
        "name": "Abdominal Crunch + Elevação de membros inferiores em suspensão",
        "warmup": "Obs: usar peso",
        "sets": [
          "4x 20 a 30 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=27hLFDTivBg&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=73",
          "https://www.youtube.com/watch?v=GQ3sn5J8_9g"
        ]
      }
    ],
    [
      {
        "name": "Desenvolvimento (halter)",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 6 a 8 reps",
          "Working Set 2 · Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições com 15seg de intervalo",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=bFuat5b4QFA&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=49"
        ]
      },
      {
        "name": "Elevações Laterais (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=nxCKW-unul0&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=64"
        ]
      },
      {
        "name": "Elevações Frontais (banco 75°)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=dmihuuva9KU&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=51"
        ]
      },
      {
        "name": "Crucifixo Inverso (banco 75°)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=7EGNBHUpPyo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=45"
        ]
      },
      {
        "name": "Tríceps Francês (cabo/halter) + Rosca direta com Barra W",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=4piO_WPmCCE&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=39",
          "https://www.youtube.com/watch?v=mVJ09kXWMhg&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=16"
        ]
      },
      {
        "name": "Tríceps Corda + Rosca Scott",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=sgs7VfTbhfk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=3",
          "https://www.youtube.com/watch?v=i9ySLhYYdpE&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=11"
        ]
      },
      {
        "name": "Rosca Martelo (corda)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=GJsi_Yw1TPo&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=12"
        ]
      },
      {
        "name": "PENDENTE DE CONFIRMAÇÃO",
        "sets": [
          "PENDENTE DE CONFIRMAÇÃO",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps"
        ],
        "pending": "Esta linha está parcialmente coberta no PDF; apenas parte das séries está legível",
        "videos": [
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      }
    ]
  ],
  [
    [
      {
        "name": "Supino Inclinado (halter/Smith/máquina)",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 6 a 8 reps",
          "Working Set 2 · Rest Pause · 3 blocos de 3 repetições · 5 segundos de pausa em cada bloco",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=lmwCGtNJmw0&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=31"
        ]
      },
      {
        "name": "Supino Reto (halter/Smith/máquina)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 8 a 10 reps",
          "Working Set 2 · Rest Pause · 3 blocos de 3 repetições · 5 segundos de pausa em cada bloco",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=_4KDAZ59jkw&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=29"
        ]
      },
      {
        "name": "Crucifixo Reto (halter/cabo/máquina)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 8 a 10 reps",
          "Working Set 2 · Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=uQIPgsELvgs&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=10"
        ]
      },
      {
        "name": "Pull Over + Crossover",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=_p2pyypglbU&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=9",
          "https://www.youtube.com/watch?v=tcwMNq8QkEU&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=53"
        ]
      },
      {
        "name": "Elevações Laterais (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 2 · Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=qIq5thMEws0&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=45"
        ]
      },
      {
        "name": "Tríceps Testa com Barra W",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=_p2pyypglbU&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=9"
        ]
      },
      {
        "name": "Tríceps Corda no Cabo + Tríceps Mergulho no banco",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=sgs7VfTbhfk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=3",
          "https://www.youtube.com/watch?v=_p2pyypglbU&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=9"
        ]
      }
    ],
    [
      {
        "name": "Cadeira Abdutora",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=_p2pyypglbU&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=9"
        ]
      },
      {
        "name": "Cadeira Extensora",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=BHxNa16VQ7A&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=49"
        ]
      },
      {
        "name": "Agachamento (Smith/livre/hack)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=7c_xinLJVZM&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=5"
        ]
      },
      {
        "name": "Leg Press Unilateral",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=RgQKL8EEonQ&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=31"
        ]
      },
      {
        "name": "Terra Sumô (livre na barra/halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps"
        ],
        "videos": [
          "https://youtube.com/watch?v=SQ480aJMCaE&feature=youtu.be"
        ]
      },
      {
        "name": "Panturrilha em Pé + Panturrilha no Leg Press ou sentado",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=xU9KCMZkoxo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=67",
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      },
      {
        "name": "Abdominal Crunch + Elevação de membros inferiores em suspensão",
        "warmup": "Obs: usar peso",
        "sets": [
          "4x 20 a 30 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=27hLFDTivBg&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=73",
          "https://youtube.com/watch?v=GQ3sn5J8_9g&feature=youtu.be"
        ]
      },
      {
        "name": "Elevação de membros inferiores em suspensão",
        "sets": [
          "4x 20 a 25 reps"
        ],
        "videos": [
          "https://youtube.com/watch?v=GQ3sn5J8_9g&feature=youtu.be"
        ]
      }
    ],
    [
      {
        "name": "Puxada Alta Supinada Aberta",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "videos": []
      },
      {
        "name": "Puxada Alta com Triângulo",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": []
      },
      {
        "name": "Remada Curvada Supinada",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Back-off · 12 a 15 reps"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": []
      },
      {
        "name": "Remada Baixa com Triângulo",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 1 · 10 a 12 reps",
          "Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "note": "O PDF indica \"Working set 1\" nas séries 2 e 3.",
        "videos": [
          "https://www.youtube.com/watch?v=yZtFixy6_ek&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=24"
        ]
      },
      {
        "name": "Pull Down",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Drop Set · 6-6-6 · 18 reps totais"
        ],
        "videos": []
      },
      {
        "name": "Crucifixo Inverso (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "videos": []
      },
      {
        "name": "Rosca alternada Banco 45°",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": []
      },
      {
        "name": "Rosca Scott com W (livre ou máquina) + Rosca Spider",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": []
      }
    ],
    [
      {
        "name": "Cadeira Flexora",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=Mqe6s-ueopo&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=34"
        ]
      },
      {
        "name": "Mesa Flexora",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Rest Pause · 3 blocos de 4 repetições · 5 segundos de pausa em cada bloco"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=zICWI7KY2tk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=33"
        ]
      },
      {
        "name": "Stiff (barra/halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=u-Ha_ZO4Y_0&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=10"
        ]
      },
      {
        "name": "Agachamento Búlgaro",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=2y6yH4m_nIY&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=2"
        ]
      },
      {
        "name": "Elevações Pélvicas",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições com 15seg de intervalo",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=ecPr0ABLo1c&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=43"
        ]
      },
      {
        "name": "Panturrilha em Pé + Panturrilha no Leg Press ou sentado",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=xU9KCMZkoxo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=67",
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      },
      {
        "name": "Abdominal Crunch + Elevação de membros inferiores em suspensão",
        "warmup": "Obs: usar peso",
        "sets": [
          "4x 20 a 30 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=27hLFDTivBg&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=73",
          "https://www.youtube.com/watch?v=GQ3sn5J8_9g"
        ]
      }
    ],
    [
      {
        "name": "Desenvolvimento (halter)",
        "warmup": "2x de 15 a 20 reps",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Feeder Set 2 · 5 a 6 reps",
          "Working Set 1 · 6 a 8 reps",
          "Working Set 2 · Cluster-Set · 3 ou 4 blocos de 3 ou 4 repetições com 15seg de intervalo",
          "Back-off · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=bFuat5b4QFA&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=49"
        ]
      },
      {
        "name": "Elevações Laterais (halter)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=nxCKW-unul0&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=64"
        ]
      },
      {
        "name": "Elevações Frontais (banco 75°)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/shorts/8NEu2WkDWkU"
        ]
      },
      {
        "name": "Crucifixo Inverso (banco 75°)",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=7EGNBHUpPyo&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=45"
        ]
      },
      {
        "name": "Tríceps Francês (cabo/halter) + Rosca direta com Barra W",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=4piO_WPmCCE&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=39"
        ]
      },
      {
        "name": "Tríceps Corda + Rosca Scott",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps",
          "Working Set 2 · 10 a 12 reps",
          "Working Set 3 · 10 a 12 reps"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=sgs7VfTbhfk&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=3",
          "https://www.youtube.com/watch?v=i9ySLhYYdpE&list=PL8KUbU4GVkCZrAtG1olJCq9thK5yDSfKG&index=11"
        ]
      },
      {
        "name": "Panturrilha Leg Press + Panturrilha no Leg Press ou sentado",
        "sets": [
          "Feeder Set 1 · 5 a 6 reps",
          "Working Set 1 · 10 a 12 reps (+ 10 reps parciais em alongamento)",
          "Working Set 2 · 10 a 12 reps (+ 10 reps parciais em alongamento)",
          "Working Set 2 · 10 a 12 reps (+ 10 reps parciais em alongamento)"
        ],
        "videos": [
          "https://www.youtube.com/watch?v=z-mIKVxAVS4&list=PL8KUbU4GVkCZeKCJBla0ziE5KjzYLEeRH&index=69"
        ]
      }
    ]
  ]
];

export const PROGRAM: Record<1 | 2 | 3 | 4, PhaseWorkouts> = {
  1: toPhase(RAW[0]),
  2: toPhase(RAW[1]),
  3: toPhase(RAW[2]),
  4: toPhase(RAW[3]),
};

function toPhase(rows: Exercise[][]): PhaseWorkouts {
  return { A: rows[0], B: rows[1], C: rows[2], D: rows[3], E: rows[4] };
}

export function getExercises(phase: number, letter: WorkoutLetter): Exercise[] {
  const p = PROGRAM[(Math.min(4, Math.max(1, phase)) as 1 | 2 | 3 | 4)];
  return p[letter];
}
