/** Optional, local-only prototype settings; never sent to the employer API. */
export const FOCUS_APPS = ["Instagram", "TikTok", "YouTube"] as const;
export const FOCUS_DURATIONS = [15, 25, 50] as const;
export type FocusApp = typeof FOCUS_APPS[number];
export interface FocusSettings {
  apps: FocusApp[];
  minutes: typeof FOCUS_DURATIONS[number];
  until: number | null;
}
