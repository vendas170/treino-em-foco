export function ProgressRing({ value, size = 88, stroke = 8, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-surface-raised" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700"
          style={{ filter: "drop-shadow(0 0 6px var(--primary))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-extrabold leading-none">{value}%</span>
        {label && <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
