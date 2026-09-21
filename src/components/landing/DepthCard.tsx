import type { ReactNode } from "react";
import { usePointerDepth } from "@/hooks/usePointerDepth";
import { useScrollDepth } from "@/hooks/useScrollDepth";

export default function DepthCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const pointer = usePointerDepth();
  useScrollDepth(pointer.ref);
  return <div {...pointer} className="depth-scene h-full"><article className={`depth-card h-full ${className}`}>{children}</article></div>;
}
