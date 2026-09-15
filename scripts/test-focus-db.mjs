import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const db = new PGlite();
const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const c1=id(900), c2=id(901), manager=id(1), otherManager=id(2);
const query = async (sql, values=[]) => (await db.query(sql, values)).rows;
let checks=0;
async function check(name, run) { await run(); checks++; console.log(`PASS ${name}`); }
async function actor(uid, run, role='authenticated') {
  await db.exec(`set role ${role}`);
  await query("select set_config('request.jwt.claim.sub',$1,false)",[uid]);
  try { return await run(); } finally { await db.exec('reset role'); await query("select set_config('request.jwt.claim.sub','',false)"); }
}
const denied = async (run) => { await assert.rejects(run, /permission denied|not_authorized/); };
try {
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema private; create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema public,auth,private to anon,authenticated,service_role;`);
  await db.exec(readFileSync(new URL('../supabase/migrations/20260506121328_b59ea544-5007-4724-81d5-6cc5c246802c.sql',import.meta.url),'utf8'));
  await db.exec(readFileSync(new URL('../supabase/migrations/20260616095244_8c0c8023-c5c8-47bd-ba7b-4b2e9612de93.sql',import.meta.url),'utf8'));
  await db.exec(`create function private.is_company_member(u uuid,c uuid) returns boolean language sql security definer as $$ select exists(select 1 from public.company_members where user_id=u and company_id=c) $$;
    create function private.has_company_role(u uuid,c uuid,r public.app_role) returns boolean language sql security definer as $$ select exists(select 1 from public.user_roles where user_id=u and company_id=c and role=r) $$;`);
  for (const table of ['user_allowed_apps','user_work_schedules','user_breaks','high_focus_periods','team_goals']) await db.exec(`create table if not exists public.${table}(id uuid)`);
  await db.exec('grant all on all tables in schema public to authenticated; grant all on all tables in schema public to service_role;');
  await db.exec(readFileSync(new URL('../supabase/migrations/20260914120000_focus_unlock_rewards.sql',import.meta.url),'utf8'));
  const people=[1,2,...Array.from({length:14},(_,i)=>100+i),...Array.from({length:4},(_,i)=>200+i)];
  for (const n of people) await query("insert into auth.users(id,email,raw_user_meta_data) values($1,$2,'{\"display_name\":\"Private legal name\"}')",[id(n),`user${n}@example.test`]);
  await query("insert into companies(id,name,slug,owner_id) values($1,'Company A','a',$2),($3,'Company B','b',$4)",[c1,manager,c2,otherManager]);
  for (const n of people) {
    const company = n===2 || n>=200 ? c2:c1;
    await query('insert into company_members(company_id,user_id) values($1,$2)',[company,id(n)]);
    await query('insert into user_roles(company_id,user_id,role) values($1,$2,$3)',[company,id(n),n<100?'manager':'employee']);
  }
  const [{ week }] = await query("select (date_trunc('week',now() at time zone 'Europe/Berlin')::date-7)::text as week");
  for (let i=0;i<14;i++) for(let day=0;day<(i===12?4:5);day++) {
    const unlocks=i<12?[4,4,5,6,7,8,9,10,10,12,12,20][i]:0;
    await query('insert into focus_days(company_id,user_id,day,unlocks,complete) values($1,$2,$3::date+$4::int,$5,$6)',[c1,id(100+i),week,day,unlocks,i!==13]);
  }
  for (let i=0;i<4;i++) for(let day=0;day<5;day++) await query('insert into focus_days(company_id,user_id,day,unlocks,complete) values($1,$2,$3::date+$4::int,8,true)',[c2,id(200+i),week,day]);
  await check('employees and managers cannot issue counts or credits',async()=>{
    for(const uid of [manager,id(100)]) await actor(uid,async()=>{
      await denied(()=>query('select * from focus_days'));
      await denied(()=>query('insert into focus_wallets(company_id,user_id,balance) values($1,$2,100000)',[c1,uid]));
      await denied(()=>query('select focus_settle_week($1,$2)',[c1,week]));
    });
  });
  await actor('',()=>query('select focus_settle_due_weeks()'), 'service_role');
  await check('equal first places each earn the full 250 and exactly ten people qualify',async()=>{
    const rows=await query('select * from focus_results where company_id=$1 order by unlocks,ticket',[c1]);
    assert.equal(rows.length,12); assert.equal(rows.filter(r=>r.selected).length,10);
    assert.deepEqual(rows.slice(0,2).map(r=>[r.rank,Number(r.bonus)]),[[1,250],[1,250]]);
    const boundary=rows.filter(r=>r.unlocks===60); assert.equal(boundary.length,2);
    assert.equal(boundary.filter(r=>r.selected).length,1); assert.equal(boundary[0].rank,boundary[1].rank);
  });
  await check('partial or unverified days cannot earn a full week or qualify',async()=>{
    assert.equal(Number((await query('select balance from focus_wallets where user_id=$1',[id(112)]))[0].balance),800);
    assert.equal((await query('select * from focus_results where user_id in ($1,$2)',[id(112),id(113)])).length,0);
    assert.equal((await query('select * from focus_wallets where user_id=$1',[id(113)])).length,0);
  });
  await check('repeated settlement preserves credits and the original draw',async()=>{
    const before=await query('select * from focus_results order by user_id');
    const count=(await query('select count(*)::int as n from focus_ledger'))[0].n;
    await actor('',()=>query('select focus_settle_week($1,$2)',[c1,week]),'service_role');
    assert.deepEqual(await query('select * from focus_results order by user_id'),before);
    assert.equal((await query('select count(*)::int as n from focus_ledger'))[0].n,count);
    await assert.rejects(()=>query('update focus_days set unlocks=0 where company_id=$1',[c1]),/week_already_settled/);
  });
  await check('manager payload contains only count, aggregate trend and catalog',async()=>{
    const [{payload}]=await actor(manager,()=>query('select focus_manager($1) as payload',[c1]));
    assert.deepEqual(Object.keys(payload).sort(),['registered','rewards','trend']);
    assert.equal(payload.registered,15); assert.equal(payload.trend.at(-1).average,8.92);
    const [{payload: small}]=await actor(otherManager,()=>query('select focus_manager($1) as payload',[c2]));
    assert.equal(small.registered,5); assert.equal(small.trend.at(-1).average,null);
    await actor(manager,()=>denied(()=>query('select focus_manager($1)',[c2])));
    await actor(manager,()=>denied(()=>query('select focus_employee($1)',[c1])));
    await actor(id(100),()=>denied(()=>query('select focus_manager($1)',[c1])));
  });
  await check('legacy personal and member records are not exposed to managers',async()=>{
    await actor(manager,async()=>{
      assert.deepEqual((await query('select id from profiles')).map(r=>r.id),[manager]);
      assert.deepEqual((await query('select user_id from company_members')).map(r=>r.user_id),[manager]);
      for(const table of ['usage_events','daily_user_summaries','daily_team_summaries','invites']) await denied(()=>query(`select * from ${table}`));
    });
  });
  await actor(manager,()=>query("select focus_save_reward($1,null,'Test reward','Original description',500,'voucher',true)",[c1]));
  const reward=(await query('select id from focus_rewards where company_id=$1',[c1]))[0].id;
  let receipt;
  await check('purchase is atomic, retry-safe and returns a pseudonymous receipt',async()=>{
    [{receipt}]=await actor(id(100),()=>query('select focus_redeem($1,$2,500,$3) as receipt',[c1,reward,id(500)]));
    const [{receipt:retry}]=await actor(id(100),()=>query('select focus_redeem($1,$2,500,$3) as receipt',[c1,reward,id(500)]));
    assert.deepEqual(retry,receipt); assert.match(receipt.alias,/^Fokus-/); assert.equal(receipt.title,'Test reward');
    assert.deepEqual(Object.keys(receipt).sort(),['alias','code','created_at','description','fulfilled_at','title']);
    assert.equal(Number((await query('select balance from focus_wallets where user_id=$1',[id(100)]))[0].balance),750);
  });
  await check('insufficient balance and stale prices never debit points',async()=>{
    await actor(manager,()=>query("select focus_save_reward($1,$2,'Edited reward','Changed',900,'voucher',true)",[c1,reward]));
    await actor(id(100),async()=>{
      await assert.rejects(()=>query('select focus_redeem($1,$2,500,$3)',[c1,reward,id(501)]),/reward_changed/);
      await assert.rejects(()=>query('select focus_redeem($1,$2,900,$3)',[c1,reward,id(502)]),/insufficient_points/);
    });
    assert.equal(Number((await query('select balance from focus_wallets where user_id=$1',[id(100)]))[0].balance),750);
  });
  await check('receipt snapshots survive product edits; fulfilment is idempotent and scoped',async()=>{
    const [{payload: original}]=await actor(manager,()=>query('select focus_receipt($1,$2,false) as payload',[c1,receipt.code]));
    assert.equal(original.title,'Test reward'); assert.equal(original.description,'Original description');
    await actor(otherManager,()=>assert.rejects(()=>query('select focus_receipt($1,$2,false)',[c2,receipt.code]),/receipt_not_found/));
    const [{payload: first}]=await actor(manager,()=>query('select focus_receipt($1,$2,true) as payload',[c1,receipt.code]));
    const [{payload: again}]=await actor(manager,()=>query('select focus_receipt($1,$2,true) as payload',[c1,receipt.code]));
    assert.ok(first.fulfilled_at); assert.deepEqual(first,again);
  });
  await check('employee payload includes no foreign usage or real names',async()=>{
    const [{payload}]=await actor(id(100),()=>query('select focus_employee($1) as payload',[c1]));
    assert.equal(payload.balance,750); assert.equal(payload.ranking.length,10); assert.equal(payload.days.length,5);
    for(const row of payload.ranking) assert.deepEqual(Object.keys(row).sort(),['alias','bonus','isMe','rank']);
    assert.ok(!JSON.stringify(payload).includes('Private legal name'));
    await actor(id(100),()=>denied(()=>query('select focus_employee($1)',[c2])));
  });
  await check('account deletion can remove settled personal records',async()=>{
    await query('delete from auth.users where id=$1',[id(100)]);
    assert.equal((await query('select * from focus_days where user_id=$1',[id(100)])).length,0);
    assert.equal((await query('select * from focus_receipts where user_id=$1',[id(100)])).length,0);
  });
  console.log(`${checks} database integration checks passed.`);
} catch(error) { console.error(error.message); if(error.position) console.error(`SQL position: ${error.position}`); process.exitCode=1; }
finally { await db.close(); }
