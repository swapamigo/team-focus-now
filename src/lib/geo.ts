// Best-effort IP geolocation for lead capture. Silently returns nulls on failure.
export interface GeoInfo {
  country: string | null;
  country_code: string | null;
}

let cached: GeoInfo | null = null;

export async function getVisitorGeo(): Promise<GeoInfo> {
  if (cached) return cached;
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!res.ok) throw new Error("geo failed");
    const j = await res.json();
    cached = {
      country: typeof j.country_name === "string" ? j.country_name : null,
      country_code: typeof j.country_code === "string" ? j.country_code : null,
    };
    return cached;
  } catch {
    cached = { country: null, country_code: null };
    return cached;
  }
}
