// simulate-year: Generiert 365 Tage Demo-Daten mit klarem Verbesserungstrend.
// Mitarbeitende sind durch TeamFocus von Monat zu Monat weniger am Handy.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIRST = ['Anna','Ben','Clara','David','Emma','Felix','Greta','Hans','Ida','Jonas','Klara','Lena','Max','Nina','Oskar','Paula','Rita','Sven','Tina','Ulla','Vera','Mara','Linus','Noah','Mila','Lara'];
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

    // Ghost-Mitarbeitende sicherstellen
    for (const team of teams) {
      const { data: existing } = await admin.from('team_members').select('user_id').eq('team_id', team.id);
      const need = Math.max(0, 6 - (existing?.length ?? 0));
      if (need > 0) {
        const profiles: any[] = []; const cms: any[] = []; const tms: any[] = [];
        for (let i = 0; i < need; i++) {
          const id = crypto.randomUUID();
          profiles.push({ id, display_name: `${FIRST[ri(0, FIRST.length)]} ${LAST[ri(0, LAST.length)]}`, onboarded: true });
          cms.push({ user_id: id, company_id });
          tms.push({ user_id: id, team_id: team.id });
        }
        await admin.from('profiles').insert(profiles);
        await admin.from('company_members').insert(cms);
        await admin.from('team_members').insert(tms);
      }
    }

    // 365 Tage – Trend: Tag 0 (vor 365d) hoch, heute niedrig.
    // Bildschirmzeit fällt linear von ~210 min auf ~95 min.
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const userTeamId = (await admin.from('team_members').select('team_id').eq('user_id', user.id).maybeSingle()).data?.team_id;

    const userSummaries: any[] = [];
    const teamSummaries: any[] = [];

    for (let d = 364; d >= 0; d--) {
      const day = new Date(today); day.setDate(today.getDate() - d);
      const date = day.toISOString().slice(0, 10);
      // Fortschritt 0 (vor 1 Jahr) -> 1 (heute)
      const p = (364 - d) / 364;
      const baseScreen = 210 - p * 115; // 210 -> 95
      const basePenalty = 70 - p * 50;  // 70 -> 20

      // User
      userSummaries.push({
        user_id: user.id, company_id, team_id: userTeamId,
        date,
        screen_minutes: Math.max(40, Math.round(baseScreen + rand(-15, 15))),
        penalty_minutes: Math.max(0, Math.round(basePenalty + rand(-8, 8))),
        unlocks: ri(8, 22),
        focus_violations: ri(0, 4),
      });
    }

    for (const team of teams) {
      const { count } = await admin.from('team_members').select('user_id', { count: 'exact', head: true }).eq('team_id', team.id);
      const memberCount = count ?? 6;
      const teamOffset = rand(-15, 15);
      for (let d = 364; d >= 0; d--) {
        const day = new Date(today); day.setDate(today.getDate() - d);
        const date = day.toISOString().slice(0, 10);
        const p = (364 - d) / 364;
        const avg = Math.max(40, 200 + teamOffset - p * 110 + rand(-12, 12));
        teamSummaries.push({
          team_id: team.id, company_id, date,
          avg_screen_minutes: Math.round(avg),
          total_screen_minutes: Math.round(avg * memberCount),
          avg_penalty_minutes: Math.max(0, Math.round(60 - p * 40 + rand(-8, 8))),
          member_count: memberCount,
        });
      }
    }

    // Upserts in Chunks
    for (let i = 0; i < userSummaries.length; i += 500) {
      await admin.from('daily_user_summaries').upsert(userSummaries.slice(i, i + 500), { onConflict: 'user_id,date' });
    }
    for (let i = 0; i < teamSummaries.length; i += 500) {
      await admin.from('daily_team_summaries').upsert(teamSummaries.slice(i, i + 500), { onConflict: 'team_id,date' });
    }

    await admin.from('notifications').insert({
      user_id: user.id,
      title: 'Demo-Jahr simuliert',
      body: '365 Tage Trends wurden generiert. Sieh dir den Jahresüberblick an.',
      category: 'success',
    });

    return json({ ok: true, days: 365, teams: teams.length });
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
