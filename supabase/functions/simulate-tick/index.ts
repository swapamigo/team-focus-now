// simulate-tick: Erzeugt für den aufrufenden User einen "neuen Tag" mit frischen Tracking-Daten.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const auth = req.headers.get('Authorization');
    if (!auth) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: auth } } },
    );
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });

    const { data: cm } = await admin.from('company_members').select('company_id').eq('user_id', user.id).limit(1);
    const company_id = cm?.[0]?.company_id;
    const { data: tm } = await admin.from('team_members').select('team_id').eq('user_id', user.id).limit(1);
    const team_id = tm?.[0]?.team_id;
    if (!company_id) return new Response(JSON.stringify({ error: 'no company' }), { status: 400, headers: corsHeaders });

    const today = new Date().toISOString().slice(0, 10);
    const screen = rand(60, 200);
    const penalty = rand(8, 40);

    await admin.from('daily_user_summaries').upsert({
      user_id: user.id, company_id, team_id, date: today,
      screen_minutes: screen, penalty_minutes: penalty,
      unlocks: Math.floor(rand(8, 25)), focus_violations: Math.floor(rand(0, 5)),
    }, { onConflict: 'user_id,date' });

    // Team-Aggregate für heute leicht variieren
    const { data: teams } = await admin.from('teams').select('id').eq('company_id', company_id);
    const updates = (teams ?? []).map((t, i) => ({
      team_id: t.id, company_id, date: today,
      avg_screen_minutes: Math.max(40, [110, 145, 95, 175][i % 4] + rand(-30, 30)),
      total_screen_minutes: rand(400, 1200),
      avg_penalty_minutes: rand(15, 45),
      member_count: 6,
    }));
    await admin.from('daily_team_summaries').upsert(updates, { onConflict: 'team_id,date' });

    await admin.from('notifications').insert({
      user_id: user.id, title: 'Tag simuliert', body: `Neue Bildschirmzeit: ${Math.round(screen)} Minuten`,
    });

    return new Response(JSON.stringify({ ok: true, screen, penalty }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
