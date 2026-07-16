import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function supabaseForUser(ctx: ToolContext) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export default defineTool({
  name: "list_my_teams",
  title: "List my teams",
  description: "Lists the TeamFokus teams the signed-in user belongs to (RLS-scoped).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = supabaseForUser(ctx);
    const { data: memberships, error: mErr } = await sb
      .from("team_members")
      .select("team_id")
      .eq("user_id", ctx.getUserId());
    if (mErr) return { content: [{ type: "text", text: mErr.message }], isError: true };
    const ids = (memberships ?? []).map((m: any) => m.team_id);
    if (ids.length === 0) {
      return { content: [{ type: "text", text: "No team memberships." }], structuredContent: { teams: [] } };
    }
    const { data: teams, error } = await sb.from("teams").select("*").in("id", ids);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(teams, null, 2) }],
      structuredContent: { teams: teams ?? [] },
    };
  },
});
