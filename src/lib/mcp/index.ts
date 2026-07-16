import { auth, defineMcp } from "@lovable.dev/mcp-js";
import whoami from "./tools/whoami";
import listMyTeams from "./tools/list-my-teams";
import listNotifications from "./tools/list-notifications";

// Build the OAuth issuer from the project ref (import-safe: Vite inlines this
// as a literal at build time). NEVER use SUPABASE_URL — on Lovable Cloud that
// is the .lovable.cloud proxy, and mcp-js rejects tokens whose issuer does not
// match the discovery document.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "teamfokus-mcp",
  title: "TeamFokus",
  version: "0.1.0",
  instructions:
    "TeamFokus tools for the signed-in user. Use `whoami` to inspect the current account, `list_my_teams` for team memberships, and `list_my_notifications` for recent notifications. All tools respect the app's row-level security.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [whoami, listMyTeams, listNotifications],
});
