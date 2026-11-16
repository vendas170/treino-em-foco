import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Wordmark } from "@/components/gd/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GDshape — Train hard. Evolve every day." },
      { name: "description", content: "Abra o app e veja o treino do dia. Conclua em um toque e acompanhe as 16 semanas no calendário." },
      { property: "og:title", content: "GDshape — Train hard. Evolve every day." },
      { property: "og:description", content: "Treino do dia, conclusão em um toque, calendário e evolução das 16 semanas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/inicio", replace: true });
    });
  }, [navigate]);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background px-6 safe-top safe-bottom">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px]" />
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-between py-10">
        <Wordmark />
        <div>
          <p className="eyebrow mb-4">Treino avançado · 16 semanas</p>
          <h1 className="font-display text-[4.5rem] font-extrabold uppercase italic leading-[0.85] tracking-tight">
            Train hard.
            <br />
            <span className="text-primary text-glow">Evolve</span>
            <br />
            every day.
          </h1>
          <p className="mt-6 max-w-xs text-sm text-muted-foreground">
            Seu treino do dia em segundos. Conclua com um toque e veja a consistência tomar forma no calendário.
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild variant="hero" size="xl" className="w-full">
            <Link to="/auth" search={{ mode: "signup" }}>Criar conta</Link>
          </Button>
          <Button asChild variant="surface" size="xl" className="w-full">
            <Link to="/auth" search={{ mode: "signin" }}>Já tenho conta</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
