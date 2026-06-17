import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import Seo from "@/components/Seo";

export default function JoinByCode() {
  const { code } = useParams<{ code: string }>();
  const { session, loading, refresh } = useAuth();
  const nav = useNavigate();
  const [status, setStatus] = useState<"checking" | "joining" | "error">("checking");
  const [message, setMessage] = useState("");

  // Code im sessionStorage parken, bis User eingeloggt ist
  useEffect(() => {
    if (code) sessionStorage.setItem("pending_invite_code", code);
  }, [code]);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      // → Login, kommt nach Auth wieder hierher
      nav(`/login?redirect=${encodeURIComponent(`/join/${code}`)}`, { replace: true });
      return;
    }
    if (!code) return;
    setStatus("joining");
    (async () => {
      const { error } = await supabase.rpc("join_with_invite", { _code: code });
      if (error) {
        setStatus("error");
        setMessage(error.message);
        toast.error("Beitritt fehlgeschlagen: " + error.message);
        return;
      }
      sessionStorage.removeItem("pending_invite_code");
      toast.success("Workspace beigetreten");
      await refresh();
      // Hard reload damit alle States frisch sind
      window.location.replace("/app");
    })();
  }, [loading, session, code]);

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <Seo
        title="Team beitreten – Team Focus"
        description="Tritt deinem Team auf Team Focus per Einladungscode bei."
        path={`/join/${code ?? ""}`}
        noindex
      />
      <div className="text-center">
        <div className="flex justify-center mb-6"><Logo /></div>
        {status === "error" ? (
          <>
            <h1 className="text-xl font-semibold mb-2">Beitritt nicht möglich</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
          </>
        ) : (
          <>
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-sm text-muted-foreground">
              {status === "joining" ? "Du wirst dem Workspace hinzugefügt…" : "Einen Moment…"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
