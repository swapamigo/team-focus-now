import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";

interface Props {
  children: ReactNode;
  requireOnboarded?: boolean;
  requireRole?: "manager" | "employee";
}

// Während der Pre-Launch-Phase ist der echte Produktbereich gesperrt.
// Nur über den versteckten Footer-Link „Prototyp" erhält der Entwickler Zugang.
const hasPrototypeAccess = () => {
  try { return typeof window !== "undefined" && localStorage.getItem("prototype_access") === "1"; }
  catch { return false; }
};

export default function ProtectedRoute({ children, requireOnboarded = true, requireRole }: Props) {
  const { session, profile, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="animate-pulse-glow"><Logo size={48} /></div>
          <p className="text-sm">Lädt…</p>
        </div>
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  if (!hasPrototypeAccess()) return <Navigate to="/checkout" replace />;
  if (requireOnboarded && profile && !profile.onboarded) return <Navigate to="/onboarding/role" replace />;
  if (requireRole && role && role !== requireRole) {
    return <Navigate to={role === "manager" ? "/manager" : "/app"} replace />;
  }
  return <>{children}</>;
}
