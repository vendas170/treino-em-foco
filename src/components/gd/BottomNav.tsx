import { Link } from "@tanstack/react-router";
import { BarChart3, CalendarDays, Dumbbell, History, Home } from "lucide-react";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/treinos", label: "Treinos", icon: Dumbbell },
  { to: "/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/evolucao", label: "Evolução", icon: BarChart3 },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl safe-bottom">
      <ul className="mx-auto grid max-w-md grid-cols-5 px-2 pt-2">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="group flex flex-col items-center gap-1 rounded-xl py-1.5 text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <span className="relative flex h-8 w-12 items-center justify-center rounded-full transition-all group-data-[status=active]:bg-primary/12 group-data-[status=active]:glow-sm">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
