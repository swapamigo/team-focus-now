import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, MailX, CheckCircle2, AlertCircle } from "lucide-react";
import Logo from "@/components/Logo";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State = "loading" | "valid" | "invalid" | "done" | "error";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_KEY } }
        );
        if (!active) return;
        setState(res.ok ? "valid" : "invalid");
      } catch {
        if (active) setState("error");
      }
    })();
    return () => { active = false; };
  }, [token]);

  const confirm = async () => {
    setBusy(true);
    const { error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
    setBusy(false);
    setState(error ? "error" : "done");
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Abmeldung – TeamFokus" description="E-Mail-Benachrichtigungen von TeamFokus abmelden." path="/unsubscribe" />
      <header className="border-b border-border/40">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Logo withWordmark /></Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>
        </div>
      </header>

      <main className="container py-16 max-w-lg">
        <div className="surface-card p-8 text-center">
          {state === "loading" && <p className="text-muted-foreground">Prüfe Link…</p>}

          {state === "valid" && (
            <>
              <div className="inline-flex h-12 w-12 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-4">
                <MailX className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-semibold mb-2">Abmeldung bestätigen</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Du erhältst danach keine weiteren E-Mails von TeamFokus an diese Adresse.
              </p>
              <Button onClick={confirm} disabled={busy} size="lg" className="shadow-glow">
                {busy ? "Wird abgemeldet…" : "Jetzt abmelden"}
              </Button>
            </>
          )}

          {state === "done" && (
            <>
              <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
              <h1 className="text-2xl font-semibold mb-2">Erfolgreich abgemeldet</h1>
              <p className="text-sm text-muted-foreground">Danke – wir haben deine Adresse entfernt.</p>
            </>
          )}

          {(state === "invalid" || state === "error") && (
            <>
              <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
              <h1 className="text-2xl font-semibold mb-2">Link ungültig</h1>
              <p className="text-sm text-muted-foreground">
                Dieser Abmelde-Link ist abgelaufen oder ungültig. Schreib uns gern an{" "}
                <a href="mailto:joel@teamfokus.app" className="text-primary hover:underline">joel@teamfokus.app</a>.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
