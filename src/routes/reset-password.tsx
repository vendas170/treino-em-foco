import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Wordmark } from "@/components/gd/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — GDshape" },
      { name: "description", content: "Defina uma nova senha para sua conta GDshape." },
      { property: "og:title", content: "Nova senha — GDshape" },
      { property: "og:description", content: "Defina uma nova senha para sua conta GDshape." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada.");
    navigate({ to: "/inicio", replace: true });
  }

  return (
    <div className="min-h-dvh bg-background px-6 safe-top">
      <div className="mx-auto flex max-w-md flex-col gap-8 py-10">
        <Wordmark />
        <h1 className="font-display text-5xl font-extrabold uppercase italic leading-none">Nova senha</h1>
        <form onSubmit={submit} className="space-y-3">
          <Input type="password" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required className="h-12 rounded-xl bg-card text-base" autoComplete="new-password" />
          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
            {loading ? "Salvando…" : "Salvar nova senha"}
          </Button>
        </form>
      </div>
    </div>
  );
}
