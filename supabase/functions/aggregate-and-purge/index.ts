// Edge function: aggregate-and-purge
// Runs daily (cron). Computes per-user daily summaries, writes team aggregates only
// once min_team_k members are present, then HARD-DELETES all raw usage events.
// Data flow:
//   usage_events (transient, < 24h) → daily_user_summaries (per person, history)
//   daily_user_summaries (per person)     → daily_team_summaries (only if members >= k)
// After the run: raw usage_events older than the cutoff are physically gone.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase.rpc("run_aggregate_and_purge");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, result: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
