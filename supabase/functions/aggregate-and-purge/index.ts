// Edge function: aggregate-and-purge
// Runs daily (cron). Computes per-user daily summaries, writes team aggregates only
// once min_team_k members are present, then HARD-DELETES all raw usage events.
// Protected by a shared CRON_SECRET passed via the X-Cron-Secret header.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const expected = Deno.env.get("CRON_SECRET");
  const provided = req.headers.get("x-cron-secret") ?? "";
  if (!expected || !timingSafeEqual(provided, expected)) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase.rpc("run_aggregate_and_purge");

  if (error) {
    console.error("run_aggregate_and_purge failed", error);
    return new Response(JSON.stringify({ error: "internal_server_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Prüft Team-Ziele und setzt ausschließlich das Kennzeichen "Belohnung freigeschaltet".
  const { data: goals, error: goalError } = await supabase.rpc("run_evaluate_team_goals");
  if (goalError) console.error("run_evaluate_team_goals failed", goalError);

  return new Response(JSON.stringify({ ok: true, result: data, goals: goals ?? null }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

