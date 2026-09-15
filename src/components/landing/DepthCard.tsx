import type { ReactNode } from "react";
import { usePointerDepth } from "@/hooks/usePointerDepth";

export default function DepthCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const pointer = usePointerDepth();
  return <div {...pointer} className="depth-scene h-full"><article className={`depth-card h-full ${className}`}>{children}</article></div>;
}
