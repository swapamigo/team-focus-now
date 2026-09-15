import { supabase } from "@/integrations/supabase/client";
import type { EmployeeData, ManagerData, Receipt, Reward } from "./focusGame";

// RPC boundary for the accompanying migration. Keep all real credits/redemptions
// on the server; demo browser storage is never imported into authenticated data.
async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(name as never, args as never);
  if (error) { const failure = new Error(error.message); if (error.code === "PGRST202") failure.name = "FocusBackendNotReady"; throw failure; }
  return data as T;
}
export const loadEmployee = (companyId: string) => rpc<EmployeeData>("focus_employee", { p_company_id: companyId });
export const loadManager = (companyId: string) => rpc<ManagerData>("focus_manager", { p_company_id: companyId });
export const redeemReward = (companyId: string, id: string, expectedPrice: number, requestId: string) => rpc<Receipt>("focus_redeem", { p_company_id: companyId, p_reward_id: id, p_expected_points: expectedPrice, p_request_id: requestId });
export const saveReward = (companyId: string, reward: Omit<Reward, "id"> & { id?: string }) => rpc<void>("focus_save_reward", { p_company_id: companyId, p_id: reward.id ?? null, p_title: reward.title, p_description: reward.description, p_points: reward.points, p_kind: reward.kind, p_active: reward.active });
export const checkReceipt = (companyId: string, code: string, fulfill = false) => rpc<Receipt>("focus_receipt", { p_company_id: companyId, p_code: code.trim().toUpperCase(), p_fulfill: fulfill });
export const saveAlias = (alias: string) => rpc<void>("focus_set_alias", { p_alias: alias });
export const createFocusInvite = (companyId: string) => rpc<string>("focus_create_invite", { p_company_id: companyId });
