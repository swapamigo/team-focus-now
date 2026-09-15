import { useLocation } from "react-router-dom";
import ManagerExperience from "@/components/focus/ManagerExperience";
import { LoadState } from "@/components/focus/Shared";
import { useAuth } from "@/hooks/useAuth";
import { useFocusResource } from "@/hooks/useFocusResource";
import { loadManager, saveReward, checkReceipt, createFocusInvite } from "@/lib/focusApi";
import { supabase } from "@/integrations/supabase/client";

export default function FocusManager() {
  const { companyId } = useAuth();
  const { data, error, notReady, refresh } = useFocusResource(companyId, loadManager);
  const segment = useLocation().pathname.split("/").filter(Boolean).pop() ?? "";
  const view = ["rewards", "verify"].includes(segment) ? segment : "overview";
  if (!data || !companyId) return <LoadState notReady={notReady} error={error} retry={refresh} />;
  return <ManagerExperience data={data} view={view} demo={false} actions={{
    invite: () => createFocusInvite(companyId),
    saveReward: async (reward) => { await saveReward(companyId, reward); await refresh(); },
    lookup: (code) => checkReceipt(companyId, code),
    fulfill: (code) => checkReceipt(companyId, code, true),
    signOut: () => { void supabase.auth.signOut(); },
  }} />;
}
