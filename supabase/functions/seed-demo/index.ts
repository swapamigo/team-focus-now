// Seed-Demo: Generiert Teams, Mitarbeiter (anonym als zusätzliche company_members fingiert),
// 30 Tage Tracking-Historie und eine aktive Challenge.
// Wird vom Manager nach dem Onboarding aufgerufen.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Body { company_id: string }

const TEAM_DEFS = [
  { name: 'Falken', emoji: '🦅', color: '#6366f1' },
  { name: 'Wölfe', emoji: '🐺', color: '#8b5cf6' },
  { name: 'Pandas', emoji: '🐼', color: '#10b981' },
  { name: 'Tiger', emoji: '🐯', color: '#f59e0b' },
];

const FIRST = ['Anna','Ben','Clara','David','Emma','Felix','Greta','Hans','Ida','Jonas','Klara','Lena','Max','Nina','Oskar','Paula','Quentin','Rita','Sven','Tina'];

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const auth = req.headers.get('Authorization');
    if (!auth) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    // user-scoped client to verify JWT
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { company_id }: Body = await req.json();
    if (!company_id) return new Response(JSON.stringify({ error: 'missing company_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    // Verify caller is manager of this company
    const { data: roles } = await supabaseAdmin.from('user_roles').select('id')
      .eq('user_id', user.id).eq('company_id', company_id).eq('role', 'manager').limit(1);
    if (!roles?.length) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    // 1. Teams anlegen (falls noch keine)
    const { data: existing } = await supabaseAdmin.from('teams').select('id').eq('company_id', company_id);
    let teamIds: string[];
    if (existing && existing.length > 0) {
      teamIds = existing.map(t => t.id);
    } else {
      const { data: teams } = await supabaseAdmin.from('teams').insert(
        TEAM_DEFS.map(t => ({ ...t, company_id }))
      ).select();
      teamIds = (teams ?? []).map(t => t.id);
    }

    // 2. Echten User in erstes Team aufnehmen (falls noch nicht)
    const { data: tm } = await supabaseAdmin.from('team_members').select('id').eq('user_id', user.id).limit(1);
    if (!tm?.length && teamIds[0]) {
      await supabaseAdmin.from('team_members').insert({ user_id: user.id, team_id: teamIds[0] });
    }

    // 3. Whitelist + High-Focus
    await supabaseAdmin.from('whitelisted_apps').upsert(
      ['Slack','Microsoft Teams','Outlook','Kalender','Rechner'].map(app_name => ({ company_id, app_name })),
      { onConflict: 'company_id,app_name' }
    );
    await supabaseAdmin.from('whitelisted_websites').upsert(
      ['github.com','figma.com','notion.so','linear.app'].map(domain => ({ company_id, domain })),
      { onConflict: 'company_id,domain' }
    );
    const { data: hfx } = await supabaseAdmin.from('high_focus_periods').select('id').eq('company_id', company_id).limit(1);
    if (!hfx?.length) {
      await supabaseAdmin.from('high_focus_periods').insert([
        { company_id, label: 'Vormittags-Fokus', start_time: '09:00', end_time: '11:00', multiplier: 2.0 },
        { company_id, label: 'Nachmittags-Fokus', start_time: '14:00', end_time: '16:00', multiplier: 2.0 },
      ]);
    }

    // 4. Challenge
    const { data: chx } = await supabaseAdmin.from('challenges').select('id').eq('company_id', company_id).eq('status', 'active').limit(1);
    if (!chx?.length) {
      const start = new Date(); start.setDate(start.getDate() - 3);
      const end = new Date(); end.setDate(end.getDate() + 11);
      await supabaseAdmin.from('challenges').insert({
        company_id, title: 'Fokus-Sprint Q2',
        description: 'Welches Team schafft die geringste Ablenkungszeit über 2 Wochen?',
        duration: '2_weeks',
        start_date: start.toISOString().slice(0, 10),
        end_date: end.toISOString().slice(0, 10),
        status: 'active',
        created_by: user.id,
      });
    }

    // 5. 30 Tage Daten für eigenen User + simulierte Team-Aggregate
    const events: any[] = [];
    const userSummaries: any[] = [];
    const teamSummaries: any[] = [];
    const today = new Date(); today.setHours(0, 0, 0, 0);

    for (let d = 29; d >= 0; d--) {
      const day = new Date(today); day.setDate(today.getDate() - d);
      const dateStr = day.toISOString().slice(0, 10);

      // Eigene Events (paar pro Tag)
      const ownMins = rand(60, 220);
      const ownPenalty = rand(10, 50);
      let unlocks = 0;
      const numEvents = Math.floor(rand(8, 18));
      for (let e = 0; e < numEvents; e++) {
        const hour = Math.floor(rand(8, 19));
        const occ = new Date(day); occ.setHours(hour, Math.floor(rand(0, 59)));
        const dur = Math.floor(rand(60, 900));
        const types = ['unlock','app_usage','website_usage'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        if (type === 'unlock') unlocks++;
        events.push({
          user_id: user.id, company_id, event_type: type,
          device_type: Math.random() > 0.5 ? 'phone' : 'laptop',
          app_name: type === 'app_usage' ? ['Instagram','TikTok','WhatsApp','YouTube'][Math.floor(Math.random()*4)] : null,
          website_url: type === 'website_usage' ? ['youtube.com','reddit.com','x.com'][Math.floor(Math.random()*3)] : null,
          duration_seconds: dur,
          penalty_minutes: type === 'unlock' ? 5 : 0,
          occurred_at: occ.toISOString(),
        });
      }
      userSummaries.push({
        user_id: user.id, company_id, team_id: teamIds[0], date: dateStr,
        screen_minutes: ownMins, penalty_minutes: ownPenalty, unlocks, focus_violations: Math.floor(rand(0, 4)),
      });

      // Team-Aggregate für alle Teams
      teamIds.forEach((tid, idx) => {
        const baseAvg = [110, 145, 95, 175][idx % 4] + rand(-30, 30);
        teamSummaries.push({
          team_id: tid, company_id, date: dateStr,
          avg_screen_minutes: Math.max(40, baseAvg),
          total_screen_minutes: Math.max(40, baseAvg) * 6,
          avg_penalty_minutes: rand(15, 45),
          member_count: 6,
        });
      });
    }

    // Inserts in Chunks
    for (let i = 0; i < events.length; i += 500) {
      await supabaseAdmin.from('usage_events').insert(events.slice(i, i + 500));
    }
    await supabaseAdmin.from('daily_user_summaries').upsert(userSummaries, { onConflict: 'user_id,date' });
    await supabaseAdmin.from('daily_team_summaries').upsert(teamSummaries, { onConflict: 'team_id,date' });

    // Notifications
    await supabaseAdmin.from('notifications').insert([
      { user_id: user.id, title: 'Willkommen bei Team Focus!', body: 'Dein Workspace ist bereit. Demo-Daten wurden geladen.' },
      { user_id: user.id, title: 'Ihr seid aktuell auf Platz 2.', body: 'Nur noch 8 Minuten weniger und ihr übernehmt Platz 1!' },
      { user_id: user.id, title: 'High-Focus-Zeit erfolgreich.', body: 'Dein Team hat die Vormittagsperiode top gemeistert.' },
    ]);

    return new Response(JSON.stringify({ ok: true, teams: teamIds.length, events: events.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
