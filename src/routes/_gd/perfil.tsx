import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, FileDown, FileUp, RotateCcw, Save, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/gd/AppShell";
import { ConfirmDialog } from "@/components/gd/ConfirmDialog";
import { PageHeader } from "@/components/gd/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useGD } from "@/hooks/use-gd";
import { ensureAppData, exportBackup, importBackup, programsQuery, startProgram, updateProfile, type Preferences } from "@/lib/data";
import { PHASES, WORKOUTS, type WorkoutLetter } from "@/lib/program-data";
import { fromISODate, normalizeStartDate, toISODate } from "@/lib/schedule";

export const Route = createFileRoute("/_gd/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — GDshape" },
      { name: "description", content: "Seu nome, programa atual, preferências, backup e exportação do histórico." },
      { property: "og:title", content: "Perfil — GDshape" },
      { property: "og:description", content: "Perfil e configurações do GDshape." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ context }) => {
    await ensureAppData(context.queryClient);
    await context.queryClient.ensureQueryData(programsQuery());
  },
  component: () => (
    <AppShell>
      <ProfilePage />
    </AppShell>
  ),
});

function ProfilePage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { profile, prefs, program, week, sessions } = useGD();
  const [name, setName] = useState(profile?.display_name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [newStart, setNewStart] = useState(toISODate(new Date()));
  const [restoreText, setRestoreText] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!program || !profile) return null;

  async function saveName() {
    setSavingName(true);
    try {
      updateProfile({ display_name: name.trim() });
    } catch {
      toast.error("Não foi possível salvar.");
      return;
    } finally {
      setSavingName(false);
    }
    await qc.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Nome atualizado.");
  }

  async function setPref(key: keyof Preferences, value: boolean) {
    const next = { ...prefs, [key]: value };
    try {
      updateProfile({ preferences: { ...next } });
    } catch {
      toast.error("Não foi possível salvar a preferência.");
    }
    await qc.invalidateQueries({ queryKey: ["profile"] });
  }

  function exportCsv() {
    const rows = sessions.filter((s) => s.status === "completed").sort((a, b) => a.session_date.localeCompare(b.session_date));
    const header = ["data", "treino", "grupo_muscular", "semana", "fase", "inicio", "conclusao"];
    const lines = rows.map((s) =>
      [
        s.session_date,
        s.workout_letter,
        WORKOUTS[s.workout_letter as WorkoutLetter].muscles,
        s.week_number,
        `${s.phase_number} - ${PHASES[s.phase_number - 1]?.name ?? ""}`,
        s.started_at ? format(new Date(s.started_at), "yyyy-MM-dd HH:mm") : "",
        s.completed_at ? format(new Date(s.completed_at), "yyyy-MM-dd HH:mm") : "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob(["\ufeff" + [header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    download(blob, `gdshape-historico-${toISODate(new Date())}.csv`);
    toast.success(`${rows.length} treinos exportados.`);
  }

  function saveBackup() {
    download(new Blob([exportBackup()], { type: "application/json" }), `gdshape-backup-${toISODate(new Date())}.json`);
    toast.success("Backup salvo. Guarde o arquivo em local seguro.");
  }

  async function pickBackup(file: File | undefined) {
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    setRestoreText(await file.text());
  }

  async function restoreBackup() {
    try {
      importBackup(restoreText ?? "");
      await qc.invalidateQueries();
      toast.success("Backup restaurado.");
      navigate({ to: "/" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setRestoreText(null);
    }
  }

  async function resetProgram() {
    try {
      const start = normalizeStartDate(fromISODate(newStart));
      startProgram(start);
      await qc.invalidateQueries();
      toast.success("Novo programa iniciado. Seu histórico foi mantido.");
      navigate({ to: "/" });
    } catch {
      toast.error("Não foi possível redefinir o programa.");
    }
  }


  return (
    <div className="space-y-5">
      <PageHeader back eyebrow="Configurações" title="Perfil" />

      <section className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/60 bg-surface-raised font-display text-2xl font-bold glow-sm">
            {(profile.display_name ?? "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <label htmlFor="name" className="eyebrow">Nome</label>
            <div className="mt-1 flex gap-2">
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-background" />
              <Button size="icon" className="h-11 w-11 shrink-0 rounded-xl" onClick={saveName} disabled={savingName || !name.trim()} aria-label="Salvar nome">
                <Save />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <InfoTile label="Programa atual" value={program.name} />
        <InfoTile label="Semana atual" value={week >= 1 && week <= 16 ? `${week} de 16` : week === 0 ? "Não iniciado" : "Concluído"} />
        <InfoTile label="Data de início" value={format(fromISODate(program.start_date), "dd/MM/yyyy")} />
        <InfoTile label="Término previsto" value={format(new Date(fromISODate(program.start_date).getTime() + (16 * 7 - 1) * 86400000), "dd/MM/yyyy")} />
      </section>

      <section className="rounded-3xl border border-border bg-card p-2">
        <p className="eyebrow px-3 pb-1 pt-3">Preferências de exibição</p>
        <PrefRow label="Mensagem motivacional" desc="Mostrar frase no início" checked={prefs.showMotivation} onChange={(v) => setPref("showMotivation", v)} />
        <PrefRow label="Exercícios recolhidos" desc="Abrir cartões só ao tocar" checked={prefs.compactExercises} onChange={(v) => setPref("compactExercises", v)} />
      </section>

      <section className="space-y-2">
        <Button variant="surface" size="xl" className="w-full justify-start" onClick={exportCsv}>
          <Download className="text-primary" /> Exportar histórico (CSV)
        </Button>
        <Button variant="surface" size="xl" className="w-full justify-start" onClick={() => setResetOpen(true)}>
          <RotateCcw className="text-primary" /> Redefinir programa
        </Button>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">Dados salvos neste aparelho</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Seus treinos ficam guardados só neste navegador, sem conta e sem envio para a internet. Limpar os dados do
              navegador apaga o histórico, então salve um backup de vez em quando — ele também serve para levar tudo
              para outro aparelho.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="surface" className="h-12" onClick={saveBackup}>
            <FileDown className="text-primary" /> Salvar backup
          </Button>
          <Button variant="surface" className="h-12" onClick={() => fileRef.current?.click()}>
            <FileUp className="text-primary" /> Restaurar
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label="Arquivo de backup"
          onChange={(e) => pickBackup(e.target.files?.[0])}
        />
      </section>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Redefinir programa?"
        description={
          <span className="block space-y-3">
            <span className="block">O programa atual será arquivado e um novo ciclo de 16 semanas começará. Seu histórico de treinos não será apagado.</span>
            <span className="block">
              <span className="eyebrow block">Nova data de início</span>
              <input
                type="date"
                value={newStart}
                onChange={(e) => e.target.value && setNewStart(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-foreground"
              />
              <span className="mt-1 block text-xs">Semana 1 começa na segunda-feira {format(fromISODate(normalizeStartDate(fromISODate(newStart))), "dd/MM", { locale: ptBR })}.</span>
            </span>
          </span>
        }
        confirmLabel="Iniciar novo programa"
        cancelLabel="Cancelar"
        onConfirm={resetProgram}
      />
      <ConfirmDialog
        open={restoreText !== null}
        onOpenChange={(o) => !o && setRestoreText(null)}
        title="Restaurar backup?"
        description="Os dados atuais deste aparelho serão substituídos pelos do arquivo escolhido."
        confirmLabel="Restaurar"
        cancelLabel="Cancelar"
        onConfirm={restoreBackup}
        destructive
      />
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-snug">{value}</p>
    </div>
  );
}

function PrefRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl px-3 py-3 hover:bg-surface-raised">
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
