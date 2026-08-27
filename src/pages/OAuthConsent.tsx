import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useT } from "@/i18n";

type SupabaseOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

function oauth(): SupabaseOAuth {
  return (supabase.auth as any).oauth as SupabaseOAuth;
}

export default function OAuthConsent() {
  const t = useT();
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError(t("pages.oauthconsent.error.missingId"));
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
          setError(error.message ?? t("pages.oauthconsent.error.loadFailed"));
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e: any) {
        setError(e?.message ?? t("pages.oauthconsent.error.unknown"));
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
        setError(error.message ?? t("pages.oauthconsent.error.actionFailed"));
        setBusy(false);
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setError(t("pages.oauthconsent.error.noRedirect"));
        setBusy(false);
        return;
      }
      window.location.href = target;
    } catch (e: any) {
      setError(e?.message ?? t("pages.oauthconsent.error.unknown"));
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
            {t("pages.oauthconsent.error.loadTitlePrefix")} {error}
          </div>
        )}

        {!error && !details && <p className="text-sm text-muted-foreground">{t("pages.oauthconsent.loading")}</p>}

        {details && (
          <>
            <h1 className="text-xl font-semibold tracking-tight">
              {t("pages.oauthconsent.title", { app: details.client?.name ?? t("pages.oauthconsent.defaultApp") })}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("pages.oauthconsent.desc1", { app: details.client?.name ?? t("pages.oauthconsent.defaultClient") })}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("pages.oauthconsent.desc2")}
            </p>

            <div className="mt-6 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                disabled={busy}
                onClick={() => decide(false)}
              >
                {t("pages.oauthconsent.deny")}
              </Button>
              <Button
                className="flex-1"
                disabled={busy}
                onClick={() => decide(true)}
              >
                {t("pages.oauthconsent.allow")}
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
