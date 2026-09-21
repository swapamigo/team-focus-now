import { useEffect, type RefObject } from "react";

type Scene = { visible: boolean; value: string };
const scenes = new Map<HTMLElement, Scene>();
let frame = 0;
let observer: IntersectionObserver | undefined;

function render() {
  frame = 0;
  const height = window.innerHeight;
  // Read stable scene wrappers first; only their children are transformed.
  const changes: [HTMLElement, Scene, string][] = [];
  for (const [element, scene] of scenes) {
    if (!scene.visible) continue;
    const rect = element.getBoundingClientRect();
    if (rect.bottom < -120 || rect.top > height + 120) continue;
    const distance = height * 0.6 + rect.height * 0.4;
    const progress = Math.max(-1, Math.min(1, (height * 0.55 - rect.top - rect.height / 2) / distance));
    const value = progress.toFixed(3);
    if (value !== scene.value) changes.push([element, scene, value]);
  }
  for (const [element, scene, value] of changes) {
    element.style.setProperty("--scene-progress", value);
    scene.value = value;
  }
}

function schedule() {
  if (scenes.size && !frame && !document.hidden) frame = requestAnimationFrame(render);
}

/** Re-measure after an entrance animation changes an ancestor's position. */
export function refreshScrollDepth() { schedule(); }

function visibilityChanged() {
  if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
  else schedule();
}

function register(element: HTMLElement) {
  if (!scenes.size) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", visibilityChanged);
    if ("IntersectionObserver" in window) observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const scene = scenes.get(target);
        if (scene) {
          scene.visible = entry.isIntersecting;
          target.toggleAttribute("data-scroll-visible", entry.isIntersecting);
        }
      }
      schedule();
    }, { rootMargin: "120px" });
  }
  scenes.set(element, { visible: true, value: "" });
  observer?.observe(element);
  schedule();
  return () => {
    observer?.unobserve(element);
    scenes.delete(element);
    element.style.removeProperty("--scene-progress");
    element.removeAttribute("data-scroll-visible");
    if (!scenes.size) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibilityChanged);
      observer?.disconnect(); observer = undefined;
      cancelAnimationFrame(frame); frame = 0;
    }
  };
}

/** One passive, on-demand frame for all visible scenes; no scroll interception. */
export function useScrollDepth(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let unregister: (() => void) | undefined;
    const update = () => {
      unregister?.();
      unregister = motion.matches ? undefined : register(element);
    };
    update();
    motion.addEventListener("change", update);
    return () => { motion.removeEventListener("change", update); unregister?.(); };
  }, [ref]);
}
