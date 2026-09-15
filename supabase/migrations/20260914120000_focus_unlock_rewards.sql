-- TeamFokus v3. No screen-time conversion and no browser-issued credits.
-- Apply with the normal Supabase migration workflow before releasing the app.
begin;

create table public.focus_aliases (
  user_id uuid primary key references auth.users(id) on delete cascade,
  alias text not null default ('Fokus-' || substr(gen_random_uuid()::text, 1, 8)) check (length(trim(alias)) between 1 and 30)
);
create table public.focus_days (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null check (extract(isodow from day) between 1 and 5),
  unlocks integer not null check (unlocks between 0 and 10000),
  complete boolean not null default false,
  primary key (company_id, user_id, day)
);
comment on table public.focus_days is 'Only trusted native ingestion may write verified active-unlock counts for 09:00-17:00 Europe/Berlin. Missing coverage is not zero unlocks.';
create table public.focus_rewards (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 100),
  description text not null default '' check (length(description) <= 500),
  points integer not null check (points between 1 and 1000000),
  kind text not null check (kind in ('voucher','wellbeing','time')),
  active boolean not null default true,
  unique(id,company_id)
);
create table public.focus_wallets (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  balance numeric(16,2) not null default 0 check (balance >= 0),
  primary key(company_id,user_id)
);
create table public.focus_ledger (
  id bigint generated always as identity primary key,
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('personal','bonus','redemption')),
  reference text not null,
  delta numeric(16,2) not null,
  created_at timestamptz not null default now(),
  unique(company_id,user_id,kind,reference)
);
create table public.focus_receipts (
  code text primary key default ('TF-' || upper(replace(gen_random_uuid()::text, '-', ''))),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reward_id uuid not null,
  request_id uuid not null,
  alias text not null,
  title text not null,
  description text not null,
  points integer not null,
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz,
  unique(company_id,user_id,request_id),
  foreign key(reward_id,company_id) references public.focus_rewards(id,company_id)
);
create table public.focus_rounds (
  company_id uuid not null references public.companies(id) on delete cascade,
  week date not null check (extract(isodow from week) = 1),
  average numeric,
  settled_at timestamptz not null default now(),
  primary key(company_id,week)
);
create table public.focus_results (
  company_id uuid not null,
  week date not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  unlocks integer not null,
  ticket uuid not null default gen_random_uuid(),
  rank integer not null default 0,
  selected boolean not null default false,
  bonus numeric(16,2) not null default 0,
  primary key(company_id,week,user_id),
  foreign key(company_id,week) references public.focus_rounds(company_id,week) on delete cascade
);

alter table public.focus_aliases enable row level security;
alter table public.focus_days enable row level security;
alter table public.focus_rewards enable row level security;
alter table public.focus_wallets enable row level security;
alter table public.focus_ledger enable row level security;
alter table public.focus_receipts enable row level security;
alter table public.focus_rounds enable row level security;
alter table public.focus_results enable row level security;
-- RPCs are the sole app entry point. In particular, managers cannot enumerate
-- receipt owners, aliases, usage rows, points, draw tickets or individual ranks.
revoke all on public.focus_aliases, public.focus_days, public.focus_rewards,
  public.focus_wallets, public.focus_ledger, public.focus_receipts,
  public.focus_rounds, public.focus_results from public, anon, authenticated;
grant all on public.focus_aliases, public.focus_days, public.focus_rewards,
  public.focus_wallets, public.focus_ledger, public.focus_receipts,
  public.focus_rounds, public.focus_results to service_role;
grant usage, select on sequence public.focus_ledger_id_seq to service_role;

create function private.focus_require(p_company uuid, p_role public.app_role)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not private.is_company_member(auth.uid(),p_company)
     or not private.has_company_role(auth.uid(),p_company,p_role)
     or (p_role = 'employee' and private.has_company_role(auth.uid(),p_company,'manager')) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;
end $$;
revoke all on function private.focus_require(uuid,public.app_role) from public,anon,authenticated;

create function private.focus_points(p_unlocks integer)
returns numeric language sql immutable set search_path = '' as $$
  select case when p_unlocks is null or p_unlocks < 0 then 0::numeric
    else 200 * power(2::numeric, -greatest(0,p_unlocks-8)::numeric/8) end
$$;
revoke all on function private.focus_points(integer) from public,anon,authenticated;

create function private.focus_receipt_json(r public.focus_receipts)
returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_build_object('code',r.code,'alias',r.alias,'title',r.title,
    'description',r.description,'created_at',r.created_at,'fulfilled_at',r.fulfilled_at)
$$;
revoke all on function private.focus_receipt_json(public.focus_receipts) from public,anon,authenticated;

create function public.focus_set_alias(p_alias text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'not_authorized' using errcode='42501'; end if;
  if p_alias is null or length(trim(p_alias)) not between 1 and 30 then raise exception 'invalid_alias'; end if;
  insert into public.focus_aliases(user_id,alias) values(auth.uid(),trim(p_alias))
    on conflict(user_id) do update set alias=excluded.alias;
end $$;

create function public.focus_save_reward(p_company_id uuid, p_id uuid, p_title text,
  p_description text, p_points integer, p_kind text, p_active boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform private.focus_require(p_company_id,'manager');
  if p_title is null or length(trim(p_title)) not between 1 and 100 or p_description is null
     or length(p_description)>500 or p_points is null or p_points not between 1 and 1000000
     or p_kind is null or p_kind not in ('voucher','wellbeing','time') or p_active is null then
    raise exception 'invalid_reward';
  end if;
  if p_id is null then
    insert into public.focus_rewards(company_id,title,description,points,kind,active)
      values(p_company_id,trim(p_title),p_description,p_points,p_kind,p_active);
  else
    update public.focus_rewards set title=trim(p_title),description=p_description,
      points=p_points,kind=p_kind,active=p_active where id=p_id and company_id=p_company_id;
    if not found then raise exception 'reward_changed'; end if;
  end if;
end $$;

create function public.focus_redeem(p_company_id uuid, p_reward_id uuid, p_expected_points integer, p_request_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.focus_receipts; product public.focus_rewards; available numeric; chosen_alias text;
begin
  perform private.focus_require(p_company_id,'employee');
  if p_request_id is null then raise exception 'invalid_request'; end if;
  insert into public.focus_wallets(company_id,user_id) values(p_company_id,auth.uid()) on conflict do nothing;
  select balance into available from public.focus_wallets where company_id=p_company_id and user_id=auth.uid() for update;
  -- The wallet lock serialises purchases, including retries on different devices.
  select * into r from public.focus_receipts where company_id=p_company_id and user_id=auth.uid() and request_id=p_request_id;
  if found then
    if r.reward_id<>p_reward_id then raise exception 'invalid_request'; end if;
    return private.focus_receipt_json(r);
  end if;
  select * into product from public.focus_rewards where id=p_reward_id and company_id=p_company_id and active for update;
  if not found or p_expected_points is null or product.points<>p_expected_points then raise exception 'reward_changed'; end if;
  if available<product.points then raise exception 'insufficient_points'; end if;
  insert into public.focus_aliases(user_id) values(auth.uid()) on conflict do nothing;
  select alias into chosen_alias from public.focus_aliases where user_id=auth.uid();
  insert into public.focus_receipts(company_id,user_id,reward_id,request_id,alias,title,description,points)
    values(p_company_id,auth.uid(),product.id,p_request_id,chosen_alias,product.title,product.description,product.points) returning * into r;
  update public.focus_wallets set balance=balance-product.points where company_id=p_company_id and user_id=auth.uid();
  insert into public.focus_ledger(company_id,user_id,kind,reference,delta)
    values(p_company_id,auth.uid(),'redemption',r.code,-product.points);
  return private.focus_receipt_json(r);
end $$;

create function public.focus_receipt(p_company_id uuid,p_code text,p_fulfill boolean default false)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.focus_receipts;
begin
  perform private.focus_require(p_company_id,'manager');
  select * into r from public.focus_receipts where company_id=p_company_id and code=upper(trim(p_code)) for update;
  if not found then raise exception 'receipt_not_found'; end if;
  if p_fulfill and r.fulfilled_at is null then
    update public.focus_receipts set fulfilled_at=now() where code=r.code returning * into r;
  end if;
  return private.focus_receipt_json(r);
end $$;

create function public.focus_employee(p_company_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare w date := date_trunc('week',now() at time zone 'Europe/Berlin')::date;
  ranking_week date; payload jsonb;
begin
  perform private.focus_require(p_company_id,'employee');
  insert into public.focus_aliases(user_id) values(auth.uid()) on conflict do nothing;
  select max(week) into ranking_week from public.focus_rounds where company_id=p_company_id;
  select jsonb_build_object(
    'alias',(select alias from public.focus_aliases where user_id=auth.uid()),
    'balance',coalesce((select balance from public.focus_wallets where company_id=p_company_id and user_id=auth.uid()),0),
    'days',(select jsonb_agg(jsonb_build_object('date',d::date,'unlocks',u.unlocks,'complete',coalesce(u.complete,false)) order by d)
      from generate_series(w::timestamp,(w+4)::timestamp,interval '1 day') d
      left join public.focus_days u on u.day=d::date and u.company_id=p_company_id and u.user_id=auth.uid()),
    'previousDays',(select jsonb_agg(jsonb_build_object('date',d::date,'unlocks',u.unlocks,'complete',coalesce(u.complete,false)) order by d)
      from generate_series((w-7)::timestamp,(w-3)::timestamp,interval '1 day') d
      left join public.focus_days u on u.day=d::date and u.company_id=p_company_id and u.user_id=auth.uid()),
    'rankingWeek',ranking_week,
    'ranking',coalesce((select jsonb_agg(jsonb_build_object('alias',a.alias,'rank',r.rank,'bonus',r.bonus,'isMe',r.user_id=auth.uid()) order by r.rank,r.ticket)
      from public.focus_results r join public.focus_aliases a on a.user_id=r.user_id
      where r.company_id=p_company_id and r.week=ranking_week and r.selected),'[]'::jsonb),
    'ownRank',(select jsonb_build_object('rank',rank,'selected',selected,'bonus',bonus) from public.focus_results
      where company_id=p_company_id and week=ranking_week and user_id=auth.uid()),
    'rewards',coalesce((select jsonb_agg(jsonb_build_object('id',id,'title',title,'description',description,'points',points,'kind',kind,'active',active) order by points,id)
      from public.focus_rewards where company_id=p_company_id and active),'[]'::jsonb),
    'receipts',coalesce((select jsonb_agg(private.focus_receipt_json(r) order by r.created_at desc) from public.focus_receipts r
      where r.company_id=p_company_id and r.user_id=auth.uid()),'[]'::jsonb)
  ) into payload;
  return payload;
end $$;

create function public.focus_manager(p_company_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare w date := date_trunc('week',now() at time zone 'Europe/Berlin')::date;
begin
  perform private.focus_require(p_company_id,'manager');
  return jsonb_build_object(
    'registered',(select count(*) from public.company_members where company_id=p_company_id),
    'trend',(select jsonb_agg(jsonb_build_object('week',d::date,'average',r.average) order by d)
      from generate_series((w-42)::timestamp,(w-7)::timestamp,interval '7 days') d
      left join public.focus_rounds r on r.week=d::date and r.company_id=p_company_id),
    'rewards',coalesce((select jsonb_agg(jsonb_build_object('id',id,'title',title,'description',description,'points',points,'kind',kind,'active',active) order by points,id)
      from public.focus_rewards where company_id=p_company_id),'[]'::jsonb)
  );
end $$;

-- One transaction per company/week. This function cannot be called by app users.
create function public.focus_settle_week(p_company_id uuid,p_week date)
returns void language plpgsql security definer set search_path = '' as $$
declare r record;
begin
  if p_week is null or extract(isodow from p_week)<>1 or p_week+7>(now() at time zone 'Europe/Berlin')::date then raise exception 'week_not_closed'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_company_id::text,0));
  if exists(select 1 from public.focus_rounds where company_id=p_company_id and week=p_week) then return; end if;
  insert into public.focus_rounds(company_id,week) values(p_company_id,p_week);
  for r in select d.user_id,sum(d.unlocks)::integer as unlocks,count(*) as days,
      round(sum(private.focus_points(d.unlocks)),2) as personal
    from public.focus_days d
    where d.company_id=p_company_id and d.day between p_week and p_week+4 and d.complete
      and private.is_company_member(d.user_id,p_company_id)
      and private.has_company_role(d.user_id,p_company_id,'employee')
      and not private.has_company_role(d.user_id,p_company_id,'manager')
    group by d.user_id order by d.user_id
  loop
    insert into public.focus_aliases(user_id) values(r.user_id) on conflict do nothing;
    insert into public.focus_wallets(company_id,user_id,balance) values(p_company_id,r.user_id,r.personal)
      on conflict(company_id,user_id) do update set balance=public.focus_wallets.balance+excluded.balance;
    insert into public.focus_ledger(company_id,user_id,kind,reference,delta)
      values(p_company_id,r.user_id,'personal',p_week::text,r.personal);
    if r.days=5 then
      insert into public.focus_results(company_id,week,user_id,unlocks) values(p_company_id,p_week,r.user_id,r.unlocks);
    end if;
  end loop;
  with positions as (
    select user_id,dense_rank() over(order by unlocks) as place,
      row_number() over(order by unlocks,ticket,user_id) as slot
    from public.focus_results where company_id=p_company_id and week=p_week
  ) update public.focus_results result set rank=p.place,selected=p.slot<=10,
      bonus=case when p.slot<=10 then round(250*power(0.8::numeric,p.place-1),2) else 0 end
    from positions p where result.user_id=p.user_id and result.company_id=p_company_id and result.week=p_week;
  for r in select user_id,bonus from public.focus_results where company_id=p_company_id and week=p_week and selected order by user_id
  loop
    update public.focus_wallets set balance=balance+r.bonus where company_id=p_company_id and user_id=r.user_id;
    insert into public.focus_ledger(company_id,user_id,kind,reference,delta) values(p_company_id,r.user_id,'bonus',p_week::text,r.bonus);
  end loop;
  update public.focus_rounds set average=(select case when count(*)>=5 then round(avg(unlocks::numeric/5),2) else null end
    from public.focus_results where company_id=p_company_id and week=p_week) where company_id=p_company_id and week=p_week;
end $$;

-- Late edits must not silently change counts behind already-paid weekly results.
create function private.focus_day_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
declare c uuid; d date;
begin
  if tg_op='DELETE' and (not exists(select 1 from auth.users where id=old.user_id) or not exists(select 1 from public.companies where id=old.company_id)) then return old; end if;
  if tg_op='DELETE' then c:=old.company_id; d:=old.day; else c:=new.company_id; d:=new.day; end if;
  perform pg_advisory_xact_lock(hashtextextended(c::text,0));
  if exists(select 1 from public.focus_rounds where company_id=c and week=date_trunc('week',d)::date) then raise exception 'week_already_settled'; end if;
  if tg_op='UPDATE' and (old.company_id<>new.company_id or old.user_id<>new.user_id or old.day<>new.day) then raise exception 'day_identity_immutable'; end if;
  if tg_op='DELETE' then return old; end if;
  if new.complete and (new.day::timestamp + interval '17 hours') > (now() at time zone 'Europe/Berlin') then raise exception 'day_not_closed'; end if;
  return new;
end $$;
create trigger focus_day_guard before insert or update or delete on public.focus_days for each row execute function private.focus_day_guard();
revoke all on function private.focus_day_guard() from public,anon,authenticated;

revoke all on function public.focus_set_alias(text),public.focus_save_reward(uuid,uuid,text,text,integer,text,boolean),
  public.focus_redeem(uuid,uuid,integer,uuid),public.focus_receipt(uuid,text,boolean),public.focus_employee(uuid),public.focus_manager(uuid)
  from public,anon;
grant execute on function public.focus_set_alias(text),public.focus_save_reward(uuid,uuid,text,text,integer,text,boolean),
  public.focus_redeem(uuid,uuid,integer,uuid),public.focus_receipt(uuid,text,boolean),public.focus_employee(uuid),public.focus_manager(uuid)
  to authenticated;
revoke all on function public.focus_settle_week(uuid,date) from public,anon,authenticated;
grant execute on function public.focus_settle_week(uuid,date) to service_role;

-- Remove old routes' residual access too: hiding a menu is insufficient.
drop policy if exists profiles_select_same_company on public.profiles;
drop policy if exists company_members_select_same_company on public.company_members;
drop policy if exists company_members_manager_select on public.company_members;
drop policy if exists company_members_manager_update on public.company_members;
drop policy if exists company_members_manager_delete on public.company_members;
drop policy if exists user_roles_managers_select_company on public.user_roles;
drop policy if exists team_members_select_company on public.team_members;
drop policy if exists team_members_manager_manage on public.team_members;
create policy focus_team_members_self on public.team_members for select to authenticated using(user_id=auth.uid());
revoke all on public.usage_events,public.daily_user_summaries,public.daily_team_summaries,
  public.user_allowed_apps,public.user_work_schedules,public.user_breaks,public.high_focus_periods,public.team_goals,public.invites
  from anon,authenticated;

create function public.focus_settle_due_weeks()
returns void language plpgsql security definer set search_path = '' as $$
declare r record;
begin
  for r in select distinct d.company_id,date_trunc('week',d.day)::date as week
    from public.focus_days d where d.complete and date_trunc('week',d.day)::date+7 <= (now() at time zone 'Europe/Berlin')::date
      and not exists(select 1 from public.focus_rounds f where f.company_id=d.company_id and f.week=date_trunc('week',d.day)::date)
    order by d.company_id,week
  loop perform public.focus_settle_week(r.company_id,r.week); end loop;
end $$;
revoke all on function public.focus_settle_due_weeks() from public,anon,authenticated;
grant execute on function public.focus_settle_due_weeks() to service_role;
-- Supabase projects with pg_cron automatically settle due weeks each morning.
-- Otherwise the trusted ingestion worker must call focus_settle_due_weeks.
do $$ begin
  if exists(select 1 from pg_extension where extname='pg_cron') then
    perform cron.schedule('teamfokus-weekly-points','5 6 * * *','select public.focus_settle_due_weeks()');
  end if;
end $$;

create function public.focus_create_invite(p_company_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare code text := upper(replace(gen_random_uuid()::text,'-',''));
begin
  perform private.focus_require(p_company_id,'manager');
  insert into public.invites(company_id,code,created_by) values(p_company_id,code,auth.uid());
  return code;
end $$;
revoke all on function public.focus_create_invite(uuid) from public,anon;
grant execute on function public.focus_create_invite(uuid) to authenticated;

commit;
