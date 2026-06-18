// delete-account: Löscht alle Daten des aufrufenden Users + den auth.users-Eintrag.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const uid = user.id;

    // Cleanup in dependency-safe order. Errors on individual tables are non-fatal.
    const tables = [
      'notifications',
      'usage_events',
      'daily_user_summaries',
      'team_members',
      'user_allowed_apps',
      'user_breaks',
      'user_work_schedules',
      'company_members',
      'user_roles',
    ];
    for (const t of tables) {
      await admin.from(t).delete().eq('user_id', uid);
    }
    // Falls Manager: eigene Companies + abhängige Daten löschen
    const { data: ownedCompanies } = await admin.from('companies').select('id').eq('owner_id', uid);
    for (const c of ownedCompanies ?? []) {
      const cid = c.id;
      await admin.from('rewards').delete().in('challenge_id',
        ((await admin.from('challenges').select('id').eq('company_id', cid)).data ?? []).map((r: any) => r.id)
      );
      const cleanup = [
        'notifications', 'usage_events', 'daily_user_summaries', 'daily_team_summaries',
        'team_members', 'teams', 'user_allowed_apps', 'user_breaks', 'user_work_schedules',
        'breaks', 'work_schedules', 'free_phone_times', 'high_focus_periods',
        'whitelisted_apps', 'whitelisted_websites', 'invites', 'challenges',
        'company_members', 'user_roles', 'subscriptions',
      ];
      for (const t of cleanup) {
        await admin.from(t).delete().eq('company_id', cid);
      }
      await admin.from('companies').delete().eq('id', cid);
    }

    await admin.from('profiles').delete().eq('id', uid);

    // Endgültiger auth-User Delete via Admin API
    const { error: delErr } = await admin.auth.admin.deleteUser(uid);
    if (delErr) {
      console.error('auth deleteUser failed', delErr);
      return json({ error: delErr.message }, 500);
    }

    return json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return json({ error: 'internal_server_error' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
