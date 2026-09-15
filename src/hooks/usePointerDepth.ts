import { useCallback, useEffect, useRef, type PointerEvent } from "react";

/** Decorative, frame-limited pointer response. Touch and reduced-motion stay still. */
export function usePointerDepth() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const enabled = useRef(false);
  const reset = useCallback(() => {
    cancelAnimationFrame(frame.current);
    for (const key of ["--tilt-x", "--tilt-y", "--light-x", "--light-y"])
      ref.current?.style.removeProperty(key);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => { enabled.current = media.matches; if (!media.matches) reset(); };
    update();
    media.addEventListener("change", update);
    return () => { media.removeEventListener("change", update); reset(); };
  }, [reset]);
  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!enabled.current || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const style = ref.current?.style;
      style?.setProperty("--tilt-x", `${(0.5 - y) * 6}deg`);
      style?.setProperty("--tilt-y", `${(x - 0.5) * 8}deg`);
      style?.setProperty("--light-x", `${x * 100}%`);
      style?.setProperty("--light-y", `${y * 100}%`);
    });
  }, []);
  return { ref, onPointerMove, onPointerLeave: reset, onPointerCancel: reset };
}
