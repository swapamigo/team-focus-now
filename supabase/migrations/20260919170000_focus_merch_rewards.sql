-- Extend reward categories while preserving the existing manager-only write rules.
begin;

alter table public.focus_rewards drop constraint focus_rewards_kind_check;
alter table public.focus_rewards add constraint focus_rewards_kind_check
  check (kind in ('voucher','wellbeing','time','merch'));

create or replace function public.focus_save_reward(p_company_id uuid, p_id uuid, p_title text,
  p_description text, p_points integer, p_kind text, p_active boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform private.focus_require(p_company_id,'manager');
  if p_title is null or length(trim(p_title)) not between 1 and 100 or p_description is null
     or length(p_description)>500 or p_points is null or p_points not between 1 and 1000000
     or p_kind is null or p_kind not in ('voucher','wellbeing','time','merch') or p_active is null then
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

commit;
