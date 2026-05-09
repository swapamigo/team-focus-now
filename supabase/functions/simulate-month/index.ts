// simulate-month: Generiert/aktualisiert 30 Tage realistische Demo-Daten
// inkl. 5–7 Ghost-Mitarbeiter pro Team. Wird aus Mitarbeiter- und Manager-View aufgerufen.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIRST = ['Anna','Ben','Clara','David','Emma','Felix','Greta','Hans','Ida','Jonas','Klara','Lena','Max','Nina','Oskar','Paula','Quentin','Rita','Sven','Tina','Ulla','Vera','Walter','Yara','Zoe','Mara','Linus','Noah','Mila','Lara'];
const LAST = ['Schmidt','Müller','Weber','Fischer','Wagner','Becker','Hoffmann','Schulz','Koch','Bauer','Klein','Wolf','Neumann','Zimmermann'];

const rand = (a: number, b: number) => Math.random() * (b - a) + a;
const ri = (a: number, b: number) => Math.floor(rand(a, b));

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const auth = req.headers.get('Authorization');
    if (!auth) return json({ error: 'unauthorized' }, 401);

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: auth } } },
    );
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: 'unauthorized' }, 401);

    const { data: cm } = await admin.from('company_members').select('company_id').eq('user_id', user.id).limit(1);
    const company_id = cm?.[0]?.company_id;
    if (!company_id) return json({ error: 'no_company' }, 400);

    const { data: teamsRaw } = await admin.from('teams').select('id, name').eq('company_id', company_id);
    const teams = teamsRaw ?? [];
    if (teams.length === 0) return json({ error: 'no_teams' }, 400);

    // ---------- Ghost-Mitarbeiter sicherstellen (5-7 pro Team) ----------
    for (const team of teams) {
      const { data: existing } = await admin.from('team_members').select('user_id').eq('team_id', team.id);
      const existingCount = existing?.length ?? 0;
      const targetMin = 6;
      if (existingCount < targetMin) {
        const need = targetMin - existingCount;
        const ghostProfiles: any[] = [];
        const ghostCompanyMembers: any[] = [];
        const ghostTeamMembers: any[] = [];
        for (let i = 0; i < need; i++) {
          const ghostId = crypto.randomUUID();
          const name = `${FIRST[ri(0, FIRST.length)]} ${LAST[ri(0, LAST.length)]}`;
          ghostProfiles.push({ id: ghostId, display_name: name, onboarded: true });
          ghostCompanyMembers.push({ user_id: ghostId, company_id });
          ghostTeamMembers.push({ user_id: ghostId, team_id: team.id });
        }
        if (ghostProfiles.length) {
          await admin.from('profiles').insert(ghostProfiles);
          await admin.from('company_members').insert(ghostCompanyMembers);
          await admin.from('team_members').insert(ghostTeamMembers);
        }
      }
    }

    // ---------- 30 Tage Daten generieren ----------
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const userSummaries: any[] = [];
    const teamSummaries: any[] = [];
    const events: any[] = [];

    // Eigener User: Trend wird mit der Zeit besser (sinkende Bildschirmzeit)
    for (let d = 29; d >= 0; d--) {
      const day = new Date(today); day.setDate(today.getDate() - d);
      const date = day.toISOString().slice(0, 10);
      const trend = 1 - (29 - d) * 0.012; // langsamer Verbesserungstrend
      const screen = Math.max(40, rand(140, 200) * trend + rand(-20, 20));
      const penalty = Math.max(0, rand(30, 55) * trend + rand(-10, 10));
      const unlocks = ri(8, 22);
      userSummaries.push({
        user_id: user.id, company_id,
        team_id: (await admin.from('team_members').select('team_id').eq('user_id', user.id).maybeSingle()).data?.team_id,
        date, screen_minutes: Math.round(screen), penalty_minutes: Math.round(penalty),
        unlocks, focus_violations: ri(0, 4),
      });
      // ein paar Events pro Tag
      if (d < 7) {
        for (let e = 0; e < 6; e++) {
          const occ = new Date(day); occ.setHours(ri(8, 18), ri(0, 59));
          events.push({
            user_id: user.id, company_id,
            event_type: ['unlock', 'app_usage', 'website_usage'][ri(0, 3)],
            device_type: Math.random() > 0.5 ? 'phone' : 'laptop',
            duration_seconds: ri(60, 600),
            penalty_minutes: Math.random() > 0.5 ? 5 : 0,
            occurred_at: occ.toISOString(),
          });
        }
      }
    }

    // Team-Summaries: realistische Member-Counts + leichte Verbesserung über Zeit
    for (const team of teams) {
      const { count } = await admin.from('team_members').select('user_id', { count: 'exact', head: true }).eq('team_id', team.id);
      const memberCount = count ?? 6;
      const baseAvg = 90 + ri(0, 90); // Team-Charakter
      for (let d = 29; d >= 0; d--) {
        const day = new Date(today); day.setDate(today.getDate() - d);
        const date = day.toISOString().slice(0, 10);
        const trend = 1 - (29 - d) * 0.01;
        const avg = Math.max(40, baseAvg * trend + rand(-15, 15));
        teamSummaries.push({
          team_id: team.id, company_id, date,
          avg_screen_minutes: Math.round(avg),
          total_screen_minutes: Math.round(avg * memberCount),
          avg_penalty_minutes: Math.round(rand(15, 45) * trend),
          member_count: memberCount,
        });
      }
    }

    // Inserts
    if (events.length) {
      // alte Events der letzten 30 Tage erstmal löschen, damit wir nicht doppeln
      const cutoff = new Date(today); cutoff.setDate(cutoff.getDate() - 30);
      await admin.from('usage_events').delete().eq('user_id', user.id).gte('occurred_at', cutoff.toISOString());
      for (let i = 0; i < events.length; i += 500) {
        await admin.from('usage_events').insert(events.slice(i, i + 500));
      }
    }
    await admin.from('daily_user_summaries').upsert(userSummaries, { onConflict: 'user_id,date' });
    await admin.from('daily_team_summaries').upsert(teamSummaries, { onConflict: 'team_id,date' });

    await admin.from('notifications').insert({
      user_id: user.id,
      title: 'Demo-Monat simuliert',
      body: '30 Tage Trends, Rankings und Teamdaten wurden aktualisiert.',
      category: 'success',
    });

    return json({ ok: true, days: 30, teams: teams.length, ghosts: 'ensured' });
  } catch (err: any) {
    console.error(err);
    return json({ error: err.message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
