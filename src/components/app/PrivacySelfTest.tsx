import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

type Result = {
  raw_events_older_than_24h: number;
  team_aggregates_below_k: number;
  min_team_k_default: number;
};

export default function PrivacySelfTest() {
  const t = useT();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase.rpc("privacy_self_test");
    if (error) setErr(error.message);
    else if (data && data[0]) setResult(data[0] as Result);
    setLoading(false);
  };

  useEffect(() => { run(); }, []);

  const ok = result && result.raw_events_older_than_24h === 0 && result.team_aggregates_below_k === 0;

  return (
    <div className={cn(
      "rounded-2xl border p-5",
      ok ? "border-emerald-500/30 bg-emerald-500/[0.04]" : "border-amber-500/30 bg-amber-500/[0.04]"
    )}>
      <div className="flex items-start gap-3 mb-3">
        {ok
          ? <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          : <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />}
        <div className="flex-1">
          <h3 className="font-semibold">{t("app.privacyselftest.title")}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("app.privacyselftest.desc")}
          </p>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border/60 hover:bg-muted/40 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} /> {t("app.privacyselftest.retest")}
        </button>
      </div>

      {err && <p className="text-xs text-destructive">{t("app.privacyselftest.error_prefix")} {err}</p>}

      {result && (
        <ul className="text-sm space-y-1.5 mt-2">
          <li className="flex justify-between">
            <span className="text-muted-foreground">{t("app.privacyselftest.raw_events_24h")}</span>
            <span className={cn("font-semibold tabular-nums", result.raw_events_older_than_24h === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600")}>
              {result.raw_events_older_than_24h}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">{t("app.privacyselftest.aggregates_below_k")}</span>
            <span className={cn("font-semibold tabular-nums", result.team_aggregates_below_k === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600")}>
              {result.team_aggregates_below_k}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">{t("app.privacyselftest.min_team_k")}</span>
            <span className="font-semibold tabular-nums">{result.min_team_k_default}</span>
          </li>
        </ul>
      )}
    </div>
  );
}
