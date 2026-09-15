import { useEffect, useRef, type ReactNode } from "react";

/** Content is visible by default; motion is only a progressive enhancement. */
export default function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation>();
  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window) || !element.animate) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      if (!motion.matches) animation.current = element.animate(
        [{ opacity: 0, transform: "translateY(22px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 650, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
      );
      observer.disconnect();
    }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    observer.observe(element);
    const stop = () => { if (motion.matches) { animation.current?.cancel(); observer.disconnect(); } };
    motion.addEventListener("change", stop);
    return () => { observer.disconnect(); animation.current?.cancel(); motion.removeEventListener("change", stop); };
  }, [delay]);
  return <div ref={ref} className={className} onFocusCapture={() => animation.current?.finish()}>{children}</div>;
}
