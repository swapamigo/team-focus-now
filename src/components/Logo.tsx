import logoSrc from "/logo.png";
import { cn } from "@/lib/utils";

export function Logo({ size = 36, className, withWordmark = false }: { size?: number; className?: string; withWordmark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src={logoSrc}
        alt="Team Focus Logo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="rounded-[22%] shadow-[var(--shadow-sm)]"
      />
      {withWordmark && (
        <span className="font-semibold tracking-tight text-lg">Team Focus</span>
      )}
    </span>
  );
}

export default Logo;
