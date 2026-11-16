import type { ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  right,
  back,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  right?: ReactNode;
  back?: boolean;
  className?: string;
}) {
  const router = useRouter();
  return (
    <header className={cn("flex items-end justify-between gap-3 pb-5 pt-2", className)}>
      <div className="flex min-w-0 items-end gap-2">
        {back && (
          <button
            onClick={() => (window.history.length > 1 ? router.history.back() : router.navigate({ to: "/inicio" }))}
            aria-label="Voltar"
            className="-ml-2 mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
          <h1 className="font-display text-4xl font-extrabold uppercase italic leading-none tracking-tight">{title}</h1>
        </div>
      </div>
      {right}
    </header>
  );
}

export function ProfileButton({ name }: { name?: string | null | undefined }) {
  const initials = (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <Link
      to="/perfil"
      aria-label="Perfil"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-surface-raised font-display text-lg font-bold text-foreground glow-sm"
    >
      {initials || "?"}
    </Link>
  );
}
