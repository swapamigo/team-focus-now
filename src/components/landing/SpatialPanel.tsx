import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { usePointerDepth } from "@/hooks/usePointerDepth";
import { useScrollDepth } from "@/hooks/useScrollDepth";

/** The decoration moves in depth while the copy and controls stay readable. */
export default function SpatialPanel({ children, icon: Icon, variant = "panel", tone = "blue", className = "" }: {
  children: ReactNode;
  icon: LucideIcon;
  variant?: "panel" | "intro";
  tone?: "blue" | "mint";
  className?: string;
}) {
  const pointer = usePointerDepth();
  useScrollDepth(pointer.ref);
  return <div {...pointer} className={`spatial-section spatial-${variant} ${className}`} data-tone={tone}>
    <div className="spatial-backdrop" aria-hidden="true"><span className="spatial-halo" /><span className="spatial-ribbon" /></div>
    <div className="spatial-surface">
      <div className="spatial-copy">{children}</div>
      <div className="spatial-emblem" aria-hidden="true">
        <span className="emblem-shadow" /><span className="emblem-orbit" />
        <span className="emblem-plate"><Icon strokeWidth={1.35} /></span>
        <span className="emblem-dot emblem-dot-near" /><span className="emblem-dot emblem-dot-far" />
      </div>
    </div>
  </div>;
}
