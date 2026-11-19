import { useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Wordmark } from "./Logo";
import { Button } from "@/components/ui/button";
import { fromISODate, normalizeStartDate, toISODate } from "@/lib/schedule";
import { importBackup, startProgram, updateProfile } from "@/lib/data";

export function Onboarding() {
  const qc = useQueryClient();
  const [date, setDate] = useState(toISODate(new Date()));
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const start = normalizeStartDate(fromISODate(date));

  /** Em um aparelho novo, permite trazer o histórico de um backup salvo antes. */
  async function restore(file: File | undefined) {
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    try {
      const store = importBackup(await file.text());
      await qc.invalidateQueries();
      if (!store.programs.some((p) => p.status === "active")) {
        toast.message("Backup restaurado, mas sem programa ativo. Escolha a data de início.");
      } else toast.success("Backup restaurado.");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function create() {
    setSaving(true);
    try {
      if (name.trim()) updateProfile({ display_name: name.trim() });
      startProgram(start);
      await qc.invalidateQueries();
      toast.success("Programa iniciado. Bora treinar!");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-[85dvh] flex-col justify-center gap-8 py-10">
      <Wordmark size="lg" />
      <div>
        <p className="eyebrow mb-2">Treino Avançado Masculino</p>
        <h1 className="font-display text-5xl font-extrabold uppercase italic leading-[0.9]">
          16 semanas.
          <br />
          <span className="text-primary text-glow">80 treinos.</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Escolha quando o programa começa. A rotação A–B–C–D–E é calculada automaticamente a partir dessa data.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <label htmlFor="name" className="eyebrow">
          Seu nome (opcional)
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como quer ser chamado"
          autoComplete="given-name"
          className="mt-2 mb-5 h-12 w-full rounded-xl border border-input bg-background px-4 text-base font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <label htmlFor="start" className="eyebrow">
          Data de início
        </label>
        <input
          id="start"
          type="date"
          value={date}
          onChange={(e) => e.target.value && setDate(e.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-base font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          A semana de treino começa na segunda-feira. Semana 1 inicia em{" "}
          <strong className="text-foreground">{format(fromISODate(start), "EEEE, d 'de' MMMM", { locale: ptBR })}</strong>.
        </p>
      </div>
      <Button variant="hero" size="xl" onClick={create} disabled={saving}>
        {saving ? "Criando…" : "Começar programa"}
      </Button>
      <div className="-mt-4 text-center">
        <Button variant="link" className="text-muted-foreground" onClick={() => fileRef.current?.click()}>
          <FileUp className="text-primary" /> Já tenho um backup · restaurar
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label="Arquivo de backup"
          onChange={(e) => restore(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
