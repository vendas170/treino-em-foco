import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { toast } from "sonner";
import { Wordmark } from "@/components/gd/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type Mode = "signin" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { mode?: Mode; redirect?: string } => ({
    mode: s.mode === "signup" || s.mode === "forgot" ? s.mode : s.mode === "signin" ? "signin" : undefined,
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar — GDshape" },
      { name: "description", content: "Entre ou crie sua conta GDshape para acompanhar seu programa de treino." },
      { property: "og:title", content: "Entrar — GDshape" },
      { property: "og:description", content: "Acesse seu programa de treino de 16 semanas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function safeRedirect(r?: string) {
  if (!r) return "/inicio";
  try {
    const u = new URL(r, window.location.origin);
    if (u.origin !== window.location.origin) return "/inicio";
    return u.pathname + u.search;
  } catch {
    return "/inicio";
  }
}

function GoogleG() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="!h-[18px] !w-[18px]">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(search.mode ?? "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: safeRedirect(search.redirect), replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: safeRedirect(search.redirect), replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate, search.redirect]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/inicio", data: { display_name: name.trim() } },
        });
        if (error) throw error;
        if (!data.session) setSent("Enviamos um link de confirmação para o seu e-mail. Confirme para entrar.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent("Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha.");
      }
    } catch (err) {
      const msg = (err as Error).message;
      toast.error(/invalid login/i.test(msg) ? "E-mail ou senha incorretos." : msg);
    } finally {
      setLoading(false);
    }
  }

  async function social(provider: "google" | "lovable") {
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin + "/auth" });
    if (result.error) toast.error("Não foi possível entrar. Tente novamente.");
  }

  const title = mode === "signup" ? "Criar conta" : mode === "forgot" ? "Recuperar senha" : "Entrar";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background px-6 safe-top safe-bottom">
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary/15 blur-[110px]" />
      <div className="relative mx-auto flex max-w-md flex-col gap-8 py-10">
        <Wordmark />
        <div>
          <p className="eyebrow mb-2">Train hard. Evolve every day.</p>
          <h1 className="font-display text-5xl font-extrabold uppercase italic leading-none">{title}</h1>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-primary/40 bg-card p-5 text-sm">
            <p>{sent}</p>
            <Button variant="link" className="mt-2 px-0" onClick={() => { setSent(null); setMode("signin"); }}>
              Voltar para entrar
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && (
                <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl bg-card text-base" autoComplete="name" />
              )}
              <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl bg-card text-base" autoComplete="email" />
              {mode !== "forgot" && (
                <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-12 rounded-xl bg-card text-base" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
              )}
              <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
                {loading ? "Aguarde…" : mode === "signup" ? "Criar conta" : mode === "forgot" ? "Enviar link" : "Entrar"}
              </Button>
            </form>

            {mode !== "forgot" && (
              <>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  ou
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-3">
                  <Button type="button" variant="surface" size="xl" className="w-full" onClick={() => social("google")}>
                    <GoogleG />
                    Continuar com Google
                  </Button>
                  <Button type="button" variant="surface" size="xl" className="w-full" onClick={() => social("lovable")}>
                    <LovableMark className="!h-[18px] !w-[18px]" />
                    Continuar com Lovable
                  </Button>
                </div>
              </>
            )}

            <div className="flex flex-col items-center gap-1 text-sm">
              {mode === "signin" && (
                <>
                  <button className="text-muted-foreground hover:text-foreground" onClick={() => setMode("forgot")}>Esqueci minha senha</button>
                  <button className="font-semibold text-primary" onClick={() => setMode("signup")}>Não tem conta? Criar agora</button>
                </>
              )}
              {mode !== "signin" && (
                <button className="font-semibold text-primary" onClick={() => setMode("signin")}>Já tenho conta</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
