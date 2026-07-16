import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

type SupabaseOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

function oauth(): SupabaseOAuth {
  return (supabase.auth as any).oauth as SupabaseOAuth;
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Fehlende authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      try {
        const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) {
          setError(error.message ?? "Autorisierung konnte nicht geladen werden");
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e: any) {
        setError(e?.message ?? "Unbekannter Fehler");
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    try {
      const { data, error } = approve
        ? await oauth().approveAuthorization(authorizationId)
        : await oauth().denyAuthorization(authorizationId);
      if (error) {
        setError(error.message ?? "Aktion fehlgeschlagen");
        setBusy(false);
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setError("Der Authorization-Server hat keine Redirect-URL zurückgegeben.");
        setBusy(false);
        return;
      }
      window.location.href = target;
    } catch (e: any) {
      setError(e?.message ?? "Unbekannter Fehler");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Logo size={40} />
          <span className="font-semibold text-lg">TeamFokus</span>
        </div>

        {error && (
          <div className="text-sm text-destructive mb-4">
            Diese Autorisierungs-Anfrage konnte nicht geladen werden: {error}
          </div>
        )}

        {!error && !details && <p className="text-sm text-muted-foreground">Wird geladen…</p>}

        {details && (
          <>
            <h1 className="text-xl font-semibold tracking-tight">
              {details.client?.name ?? "Eine Anwendung"} mit deinem TeamFokus-Konto verbinden
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Dadurch kann {details.client?.name ?? "der Client"} die aktivierten TeamFokus-Tools als du nutzen, solange du angemeldet bist.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Die Berechtigungen deiner App und die Backend-Regeln bleiben unverändert – nichts wird umgangen.
            </p>

            <div className="mt-6 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                disabled={busy}
                onClick={() => decide(false)}
              >
                Ablehnen
              </Button>
              <Button
                className="flex-1"
                disabled={busy}
                onClick={() => decide(true)}
              >
                Erlauben
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
