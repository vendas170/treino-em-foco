import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BottomNav } from "./BottomNav";
import { Onboarding } from "./Onboarding";
import { useGD } from "@/hooks/use-gd";
import { requestPersistentStorage, STORE_KEY } from "@/lib/data";

/** Mantém as telas atualizadas se o app estiver aberto em outra aba. */
function useStoreSync() {
  const qc = useQueryClient();
  useEffect(() => {
    requestPersistentStorage();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORE_KEY) void qc.invalidateQueries();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [qc]);
}

export function AppShell({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) {
  const { program } = useGD();
  useStoreSync();

  return (
    <div className="min-h-dvh bg-background">
      <main className={`mx-auto max-w-md px-5 safe-top ${hideNav ? "pb-10" : "pb-nav"}`}>
        {program ? children : <Onboarding />}
      </main>
      {program && !hideNav && <BottomNav />}
    </div>
  );
}
