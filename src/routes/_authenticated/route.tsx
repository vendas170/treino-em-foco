import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (data.user) return;
    // Sem internet não é possível revalidar; usa a sessão salva no aparelho para permitir consulta offline.
    if (error && !navigator.onLine) {
      const { data: s } = await supabase.auth.getSession();
      if (s.session) return;
    }
    throw redirect({ to: "/auth", search: { redirect: location.href } });
  },
  component: () => <Outlet />,
});
