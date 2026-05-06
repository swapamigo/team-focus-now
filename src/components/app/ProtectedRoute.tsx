import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

export default function ProtectedRoute({ children, requireOnboarded = true }: { children: ReactNode; requireOnboarded?: boolean }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-12 w-12 rounded-2xl gradient-primary grid place-items-center animate-pulse-glow">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="text-sm">Lädt…</p>
        </div>
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  if (requireOnboarded && profile && !profile.onboarded) return <Navigate to="/onboarding/role" replace />;
  return <>{children}</>;
}
