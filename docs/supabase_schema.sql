create table if not exists public.journal_entries (
id uuid primary key default gen_random_uuid(),
user_id uuid not null references auth.users(id) on delete cascade,
entry_date date not null default current_date,
responses jsonb not null default '{}'::jsonb,
reflection_summary text,
source text not null default 'typed',
created_at timestamptz not null default now(),
updated_at timestamptz not null default now(),

constraint journal_entries_source_check
check (source in ('typed', 'voice', 'photo'))
);

alter table public.journal_entries enable row level security;

create policy "Users can view their own journal entries"
on public.journal_entries
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own journal entries"
on public.journal_entries
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
on public.journal_entries
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
on public.journal_entries
for delete
to authenticated
using (auth.uid() = user_id);

-- ==========================================
-- PROFILES / USERS TRACKING
-- ==========================================

-- Create a public profiles table to track users safely
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can only view and update their own profile
create policy "Users can view their own profile" 
on public.profiles for select 
to authenticated using (auth.uid() = id);

create policy "Users can update their own profile" 
on public.profiles for update 
to authenticated using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to automatically create a profile for each new auth.user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- OCR USAGE LIMITS
-- ==========================================

create table if not exists public.ocr_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  provider text not null default 'google_vision',
  feature text not null default 'TEXT_DETECTION',
  status text not null default 'reserved',
  image_hash text
);

alter table public.ocr_usage_events enable row level security;

create policy "Users can view their own OCR usage"
on public.ocr_usage_events
for select
to authenticated
using (auth.uid() = user_id);

create or replace function public.reserve_ocr_unit(p_image_hash text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_today_count int;
  v_month_count int;
  v_event_id uuid;
begin
  if v_user_id is null then
    return jsonb_build_object('allowed', false, 'reason', 'not_authenticated');
  end if;

  perform pg_advisory_xact_lock(hashtext('qora_ocr_global_monthly_cap'));

  select count(*)
  into v_today_count
  from public.ocr_usage_events
  where user_id = v_user_id
    and created_at >= date_trunc('day', now());

  if v_today_count >= 5 then
    return jsonb_build_object(
      'allowed', false,
      'reason', 'daily_limit_reached'
    );
  end if;

  select count(*)
  into v_month_count
  from public.ocr_usage_events
  where created_at >= date_trunc('month', now());

  if v_month_count >= 900 then
    return jsonb_build_object(
      'allowed', false,
      'reason', 'monthly_app_limit_reached'
    );
  end if;

  insert into public.ocr_usage_events (
    user_id,
    provider,
    feature,
    status,
    image_hash
  )
  values (
    v_user_id,
    'google_vision',
    'TEXT_DETECTION',
    'reserved',
    p_image_hash
  )
  returning id into v_event_id;

  return jsonb_build_object(
    'allowed', true,
    'event_id', v_event_id,
    'remaining_today', 4 - v_today_count,
    'remaining_month', 899 - v_month_count
  );
end;
$$;
