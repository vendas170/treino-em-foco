import { queryOptions, type QueryClient } from "@tanstack/react-query";
import type { WorkoutLetter } from "./program-data";
import type { ProgramDay } from "./schedule";

/*
 * Armazenamento pessoal, sem login: todos os registros ficam salvos no navegador
 * deste aparelho (localStorage). Nada é enviado para servidores, então ninguém
 * mais consegue ler ou alterar os dados. Backup/restauração em JSON permite
 * levar o histórico para outro aparelho.
 */

export type SessionStatus = "in_progress" | "completed" | "voided";

export interface ProfileRow {
  id: string;
  display_name: string | null;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
export interface ProgramRow {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  total_weeks: number;
  status: "active" | "archived";
  archived_at: string | null;
  created_at: string;
}
export interface SessionRow {
  id: string;
  user_id: string;
  program_id: string;
  session_date: string;
  workout_letter: string;
  week_number: number;
  phase_number: number;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  voided_at: string | null;
  created_at: string;
  updated_at: string;
}
export type PendingRow = Omit<SessionRow, "created_at" | "updated_at">;

export interface Preferences {
  showMotivation: boolean;
  compactExercises: boolean;
}
export const DEFAULT_PREFS: Preferences = { showMotivation: true, compactExercises: false };

export function readPrefs(profile: ProfileRow | null): Preferences {
  const p = (profile?.preferences ?? {}) as Partial<Preferences>;
  return { ...DEFAULT_PREFS, ...p };
}

export const LOCAL_USER_ID = "local";
export const PROGRAM_NAME = "Treino Avançado Masculino";
export const STORE_KEY = "gdshape:v1";

export interface Store {
  version: 1;
  profile: ProfileRow;
  programs: ProgramRow[];
  sessions: SessionRow[];
}

const nowISO = () => new Date().toISOString();

function emptyStore(): Store {
  const now = nowISO();
  return {
    version: 1,
    profile: { id: LOCAL_USER_ID, display_name: null, preferences: {}, created_at: now, updated_at: now },
    programs: [],
    sessions: [],
  };
}

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

export function loadStore(): Store {
  if (!hasStorage()) return emptyStore();
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return emptyStore();
  try {
    return parseStore(JSON.parse(raw));
  } catch {
    return emptyStore();
  }
}

function saveStore(store: Store) {
  if (!hasStorage()) throw new Error("Armazenamento indisponível neste navegador.");
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function update(mutator: (s: Store) => void): Store {
  const s = loadStore();
  mutator(s);
  saveStore(s);
  return s;
}

/** Pede ao navegador para não apagar os dados automaticamente quando faltar espaço. */
export function requestPersistentStorage() {
  if (typeof navigator !== "undefined" && navigator.storage?.persist) void navigator.storage.persist().catch(() => {});
}

/* ---------- consultas ---------- */

export const profileQuery = () =>
  queryOptions({ queryKey: ["profile"], networkMode: "always", queryFn: async () => loadStore().profile });

export const programQuery = () =>
  queryOptions({
    queryKey: ["program"],
    networkMode: "always",
    queryFn: async () => loadStore().programs.find((p) => p.status === "active") ?? null,
  });

export const programsQuery = () =>
  queryOptions({
    queryKey: ["programs"],
    networkMode: "always",
    queryFn: async () => [...loadStore().programs].sort((a, b) => b.created_at.localeCompare(a.created_at)),
  });

export const sessionsQuery = () =>
  queryOptions({
    queryKey: ["sessions"],
    networkMode: "always",
    queryFn: async () => [...loadStore().sessions].sort((a, b) => a.session_date.localeCompare(b.session_date)),
  });

export async function ensureAppData(qc: QueryClient) {
  await Promise.all([
    qc.ensureQueryData(profileQuery()),
    qc.ensureQueryData(programQuery()),
    qc.ensureQueryData(sessionsQuery()),
  ]);
}

export function refreshAll(qc: QueryClient) {
  return qc.invalidateQueries();
}

/* ---------- perfil e programa ---------- */

export function updateProfile(patch: Partial<Pick<ProfileRow, "display_name" | "preferences">>) {
  update((s) => {
    s.profile = { ...s.profile, ...patch, updated_at: nowISO() };
  });
}

/** Inicia um novo ciclo de 16 semanas. Um programa ativo anterior é arquivado; o histórico é mantido. */
export function startProgram(startDate: string): ProgramRow {
  const program: ProgramRow = {
    id: crypto.randomUUID(),
    user_id: LOCAL_USER_ID,
    name: PROGRAM_NAME,
    start_date: startDate,
    total_weeks: 16,
    status: "active",
    archived_at: null,
    created_at: nowISO(),
  };
  update((s) => {
    for (const p of s.programs) if (p.status === "active") Object.assign(p, { status: "archived", archived_at: nowISO() });
    s.programs.push(program);
  });
  return program;
}

/* ---------- regras de sessão ---------- */

/** Sessão válida (não anulada) do programa ativo para a data. */
export function activeSessionFor(sessions: SessionRow[], programId: string | undefined, date: string) {
  if (!programId) return undefined;
  return sessions.find((s) => s.program_id === programId && s.session_date === date && s.status !== "voided");
}

export type SessionAction = "start" | "complete" | "void";

export function buildSessionChange(
  action: SessionAction,
  ctx: { userId: string; programId: string; day: ProgramDay; existing?: SessionRow | undefined; now?: Date; today: string },
): PendingRow {
  const { userId, programId, day, existing, today } = ctx;
  const now = (ctx.now ?? new Date()).toISOString();
  if (action === "void") {
    if (!existing) throw new Error("Nenhum registro para corrigir.");
    return { ...strip(existing), status: "voided", voided_at: now };
  }
  if (day.kind !== "training" || !day.letter || !day.week || !day.phase) {
    throw new Error("Este dia não tem treino programado.");
  }
  if (day.date > today) throw new Error("Não é possível registrar treinos futuros.");
  if (existing?.status === "completed") throw new Error("Este treino já foi concluído.");
  if (action === "start") {
    if (existing) return strip(existing);
    return newRow(userId, programId, day, { status: "in_progress", started_at: now });
  }
  if (existing) return { ...strip(existing), status: "completed", completed_at: now };
  return newRow(userId, programId, day, { status: "completed", completed_at: now });
}

function strip(r: SessionRow): PendingRow {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { created_at, updated_at, ...rest } = r;
  return rest;
}

function newRow(userId: string, programId: string, day: ProgramDay, patch: Partial<PendingRow>): PendingRow {
  return {
    id: crypto.randomUUID(),
    user_id: userId,
    program_id: programId,
    session_date: day.date,
    workout_letter: day.letter as WorkoutLetter,
    week_number: day.week as number,
    phase_number: day.phase as number,
    status: "in_progress",
    started_at: null,
    completed_at: null,
    voided_at: null,
    ...patch,
  };
}

/** Grava a mudança. Impede um segundo registro válido para o mesmo dia e programa. */
export function saveSession(row: PendingRow) {
  update((s) => {
    if (row.status !== "voided") {
      const clash = s.sessions.find(
        (x) => x.id !== row.id && x.program_id === row.program_id && x.session_date === row.session_date && x.status !== "voided",
      );
      if (clash) throw new Error("Este dia já possui um registro.");
    }
    const prev = s.sessions.find((x) => x.id === row.id);
    const next: SessionRow = { ...row, created_at: prev?.created_at ?? nowISO(), updated_at: nowISO() };
    s.sessions = prev ? s.sessions.map((x) => (x.id === row.id ? next : x)) : [...s.sessions, next];
  });
}

export async function commitSessionChange(qc: QueryClient, row: PendingRow) {
  saveSession(row);
  await qc.invalidateQueries({ queryKey: ["sessions"] });
}

/* ---------- backup ---------- */

export function exportBackup(): string {
  return JSON.stringify({ app: "gdshape", exported_at: nowISO(), ...loadStore() }, null, 2);
}

/** Substitui os dados deste aparelho pelos do arquivo de backup. Lança erro se o arquivo for inválido. */
export function importBackup(json: string): Store {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Arquivo de backup inválido.");
  }
  const store = parseStore(parsed);
  saveStore(store);
  return store;
}

const isStr = (v: unknown): v is string => typeof v === "string";
const isDate = (v: unknown) => isStr(v) && /^\d{4}-\d{2}-\d{2}$/.test(v);

function parseStore(input: unknown): Store {
  const o = input as Partial<Store> | null;
  if (!o || typeof o !== "object" || !Array.isArray(o.programs) || !Array.isArray(o.sessions) || !o.profile) {
    throw new Error("Arquivo de backup inválido.");
  }
  const base = emptyStore();
  const prof = o.profile as Partial<ProfileRow>;
  const profile: ProfileRow = {
    ...base.profile,
    display_name: isStr(prof.display_name) ? prof.display_name : null,
    preferences: prof.preferences && typeof prof.preferences === "object" ? prof.preferences : {},
  };
  const programs = o.programs.filter(
    (p): p is ProgramRow => !!p && isStr(p.id) && isDate(p.start_date) && (p.status === "active" || p.status === "archived"),
  );
  const sessions = o.sessions.filter(
    (s): s is SessionRow =>
      !!s &&
      isStr(s.id) &&
      isStr(s.program_id) &&
      isDate(s.session_date) &&
      ["in_progress", "completed", "voided"].includes(s.status) &&
      ["A", "B", "C", "D", "E"].includes(s.workout_letter),
  );
  // No máximo um programa ativo.
  let seenActive = false;
  for (const p of [...programs].sort((a, b) => b.created_at.localeCompare(a.created_at))) {
    if (p.status === "active") {
      if (seenActive) p.status = "archived";
      seenActive = true;
    }
  }
  return { version: 1, profile, programs, sessions };
}
