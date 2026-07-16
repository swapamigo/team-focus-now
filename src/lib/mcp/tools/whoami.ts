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
  name: "whoami",
  title: "Who am I",
  description: "Returns the signed-in TeamFokus user's profile, role and company/team assignment.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const uid = ctx.getUserId();
    const sb = supabaseForUser(ctx);
    const [{ data: profile }, { data: roles }, { data: membership }, { data: teams }] = await Promise.all([
      sb.from("profiles").select("id, display_name, onboarded, beta_access").eq("id", uid).maybeSingle(),
      sb.from("user_roles").select("role, company_id").eq("user_id", uid),
      sb.from("company_members").select("company_id").eq("user_id", uid),
      sb.from("team_members").select("team_id").eq("user_id", uid),
    ]);
    const result = {
      user_id: uid,
      email: ctx.getUserEmail(),
      profile,
      roles: roles ?? [],
      companies: (membership ?? []).map((m: any) => m.company_id),
      teams: (teams ?? []).map((t: any) => t.team_id),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
