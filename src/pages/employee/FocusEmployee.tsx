import { useLocation } from "react-router-dom";
import EmployeeExperience from "@/components/focus/EmployeeExperience";
import { LoadState } from "@/components/focus/Shared";
import { useAuth } from "@/hooks/useAuth";
import { useFocusResource } from "@/hooks/useFocusResource";
import { loadEmployee, redeemReward, saveAlias } from "@/lib/focusApi";
import { supabase } from "@/integrations/supabase/client";

export default function FocusEmployee() {
  const { companyId } = useAuth();
  const { data, error, notReady, refresh } = useFocusResource(companyId, loadEmployee);
  const segment = useLocation().pathname.split("/").filter(Boolean).pop() ?? "";
  const view = ["progress", "ranking", "shop"].includes(segment) ? segment : "today";
  if (!data || !companyId) return <LoadState notReady={notReady} error={error} retry={refresh} />;
  return <EmployeeExperience data={data} view={view} demo={false} actions={{
    redeem: async (...args) => { const receipt = await redeemReward(companyId, ...args); await refresh(); return receipt; },
    alias: async (alias) => { await saveAlias(alias); await refresh(); },
    signOut: () => { void supabase.auth.signOut(); },
  }} />;
}
