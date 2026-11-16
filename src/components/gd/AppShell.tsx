import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CloudOff, RefreshCw } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { Onboarding } from "./Onboarding";
import { useGD } from "@/hooks/use-gd";
import { flushQueue, getLocalUserId, readQueue } from "@/lib/data";

function useSyncStatus() {
  const qc = useQueryClient();
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const uid = await getLocalUserId();
      if (alive) setPending(uid ? readQueue(uid).length : 0);
    };
    const sync = async () => {
      setOnline(navigator.onLine);
      if (!navigator.onLine) return refresh();
      const res = await flushQueue();
      if (res.synced > 0 || res.rejected > 0) await qc.invalidateQueries({ queryKey: ["sessions"] });
      refresh();
    };
    sync();
    const onOffline = () => setOnline(false);
    window.addEventListener("online", sync);
    window.addEventListener("offline", onOffline);
    const id = window.setInterval(refresh, 4000);
    return () => {
      alive = false;
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", onOffline);
      window.clearInterval(id);
    };
  }, [qc]);

  return { online, pending };
}

export function AppShell({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) {
  const { program } = useGD();
  const { online, pending } = useSyncStatus();

  return (
    <div className="min-h-dvh bg-background">
      {(!online || pending > 0) && (
        <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-surface-raised px-4 py-2 text-xs font-semibold text-muted-foreground safe-top">
          {online ? <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" /> : <CloudOff className="h-3.5 w-3.5 text-primary" />}
          {online
            ? `Sincronizando ${pending} registro(s)…`
            : pending > 0
              ? `Sem conexão · ${pending} registro(s) aguardando sincronização`
              : "Sem conexão · exibindo dados salvos no aparelho"}
        </div>
      )}
      <main className={`mx-auto max-w-md px-5 safe-top ${hideNav ? "pb-10" : "pb-nav"}`}>
        {program ? children : <Onboarding />}
      </main>
      {program && !hideNav && <BottomNav />}
    </div>
  );
}
