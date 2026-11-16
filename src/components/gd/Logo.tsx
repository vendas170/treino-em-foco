import logo from "@/assets/gdshape_logo.png.asset.json";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return <img src={logo.url} alt="GDshape" className={cn("logo-blend select-none object-contain", className)} draggable={false} />;
}

export function Wordmark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? "text-5xl" : size === "sm" ? "text-xl" : "text-2xl";
  const mark = size === "lg" ? "h-20 w-20" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <LogoMark className={cn(mark, "-ml-1")} />
      <span className={cn("font-display font-extrabold italic uppercase leading-none tracking-tight", text)}>
        GD<span className="text-primary">shape</span>
      </span>
    </div>
  );
}
