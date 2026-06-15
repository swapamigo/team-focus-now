import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  consent_accepted_at: string | null;
  onboarded: boolean;
}

export interface UserContext {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: "manager" | "employee" | null;
  isAdmin: boolean;
  companyId: string | null;
  teamId: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useAuth(): UserContext {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<"manager" | "employee" | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContext = async (uid: string | undefined) => {
    if (!uid) {
      setProfile(null); setRole(null); setIsAdmin(false); setCompanyId(null); setTeamId(null);
      return;
    }
    const [{ data: prof }, { data: roles }, { data: members }, { data: tm }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role, company_id").eq("user_id", uid),
      supabase.from("company_members").select("company_id").eq("user_id", uid).limit(1),
      supabase.from("team_members").select("team_id").eq("user_id", uid).limit(1),
    ]);
    setProfile(prof as Profile | null);
    const allRoles = (roles ?? []).map((r: any) => r.role as string);
    const primary = allRoles.find((r) => r === "manager" || r === "employee") ?? null;
    setRole(primary as "manager" | "employee" | null);
    setIsAdmin(allRoles.includes("admin"));
    const nonAdminRole = (roles ?? []).find((r: any) => r.role !== "admin");
    setCompanyId(members?.[0]?.company_id ?? nonAdminRole?.company_id ?? null);
    setTeamId(tm?.[0]?.team_id ?? null);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setTimeout(() => loadContext(newSession?.user?.id).finally(() => setLoading(false)), 0);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      loadContext(s?.user?.id).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const refresh = async () => {
    await loadContext(session?.user?.id);
  };

  return {
    session,
    user: session?.user ?? null,
    profile,
    role,
    isAdmin,
    companyId,
    teamId,
    loading,
    refresh,
  };
}
