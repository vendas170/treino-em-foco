import { useCallback, useMemo, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  activeSessionFor,
  buildSessionChange,
  commitSessionChange,
  profileQuery,
  programQuery,
  readPrefs,
  sessionsQuery,
  type SessionAction,
  type SessionRow,
} from "@/lib/data";
import { currentWeek, getProgramDay, phaseForWeek, toISODate, TOTAL_WEEKS, type ProgramDay } from "@/lib/schedule";

export function useToday() {
  return toISODate(new Date());
}

export function useGD() {
  const { data: profile } = useSuspenseQuery(profileQuery());
  const { data: program } = useSuspenseQuery(programQuery());
  const { data: sessions } = useSuspenseQuery(sessionsQuery());
  const today = useToday();

  return useMemo(() => {
    const programSessions = program
      ? sessions.filter((s) => s.program_id === program.id && s.status !== "voided")
      : [];
    const completed = programSessions.filter((s) => s.status === "completed");
    const completedDates = new Set(completed.map((s) => s.session_date));
    const week = program ? currentWeek(program.start_date, new Date(), program.total_weeks) : 0;
    const weekClamped = Math.min(Math.max(week, 1), TOTAL_WEEKS);
    const todayDay = program ? getProgramDay(program.start_date, today, program.total_weeks) : null;
    return {
      profile,
      prefs: readPrefs(profile),
      program,
      sessions,
      programSessions,
      completed,
      completedDates,
      today,
      todayDay,
      week,
      weekClamped,
      phase: phaseForWeek(weekClamped),
      sessionFor: (date: string) => activeSessionFor(sessions, program?.id, date),
    };
  }, [profile, program, sessions, today]);
}

export function useSessionActions() {
  const qc = useQueryClient();
  const { program, sessions, today } = useGD();
  const [busy, setBusy] = useState(false);

  const run = useCallback(
    async (action: SessionAction, day: ProgramDay, existing?: SessionRow) => {
      if (!program) return false;
      setBusy(true);
      try {
        const row = buildSessionChange(action, {
          userId: program.user_id,
          programId: program.id,
          day,
          existing: existing ?? activeSessionFor(sessions, program.id, day.date),
          today,
        });
        const { offline } = await commitSessionChange(qc, row);
        if (offline) toast.message("Sem conexão", { description: "Registro salvo no aparelho. Sincroniza quando a internet voltar." });
        return true;
      } catch (err) {
        toast.error((err as Error).message);
        return false;
      } finally {
        setBusy(false);
      }
    },
    [program, sessions, today, qc],
  );

  return { run, busy };
}
