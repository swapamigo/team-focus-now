// Stilisierte Fantasy-Brand-Logos – rein dekorativ.
const Logo1 = () => (
  <svg viewBox="0 0 140 32" className="h-7 w-auto" aria-hidden>
    <circle cx="14" cy="16" r="10" fill="currentColor" />
    <circle cx="22" cy="16" r="6" fill="hsl(var(--background))" />
    <text x="40" y="22" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="16" fill="currentColor" letterSpacing="-0.5">NORDLUX</text>
  </svg>
);
const Logo2 = () => (
  <svg viewBox="0 0 150 32" className="h-7 w-auto" aria-hidden>
    <path d="M4 26 L14 6 L24 26 Z" fill="currentColor" />
    <text x="32" y="22" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="16" fill="currentColor" letterSpacing="-0.3">Vextra</text>
    <text x="86" y="22" fontFamily="Inter, sans-serif" fontWeight="300" fontSize="16" fill="currentColor" opacity="0.7">Group</text>
  </svg>
);
const Logo3 = () => (
  <svg viewBox="0 0 150 32" className="h-7 w-auto" aria-hidden>
    <rect x="4" y="6" width="20" height="20" rx="4" fill="currentColor" />
    <rect x="9" y="11" width="10" height="10" rx="2" fill="hsl(var(--background))" />
    <text x="32" y="22" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="15" fill="currentColor" letterSpacing="2">KAIROS</text>
  </svg>
);
const Logo4 = () => (
  <svg viewBox="0 0 150 32" className="h-7 w-auto" aria-hidden>
    <circle cx="14" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <text x="32" y="22" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="600" fontSize="17" fill="currentColor">helion.</text>
  </svg>
);
const Logo5 = () => (
  <svg viewBox="0 0 160 32" className="h-7 w-auto" aria-hidden>
    <path d="M6 22 L14 8 L22 22 M10 17 H18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    <text x="30" y="22" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="16" fill="currentColor">ATHENA</text>
    <text x="92" y="22" fontFamily="Inter, sans-serif" fontWeight="400" fontSize="16" fill="currentColor" opacity="0.6">labs</text>
  </svg>
);
const Logo6 = () => (
  <svg viewBox="0 0 150 32" className="h-7 w-auto" aria-hidden>
    <path d="M4 16 Q14 4 24 16 Q14 28 4 16 Z" fill="currentColor" />
    <text x="32" y="22" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="16" fill="currentColor" letterSpacing="-0.5">Meridian</text>
  </svg>
);
const Logo7 = () => (
  <svg viewBox="0 0 150 32" className="h-7 w-auto" aria-hidden>
    <rect x="4" y="8" width="6" height="16" fill="currentColor" />
    <rect x="13" y="4" width="6" height="24" fill="currentColor" opacity="0.7" />
    <rect x="22" y="12" width="6" height="12" fill="currentColor" opacity="0.5" />
    <text x="36" y="22" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="15" fill="currentColor" letterSpacing="-0.3">QUANTIVO</text>
  </svg>
);
const Logo8 = () => (
  <svg viewBox="0 0 150 32" className="h-7 w-auto" aria-hidden>
    <polygon points="14,4 24,16 14,28 4,16" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="14" cy="16" r="3" fill="currentColor" />
    <text x="32" y="22" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="16" fill="currentColor">Polaris</text>
  </svg>
);

const logos = [Logo1, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7, Logo8];

export default function SocialProofStrip() {
  // Doppelte Liste für nahtloses Marquee.
  const row = [...logos, ...logos];
  return (
    <section className="border-b border-border/40 bg-secondary/20 overflow-hidden">
      <div className="container py-6 md:py-7">
        <p className="text-center text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-4">
          Vertraut von wachsenden Teams
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex items-center gap-14 animate-marquee whitespace-nowrap text-foreground/60">
            {row.map((L, i) => (
              <div key={i} className="shrink-0 hover:text-foreground transition-colors">
                <L />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
