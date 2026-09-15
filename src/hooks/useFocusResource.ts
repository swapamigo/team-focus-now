import { useCallback, useEffect, useRef, useState } from "react";

export function useFocusResource<T>(companyId: string | null, loader: (id: string) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const [notReady, setNotReady] = useState(false);
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++sequence.current;
    setNotReady(false);
    if (!companyId) { setData(null); setError(true); return; }
    setError(false);
    try {
      const result = await loader(companyId);
      if (request === sequence.current) setData(result);
    } catch (failure) {
      if (request === sequence.current) { setError(true); setData(null); setNotReady(failure instanceof Error && failure.name === "FocusBackendNotReady"); }
    }
  }, [companyId, loader]);
  useEffect(() => { setData(null); void refresh(); return () => { sequence.current++; }; }, [refresh]);
  return { data, error, notReady, refresh };
}
