import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { WorkoutLetter } from "./program-data";
import type { ProgramDay } from "./schedule";

export type ProgramRow = Database["public"]["Tables"]["programs"]["Row"];
export type SessionRow = Database["public"]["Tables"]["workout_sessions"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type SessionStatus = "in_progress" | "completed" | "voided";

export interface Preferences {
  showMotivation: boolean;
  compactExercises: boolean;
}
export const DEFAULT_PREFS: Preferences = { showMotivation: true, compactExercises: false };

export function readPrefs(profile: ProfileRow | null): Preferences {
  const p = (profile?.preferences ?? {}) as Partial<Preferences>;
  return { ...DEFAULT_PREFS, ...p };
}

/* ---------- identidade local (funciona sem rede) ---------- */

export async function getLocalUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

/* ---------- cache local para consulta offline ---------- */

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;
const cacheKey = (uid: string, key: string) => `gd:cache:${uid}:${key}`;

function readCache<T>(uid: string, key: string): T | undefined {
  if (!hasStorage()) return undefined;
  const raw = localStorage.getItem(cacheKey(uid, key));
  return raw ? (JSON.parse(raw) as T) : undefined;
}
function writeCache(uid: string, key: string, value: unknown) {
  if (hasStorage()) localStorage.setItem(cacheKey(uid, key), JSON.stringify(value));
}

export function isNetworkError(err: unknown): boolean {
  if (typeof navigator !== "undefined" && !navigator.onLine) return true;
  const msg = String((err as { message?: string })?.message ?? err ?? "");
  return /failed to fetch|network|load failed|fetch failed|networkerror/i.test(msg);
}

async function withCache<T>(key: string, fetcher: (uid: string) => Promise<T>): Promise<T> {
  const uid = await getLocalUserId();
  if (!uid) throw new Error("Sessão expirada");
  try {
    const value = await fetcher(uid);
    writeCache(uid, key, value);
    return value;
  } catch (err) {
    const cached = readCache<T>(uid, key);
    if (cached !== undefined && isNetworkError(err)) return cached;
    if (cached !== undefined && typeof navigator !== "undefined" && !navigator.onLine) return cached;
    throw err;
  }
}

/* ---------- fila de ações pendentes ---------- */

export type PendingRow = Omit<SessionRow, "created_at" | "updated_at">;
const queueKey = (uid: string) => `gd:queue:${uid}`;

export function readQueue(uid: string): PendingRow[] {
  if (!hasStorage()) return [];
  return JSON.parse(localStorage.getItem(queueKey(uid)) ?? "[]") as PendingRow[];
}
function writeQueue(uid: string, rows: PendingRow[]) {
  if (hasStorage()) localStorage.setItem(queueKey(uid), JSON.stringify(rows));
}
function enqueue(uid: string, row: PendingRow) {
  const q = readQueue(uid).filter((r) => r.id !== row.id);
  q.push(row);
  writeQueue(uid, q);
}

let flushing: Promise<{ synced: number; pending: number; rejected: number }> | null = null;

/** Envia ao servidor as ações registradas sem conexão. Idempotente: cada linha tem id próprio. */
export function flushQueue() {
  if (flushing) return flushing;
  flushing = (async () => {
    const uid = await getLocalUserId();
    if (!uid) return { synced: 0, pending: 0, rejected: 0 };
    let synced = 0;
    let rejected = 0;
    const queue = readQueue(uid);
    const remaining: PendingRow[] = [];
    for (let i = 0; i < queue.length; i++) {
      const row = queue[i];
      const { error } = await supabase.from("workout_sessions").upsert(row, { onConflict: "id" });
      if (!error) {
        synced++;
        continue;
      }
      if (isNetworkError(error)) {
        remaining.push(...queue.slice(i));
        break;
      }
      // Conflito (dia já registrado) ou regra do servidor: descarta para não duplicar.
      console.warn("Ação descartada na sincronização", error);
      rejected++;
    }
    writeQueue(uid, remaining);
    return { synced, pending: remaining.length, rejected };
  })().finally(() => {
    flushing = null;
  });
  return flushing;
}

/* ---------- consultas ---------- */

export const profileQuery = () =>
  queryOptions({
    queryKey: ["profile"],
    networkMode: "always",
    queryFn: () =>
      withCache<ProfileRow | null>("profile", async (uid) => {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
        if (error) throw error;
        return data;
      }),
  });

export const programQuery = () =>
  queryOptions({
    queryKey: ["program"],
    networkMode: "always",
    queryFn: () =>
      withCache<ProgramRow | null>("program", async (uid) => {
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .eq("user_id", uid)
          .eq("status", "active")
          .maybeSingle();
        if (error) throw error;
        return data;
      }),
  });

export const programsQuery = () =>
  queryOptions({
    queryKey: ["programs"],
    networkMode: "always",
    queryFn: () =>
      withCache<ProgramRow[]>("programs", async (uid) => {
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data ?? [];
      }),
  });

export const sessionsQuery = () =>
  queryOptions({
    queryKey: ["sessions"],
    networkMode: "always",
    queryFn: async () => {
      const rows = await withCache<SessionRow[]>("sessions", async (uid) => {
        const { data, error } = await supabase
          .from("workout_sessions")
          .select("*")
          .eq("user_id", uid)
          .order("session_date", { ascending: true })
          .range(0, 4999);
        if (error) throw error;
        return data ?? [];
      });
      const uid = await getLocalUserId();
      return mergePending(rows, uid ? readQueue(uid) : []);
    },
  });

export function mergePending(rows: SessionRow[], pending: PendingRow[]): SessionRow[] {
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const p of pending) {
    const prev = byId.get(p.id);
    byId.set(p.id, {
      ...p,
      created_at: prev?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  return [...byId.values()].sort((a, b) => a.session_date.localeCompare(b.session_date));
}

export async function ensureAppData(qc: QueryClient) {
  await Promise.all([
    qc.ensureQueryData(profileQuery()),
    qc.ensureQueryData(programQuery()),
    qc.ensureQueryData(sessionsQuery()),
  ]);
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
  ctx: { userId: string; programId: string; day: ProgramDay; existing?: SessionRow; now?: Date; today: string },
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

/** Registra a mudança localmente (aparece na hora) e tenta sincronizar. */
export async function commitSessionChange(qc: QueryClient, row: PendingRow) {
  const uid = await getLocalUserId();
  if (!uid) throw new Error("Sessão expirada");
  enqueue(uid, row);
  qc.setQueryData<SessionRow[]>(["sessions"], (old) => mergePending(old ?? [], [row]));
  const res = await flushQueue();
  if (res.rejected > 0) {
    await qc.invalidateQueries({ queryKey: ["sessions"] });
    throw new Error("Este dia já possui um registro.");
  }
  if (res.pending === 0) await qc.invalidateQueries({ queryKey: ["sessions"] });
  return { offline: res.pending > 0 };
}
