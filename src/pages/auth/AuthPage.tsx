import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import Seo from "@/components/Seo";
import { z } from "zod";
import { useT } from "@/i18n";

interface Props { mode: "login" | "register" }

export default function AuthPage({ mode }: Props) {
  const t = useT();
  const nav = useNavigate();
  const loc = useLocation();
  const { session, profile, role, isAdmin, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    email: z.string().trim().email(t("auth.authpage.invalid_email")).max(255),
    password: z.string().min(6, t("auth.authpage.min_chars")).max(100),
  });

  const params = new URLSearchParams(loc.search);
  const nextParam = params.get("next") || params.get("redirect");
  const inviteCode = params.get("invite");
  const hasBetaAccess = profile?.beta_access === true;
  // Admins gehen direkt in den Admin-Bereich.
  // Sonst: Standardziel = Warteliste. Nur mit serverseitigem Beta-Zugang in den echten App-Bereich.
  const defaultPostAuth = isAdmin
    ? "/admin/leads"
    : hasBetaAccess
      ? (profile && !profile.onboarded ? "/onboarding/role" : role === "manager" ? "/manager" : "/app")
      : "/waitlist";

  if (!authLoading && session) {
    return <Navigate to={nextParam ?? defaultPostAuth} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success(t("auth.authpage.account_created"));
        nav(nextParam ?? (inviteCode ? `/onboarding/employee?invite=${inviteCode}` : defaultPostAuth));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("auth.authpage.welcome_back_toast"));
        nav(nextParam ?? defaultPostAuth);
      }
    } catch (err: any) {
      toast.error(err.message ?? t("auth.authpage.generic_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const target = nextParam ?? defaultPostAuth;
    const redirectUri = `${window.location.origin}${target.startsWith("/") ? target : "/" + target}`;
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: redirectUri });
    if (result.error) {
      toast.error(t("auth.authpage.google_failed"));
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    nav(target);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title={mode === "login" ? t("auth.authpage.seo_title_login") : t("auth.authpage.seo_title_register")}
        description={mode === "login"
          ? t("auth.authpage.seo_desc_login")
          : t("auth.authpage.seo_desc_register")}
        path={mode === "login" ? "/login" : "/register"}
        noindex
      />
      <header className="container py-6">
        <Link to="/" className="inline-flex items-center">
          <Logo withWordmark />
        </Link>
      </header>

      <div className="flex-1 grid place-items-center px-4">
        <div className="w-full max-w-md surface-card p-8 animate-scale-in">
          <h1 className="text-3xl font-semibold tracking-tight mb-1">
            {mode === "login" ? t("auth.authpage.welcome_back") : t("auth.authpage.create_account")}
          </h1>
          <p className="text-sm text-muted-foreground mb-7">
            {mode === "login" ? t("auth.authpage.login_subtitle") : t("auth.authpage.register_subtitle")}
          </p>

          <Button onClick={handleGoogle} disabled={loading} variant="outline" className="w-full h-12 rounded-2xl mb-4">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {t("auth.authpage.continue_google")}
          </Button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t("auth.authpage.or_email")}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">{t("auth.authpage.display_name")}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auth.authpage.display_name_placeholder")} className="h-11 rounded-xl" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("auth.authpage.email")}</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.authpage.email_placeholder")} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t("auth.authpage.password")}</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 rounded-xl" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl shadow-glow">
              {loading ? t("auth.authpage.please_wait") : mode === "login" ? t("auth.authpage.login") : t("auth.authpage.create_account")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>{t("auth.authpage.no_account")} <Link to="/register" className="text-primary font-medium">{t("auth.authpage.register_link")}</Link></>
            ) : (
              <>{t("auth.authpage.already_registered")} <Link to="/login" className="text-primary font-medium">{t("auth.authpage.login")}</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
